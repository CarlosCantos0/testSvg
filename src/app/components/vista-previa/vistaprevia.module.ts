import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VistaPreviaRoutingModule } from './vista-previa-routing.module';
import { VistaPreviaComponent } from './pages/vista-previa.component';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CodoService } from 'src/app/services/codo.service';
import { FiguraService } from 'src/app/services/figura.service';
import { CanvasService } from 'src/app/services/canvas.service';
import { ListaEsquemasComponent } from './lista-esquemas/lista-esquemas.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    VistaPreviaComponent,
    ListaEsquemasComponent,
  ],
  imports: [
    CommonModule,
    VistaPreviaRoutingModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [
    CodoService,
    FiguraService,
    CanvasService
  ]
})
export class VistaPreviaModule { }
