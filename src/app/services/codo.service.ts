import { Injectable, inject } from '@angular/core';
import { fabric } from 'fabric';
import { LineCodoMap } from '../components/vista-previa/vista-previa.component';
import { Circle, IEvent } from 'fabric/fabric-impl';


type Punto = {
  x: number;
  y: number;
  id: string;
};

type Linea = {
  puntoA: Punto;
  puntoB: Punto;
};

type Conexion = {
  puntos: { [id: string]: Punto };
  lineas: Linea[];
};

type Conexiones = {
  [key: string]: Conexion;
};

@Injectable({
  providedIn: 'root'
})
export class CodoService {

  private canvas: fabric.Canvas | undefined;
  private lineCodoMaps: LineCodoMap[] = [];
  movingBluePoint: boolean = false;
  id: number = 0;
  primerCodo: boolean = true;
  conexiones: Conexiones = {};

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

    // Obtener las coordenadas de los puntos de la línea
    const x1 = linea.get('x1') as number;
    const y1 = linea.get('y1') as number;
    const x2 = linea.get('x2') as number;
    const y2 = linea.get('y2') as number;

    const puntoA: Punto = { x: x1, y: y1, id: 'P' + this.id.toString() };
    const puntoB: Punto = { x: x2, y: y2, id: 'P' + this.id.toString() };


    this.eliminarConexion(puntoA, puntoB);
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
    this.id++;
    const puntoB: Punto = { x: x1!, y: y1!, id: 'Punto' + this.id.toString() };


    const punto1 = this.crearPuntoAzul(puntoA.x, puntoA.y);
    this.id++;
    const punto2 = this.crearPuntoAzul(puntoB.x, puntoB.y);
    //console.log(punto1, punto2)
    // Agregar la información de la conexión
    this.crearConexion(puntoA, puntoB);


    // Crea dos nuevas líneas
    const nuevaLinea1 = this.crearNuevaLinea([x1!, y1!, codoPosition.x, codoPosition.y], linea.stroke!, linea.strokeWidth!);
    const nuevaLinea2 = this.crearNuevaLinea([codoPosition.x, codoPosition.y, x2!, y2!], linea.stroke!, linea.strokeWidth!);



    this.eliminarLineaDelCanvas(linea);
    this.canvas!.add(codo, nuevaLinea1, nuevaLinea2);
    this.agregarLineasACodo(codo, nuevaLinea1, nuevaLinea2);


    // Busca si ya existe un LineCodoMap con la línea actual
    const existingMapIndex = this.lineCodoMaps.findIndex(map => map.codo);

