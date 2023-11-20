import { Component, OnInit, inject } from '@angular/core';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { SvgService } from 'src/app/services/svg-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  //constructor(private svgService: SvgServiceService){}

  private svgService = inject(SvgService)
  public elementosAlmacen: SvgBase[] = [];  //Almacen recibido del servicio svg-service


  ngOnInit(): void {
    this.getElementosAlmacen();
  }

  getElementosAlmacen() {
    this.elementosAlmacen = this.svgService.getElementosAlmacenados();
  }
}
