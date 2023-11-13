import { Injectable, OnInit } from '@angular/core';
import { SvgBase } from '../interfaces/svgBase.interface';

@Injectable({
  providedIn: 'root'
})
export class SvgServiceService {

  constructor() { }

  figuraSeleccionada: SvgBase = {
    svgContent: 'hola 21221',
    id: 0,
    forma: 'cuadrado-rectangulo',
    coordX: 50,
    coordY: 50,
    width: 100,
    height: 100,
    stroke: 'orange',
    rellenado: false,
    fill: 'none',
    strokeWidth: 3,
    sizeLetter: 0,
    text: '',
    fonts: '',
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
  };

  figura2: SvgBase = {
    svgContent: '',
    id: 1,
    forma: 'cuadrado-rectangulo',
    coordX: 150,
    coordY: 250,
    width: 200,
    height: 300,
    stroke: 'blue',
    rellenado: true,
    fill: '#0a0a0a',
    strokeWidth: 3,
    sizeLetter: 0,
    text: '',
    fonts: '',
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
  };

  figuraLinea: SvgBase = {
    svgContent: '', // Deja este campo vacío o como prefieras para las líneas
    id: 2, // Un nuevo ID para la línea
    coordX: 150,
    coordY: 250,
    width: 200,
    height: 300,
    stroke: '#0a0a0a',
    rellenado: true,
    fill: '#0a0a0a',
    strokeWidth: 3,
    sizeLetter: 0,
    text: '',
    fonts: '',
    forma: 'linea', // Marca como 'linea' para diferenciarlo de otros elementos
    x1: 100, // Coordenada inicial X
    y1: 100, // Coordenada inicial Y
    x2: 200, // Coordenada final X
    y2: 200, // Coordenada final Y
  };

  figuraTexto: SvgBase = {
      svgContent: '', // Deja este campo vacío o como prefieras para el objeto de texto
      id: 3, // Un nuevo ID para el objeto de texto
      forma: 'texto', // Marca como 'texto' para diferenciarlo de otros elementos
      coordX: 200, // Coordenada X
      coordY: 100, // Coordenada Y
      width: 200,
      height: 200,
      stroke: 'grey',
      rellenado: false,
      strokeWidth: 4,
      sizeLetter: 25,
      text: 'Texto de ejemplo', // El texto que deseas mostrar
      fonts: 'monospace', // Tipo de fuente
      fill: 'black', // Color del texto
      x1: 100, // Coordenada inicial X
      y1: 100, // Coordenada inicial Y
      x2: 200, // Coordenada final X
      y2: 200, // Coordenada final Y
  };


  private elementosAlmacen: SvgBase[] = [];  //Almacen compartido con el componente para realizar la descarga y vistaPrevia

  iniciarAlmacen() {
    this.elementosAlmacen.push(this.figuraSeleccionada, this.figura2, this.figuraLinea, this.figuraTexto);
  }

  // Obtiene las formas almacenadas para editarlas posteriormente y realizar la descarga
  getElementosAlmacenados(): SvgBase[]{
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
