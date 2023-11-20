import { Injectable } from '@angular/core';
import { SvgBase } from '../interfaces/svgBase.interface';
import { fabric } from 'fabric';
import { CodoService } from './codo.service';
import { CanvasService } from './canvas.service';


@Injectable({
  providedIn: 'root'
})
export class FiguraService {

  private canvas: fabric.Canvas | undefined;
  objetoSeleccionado: fabric.Object | undefined;
  codoMode: boolean = true;

  constructor(private codoService: CodoService) { }

  inicializar(canvasService: CanvasService): fabric.Canvas {
    return this.canvas = canvasService.getCanvasInstance();
  }

  crearRectangulo(figura: SvgBase): fabric.Rect {
    const rectangulo = new fabric.Rect({
      width: figura.width,
      height: figura.height,
      left: figura.coordX,
      top: figura.coordY,
      fill: figura.fill,
      stroke: figura.stroke,
      name: figura.id.toString(),
      opacity: 0.65,
    });



    this.canvas!.sendToBack(this.objetoSeleccionado!)
    rectangulo.on('mousedown', (options) => {
      this.seleccionarFigura(options.target!);
    });

    return rectangulo;
  }

  crearTexto(figura: SvgBase): fabric.Text {
    const texto = new fabric.Text(figura.text, {
      left: figura.coordX,
      top: figura.coordY,
      fontFamily: figura.fonts,
      fontSize: figura.sizeLetter,
      fill: figura.fill,
      stroke: figura.stroke,
      name: figura.id.toString(),
    });

    this.canvas!.bringToFront(this.objetoSeleccionado!)

    texto.on('mousedblclick', (options) => {
      this.editarTexto(options.target as fabric.Text);
    });

    return texto;
  }

  crearLinea(figura: SvgBase): fabric.Line {
    const linea = new fabric.Line([figura.x1, figura.y1, figura.x2, figura.y2], {
      stroke: figura.stroke,
      fill: figura.fill,
      strokeWidth: figura.strokeWidth,
      name: figura.id.toString(),
      opacity: 0.85,
    });

    this.canvas!.sendBackwards(this.objetoSeleccionado!);

    linea.on('mousedown', (options) => {
      this.seleccionarFigura(options.target!);
    });

    if (linea) {
      this.canvas?.add(linea);
    }

    this.canvas!.on('mouse:dblclick', (event) => {
      if (this.codoMode && event.target instanceof fabric.Line) {
        this.codoService.realizarCodoYLineas(event.target as fabric.Line, this.canvas!.getPointer(event.e));
        this.canvas!.remove(event.target);
      }
    });


    return linea;
  }

  seleccionarFigura(figura: fabric.Object): fabric.Object {
    return this.objetoSeleccionado = figura;
  }

  editarTexto(objetoTexto: fabric.Text) {
    const nuevoTexto = prompt('Editar texto:', objetoTexto.text);
    if (nuevoTexto !== null) {
      objetoTexto.set({ text: nuevoTexto });
      this.canvas?.renderAll(); //Actualiza el lienzo para refrescar las modificaciones
    }
  }
}
