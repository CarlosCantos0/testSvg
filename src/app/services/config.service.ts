import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private serviceUrl = 'http://localhost:3200/servicios'

  constructor(private http: HttpClient) { }

  obtenerServicios(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(this.serviceUrl).subscribe({
        next    : (lectura: any ) => resolve(lectura),
        error   : (error: any)    => reject(error),
        complete: ()              => console.log('Lectura completada')
      })
    })
  }

}
