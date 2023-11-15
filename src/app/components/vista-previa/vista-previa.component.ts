import { Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { CodoService } from 'src/app/services/codo.service';
import { FiguraService } from 'src/app/services/figura.service';
import { SvgServiceService } from 'src/app/services/svg-service.service';
import { CanvasService } from '../../services/canvas.service';
import { MatMenuTrigger } from '@angular/material/menu';

export interface LineCodoMap {
  lines: fabric.Line[];     // Array que almacena las dos líneas
  codo: fabric.Circle[];      // Círculo que representa el codo
  puntos: fabric.Circle[];  // Array que almacena los dos puntos azules (extremos)
}

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.css'],

})
export class VistaPreviaComponent implements OnInit {

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  lineCodoMaps: LineCodoMap[] = [];
  movingBluePoint: boolean = false;

  canvas: fabric.Canvas | undefined;
  objetoSeleccionado: fabric.Object | undefined;

  figuras: SvgBase[] = [];
  height: number = 0;
  width: number = 0;
  editar: boolean = false;

  codoMode: boolean = true; // Modo de creación de codos
  inputColorLinea: boolean = true;

  constructor(private svg: SvgServiceService, private figuraService: FiguraService, private codoService: CodoService, private canvasService: CanvasService) { }


  ngOnInit(): void {
    this.canvas = this.canvasService.inicializarCanvas();
    // Obtiene las figuras del servicio
    this.dibujarFigurasEnCanvas();
  }

  esLinea(seleccionado: object) {
    if (seleccionado instanceof fabric.Line) {
      return false;
    }
    return true;
  }

  // Función para dibujar las figuras en el canvas
  private dibujarFigurasEnCanvas() {

    this.figuras = this.canvasService.getFigurasAlmacen();

    this.figuras.forEach((figura) => {
      let canvaObject: fabric.Object | undefined;

      if (figura.forma === 'cuadrado-rectangulo') {
        canvaObject = this.figuraService.crearRectangulo(figura);
      } else if (figura.forma === 'texto') {
        canvaObject = this.figuraService.crearTexto(figura);
      } else if (figura.forma === 'linea') {
        canvaObject = this.figuraService.crearLinea(figura);
      }

      if (canvaObject) {
        this.canvas!.add(canvaObject);
        canvaObject.on('mousedown', (event: any) => {
          this.objetoSeleccionado = canvaObject;
        });
      }

      this.canvas!.on('selection:cleared', () => {
        this.objetoSeleccionado = undefined; // Cuando se deselecciona, ObjetoSeleccionado es null
      });
    });
  }

  @HostListener('window:contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent) {
    // console.log(event)
    event.preventDefault();
    this.showContextMenu(this.objetoSeleccionado!.left!, this.objetoSeleccionado!.top!);
  }

  //Devolvemos el almacen por el console.log para ver si se actualizan bien los datos
  devolverAlmacen() {
    this.codoService.devolverAlmacen();
  }

  crearCodo(linea: fabric.Line, pointer: { x: number, y: number }) {
    this.codoService.crearCodo(linea, pointer);
  }

  seleccionarFiguraLista(figura: SvgBase) {
    const id = figura.id.toString(); // ID de la figura que deseas seleccionar

    // Buscar el objeto en el lienzo basado en el nombre (ID) personalizado
    const objetoCanvas = this.canvas?.getObjects().find(obj => obj.name === id);

    if (objetoCanvas) {
      //console.log(objetoCanvas)
      this.canvas!.setActiveObject(objetoCanvas);
      this.objetoSeleccionado = objetoCanvas;
    }
    this.canvas!.renderAll();
  }

  // Forzamos la actualización del color reduciendo el tamaño del objeto seleccionado
  actualizarColor(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.fill = event.target.value;
        this.objetoSeleccionado.scaleX! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje X para forzar una actualizacion del color
        this.objetoSeleccionado.scaleY! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje Y
        this.canvas!.renderAll();
        this.editar = false;
        //console.log(this.objetoSeleccionado!);
        //this.objetoModificado();
      }
    }
  }

  actualizarColorBorde(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.stroke = event.target.value;
        this.objetoSeleccionado.scaleX! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje X para forzar una actualizacion del color
        this.objetoSeleccionado.scaleY! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje Y
        this.canvas!.renderAll();
        this.editar = false;
        //console.log(this.objetoSeleccionado!);
        //this.objetoModificado();
      }
    }
  }

  actualizarFigura(event: any) {
    this.objetoSeleccionado = event.target;
  }

  exportToSVG() {
    // Crear un nuevo elemento canvas temporal para la exportación
    if (this.canvas) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width || 0;
      tempCanvas.height = this.canvas.height || 0;
      const tempContext = tempCanvas.getContext('2d');

      // Dibujar el contenido del lienzo de Fabric en el canvas temporal
      if (tempContext) {
        this.canvas.getObjects().forEach(obj => {
          obj.render(tempContext);
        });
      }
      // Convertir el canvas temporal a SVG
      const svgString = this.canvas.toSVG(tempCanvas);
      //console.log('canvas svg: ' + svgString)

      // Aquí svgString contiene el contenido SVG generado
      console.log(svgString);
    }
  }

  showContextMenu(x: number, y: number): void {
    this.contextMenu.menu!.focusFirstItem('mouse');

    // Abrir el menú contextual en las coordenadas x, y
    this.contextMenu.menuData = {
      x: `${x}px`,
      y: `${y}px`
    };

    this.contextMenu.openMenu();
  }

  traerAlFrente(): void {
    const clickedObject = this.canvas!.getActiveObject();
    if (clickedObject) {
      this.canvas!.bringToFront(clickedObject);
    }
    this.contextMenu.closeMenu();
  }

  llevarAlFondo(): void {
    const clickedObject = this.canvas!.getActiveObject();
    if (clickedObject) {
      this.canvas!.sendToBack(clickedObject);
    }
    this.contextMenu.closeMenu();
  }

}
