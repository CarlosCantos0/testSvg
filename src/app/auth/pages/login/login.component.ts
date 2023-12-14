import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router  } from '@angular/router';
import { UserHelper } from 'src/app/helpers/user.helper';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Usuario } from './models/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup;
  public validarEmail: boolean = false;
  public inputType = 'password';
  public visible = false;
  public loading = false;
  public pageLoad = false;
  public errorMessage = '';

  /** Nombre de la web (se coge del environment) */
  nombreWeb: string = 'Gestor Web Elementos SVG';

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private authService: AuthService,
              private userHelper: UserHelper,
              public jwtHelper: JwtHelperService
  ) {
    const token = localStorage.getItem('token');
    if(localStorage.getItem('token') !== null && !this.jwtHelper.isTokenExpired(token)) {
      router.navigate(["/vista-previa"]);
    }
  }

  ngOnInit() {
    this.pageLoad = true;

    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    const usuario = new Usuario();
    usuario.userName = this.form.value.usuario;
    usuario.password = this.form.value.password;

    this.loading = true;
    this.authService.login(usuario).subscribe(
      (data: any ) => {
        this.loading = true;

        var user = this.userHelper.getUser();

        if (user.defaultPage) {
          this.router.navigate(['/vista-previa']);
        }
        else {
          this.router.navigate(['/vista-previa']); // Por defecto
        }

      },
      (err: { error: string; }) => {
        this.loading = false;
        this.errorMessage = err.error;
      });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
