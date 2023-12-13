import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { IpersistenciaSvg } from '../interfaces/ipersistencia-svg';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { DataService2 } from './DataService2.service';
import { EsquemaService } from './esquema.service';
import { IEsquema } from '../interfaces/iesquemas';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private servicios: any = {
    DataService: DataService,
    otro: ConfigService
  }

  constructor(private configService: ConfigService, private http: HttpClient) { }

  async instanciarServicioPersistencia(): Promise<IpersistenciaSvg> {
    const configuracion = await this.configService.obtenerServicios();
    let nombreServicio = configuracion[0];  //.nombreServicio; en el caso de tener una petición HTTP en la configuración
    switch (nombreServicio) {
      case 'DataService':
        console.log('dataService');
        return new DataService(this.http);
      case 'DataService2':
        console.log('dataService2');
        return new DataService2(this.http);
    }
    return new DataService(this.http);
  }

  async instanciarServicioEsquemas(): Promise<IEsquema> {
    return new EsquemaService(this.http);
  }

}
