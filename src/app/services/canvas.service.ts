import { Injectable, inject } from '@angular/core';
import { FiguraService } from './figura.service';
import { CodoService } from './codo.service';
import { fabric } from 'fabric';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private canvas: fabric.Canvas | undefined;

  constructor( private figuraService: FiguraService, private codoService: CodoService, private data: DataService) {}

  inicializarCanvas(): fabric.Canvas {
    this.canvas = new fabric.Canvas('canvas', {
      width: 800, // Ancho en píxeles
      height: 700, // Alto en píxeles
      backgroundColor: 'white', // Color de fondo del lienzo
      selection: true, // Habilita la selección de objetos
      selectionBorderColor: 'blue', // Color del borde de selección
      selectionLineWidth: 1, // Ancho del borde de selección
    });

    this.figuraService.inicializar(this);
    this.codoService.inicializar(this.canvas);

    return this.canvas;
  }

  //Retornamos el canvas si existe uno
  getCanvasInstance(): fabric.Canvas {
    if (!this.canvas) {
      throw new Error('El lienzo no ha sido inicializado aún.');
    }
    return this.canvas;
  }


}
