
export interface IEsquema {
  getEsquemas(): Promise<EsquemaBase[]>;
  setEsquema(esquema: EsquemaBase): Promise<EsquemaBase>;
  eliminarEsquema(id: number): Promise<any>;
}

export interface ApiResponse {
  isSucces: boolean;
  result: EsquemaBase[];
  displayMessage: string;
  errorMessages: any;
}

export interface EsquemaBase {
  id: number;
  idUsuario: string;
  descripcion: string;
}
