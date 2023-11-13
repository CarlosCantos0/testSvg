import { Injectable, inject } from '@angular/core';
import { FiguraService } from './figura.service';
import { CodoService } from './codo.service';
import { fabric } from 'fabric';
import { SvgBase } from '../interfaces/svgBase.interface';
import { SvgServiceService } from './svg-service.service';


@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private canvas: fabric.Canvas | undefined;
  private objetoSeleccionado: fabric.Object | undefined;
  private figuras: SvgBase[] = [];


  constructor( private svg: SvgServiceService, private figuraService: FiguraService, private codoService: CodoService) {}


  inicializarCanvas(): fabric.Canvas {
    this.canvas = new fabric.Canvas('canvas', {
      width: 800, // Ancho en píxeles
      height: 700, // Alto en píxeles
      backgroundColor: 'white', // Color de fondo del lienzo
      selection: true, // Habilita la selección de objetos
      selectionBorderColor: 'blue', // Color del borde de selección
      selectionLineWidth: 2, // Ancho del borde de selección
    });

    this.figuraService.inicializar(this);
    this.codoService.inicializar(this.canvas);

    this.movimiento();
    this.figuras = this.getFigurasAlmacen();
    return this.canvas;
  }

  getCanvasInstance(): fabric.Canvas {
    if (!this.canvas) {
      throw new Error('El lienzo no ha sido inicializado aún.');
    }
    return this.canvas;
  }

  getFigurasAlmacen():SvgBase[] {
   return this.figuras = this.svg.getElementosAlmacenados();
  }

  movimiento() {
    if (this.canvas) {
      //Evento cada vez que dejo de clickar
      this.canvas.on('mouse:down', (event) => {
        if (event.target) {
          // Si se hizo clic en un objeto, asigna ese objeto a objetoSeleccionado
          this.actualizarFigura(event);
        }
      });
    }
  }

  actualizarFigura(event: any) {
    this.objetoSeleccionado = event.target;
  }
}
