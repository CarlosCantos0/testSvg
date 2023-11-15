import { Injectable, OnInit } from '@angular/core';
import { SvgBase } from '../interfaces/svgBase.interface';

@Injectable({
  providedIn: 'root'
})
export class SvgServiceService {

  id: number = 0;

  constructor() {
  }

  private elementosAlmacen: SvgBase[] = [
    {
      svgContent: '',
      id: this.id++,
      forma: 'cuadrado-rectangulo',
      coordX: 50,
      coordY: 50,
      width: 100,
      height: 100,
      stroke: 'red',
      rellenado: false,
      fill: '',
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
      svgContent: '', // Deja este campo vacío o como prefieras para las líneas
      id: this.id++, // Un nuevo ID para la línea
      forma: 'linea', // Marca como 'linea' para diferenciarlo de otros elementos
      coordX: 150,
      coordY: 250,
      width: NaN,
      height: NaN,
      stroke: '#0a0a0a',
      rellenado: false,
      fill: '#0a0a0a',
      strokeWidth: 3,
      sizeLetter: 0,
      text: '',
      fonts: '',
      x1: 100, // Coordenada inicial X
      y1: 100, // Coordenada inicial Y
      x2: 200, // Coordenada final X
      y2: 200, // Coordenada final Y
    },
    {
      svgContent: '', // Deja este campo vacío o como prefieras para el objeto de texto
      forma: 'texto', // Marca como 'texto' para diferenciarlo de otros elementos
      id: this.id++, // Un nuevo ID para el objeto de texto
      coordX: 200, // Coordenada X
      coordY: 100, // Coordenada Y
      width: NaN,
      height: NaN,
      stroke: '',
      rellenado: false,
      strokeWidth: NaN,
      sizeLetter: 30,
      text: 'Texto de ejemplo', // El texto que deseas mostrar
      fonts: 'monospace', // Tipo de fuente
      fill: 'black', // Color del texto
      x1: NaN, // Coordenada inicial X
      y1: NaN, // Coordenada inicial Y
      x2: NaN, // Coordenada final X
      y2: NaN, // Coordenada final Y
    }
  ];  //Almacen compartido con el componente para realizar la descarga y vistaPrevia

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
