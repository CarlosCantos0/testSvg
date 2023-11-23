import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, from, mergeMap, toArray } from 'rxjs';
import { SvgBase } from '../interfaces/svgBase.interface';
import { IpersistenciaSvg } from '../interfaces/ipersistencia-svg';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class DataService implements IpersistenciaSvg {

  private baseUrl = 'http://localhost:3000';

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

  guardarSvg(elementos: SvgBase[]): Promise<any> {
    console.log(elementos)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' // Agregar el encabezado Content-Type: application/json
      })
    };

    return this.actualizarElementos(elementos, httpOptions)
      .toPromise()
      .then(() => 'Elementos actualizados exitosamente')
      .catch(error => {
        throw new Error('Error al actualizar elementos: ' + error.message.value);
      });
  }

  private actualizarElementos(elementos: SvgBase[], httpOptions: any): Observable<any> {
    console.log('actualizar elementos');
    return from(elementos).pipe(
      mergeMap(elemento =>
        this.http.patch(`${this.baseUrl}/FigurasData/${elemento.id}`, elemento, httpOptions)
      ),
      toArray()
    );
  }

  leerTiempoReal(): void {
    console.log('leyendo tiempo real')
    setInterval(() => {
      // Simulación de cambios en algunos elementos (aquí debes modificar según tu lógica)
      if (this.elementos.length > 0) {
        console.log(this.elementos);
        const randomIndex = Math.floor(Math.random() * this.elementos.length);
        const randomElement = this.elementos[randomIndex];
        // Modificar algunos valores del elemento aleatoriamente para simular cambios
        randomElement.coordX = Math.random() * 100;
        randomElement.coordY = Math.random() * 100;
        // Aquí podrías cambiar otros atributos como color, forma, etc.

        // Luego, podrías actualizar el elemento en tu backend si es necesario
        this.guardarSvg(this.elementos);
        //this.actualizarDatos(this.elementos);

      }
    }, 2500); // Ejecutar cada 5 segundos (en milisegundos)
  }

  // Método para actualizar datos en la lista existente
  private actualizarDatos(datosActualizados: SvgBase[]): void {
    datosActualizados.forEach((nuevoDato: SvgBase) => {
      const elementoExistente = this.elementos.find(elemento => elemento.id === nuevoDato.id);
    if (elementoExistente) {
      // Actualizar propiedades del elemento existente con los valores del nuevo dato
      Object.assign(elementoExistente, nuevoDato);
      console.log('Actualizando: ' + nuevoDato.text);
    } else {
      console.log('Push');
      // Si el elemento no existe en la lista actual, se puede agregar si es necesario
      this.elementos.push(nuevoDato);
    }
      //console.log(this.elementos)
    });
  }


  getElementosAlmacenados(): Promise<SvgBase[]> {

    return new Promise((resolve, reject) => {
      this.http.get<SvgBase[]>(`${this.baseUrl}/FigurasData`)
        .subscribe(elementos => {
          resolve(elementos)
        })
    })
  }

  devolverAlmacen() {
    console.log(this.elementos)
  }

  // Método para recibir actualizaciones
  recibirActualizacionDatos(): Observable<SvgBase[]> {
    return this.actualizacionDatosSubject.asObservable();
  }

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
