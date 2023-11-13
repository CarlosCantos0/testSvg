import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VistaPreviaComponent } from './components/vista-previa/vista-previa.component';
import { FiguraService } from './services/figura.service';
import { CodoService } from './services/codo.service';
import { SvgServiceService } from './services/svg-service.service';
import { CanvasService } from './services/canvas.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VistaPreviaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    FiguraService,
    CodoService,
    SvgServiceService,
    CanvasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
