import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, from, mergeMap, of, toArray } from 'rxjs';
import { SvgBase } from '../interfaces/svgBase.interface';
import { IpersistenciaSvg } from '../interfaces/ipersistencia-svg';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class DataService implements IpersistenciaSvg {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.elementosGestor.subscribe(elementos => this.elementos = elementos)
  }

  private elementos: SvgBase[] = [];
  public elementosGestor: Subject<SvgBase[]> = new Subject<SvgBase[]>
  actualizacionDatosSubject = new Subject<SvgBase[]>(); // Emisor de eventos

  async leerJson(): Promise<SvgBase[]> {
    return await this.getElementosAlmacenados();
  }

  public setElementos(elementos: SvgBase[]): void {
    this.elementosGestor.next(elementos)
  }

  async guardarSvg(elementos: SvgBase[]): Promise<any> {
    console.log(elementos)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // Agregar el encabezado Content-Type: application/json
      })
    };

    try {
      await this.actualizarElementos(elementos, httpOptions)
        .toPromise();
      return 'Elementos actualizados exitosamente';
    } catch (error) {
      throw new Error('Error al actualizar elementos: ' + error);
    }
  }

  //Elimina la referencia de mi backend
  eliminarElemento(elemento: fabric.Object): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete(`${this.baseUrl}/FigurasData/${parseInt(elemento.name!)}`, httpOptions);
  }

  //Cuando le damos a guardar, actualizamos los elementos existentes posteamos los demás
  private actualizarElementos(elementos: SvgBase[], httpOptions: any): Observable<any> {
    console.log('actualizar elementos');

    return from(elementos).pipe(
      mergeMap(elemento =>
        this.http.get(`${this.baseUrl}/FigurasData/${elemento.id}`).pipe(
          catchError(() => of(null)) // Manejamos el error si el elemento no existe
        ).pipe(
          mergeMap(existingElement => {
            if (existingElement) {
              // El elemento existe, realiza un PATCH
              return this.http.patch(`${this.baseUrl}/FigurasData/${elemento.id}`, elemento, httpOptions);
            } else {
              console.log(elemento)
              // El elemento no existe, realiza un POST
              return this.http.post(`${this.baseUrl}/FigurasData`, elemento, httpOptions);
            }
          })
        )
      ),
      toArray()
    );
  }

  //Almacen en tiempo real para realizar modificaciones y visualizar los resultados mientras cambian por pantalla
  leerTiempoReal(): void {
    let iteraciones: number = 0

    console.log('leyendo tiempo real')
    this.leerJson()
      .then(elementos => {

        setInterval(async () => {
          if (elementos.length > 0) {
            console.log(elementos);
            if (iteraciones == 0) {
              elementos[0].text = 'patatas'
            }
            if (iteraciones == 3) {
              elementos[0].text = 'zanahoria'
            }
            if (iteraciones == 6) {
              elementos[0].text = 'empanada de choclo'
            }
            if (iteraciones == 9) {
              elementos[0].text = 'atún al pisto'
            }
            if (iteraciones == 12) {
              elementos[0].text = 'dani master in Angular'
            }

            iteraciones++;
            this.setElementos(elementos)
          }

        }, 2500);

      });
      console.log(iteraciones)
    // Ejecutar cada 2.5 segundos (en milisegundos)
  }

  // Método para actualizar datos en la lista existente
  private actualizarDatos(datosActualizados: SvgBase[]): void {

    datosActualizados.forEach((nuevoDato: SvgBase) => {
      const elementoExistente = this.elementos.find(elemento => elemento.id == nuevoDato.id);
      if (elementoExistente) {
        // Actualizar propiedades del elemento existente con los valores del nuevo dato
        Object.assign(elementoExistente, nuevoDato);
      } else {
        // Si el elemento no existe en la lista actual, se puede agregar si es necesario
        this.elementos.push(nuevoDato);
      }
      //console.log(this.elementos)
    });
  }

  //Devuelve todos los elementos que existen en nuestra bbdd
  getElementosAlmacenados(): Promise<SvgBase[]> {
    return new Promise((resolve, reject) => {
      this.http.get<SvgBase[]>(`${this.baseUrl}/FigurasData`)
        .subscribe(elementos => {
          resolve(elementos)
        })
    })
  }

  // Método para recibir actualizaciones
  recibirActualizacionDatos(): Observable<SvgBase[]> {
    return this.actualizacionDatosSubject.asObservable();
  }
}
