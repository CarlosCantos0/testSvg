import { Injectable, OnInit } from '@angular/core';
import { SvgBase } from '../interfaces/svgBase.interface';

@Injectable({
  providedIn: 'root'
})
export class SvgService {

  id: number = 0;

  constructor() {
  }

  private elementosAlmacen: SvgBase[] = [
    {
      svgContent: '',
      id: this.id++,                //Identificador único
      forma: 'cuadrado-rectangulo', //Tipo de forma para diferenciar del resto
      coordX: 50,                   //coordenada X en el lienzo
      coordY: 50,                   //Coordenada Y en el lienzo
      width: 100,                   // Ancho del cuadrado-rectangulo
      height: 100,                  //Alto del cuadrado-rectangulo
      stroke: 'red',                //Color del borde
      rellenado: false,             //si queremos rellenado o no
      fill: '',                     //Color relleno
      strokeWidth: NaN,
      sizeLetter: NaN,
      text: '',
      fonts: '',
      x1: NaN,
      x2: NaN,
      y1: NaN,
      y2: NaN
    },
    {
      svgContent: '',
      id: this.id++,
      forma: 'cuadrado-rectangulo',
      coordX: 150,
      coordY: 250,
      width: 200,
      height: 300,
      stroke: 'blue',
      rellenado: true,
      fill: '#0E4444',
      strokeWidth: NaN,
      sizeLetter: NaN,
      text: '',
      fonts: '',
      x1: NaN,
      x2: NaN,
      y1: NaN,
      y2: NaN
    },
    {
      svgContent: '',
      id: this.id++,
      forma: 'linea',           // Marca como 'linea' para diferenciarlo de otros elementos
      coordX: NaN,
      coordY: NaN,
      width: NaN,
      height: NaN,
      stroke: '#0a0a0a',
      rellenado: false,
      fill: '',
      strokeWidth: 3,
      sizeLetter: 0,
      text: '',
      fonts: '',
      x1: 100,                  // Coordenada inicial X
      y1: 100,                  // Coordenada inicial Y
      x2: 200,                  // Coordenada final X
      y2: 200,                  // Coordenada final Y
    },
    {
      svgContent: '',
      forma: 'texto',
      id: this.id++,
      coordX: 200,              // Coordenada X en el lienzo
      coordY: 100,              // Coordenada Y lienzo
      width: NaN,
      height: NaN,
      stroke: '',               //Color borde del texto
      rellenado: false,
      strokeWidth: NaN,
      sizeLetter: 30,
      text: 'Texto de ejemplo', // El texto a mostrar
      fonts: 'monospace',       // Tipos de fuentes
      fill: 'black',            // Color relleno texto
      x1: NaN,
      y1: NaN,
      x2: NaN,
      y2: NaN,
    }
  ];  //Almacen compartido con el componente Dashboard para realizar el SVG y la vistaPrevia en el Canvas

  // Obtiene las formas almacenadas para editarlas posteriormente y realizar la descarga
  getElementosAlmacenados(): SvgBase[] {
    return this.elementosAlmacen;
  }

  // Método para generar contenido SVG basado en la forma seleccionada y sus propiedades
  updateSvgContent(svg: SvgBase): string {
    let svgContent = '';

    if (svg.forma === 'cuadrado-rectangulo') {
      const CuadradoRectangulo = svg;
      let fillAttribute = CuadradoRectangulo.rellenado ? CuadradoRectangulo.stroke : 'none';

      svgContent = `<g id="figura-${svg.id}"><rect id="${CuadradoRectangulo.id}" x="${CuadradoRectangulo.coordX}" y="${CuadradoRectangulo.coordY}" width="${CuadradoRectangulo.width}" height="${CuadradoRectangulo.height}" fill="${fillAttribute}" stroke="${CuadradoRectangulo.stroke}"`;
      svgContent += ' /></g>';
    }

    svg.svgContent = svgContent;
    return svgContent;
  }

}
