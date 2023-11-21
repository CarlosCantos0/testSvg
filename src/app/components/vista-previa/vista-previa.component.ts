import { Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { CodoService } from 'src/app/services/codo.service';
import { FiguraService } from 'src/app/services/figura.service';
import { SvgService } from 'src/app/services/svg-service.service';
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

  constructor(private svg: SvgService, private figuraService: FiguraService, private codoService: CodoService, private canvasService: CanvasService) { }


  ngOnInit(): void {
    this.canvas = this.canvasService.inicializarCanvas();
    // Obtiene las figuras del servicio
    this.filtrarFigurasAñadirCanvas();
  }


  // Función para dibujar las figuras en el canvas
  private filtrarFigurasAñadirCanvas() {

    this.figuras = this.canvasService.getFigurasAlmacen();

    this.figuras.forEach((figura) => {
      let objetoCanva: fabric.Object | undefined;

      if (figura.forma === 'cuadrado-rectangulo') {
        objetoCanva = this.figuraService.crearRectangulo(figura);
      } else if (figura.forma === 'texto') {
        objetoCanva = this.figuraService.crearTexto(figura);
      } else if (figura.forma === 'linea') {
        objetoCanva = this.figuraService.crearLinea(figura);
      }

      if (objetoCanva) {
        this.canvas!.add(objetoCanva);
        objetoCanva.on('mousedown', (event: any) => {
          this.objetoSeleccionado = objetoCanva;
        });
      }

      this.canvas!.on('selection:cleared', () => {
        this.objetoSeleccionado = undefined; // Cuando se deselecciona, ObjetoSeleccionado es null
      });
    });
  }

  //Context menu para llevar al frente o al fondo a la FiguraSVG
  @HostListener('window:contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent) {
    // console.log(event)
    event.preventDefault();
    this.showContextMenu(this.objetoSeleccionado!.left!, this.objetoSeleccionado!.top!);
  }

  //Devolvemos el almacen por el console.log para ver si se actualizan bien los datos
  devolverAlmacen() {
    this.codoService.devolverMapa();
  }

  //Busca por ID el objeto que seleccionamos de la lista para mostrarlo activo
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

  actualizarColor(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.fill = event.target;
        this.forzarActualizacionColor(this.objetoSeleccionado);
      }
    }
  }

  actualizarColorBorde(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.stroke = event.target.value;
        this.forzarActualizacionColor(this.objetoSeleccionado);
      }
    }
  }

  // Forzamos la actualización del color reduciendo el tamaño del objeto a modificar
  forzarActualizacionColor(objetoSeleccionado: any) {
    objetoSeleccionado.scaleX! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje X para forzar una actualizacion del color
    objetoSeleccionado.scaleY! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje Y
    this.canvas!.renderAll();
    this.editar = false;
  }

  actualizarFigura(event: any) {
    this.objetoSeleccionado = event.target;
  }

  exportarSVG() {
    // Crear un nuevo elemento canvas temporal para la exportación
    if (this.canvas) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width!;
      tempCanvas.height = this.canvas.height!;
      const tempContext = tempCanvas.getContext('2d');

      // Dibujar el contenido del lienzo de Fabric en el canvas temporal
      if (tempContext) {
        this.canvas.getObjects().forEach(obj => {
          obj.render(tempContext);
        });
      }
      // Convertir el canvas temporal a SVG
      const svgString = this.canvas.toSVG(tempCanvas);
      console.log(svgString);
    }
  }

  // Click derecho en una figura seleccionada para llevarla al frente o fondo
  showContextMenu(x: number, y: number): void {
    this.contextMenu.menu!.focusFirstItem('mouse');

    // Abrir el menú contextual en las coordenadas x, y
    this.contextMenu.menuData = {
      x: `${x}px`,
      y: `${y}px`
    };

    this.contextMenu.openMenu();
  }

  //Modifica el indexZ para llevar al frente a la figura seleccionada
  traerAlFrente(): void {
    const clickedObject = this.canvas!.getActiveObject();
    if (clickedObject) {
      this.canvas!.bringToFront(clickedObject);
    }
    this.contextMenu.closeMenu();
  }

  //Modifica el indexZ para llevar al fondo a la figura seleccionada
  llevarAlFondo(): void {
    const clickedObject = this.canvas!.getActiveObject();
    if (clickedObject) {
      this.canvas!.sendToBack(clickedObject);
    }
    this.contextMenu.closeMenu();
  }

  //Retorna un boolean dependiendo si es line o no
  esLinea(seleccionado: object) {
    if (seleccionado instanceof fabric.Line) {
      return false;
    }
    return true;
  }
}
