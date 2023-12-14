import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs';
import { SvgBase } from '../interfaces/svgBase.interface';
import { IpersistenciaSvg } from '../interfaces/ipersistencia-svg';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class DataService implements IpersistenciaSvg {
  private baseUrl = 'https://localhost:44387';
  private idSubject: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);

  constructor(private http: HttpClient) {
    this.elementosGestor.subscribe((elementos) => (this.elementos = elementos));
  }

  private elementos: SvgBase[] = [];
  public elementosGestor: Subject<SvgBase[]> = new Subject<SvgBase[]>();
  public cambioTexto = new EventEmitter<void>();

  async leerJson(id: number): Promise<SvgBase[]> {
    return await this.getElementosAlmacenados(id);
  }

  public setElementos(elementos: SvgBase[]): void {
    this.elementosGestor.next(elementos);
  }

  async guardarSvg(elementos: SvgBase[]): Promise<any> {
    console.log(elementos);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Agregar el encabezado Content-Type: application/json
      }),
    };
    return this.actualizarElementos(elementos, httpOptions).toPromise();
  }

  //Cuando le damos a guardar, actualizamos los elementos existentes posteamos los demás
  private actualizarElementos(
    elementos: SvgBase[],
    httpOptions: any
  ): Observable<any> {
    console.log('actualizar elementos:', elementos);
    return this.http.post(
      `${this.baseUrl}/api/Elementos/SetElementos`,
      elementos,
      httpOptions
    );
  }

  setId(id: number): void {
    this.idSubject.next(id);
  }

  getId(): Observable<number | null> {
    return this.idSubject.asObservable();
  }

  //Almacen en tiempo real para realizar modificaciones y visualizar los resultados mientras cambian por pantalla
  leerTiempoReal(): void {
    let iteraciones: number = 0;

    console.log('leyendo tiempo real');
    // Utiliza mergeMap para manejar las operaciones asincrónicas de manera secuencial
    this.getId()
      .pipe(
        mergeMap(async (id: number | null) => {
          // Asegúrate de que el ID esté disponible antes de continuar
          if (id !== null) {
            const elementos = await this.leerJson(id);

            if (elementos.length > 0) {
              for (const figura of elementos) {
                if (figura.form === 'text') {
                  // Encontraste la figura de texto, ahora actualiza el valor
                  if (iteraciones === 0) {
                    figura.text = 'patatas';
                  } else if (iteraciones === 3) {
                    figura.text = 'zanahoria';
                  } else if (iteraciones === 6) {
                    figura.text = 'empanada de choclo';
                  } else if (iteraciones === 9) {
                    figura.text = 'atún al pisto';
                  } else if (iteraciones === 12) {
                    figura.text = 'dani master in Angular';
                  }
                  iteraciones++;
                  break; // Rompe el bucle una vez que se actualiza el valor del primer texto encontrado
                }
              }

              this.setElementos(elementos);
              this.cambioTexto.emit(); // Emitir el evento cuando cambia el valor del texto
            }
          }
          return id; // Pasa el ID al siguiente observable
        })
      )
      .subscribe();
  }

  //Devuelve todos los elementos que existen en nuestra bbdd
  getElementosAlmacenados(id: number): Promise<SvgBase[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get<{ result: SvgBase[] }>(
          `${this.baseUrl}/api/Esquemas/GetElementosEsquema?idEsquema=${id}`
        )
        .subscribe(
          (response) => {
            resolve(response.result);
          },
          (error) => {
            console.error('Error en la solicitud HTTP:', error);
            reject(error);
          }
        );
    });
  }
}
