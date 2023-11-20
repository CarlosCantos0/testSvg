import { EventEmitter, Injectable, inject } from '@angular/core';
import { fabric } from 'fabric';
import { LineCodoMap } from '../components/vista-previa/vista-previa.component';

interface lineaParams {
  lineaOriginal?: fabric.Line;
  linea1: fabric.Line;
  linea2: fabric.Line;
  codo: fabric.Circle;
  punto1?: fabric.Circle;
  punto2?: fabric.Circle;
}

interface LineHandler {
  line: fabric.Line;
  startElement: fabric.Circle;
  endElement: fabric.Circle;
}

interface CodoData {
  lineas: [fabric.Line, fabric.Line]; // Array con las líneas asociadas al codo
  puntosControl: [fabric.Circle, fabric.Circle]; // Array con los puntos de control asociados al codo
}

type Punto = {
  x: number;
  y: number;
  id: string;
};

@Injectable({
  providedIn: 'root'
})
export class CodoService {

  private canvas: fabric.Canvas | undefined;
  private lineCodoMaps: LineCodoMap[] = [];
  private lineaConexion: LineHandler[] = [];

  private codosData: Map<fabric.Circle, CodoData[]> = new Map();


  id: number = 0;

  // Estructura de mapeo de codos y líneas
  //private conexionCodoLineaMap: Map<fabric.Circle, { linea1: fabric.Line, linea2: fabric.Line }> = new Map();

  constructor() { }

