export type Formas = '' | 'rect' | 'text' | 'line';
//export type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';


//IndexZ va por posición de la lista de las figuras
export interface SvgBase {
  idElemento: number;
  idEsquema: number;
  idTipoElemento: number;
  rellenado: boolean;
  form: string;
  coordX: number;
  coordY: number;
  width: number;
  height: number;
  stroke: string;
  fill: string;
  svgContent: string;
  strokeWidth: number;
  sizeLetter: number;
  text: string;
  fonts: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  name: string;
  scaleX: number;
  scaleY: number;
  angle: number;
  strokeDashArray: number[],
  estadoBorde: string,
  nombrePersonalizado: string
}
