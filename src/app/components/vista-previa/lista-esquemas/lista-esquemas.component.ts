import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { signal } from '@preact/signals';
import { EsquemaBase, IEsquema } from 'src/app/interfaces/iesquemas';
import { IpersistenciaSvg } from 'src/app/interfaces/ipersistencia-svg';
import { AuthService } from 'src/app/services/auth.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-lista-esquemas',
  templateUrl: './lista-esquemas.component.html',
  styleUrls: ['./lista-esquemas.component.css'],
})
export class ListaEsquemasComponent {
  @Output() idEsquemaSeleccionado = new EventEmitter<number>();

  id: number = 0;
  esquemasService!: IEsquema;
  dataService!: IpersistenciaSvg;
  esquemas: EsquemaBase[] = []; //lista con los distintos esquemas

  constructor(
    private providerService: ProviderService,
    private authService : AuthService,
    private router: Router
  ) {
    providerService.instanciarServicioEsquemas().then((servicio) => {
      this.esquemasService = servicio;
      this.actualizarDatos();
    });

    providerService.instanciarServicioPersistencia().then((servicio) => {
      this.dataService = servicio;
    });
  }

  // Método para actualizar en this.esquemas la información de los distintos esquemas
  async actualizarDatos(): Promise<void> {
    this.esquemas = await this.esquemasService.getEsquemas();
  }

  irAVistaPrevia(id: number): void {
    this.idEsquemaSeleccionado.emit(id);
    this.router.navigate(['/vista-previa']);
  }

  async eliminarEsquema(id: number) {
    console.log(id);
    this.id = id;
    try {
      await this.esquemasService.eliminarEsquema(id);

      // Eliminar esquema en el almacen local
      const indiceAEliminar = this.esquemas.findIndex(
        (esquema) => esquema.id === id
      );
      if (indiceAEliminar !== -1) {
        this.esquemas.splice(indiceAEliminar, 1);
        console.log('Esquema eliminado localmente');
      } else {
        console.log('No se encontró el esquema en el almacen local');
      }

      console.log('Operación completada con éxito');
    } catch (error) {
      console.error('Error en la operación', error);
    }
  }

  crearNuevoEsquema(): void {
    // Obtener el valor más alto actual de los ids
    const maxId = Math.max(...this.esquemas.map((esquema) => esquema.id), 0);

    // Asignar el nuevo id como el valor más alto + 1
    this.id = maxId + 1;

    // Solicitar la descripción al usuario mediante un cuadro de diálogo o modal
    const descripcion = window.prompt('Ingrese la descripción del esquema:');

    // Verificar si se ingresó una descripción
    if (descripcion !== null) {
      // Crear el objeto EsquemaBase con la descripción y la fecha actual
      const nuevoEsquema: EsquemaBase = {
        id: this.id,
        idUsuario: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        descripcion: descripcion,
      };
      console.log(nuevoEsquema);
      // Agregar el nuevo esquema a la lista local
      this.esquemas.push(nuevoEsquema);

      // Llamar al servicio para agregar el esquema
      this.esquemasService
        .setEsquema(nuevoEsquema)
        .then(() => {
          console.log('Esquema agregado correctamente');
        })
        .catch((error) => {
          console.error('Error al agregar el esquema', error);

          // En caso de error al persistir, eliminar el esquema de la lista local
          const index = this.esquemas.findIndex(
            (e) => e.id === nuevoEsquema.id
          );
          if (index !== -1) {
            this.esquemas.splice(index, 1);
          }
        });
    }
  }

  logout() {
    this.authService.logout();
  }
}
