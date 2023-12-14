import { ApiResponse, IEsquema } from './../interfaces/iesquemas';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { IpersistenciaSvg } from '../interfaces/ipersistencia-svg';
import { EsquemaBase } from '../interfaces/iesquemas';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EsquemaService implements IEsquema{
    constructor(private http: HttpClient) {}

  private baseUrl = 'https://gestorsvg.azurewebsites.net/api/Esquemas';

  async getEsquemas() {
    return await this.getEsquemasAlmacenados();
  }

  getEsquemasAlmacenados(): Promise<EsquemaBase[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ApiResponse>(`${this.baseUrl}/GetEsquemas`)
        .subscribe(
          esquemas => {
            resolve(esquemas.result);
          },
          error => {
            console.error('Error al obtener esquemas:', error);
            reject(error);
          }
        );
    });
  }

  async setEsquema(esquema: EsquemaBase): Promise<any> {
    const url = `${this.baseUrl}/AgregarEsquema`;
    try {
      await this.http.post(url, esquema).toPromise();
      console.log('Esquema agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el esquema', error);
      throw error;
    }
  }

  async eliminarEsquema(id: number): Promise<any> {
    const url = `${this.baseUrl}/DeleteEsquema/${id}`;
    try {
      await this.http.delete(url).toPromise();
      console.log('Esquema eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el esquema', error);
      throw error;
    }
  }
}
