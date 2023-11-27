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

  private datosActualizadosSubject = new BehaviorSubject<SvgBase[]>([]);
  //datosActualizados$ = this.datosActualizadosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.actualizacionDatosSubject.subscribe((datos: SvgBase[]) => {
      this.actualizarDatos(datos); // Actualizar la lista con los datos recibidos
    });
   }

  private elementos: SvgBase[] = [];
  actualizacionDatosSubject = new Subject<SvgBase[]>(); // Emisor de eventos

  async leerLayout(): Promise<SvgBase[]> {
    this.elementos = await this.getElementosAlmacenados();
    return this.elementos;
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

    console.log(this.http.delete(`${this.baseUrl}/FigurasData/${parseInt(elemento.name!)}`, httpOptions))

    return this.http.delete(`${this.baseUrl}/FigurasData/${parseInt(elemento.name!)}`, httpOptions);
  }

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
    console.log('leyendo tiempo real')
    setInterval(() => {
      // Simulación de cambios en algunos elementos
      if (this.elementos.length > 0) {
        console.log(this.elementos);
        const randomIndex = Math.floor(Math.random() * this.elementos.length);
        const randomElement = this.elementos[randomIndex];
        // Modificar algunos valores del elemento aleatoriamente para simular cambios
        randomElement.coordX = Math.random() * 100;
        randomElement.coordY = Math.random() * 100;

        // Actualizamos el elemento en el backend
        this.guardarSvg(this.elementos);
        //this.actualizarDatos(this.elementos);

      }
    }, 2500); // Ejecutar cada 2.5 segundos (en milisegundos)
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

  // Log del almacén para realizar pruebas dev
  devolverAlmacen() {
    console.log(this.elementos)
  }

  // Método para recibir actualizaciones
  recibirActualizacionDatos(): Observable<SvgBase[]> {
    return this.actualizacionDatosSubject.asObservable();
  }

  //Método para actualizar el texto introducido en el elemento de texto
  actualizarTexto(modifiedObject: fabric.Text): void {
    if (modifiedObject instanceof fabric.Text) {
      const updatedId = parseInt(modifiedObject.name!);
      const updatedText = modifiedObject.text!;

      // Busca y actualiza el elemento correspondiente en la lista local
      const elementoActualizado = this.elementos.find(elemento => elemento.id === updatedId);
      if (elementoActualizado) {
        elementoActualizado.text = updatedText;

        // Emitir la lista actualizada a través del Subject
        this.actualizacionDatosSubject.next(this.elementos);
      }
    }
  }
}
