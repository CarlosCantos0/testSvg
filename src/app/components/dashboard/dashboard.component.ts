import { Component, OnInit, inject } from '@angular/core';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private dataService: DataService){}

  public elementosAlmacen: SvgBase[] = [];  //Almacen recibido del servicio svg-service


  ngOnInit(): void {
    this.getElementosAlmacen();
  }

  getElementosAlmacen() {
    const elementosAlmacen = this.dataService.leerLayout()
      .then(data => {
        this.elementosAlmacen = data;
      })
  }
}
