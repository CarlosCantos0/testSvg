import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserHelper  {

    private authenticationChanged = new Subject<boolean>();
    constructor(public router: Router, private jwtHelper: JwtHelperService) {

    }

  public getModulos(): string[] {
    if (!this.isAuthenticated()) {
      return [];
    }
    else {
      const user = this.getToken();
      return user.modulos.split(',');
    }
  }

    public isAuthenticated(): boolean {

        return (!(localStorage['token'] === undefined ||
            localStorage['token'] === null ||
            localStorage['token'] === 'null' ||
            localStorage['token'] === 'undefined' ||
            localStorage['token'] === ''));
    }

    public isAuthenticationChanged(): any {
        return this.authenticationChanged.asObservable();
    }

    public getToken(): any {
        if ( localStorage['token'] === undefined ||
            localStorage['token'] === null ||
            localStorage['token'] === 'null' ||
            localStorage['token'] === 'undefined' ||
           localStorage['token'] === '') {
            return '';
        }
        const obj = this.jwtHelper.decodeToken(localStorage['token']);
        return obj;
    }

    public getUser(): any {
      if ( localStorage['user'] === undefined ||
          localStorage['user'] === null ||
          localStorage['user'] === 'null' ||
          localStorage['user'] === 'undefined' ||
          localStorage['user'] === '') {
          return '';
      }
      const obj = JSON.parse(localStorage['user']);
      return obj;
  }

    public setToken(data: any): void {
        this.setStorageToken(JSON.stringify(data));
    }

    public failToken(): void {
        this.setStorageToken(undefined);
    }

    private setStorageToken(value: any): void {
        localStorage['token'] = value;
        this.authenticationChanged.next(this.isAuthenticated());
        this.router.navigate(['/login']);
    }

}
