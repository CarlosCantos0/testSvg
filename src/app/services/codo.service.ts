import { Injectable, inject } from '@angular/core';
import { fabric } from 'fabric';
import { LineCodoMap } from '../components/vista-previa/vista-previa.component';

@Injectable({
  providedIn: 'root'
})
export class CodoService {
  private conexiones = [
    {
      conexion: {
        codos: [
          {
            id: 0,
            x: 5,
            y: 7
          },
          {
            id: 1,
            x: 9,
            y: 6
          },
          {
            id: 2,
            x: 7,
            y: 4
          }
        ],
        lineas: [
          {
            id: 0,
            codoA: 0,
            codoB: 2
          },
          {
            id: 1,
            codoA: 2,
            codoB: 1
          }
        ]
      }
    }
  ]

  private canvas: fabric.Canvas | undefined;
  private lineCodoArray: LineCodoMap[] = [];
  movingBluePoint: boolean = false;

  private lineCodoMaps: Map<fabric.Line, LineCodoMap> = new Map();

  constructor() {

  }

  inicializar(canvas: fabric.Canvas) {
    this.canvas = canvas;
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
      name: 'codo',
    });
    console.log(codo)

    const codoPosition = codo.getCenterPoint();

    // Calcula la longitud original de las líneas
    const originalLength1 = this.distanciaEntrePuntos({ x: x1!, y: y1! }, codoPosition);
    const originalLength2 = this.distanciaEntrePuntos(codoPosition, { x: x2!, y: y2! });

    // Crea dos nuevas líneas
    const nuevaLinea1 = this.crearNuevaLinea([x1!, y1!, codoPosition.x, codoPosition.y], linea.stroke!, linea.strokeWidth!);
    const nuevaLinea2 = this.crearNuevaLinea([codoPosition.x, codoPosition.y, x2!, y2!], linea.stroke!, linea.strokeWidth!);

    // Escala las nuevas líneas
    const scaleFactorA = originalLength1 / this.distanciaEntrePuntos({ x: x1!, y: y1! }, { x: x2!, y: y2! });
    const scaleFactorB = originalLength2 / this.distanciaEntrePuntos({ x: x1!, y: y1! }, { x: x2!, y: y2! });

    // Escala las nuevas líneas
    nuevaLinea1.scaleX = scaleFactorA;
    nuevaLinea2.scaleX = scaleFactorB;

    this.canvas!.remove(linea);



    // Buscar extremos de líneas con coordenadas similares
    //const extremosSimilares = this.buscarExtremosSimilares({ x: x1!, y: y1! }, { x: x2!, y: y2! });
    //console.log('Extremos Similares:', extremosSimilares);
    // Verificar si hay otros codos cercanos a los extremos similares

    this.canvas!.add(codo, nuevaLinea1, nuevaLinea2);
    //this.eliminarCodoAsociado(linea);

    // Crea un puntos azules en los extremos opuestos de las líneas al codo
    const extremoAzul1 = this.crearPuntoAzul(x2!, y2!, 'extremoAzul1');
    const extremoAzul2 = this.crearPuntoAzul(x1!, y1!, 'extremoAzul2');
    const lineToPointAzulMap = new Map<fabric.Line, fabric.Circle>();

    // Elimina las líneas antiguas del arreglo lineCodoMaps
    this.lineCodoArray = this.lineCodoArray.filter(map => !map.linesConnected.includes(linea));

    // Asociar el codo y las líneas con el LineCodoMap
    const existingMap = this.lineCodoArray.find(map => map.line.x1 === nuevaLinea1.x1 || map.line.x1 === nuevaLinea2.x1 || map.line.x1 === linea.x1);



    if (existingMap) {
      console.log(existingMap)
      // Si ya existe, agrega el nuevo codo a la lista de codos existente
      existingMap.codos.push(codo);
    } else {
      console.log(existingMap)

      // Si no existe, crea un nuevo LineCodoMap
      this.lineCodoArray.push({
        line: linea,
        codos: [codo], // Coloca el codo en un array para futuras expansiones
        linesConnected: [nuevaLinea1, nuevaLinea2],
        pointAzul1: extremoAzul1,
        pointAzul2: extremoAzul2,
      });
    }


    //this.agregarNuevoCodo(linea, codo, nuevaLinea1, nuevaLinea2, extremoAzul1, extremoAzul2)

    this.actualizarLineasEnMovimiento(codo, nuevaLinea1, nuevaLinea2, originalLength1, originalLength2);

    // Llamar a la función para gestionar el punto azul
    this.gestionarPuntoAzulParaLinea(lineToPointAzulMap, nuevaLinea1, extremoAzul1);
    this.gestionarPuntoAzulParaLinea(lineToPointAzulMap, nuevaLinea2, extremoAzul2);

    // Agrega el punto azul al lienzo
    this.canvas!.add(extremoAzul1, extremoAzul2);

    extremoAzul1.on('mousedown', (event) => {
      this.iniciarMovimientoPuntoAzul(event, extremoAzul1, nuevaLinea2, originalLength2);
    });

    extremoAzul2.on('mousedown', (event) => {
      this.iniciarMovimientoPuntoAzul(event, extremoAzul2, nuevaLinea1, originalLength1);
    });

    //Verificar si ya existe un codo en la línea y eliminarlo si es necesario
    this.eliminarPuntoAzul(linea);

    console.log(this.lineCodoArray)

    //this.conectarLineasCercanas(codo);

    // Evento al hacer clic en el codo
    codo.on('mousedown', (event) => {
      if (event.target!.name === 'codo') {
        this.movingBluePoint = false;
      }
      this.canvas!.renderAll();
    });

  }

  private eliminarPuntoAzul(linea: fabric.Line) {
    const codos = this.canvas!.getObjects().filter(obj => obj.name === 'codo');

    const puntosAzules = this.canvas!.getObjects().filter(obj =>
      obj.name === 'extremoAzul1' || obj.name === 'extremoAzul2'
    );

    puntosAzules.forEach(puntoAzul => {
      const azulAsociadoALinea = this.lineCodoArray.some(map =>
        map.pointAzul1 === puntoAzul || map.pointAzul2 === puntoAzul
      );

      const azulAsociadoACodo = codos.some(codo =>
        this.distanciaEntrePuntos(puntoAzul.getCenterPoint(), codo.getCenterPoint()) < 15
      );

      puntosAzules.forEach(puntoAzul => {
        codos.forEach(codo => {
          const distancia = this.distanciaEntrePuntos(puntoAzul.getCenterPoint(), codo.getCenterPoint());
          if (distancia < 15) {
            this.canvas!.remove(puntoAzul);
          }
        });
      });

      if (!azulAsociadoALinea && !azulAsociadoACodo) {
        const similarPoint = puntosAzules.find(p =>
          p !== puntoAzul &&
          this.distanciaEntrePuntos(p.getCenterPoint(), puntoAzul.getCenterPoint()) < 15
        );

        if (similarPoint) {
          this.canvas!.remove(puntoAzul);
        }
      }
    });
  }

  distanciaEntrePuntos(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  gestionarPuntoAzulParaLinea(
    lineToPointAzulMap: Map<fabric.Line, fabric.Circle>,
    nuevaLinea: fabric.Line,
    extremoAzul: fabric.Circle,
  ) {
    // Asociar la nueva línea con el nuevo punto azul
    lineToPointAzulMap.set(nuevaLinea, extremoAzul);

    // Agregar el nuevo punto azul al lienzo
    this.canvas!.add(extremoAzul);
  }

  private crearNuevaLinea(points: number[], stroke: string, strokeWidth: number): fabric.Line {
    return new fabric.Line(points, {
      stroke,
      strokeWidth,
    });
  }

  private actualizarLineasEnMovimiento(codo: fabric.Circle, linea1: fabric.Line, linea2: fabric.Line, originalLength1: number, originalLength2: number) {
    this.canvas!.on('object:moving', (event) => {
      const codoPosition = codo.getCenterPoint();
      const { x1, y1, x2, y2 } = linea1;
      const newLength1 = Math.abs(originalLength1);
      const newLength2 = Math.abs(originalLength2);
      linea1.set({ x2: codoPosition.x, y2: codoPosition.y });
      linea2.set({ x1: codoPosition.x, y1: codoPosition.y });

      const scaleFactor1 = newLength1 / originalLength1;
      const scaleFactor2 = newLength2 / originalLength2;
      linea1.scaleX = scaleFactor1;
      linea1.scaleY = scaleFactor1;
      linea2.scaleX = scaleFactor2;
      linea2.scaleY = scaleFactor2;

      // Aquí, actualizamos las conexiones del codo antiguo
      //this.actualizarCodosAsociados(linea1, linea2);

      this.canvas!.renderAll();
    });
  }





  // Función para crear un punto azul
  private crearPuntoAzul(left: number, top: number, name: string): fabric.Circle {
    return new fabric.Circle({
      left,
      top,
      radius: 8,
      fill: 'blue',
      hasBorders: false,
      hasControls: false,
      name,
    });
  }

  private iniciarMovimientoPuntoAzul(event: any, puntoAzul: fabric.Circle, linea: fabric.Line, originalLength: number) {

    puntoAzul.on('moving', (event) => {
      this.moverPuntoAzul(event, puntoAzul, linea, originalLength);
      console.log('movimiento puntoazul')
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
    //this.actualizarCodosAsociados(linea);

    // Actualiza las líneas en el lienzo
    this.canvas!.renderAll();
  }



}
