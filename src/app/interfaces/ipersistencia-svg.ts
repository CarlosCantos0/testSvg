import { Observable, Subject } from "rxjs";
import { Formas, SvgBase } from "./svgBase.interface";

export interface IpersistenciaSvg {
  //Operaciones principales para el servicio
  leerLayout(): Promise<SvgBase[]>;
  guardarSvg(elementos: SvgBase[]): Promise<SvgBase[]>;
  leerTiempoReal(): void;

  //Operaciones secundarias
  eliminarElemento(elemento: fabric.Object): Observable<any>;
  // Definir el Subject para actualizaciones de datos
  actualizacionDatosSubject: Subject<SvgBase[]>;
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
