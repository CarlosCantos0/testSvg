import { Router } from '@angular/router';

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Usuario } from '../auth/pages/login/models/usuario.model';
import { UserHelper } from '../helpers/user.helper';

@Injectable()
export class AuthService {
  baseUrl: string;
  usuario!: Usuario | null;
  token: string | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userHelper: UserHelper
  ) {
    this.baseUrl = environment.appRoot;
    this.token = localStorage.getItem('token');
  }

  guardarStorage(data: any) {
    localStorage.setItem('token', data.result);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.usuario = this.userHelper.getToken();
    this.token = data.result;
  }

  login(usuario: Usuario) {
    const url = this.baseUrl + 'sdAuth/login';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, usuario, { headers: reqHeader }).pipe(
      map((data: any) => {
        if (data) {
          this.guardarStorage(data);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  renuevaToken() {
    const url = this.baseUrl + 'sdAuth/Renuevatoken';

    let params = new HttpParams();
    params = params.append('token', this.token!);

    return this.http.get(url, { params }).pipe(
      map((data: any) => {
        if (data.result) {
          this.guardarStorage(data.result);
          return true;
        } else return false;
      })
    );
  }

  logout() {
    this.router.navigate(['/login']);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.usuario = null;
      this.token = '';
  }

  getToken(): string {
    return this.token!;
  }
}
