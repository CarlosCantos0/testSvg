import { Injectable } from '@angular/core';
import { SvgBase } from '../interfaces/svgBase.interface';
import { fabric } from 'fabric';
import { CodoService } from './codo.service';
import { CanvasService } from './canvas.service';


@Injectable({
  providedIn: 'root'
})
export class FiguraService {

  id: number = 0;
  private canvas: fabric.Canvas | undefined;
  objetoSeleccionado: fabric.Object | undefined;
  codoMode: boolean = true;

  constructor(private codoService: CodoService) { }

  //Obtenemos el canvas a modificar
  inicializar(canvasService: CanvasService): fabric.Canvas {
    return this.canvas = canvasService.getCanvasInstance();
  }

  //Método para crear cuadrados desde nuestro almácen
  crearRectanguloAlmacen(figura: SvgBase): fabric.Rect {
    this.id = figura.idElemento

    const rectangulo = new fabric.Rect({
      width: figura.width,
      height: figura.height,
      left: figura.coordX,
      top: figura.coordY,
      fill: figura.fill,
      stroke: figura.stroke,
      name: figura.idElemento.toString(),
      opacity: 0.65,
      scaleX: figura.scaleX,
      scaleY: figura.scaleY,
      angle: figura.angle
    });

    return rectangulo;
  }

  //Método para crear un elemento Cuadrado 'genérico' al pulsar el botón
  crearCuadradoGenerico = () => {
    this.id++;

    const cuadradoGenerico = new fabric.Rect({
      width: 200,
      height: 200,
      left: 50,
      top: 50,
      fill: 'black',
      stroke: 'black',
      name: this.id.toString(),
      opacity: 0.65,
    });

    cuadradoGenerico.on('mousedown', (options) => {
      //this.seleccionarFigura(options.target!);
    });

    return cuadradoGenerico;
  }

  //Método para crear elementos de texto desde nuestro almácen
  crearTextoAlmacen(figura: SvgBase): fabric.Text {
    this.id = figura.idElemento;

    const texto = new fabric.Text(figura.text, {
      left: figura.coordX,
      top: figura.coordY,
      fontFamily: figura.fonts,
      fontSize: figura.sizeLetter,
      fill: figura.fill,
      stroke: figura.stroke,
      name: figura.idElemento.toString(),
      scaleX: figura.scaleX,
      scaleY: figura.scaleY,
      angle: figura.angle,
    });
    return texto;
  }

  //Método para crear un elemento de texto 'genérico' al pulsar el botón
  crearTextoGenerico = () => {
    this.id++;
    const texto = new fabric.Text('Texto a modificar', {
      left: 150,
      top: 150,
      fontFamily: 'monospace',
      fontSize: 20,
      fill: 'black',
      stroke: 'black',
      name: this.id.toString(),
      borderColor: 'black'
    });
    return texto;
  }

  //Método para crear elementos de línea desde nuestro almácen
  crearLineaAlmacen(figura: SvgBase): fabric.Line {
    this.id = figura.idElemento;

    const linea = new fabric.Line([figura.x1, figura.y1, figura.x2, figura.y2], {
      stroke: figura.stroke,
      fill: figura.fill,
      strokeWidth: figura.strokeWidth,
      name: figura.idElemento.toString(),
      opacity: 0.85,
      angle: figura.angle,
      strokeDashArray: [NaN],
    });

    linea.on('mousedown', (options) => {
      //this.seleccionarFigura(options.target!);
    });

    this.canvas!.on('mouse:dblclick', (event) => {
      if (this.codoMode && event.target instanceof fabric.Line) {
        this.codoService.realizarCodoYLineas(event.target as fabric.Line, this.canvas!.getPointer(event.e));
        this.canvas!.remove(event.target);
      }
    });
    return linea;
  }

//Método para crear un elemento línea 'genérico' al pulsar el botón
crearLineaGenerica = () => {
  this.id++;
  const linea = new fabric.Line([50, 50, 200, 200], {
    stroke: 'black',
    fill: 'black',
    strokeWidth: 3,
    name: this.id.toString(),
    opacity: 0.85,
  });

  linea.on('mousedown', (options) => {
    //this.seleccionarFigura(options.target!);
  });

  return linea;
}

// seleccionarFigura(figura: fabric.Object): fabric.Object {
//   return this.objetoSeleccionado = figura;
// }
}
