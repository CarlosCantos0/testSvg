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
    this.canvas!.sendToBack(this.objetoSeleccionado!)

    const rectangulo = new fabric.Rect({
      width: figura.width,
      height: figura.height,
      left: figura.coordX,
      top: figura.coordY,
      fill: figura.stroke,
      name: figura.id.toString(),
      opacity: 0.65,
      // Otras propiedades específicas del rectángulo...
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
      fill: figura.stroke,
      name: figura.id.toString(),
      // Otras propiedades específicas del texto...
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
      fill: figura.stroke,
      strokeWidth: figura.strokeWidth,
      name: figura.id.toString(),
      opacity: 0.85,
    });

    this.canvas!.sendBackwards(this.objetoSeleccionado!);
    if (this.codoMode) {
      this.habilitarCodoCreation(linea as fabric.Line);
    }

    linea.on('mousedown', (options) => {
      this.seleccionarFigura(options.target!);
    });

    if (linea) {
      this.canvas?.add(linea);
    }

    this.canvas!.on('mouse:dblclick', (event) => {
      if (this.codoMode && event.target instanceof fabric.Line) {
        this.codoService.crearCodo(event.target as fabric.Line, this.canvas!.getPointer(event.e));
        this.canvas!.remove(event.target);
      }
    });

    return linea;
  }

  seleccionarFigura(figura: fabric.Object): fabric.Object {
    // console.log('seleccionar figuura')
    return this.objetoSeleccionado = figura;
  }

  editarTexto(objetoTexto: fabric.Text) {
    // Abre un cuadro de diálogo de entrada de texto y permite al usuario editar el texto
    const nuevoTexto = prompt('Editar texto:', objetoTexto.text);
    if (nuevoTexto !== null) {
      objetoTexto.set({ text: nuevoTexto });
      this.canvas?.renderAll(); // Actualiza el lienzo para reflejar los cambios
    }
  }

  habilitarCodoCreation(linea: fabric.Line) {
    linea.on('mouse:dblclick', (options) => {
      if (this.codoMode && options.target instanceof fabric.Line) {
        console.log('dentro de codo creation')
        this.codoService.crearCodo(options.target as fabric.Line, this.canvas!.getPointer(options.e));
      }
    });
  }
}