  inicializar(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  private eliminarLineaDelCanvas(linea: fabric.Line): void {
    this.canvas!.remove(linea);

    // Eliminar la referencia de la línea en lineCodoMaps
    const indiceMapa = this.lineCodoMaps.findIndex(map => map.lines.includes(linea));
    if (indiceMapa !== -1) {
      const map = this.lineCodoMaps[indiceMapa];
      map.lines = map.lines.filter(l => l !== linea);
      //console.log(map.lines)
    }

    // Eliminar la referencia de la línea en lineaConexion
    this.lineaConexion = this.lineaConexion.filter(entry => entry.line !== linea);

    // Eliminar la referencia de la línea en codosData
    this.codosData.forEach((codosData, codo) => {
      codosData.forEach(codoData => {
        const index = codoData.lineas.indexOf(linea);
        if (index !== -1) {
          codoData.lineas.splice(index, 1);
        }
      });
    });

  }

  // Agregar las líneas asociadas a un codo al mapa
  private agregarPuntosLinea(linea: fabric.Line, puntoInicio: fabric.Circle, puntoFinal: fabric.Circle): void {
    this.lineaConexion.push({ line: linea, startElement: puntoInicio, endElement: puntoFinal });
    //!TO DO; Conexion de la linea con los distintos puntos
    console.log(this.lineaConexion);
  }

  devolverConexionMap() {
    console.log(this.lineaConexion);
  }

  realizarCodoYLineas(linea: fabric.Line, pointer: { x: number, y: number }) {
    const { x1, y1, x2, y2 } = linea;

    const codo = this.crearCodo(pointer);


    this.canvas!.bringToFront(codo);
    const codoPosition = codo.getCenterPoint();

    const puntoA: Punto = { x: x2!, y: y2!, id: 'Punto' + this.id.toString() };
    const puntoB: Punto = { x: x1!, y: y1!, id: 'Punto' + this.id.toString() };

    const punto1 = this.puntoAzulBuscarCercania(puntoA.x, puntoA.y);
    const punto2 = this.puntoAzulBuscarCercania(puntoB.x, puntoB.y);
    console.log(this.id)

    const [linea1, linea2] = this.crearNuevasLineas(linea, codoPosition);

    console.log(this.codosData)

    this.eliminarLineaDelCanvas(linea);
    this.agregarElementosAlCanvas({ codo, linea1, linea2, punto1, punto2 });
    this.actualizarLineCodoMap({ lineaOriginal: linea, linea1, linea2, codo, punto1, punto2 });
    this.actualizarLineasEnMovimiento({ linea1, linea2, codo: codo });

    console.log(this.lineCodoMaps);
  }

  crearCodo(pointer: { x: number, y: number }): fabric.Circle {
    this.id++;
    return new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 10,
      fill: 'red',
      hasBorders: false,
      hasControls: false,
      name: 'codo' + this.id.toString(),
    });
  }

  crearNuevasLineas(linea: fabric.Line, codoPosition: fabric.Point): [fabric.Line, fabric.Line] {
    const { x1, y1, x2, y2 } = linea;
    const nuevaLinea1 = this.crearNuevaLinea([x1!, y1!, codoPosition.x, codoPosition.y], linea.stroke!, linea.strokeWidth!);
    const nuevaLinea2 = this.crearNuevaLinea([codoPosition.x, codoPosition.y, x2!, y2!], linea.stroke!, linea.strokeWidth!);
    return [nuevaLinea1, nuevaLinea2];
  }

  agregarElementosAlCanvas(params: lineaParams): void {
    const { codo, linea1, linea2, punto1, punto2 } = params;
    if (punto1 === undefined || punto2 === undefined) {
      this.canvas!.add(codo, linea1, linea2);
    } else if (punto2 === undefined) {
      this.canvas!.add(codo, linea1, linea2, punto1);
    } else if (punto1 === undefined) {
      this.canvas!.add(codo, linea1, linea2, linea2)
    } else {
      this.canvas!.add(codo, linea1, linea2, punto1!, punto2!);
    }
    this.agregarPuntosLinea(linea2, codo, punto1!); //COMPORTAMIENTO DE LAS LINEAS AL SEGUIR AL CODO
    this.agregarPuntosLinea(linea1, punto2!, codo);
  }

  actualizarLineCodoMap(params: lineaParams): void {
    const { lineaOriginal: linea, linea1, linea2, codo, punto1, punto2 } = params;

    this.eliminarLineaDelCanvas(linea!);
    this.lineCodoMaps = this.getLineCodoMap({
      linea1: linea1, linea2: linea2, codo: codo,
      punto1: punto1, punto2: punto2
    });

    this.codosData.forEach((codosData, codo) => {
      codosData.forEach(codoData => {
        const index = codoData.lineas.indexOf(linea!);
        if (index !== -1) {
          codoData.lineas[index] = linea1;
        }
      });
    });


  }

  private getLineCodoMap(params: lineaParams): LineCodoMap[] {
    // Accede a los parámetros mediante el objeto params
    const { linea1, linea2, codo, punto1, punto2 } = params;

    // Busca si ya existe un LineCodoMap con la línea actual
    const existingMapIndex = this.lineCodoMaps.findIndex(map => map.codo);

    if (existingMapIndex !== -1) {
      // Si existe, actualiza la información existente
      const existingMap = this.lineCodoMaps[existingMapIndex];
      existingMap.lines.push(linea1, linea2);
      existingMap.codo.push(codo);

      //existingMap.puntos.push(punto1!, punto2!);
    } else {
      // Si no existe, crea un nuevo LineCodoMap
      this.lineCodoMaps.push({
        lines: [linea1, linea2],
        codo: [codo],
        puntos: [punto1!, punto2!],
      });
    }

    const codosDataCodo = this.codosData.get(codo);

    if (codosDataCodo !== undefined) {
      codosDataCodo.push({
        lineas: [linea1, linea2],
        puntosControl: [punto1!, punto2!],
      });
    } else {
      this.codosData.set(codo, [{
        lineas: [linea1, linea2],
        puntosControl: [punto1!, punto2!],
      }]);
    }

    return this.lineCodoMaps
  }



  private crearNuevaLinea(points: number[], stroke: string, strokeWidth: number): fabric.Line {
    this.id++;
    return new fabric.Line(points, {
      stroke,
      strokeWidth,
      name: 'linea' + this.id.toString(),
    });
  }

  private actualizarLineasEnMovimiento(params: lineaParams) {
    const { codo } = params;

    //const lineasAsociadas = this.obtenerLineasAsociadas(codo, this.lineCodoMaps[0].lines );

    this.canvas!.off('object:moving');

    this.canvas!.on('object:moving', (event) => {
      const codoMap = this.lineCodoMaps.find(map => map.codo);

      if (codoMap && codoMap.puntos) {
        this.actualizarLineas(event);
        this.canvas!.renderAll();
      }
    });
  }

  devolverMapa() {
    console.log(this.codosData)
  }

  private actualizarLineas(event: fabric.IEvent): void {
    if (event.target?.name?.startsWith('codo')) this.movimientoCodo(event);
    else if (event.target!.name?.startsWith('punto')) this.movimientoPunto(event);
  }

  movimientoCodo(event: fabric.IEvent) {
    const codo = event.target as fabric.Circle;
    const codosDataCodo = this.codosData.get(codo);

    if (codosDataCodo) {
        codosDataCodo.forEach(codoData => {
            const [linea1, linea2] = codoData.lineas;
            const [punto1, punto2] = codoData.puntosControl;

            if (punto1 && punto2) {
                const startPoint = punto1.getCenterPoint();
                const endPoint = punto2.getCenterPoint();

                if (linea1) {
                    linea1.set({ x1: startPoint.x, y1: startPoint.y, x2: codo.left!, y2: codo.top! });
                }

                if (linea2) {
                    linea2.set({ x1: codo.left!, y1: codo.top!, x2: endPoint.x, y2: endPoint.y });
                }
            }
        });

        this.canvas!.renderAll();
    }
}

