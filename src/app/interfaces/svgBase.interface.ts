export type Formas = '' | 'cuadrado-rectangulo' | 'texto' | 'linea'
export type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';


export interface SvgBase {
  rellenado: boolean;
  id: number;
  forma: Formas;
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
  fonts: Fuentes;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