    if (existingMapIndex !== -1) {
      // Si existe, actualiza la información existente
      const existingMap = this.lineCodoMaps[existingMapIndex];
      existingMap.lines = [nuevaLinea1, nuevaLinea2];
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

    //console.log(this.conexiones)

    this.actualizarLineasEnMovimiento(codo, nuevaLinea1, nuevaLinea2, originalLength1, originalLength2);

    // Agrega el punto azul al lienzo
    this.canvas!.add(this.crearPuntoAzul(puntoA.x, puntoA.y), this.crearPuntoAzul(puntoB.x, puntoB.y));

    // punto1.on('mousedown', (event) => {
    //   this.iniciarMovimientoPuntoAzul(event, punto1, nuevaLinea2, originalLength2);
    // });

    // punto2.on('mousedown', (event) => {
    //   this.iniciarMovimientoPuntoAzul(event, punto2, nuevaLinea1, originalLength1);
    // });

    console.log(this.lineCodoMaps)
    this.primerCodo = false;

    // Evento al hacer clic en el codo
    codo.on('mousedown', (event) => {
      if (event.target!.name === 'codo') {
        this.movingBluePoint = false;
      }
      this.canvas!.renderAll();
    });

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





  crearConexion(puntoA: Punto, puntoB: Punto) {
    const key = `${puntoA.id}-${puntoB.id}`;
    if (!this.conexiones[key]) {
      const nuevaConexion: Conexion = {
        lineas: [],
        puntos: {}
      };
      nuevaConexion.puntos[puntoA.id!] = puntoA;
      nuevaConexion.puntos[puntoB.id!] = puntoB;

      this.conexiones[key] = nuevaConexion;
    }

    const nuevaLinea: Linea = {
      puntoA: this.conexiones[key].puntos[puntoA.id!],
      puntoB: this.conexiones[key].puntos[puntoB.id!]
    };
    this.conexiones[key].lineas.push(nuevaLinea);
  }

  eliminarConexion(puntoA: Punto, puntoB: Punto) {
    const key = `${puntoA.id}-${puntoB.id}`;
    if (this.conexiones[key]) {
      delete this.conexiones[key];
    }
  }

  actualizarConexion(punto: Punto) {
    for (const key in this.conexiones) {
      const conexion = this.conexiones[key];
      if (conexion.puntos[punto.id!]) {
        conexion.puntos[punto.id!] = punto;
      }
    }
  }



  private actualizarLineasEnMovimiento(codo: fabric.Circle, linea1: fabric.Line, linea2: fabric.Line, originalLength1: number, originalLength2: number) {
    this.canvas!.off('object:moving');

    this.canvas!.on('object:moving', (event) => {
      const codoMap = this.lineCodoMaps.find(map => map.codo);

      if (codoMap && codoMap.puntos) {
        const [p1, p2] = codoMap.puntos;
        this.actualizarLineas(event, codo, linea1, originalLength1, this.lineCodoMaps);
        this.actualizarLineas(event, codo, linea2, originalLength2, this.lineCodoMaps);
        this.canvas!.renderAll();
      }
    });
  }


  actualizarLineas(event: fabric.IEvent, codo: fabric.Circle, linea: fabric.Line, originalLength: number, lineCodoMaps: LineCodoMap[]): void {
    const lineCodoMap = this.getLineCodoMapByLine(linea);
    const lineasAsociadas = this.conexionCodoLineaMap.get(codo);

    if (!lineCodoMap) {
      console.error('No se encontró el mapeo de la línea.');
      return;
    }

    if (lineasAsociadas) {
      let primeraLinea = true;

      for (const [, linea] of Object.entries(lineasAsociadas)) {
        const codoPosition = codo.getCenterPoint();
        const x1 = lineCodoMaps[0].puntos[0].left!
        const y1 = lineCodoMaps[0].puntos[0].top!
        const x2 = lineCodoMaps[0].puntos[1].left!
        const y2 = lineCodoMaps[0].puntos[1].top!
        //console.log(x1, y1, x2, y2)
        lineasAsociadas.linea1.set({ x1: codoPosition.x, y1: codoPosition.y, x2, y2 });
        lineasAsociadas.linea2.set({ x1, y1, x2: codoPosition.x, y2: codoPosition.y });

      }
    }
  }

  // getLineasAsociadasConexiones(key: string): { linea1: fabric.Line, linea2: fabric.Line } | undefined {
  //   const lineCodoMapsValues = Object.values(this.conexionCodoLineaMap);
  //   for (const lineasAsociadas of lineCodoMapsValues) {
  //     if (lineasAsociadas.linea1.name === key || lineasAsociadas.linea2.name === key) {
  //       return lineasAsociadas;
  //     }
  //   }
  //   return undefined;
  // }

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


  private esCodo(obj: Circle): boolean {
    return obj && obj.name === 'codo' + this.id.toString();
  }

  private esPuntoAzul(obj: Circle): boolean {
    return obj && (obj.name === 'extremoAzul1' || obj.name === 'extremoAzul2');
  }

  private actualizarCodoEnReferencePoints(codoMap: LineCodoMap) {
    const codoPosition = codoMap.codo[0].getCenterPoint();
    const [p1, p2] = codoMap.puntos;

    if (p1 && p2) {
      codoMap.puntos = [{ left: p1.left!, top: p1.top! } as Circle, { left: p2.left!, top: p2.top! } as Circle];

      const [rp1, rp2] = codoMap.puntos;

      // Actualiza las líneas con los nuevos puntos de referencia
      codoMap.lines.forEach(linea => {
        linea.set({ x1: rp1.left, y1: rp1.top, x2: rp2.left, y2: rp2.top });
      });
    }
  }


  // Función para crear un punto azul
  private crearPuntoAzul(left: number, top: number): fabric.Circle {
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

  private iniciarMovimientoPuntoAzul(event: any, puntoAzul: fabric.Circle, linea: fabric.Line, originalLength: number) {

    puntoAzul.on('moving', (event) => {
      this.moverPuntoAzul(event, puntoAzul, linea, originalLength);
    });

    puntoAzul.on('mouseup', (event) => {
      this.movingBluePoint = false;
    });
  }

  // Función para mover el punto azul y actualizar la línea
  private moverPuntoAzul(event: any, puntoAzul: fabric.Circle, linea: fabric.Line, originalLength2: number) {
    //console.log('Moviendo Punto Azul');
    const puntoAzulPosition = puntoAzul.getCenterPoint();

    // Calcula la nueva longitud
    const nuevaLongitud = Math.abs(originalLength2);

    // Ajusta la escala de la línea
    linea.scaleX = nuevaLongitud / originalLength2;
    linea.scaleY = nuevaLongitud / originalLength2;

    // Mueve el extremo opuesto al codo hacia la posición del punto azul
    if (puntoAzul.name === 'extremoAzul1') linea.set({ x2: puntoAzulPosition.x, y2: puntoAzulPosition.y });
    else if (puntoAzul.name === 'extremoAzul2') linea.set({ x1: puntoAzulPosition.x, y1: puntoAzulPosition.y });

    // Actualiza las líneas en el lienzo
    this.canvas!.renderAll();
  }

}
