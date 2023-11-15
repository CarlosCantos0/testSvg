import { Injectable, inject } from '@angular/core';
import { fabric } from 'fabric';
import { LineCodoMap } from '../components/vista-previa/vista-previa.component';
import { Circle, IEvent } from 'fabric/fabric-impl';


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
  movingBluePoint: boolean = false;
  id: number = 0;
  //conexiones: Conexiones = {};

  // Estructura de mapeo de codos y líneas
  private conexionCodoLineaMap: Map<fabric.Circle, { linea1: fabric.Line, linea2: fabric.Line }> = new Map();

  constructor() { }

  inicializar(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  eliminarLineaDelCanvas(linea: fabric.Line): void {
    this.canvas!.remove(linea);

    // Eliminar la referencia de la línea en lineCodoMaps
    const indiceMapa = this.lineCodoMaps.findIndex(map => map.lines.includes(linea));
    if (indiceMapa !== -1) {
      const map = this.lineCodoMaps[indiceMapa];
      map.lines = map.lines.filter(l => l !== linea);
      console.log(map.lines)
    }

    // Eliminar la referencia de la línea en el mapa conexionCodoLineaMap
    for (const [codo, lineas] of this.conexionCodoLineaMap) {
      if (lineas.linea1 === linea || lineas.linea2 === linea) {
        this.conexionCodoLineaMap.delete(codo);
        break;
      }
    }
  }

  // Agregar las líneas asociadas a un codo al mapa
  agregarLineasACodo(codo: fabric.Circle, linea1: fabric.Line, linea2: fabric.Line): void {
    this.conexionCodoLineaMap.set(codo, { linea1, linea2 });
  }

  crearCodo(linea: fabric.Line, pointer: { x: number, y: number }) {
    const { x1, y1, x2, y2 } = linea;
    const codo = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 10,
      fill: 'red',
      hasBorders: false,
      hasControls: false,
      name: 'codo' + this.id.toString(),
    });

    const codoPosition = codo.getCenterPoint();

    // Calcula la longitud original de las líneas
    const originalLength1 = this.distanciaEntrePuntos({ x: x1!, y: y1! }, codoPosition);
    const originalLength2 = this.distanciaEntrePuntos(codoPosition, { x: x2!, y: y2! });

    // Crea un puntos azules en los extremos opuestos de las líneas al codo
    const puntoA: Punto = { x: x2!, y: y2!, id: 'Punto' + this.id.toString() };
    const puntoB: Punto = { x: x1!, y: y1!, id: 'Punto' + this.id.toString() };

    //Creación de puntos de control
    const punto1 = this.crearPuntoAzul(puntoA.x, puntoA.y);
    const punto2 = this.crearPuntoAzul(puntoB.x, puntoB.y);


    // Crea dos nuevas líneas
    const nuevaLinea1 = this.crearNuevaLinea([x1!, y1!, codoPosition.x, codoPosition.y], linea.stroke!, linea.strokeWidth!);
    const nuevaLinea2 = this.crearNuevaLinea([codoPosition.x, codoPosition.y, x2!, y2!], linea.stroke!, linea.strokeWidth!);

    this.eliminarLineaDelCanvas(linea);

    // Después, eliminas las líneas del array `existingMap.lines`
    this.canvas!.add(codo, nuevaLinea1, nuevaLinea2);
    this.agregarLineasACodo(codo, nuevaLinea1, nuevaLinea2);


    // Busca si ya existe un LineCodoMap con la línea actual
    const existingMapIndex = this.lineCodoMaps.findIndex(map => map.codo);

    if (existingMapIndex !== -1) {
      // Si existe, actualiza la información existente
      const existingMap = this.lineCodoMaps[existingMapIndex];
      existingMap.lines.push(nuevaLinea1, nuevaLinea2);
      existingMap.codo.push(codo);
      existingMap.puntos.push(punto1, punto2);
    } else {
      // Si no existe, crea un nuevo LineCodoMap
      this.lineCodoMaps.push({
        lines: [nuevaLinea1, nuevaLinea2],
        codo: [codo],
        puntos: [punto1, punto2],
      });
    }

    //Eliminamos la linea del almacen
    this.lineCodoMaps[0].lines = this.lineCodoMaps[0].lines.filter(line => line !== linea);

    this.actualizarLineasEnMovimiento(codo, nuevaLinea1, nuevaLinea2, originalLength1, originalLength2);

    // Agrega el punto azul al lienzo
    this.canvas!.add(punto1, punto2);
    console.log(punto1, punto2)
    console.log(this.lineCodoMaps)

    // Evento al hacer clic en el codo
    codo.on('mousedown', (event) => {
      if (event.target!.name === 'codo') {
        this.movingBluePoint = false;
      }
      this.canvas!.renderAll();
    });

  }

  devolverAlmacen() {
    console.log(this.lineCodoMaps)
  }

  distanciaEntrePuntos(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private crearNuevaLinea(points: number[], stroke: string, strokeWidth: number): fabric.Line {
    return new fabric.Line(points, {
      stroke,
      strokeWidth,
      name: `linea${this.id.toString()}`,
    });
  }

  private actualizarLineasEnMovimiento(codo: fabric.Circle, linea1: fabric.Line, linea2: fabric.Line, originalLength1: number, originalLength2: number) {
    this.canvas!.off('object:moving');

    this.canvas!.on('object:moving', (event) => {
      //console.log(event)
      const codoMap = this.lineCodoMaps.find(map => map.codo);

      if (codoMap && codoMap.puntos) {
        this.actualizarLineas(event, codo, linea1, this.lineCodoMaps);
        this.actualizarLineas(event, codo, linea2, this.lineCodoMaps);
        this.canvas!.renderAll();
      }
    });
  }

  actualizarLineas(event: fabric.IEvent, codo: fabric.Circle, linea: fabric.Line, lineCodoMaps: LineCodoMap[]): void {
    const lineasAsociadas = this.conexionCodoLineaMap.get(codo);
    let [x1, y1, x2, y2] = [lineCodoMaps[0].puntos[0].left!, lineCodoMaps[0].puntos[0].top!, lineCodoMaps[0].puntos[1].left!, lineCodoMaps[0].puntos[1].top!];

    if (lineasAsociadas) {
      let primeraLinea = true;

      const linea1 = lineasAsociadas.linea1;
      const linea2 = lineasAsociadas.linea2;
      //console.log(event.target?.name)

      for (const [, linea] of Object.entries(lineasAsociadas)) {
        const codoPosition = codo.getCenterPoint();
        if (event.target?.name === 'punto1') {
          x1 = event.target!.left!
          lineCodoMaps[0].puntos[0].left! = x1;
          y1 = event.target!.top!
          lineCodoMaps[0].puntos[0].top! = y1;
        } else if (event.target?.name === 'punto2') {
          x2 = event.target!.left!
          lineCodoMaps[0].puntos[1].left! = x2;
          y2 = event.target!.top!
          lineCodoMaps[0].puntos[1].top! = y2;
        }

        if (event.target?.name === 'punto3') {
          x1 = event.target!.left!
          lineCodoMaps[0].puntos[2].left! = x1;
          y1 = event.target!.top!
          lineCodoMaps[0].puntos[2].top! = y1;
        } else if (event.target?.name === 'punto4') {
          x2 = event.target!.left!
          lineCodoMaps[0].puntos[3].left! = x2;
          y2 = event.target!.top!
          lineCodoMaps[0].puntos[3].top! = y2;
        }

        const lineaDelPunto = this.getLineConnectedToPoint(lineCodoMaps[0], event.target as Circle)


        //console.log(x1, y1, x2, y2)
        linea1.set({ x1: codoPosition.x, y1: codoPosition.y, x2: x2, y2: y2 });
        linea2.set({ x1: x1, y1: y1, x2: codoPosition.x, y2: codoPosition.y });

      }
    }
  }

  // Función para encontrar el LineCodoMap dado una línea
  getLineCodoMapByLine(line: fabric.Line): LineCodoMap | undefined {
    return this.lineCodoMaps.find((map) => map.lines.includes(line));
  }

  ajustarLineas(codo: fabric.Circle, puntosControl: fabric.Circle[], lines: fabric.Line[]): void {
    puntosControl.forEach((punto, index) => {
      const linea = lines[index];
      linea.set({
        x1: codo.left,
        y1: codo.top,
        x2: punto.left,
        y2: punto.top
      });
    });
  }

  // Función para obtener la línea conectada a un punto
  getLineConnectedToPoint(lineCodoMap: LineCodoMap, point: fabric.Circle): fabric.Line | undefined {
    const tolerancia = 5; // Tolerancia para considerar que el punto está cerca de la línea

    for (const line of lineCodoMap.lines) {
      // Verificar si el punto está cerca de los extremos de la línea con una tolerancia
      if (
        (Math.abs(line.x1! - point.left!) <= tolerancia && Math.abs(line.y1! - point.top!) <= tolerancia) ||
        (Math.abs(line.x2! - point.left!) <= tolerancia && Math.abs(line.y2! - point.top!) <= tolerancia)
      ) {
        return line;
      }
    }

    return undefined;
  }

  // Función para crear un punto azul
  private crearPuntoAzul(left: number, top: number): fabric.Circle {
    this.id++;
    return new fabric.Circle({
      left,
      top,
      radius: 8,
      fill: 'blue',
      hasBorders: false,
      hasControls: false,
      name: `punto${this.id.toString()}`,
    });
  }
}
