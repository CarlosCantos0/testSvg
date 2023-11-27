import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VistaPreviaComponent } from './components/vista-previa/vista-previa.component';
import { FiguraService } from './services/figura.service';
import { CodoService } from './services/codo.service';
import { CanvasService } from './services/canvas.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { PERSISTENCIA_SVG_TOKEN } from './components/vista-previa/token-servicio';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VistaPreviaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    MatListModule
  ],
  providers: [
    FiguraService,
    CodoService,
    CanvasService,
    { provide: PERSISTENCIA_SVG_TOKEN, useClass: DataService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
