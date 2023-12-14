import { Injectable } from '@angular/core';
import { Usuario } from '../auth/pages/login/models/usuario.model';
import { IUsuario } from '../interfaces/iUsuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddUserService {
  private baseUrl = 'https://gestorsvg.azurewebsites.net';

  constructor(private http: HttpClient) {}

  addUser(usuario: IUsuario): Observable<any> {
    console.log(usuario)
    const url = `${this.baseUrl}/api/Usuarios/CrearUsuario`;
    return this.http.post(url, usuario);
  }
}
