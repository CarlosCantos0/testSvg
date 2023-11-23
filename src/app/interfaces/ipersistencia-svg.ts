import { Formas, SvgBase } from "./svgBase.interface";

export interface IpersistenciaSvg {
  leerLayout(): Promise<SvgBase[]>;
  guardarSvg(elementos: SvgBase[]): Promise<SvgBase[]>;
  leerTiempoReal(): void;
}


export interface iDibujar {
  id: number;
  coordX: number;
  coordY: number;
  colorRelleno: string;
  colorBorde: string;
  forma: 'linea' | 'cuadrado-rectangulo' | 'texto' | '';

  getCoordX(): void;
  setCoordX(x: number): void;
  getCoordY(): void;
  setCoordY(y: number): void;
  getColorRelleno(): void;
  setColorRelleno(color: string): void;
  getColorBorde(): void;
  setColorBorde(color: string): void;
  getForma(): void;
  setForma(forma: Formas): void;
}
