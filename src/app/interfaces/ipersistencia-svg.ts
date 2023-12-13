import { Observable, Subject } from "rxjs";
import { Formas, SvgBase } from "./svgBase.interface";
import { EventEmitter } from "@angular/core";

export interface IpersistenciaSvg {
  //Operaciones principales para el servicio
  leerJson(id: number): Promise<SvgBase[]>;
  guardarSvg(elementos: SvgBase[]): Promise<SvgBase[]>;
  leerTiempoReal(): void;

  //Operaciones secundarias
  setId(id: number): void;
  getId(): Observable<number | null>;

  // Definir el Subject para actualizaciones de datos
  elementosGestor: Subject<SvgBase[]>;

  cambioTexto: EventEmitter<void>;
}