movimientoPunto(event: fabric.IEvent) {
    const tolerancia = 40;
    const lineasAsociadas = this.obtenerLineasAsociadas(event.target as fabric.Circle, this.lineaConexion);

    if (lineasAsociadas) {
        lineasAsociadas.forEach(linea => {
            const startPoint = this.distanciaEntrePuntos({ x: linea.x1!, y: linea.y1! }, { x: event.target!.left!, y: event.target!.top! }) < tolerancia;
            const endPoint = this.distanciaEntrePuntos({ x: linea.x2!, y: linea.y2! }, { x: event.target!.left!, y: event.target!.top! }) < tolerancia;

            if (startPoint) {
                linea.set({ x1: event.target!.left, y1: event.target!.top });
            } else if (endPoint) {
                linea.set({ x2: event.target!.left, y2: event.target!.top });
            }
        });

        this.canvas!.renderAll();
    }
}

  private obtenerLineasAsociadas(punto: fabric.Circle, lineas: LineHandler[]): fabric.Line[] {
    const lineasAsociadas: fabric.Line[] = [];

    lineas.forEach((lineHandler: LineHandler) => {
      if (lineHandler.startElement === punto || lineHandler.endElement === punto) {
        lineasAsociadas.push(lineHandler.line);
      }
    });

    return lineasAsociadas;
  }

  distanciaEntrePuntos(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  crearPuntoAzul(left: number, top: number) {
    this.id++;
    return new fabric.Circle({
      left,
      top,
      radius: 8,
      fill: 'blue',
      hasBorders: false,
      hasControls: false,
      name: 'punto' + this.id.toString()
    });
  }

  puntoAzulBuscarCercania(left: number, top: number): fabric.Circle | undefined {
    const punto = this.crearPuntoAzul(left, top);

    const cercaniaCodo = this.buscarCodoEnCercania(punto.left!, punto.top!);  //! DEVUELVE EL CODO ANTERIOR YA QUE EL SIGUIENTE TODAVÍA NO LO HEMOS CREADO
    //console.log(cercaniaCodo)
    // Si existe un codo en la cercanía, no se crea un nuevo punto de control
    if (cercaniaCodo) {
      return undefined;
    }
    return punto;
  }


  buscarCodoEnCercania(x: number, y: number): fabric.Circle | undefined {
    const tolerancia = 20; // Definir la distancia de tolerancia para considerar cercanía

    // Verificar la cercanía con los codos existentes
    for (const map of this.lineCodoMaps) {
      for (const codo of map.codo) {
        const codoX = codo.left!;
        const codoY = codo.top!;

        // Calcular la distancia entre el punto y el codo utilizando la función distanciaEntrePuntos
        const distancia = this.distanciaEntrePuntos({ x: codoX, y: codoY }, { x, y });
        //console.log(distancia)

        // Verificar si la distancia es menor o igual que la tolerancia
        if (distancia <= tolerancia) {
          return codo;
        }
      }
    }

    // Verificar la cercanía con los puntos azules existentes
    for (const map of this.lineCodoMaps) {
      for (const punto of map.puntos) {

        const puntoX = punto.left!;
        const puntoY = punto.top!;

        // Calcular la distancia entre el punto y el punto azul existente
        const distanciaPunto = this.distanciaEntrePuntos({ x: puntoX, y: puntoY }, { x, y });


        // Verificar si el punto está cerca de un punto azul existente
        if (distanciaPunto <= tolerancia) {
          return punto; // Ya existe un punto azul cercano, no se crea otro
        }
      }
    }

    return undefined;
  }

  //Visualizar por consola el almacen para ver su estado
  devolverAlmacen() {
    console.log(this.lineCodoMaps)
  }
}
