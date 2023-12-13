import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  obtenerServicios(): string {
    return 'DataService'  //En este caso asignamos un valor predeterminado ya que no tenemos mas servicios, en el caso de tenerlos podríamos tener un método como el comentado abajo
  }


  //private serviceUrl = 'http://localhost:3200/servicios'
  // instanciamos en el construcutor http con   private http: HttpClient
  // obtenerServicios(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get<any[]>(this.serviceUrl).subscribe({
  //       next    : (lectura: any ) => resolve(lectura),
  //       error   : (error: any)    => reject(error),
  //       complete: ()              => console.log('Lectura completada')
  //     })
  //   })
  // }

}
