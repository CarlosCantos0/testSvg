export type Formas = '' | 'rect' | 'text' | 'line'
//export type Fuentes = 'Arial' | 'sans-serif' | 'serif' | 'monospace' | 'Times New Roman' | '';


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
  fonts: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  name: string;
  scaleX: number;
  scaleY: number;
}
