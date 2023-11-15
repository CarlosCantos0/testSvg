import { Component, OnInit, inject } from '@angular/core';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { SvgServiceService } from 'src/app/services/svg-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  private svgService = inject(SvgServiceService)
  public elementosAlmacen: SvgBase[] = [];  //Almacen compartido con el componente para realizar la descarga y vistaPrevia


  ngOnInit(): void {
    this.getElementosAlmacen();
  }

  getElementosAlmacen() {
    this.elementosAlmacen = this.svgService.getElementosAlmacenados();
  }
}
