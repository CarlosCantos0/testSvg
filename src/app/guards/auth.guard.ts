import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserHelper } from '../helpers/user.helper';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private userHelper: UserHelper, public router: Router) {}

  canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {

    if (this.userHelper.isAuthenticated()) {
      // El usuario está autenticado
      //No le dejamos ir al login ni al registro
      console.log(state.url)
      if (state.url !== '/vista-previa') {
        this.router.navigate(['/vista-previa']);
      }
      return true;
    } else {
      // El usuario no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
