import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddUserService } from 'src/app/services/add-user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  registrationForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private addUserService: AddUserService,  private snackBar: MatSnackBar) {
    this.registrationForm = this.fb.group({
      nombre: ['', Validators.required],
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    if(localStorage.getItem('token')) {
      router.navigate(["/vista-previa"]);
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // Lógica para procesar el formulario
      const userData = this.registrationForm.value;

      // Verificar que las contraseñas coincidan
      if (userData.password !== userData.confirmPassword) {
        console.log('Las contraseñas no coinciden');
        this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 });
        return;
      }

      this.loading = true;  // Marcamos el inicio de la carga

      // Llamamos al servicio para agregar el usuario
      this.addUserService.addUser({
        userName: userData.nombre,
        password: userData.password,
        email: userData.email,
        alias: userData.nickname,
        confirmPassword: userData.confirmPassword
      }).subscribe(
        (response: any) => {
          console.log('Usuario registrado exitosamente', response);
          // Realizar las acciones necesarias después de un registro exitoso
          this.router.navigate(["/login"]);
          this.loading = false;  // Marcamos el fin de la carga
        },
        (error: any) => {
          console.error('Error al registrar el usuario', error);
          // Realizar acciones si hay un error en el registro
          this.loading = false;  // Marcamos el fin de la carga
        }
      );
    }
  }
}
