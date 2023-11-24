import { Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { CodoService } from 'src/app/services/codo.service';
import { FiguraService } from 'src/app/services/figura.service';
import { CanvasService } from '../../services/canvas.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

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

  @ViewChild('nuevoTexto') nuevoTextoRef!: ElementRef;

  interval: any;

  private datosSubscription: Subscription | undefined;

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

  constructor(private dataService: DataService, private figuraService: FiguraService, private codoService: CodoService, private canvasService: CanvasService) { }

  ngOnInit(): void {
    this.actualizarDatos();
    this.cargar();
  }

  cargar() {
    this.canvas = this.canvasService.inicializarCanvas();
    this.canvas.renderAll();
    this.filtrarFigurasAñadirCanvas();
  }


  // Función para dibujar las figuras en el canvas
  private async filtrarFigurasAñadirCanvas() {
    await this.actualizarDatos();
    this.canvas!.clear()
    this.figurasAlmacen(this.figuras);
    //console.log(this.figuras)
  }

  async actualizarDatos(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const data = await this.dataService.leerLayout();
        this.figuras = data;
        resolve();
      }, 500);
    });
  }

  figurasAlmacen(figuras: SvgBase[]) {
    figuras.forEach((figura) => {
      const objetoCanva = this.crearObjetoFabric(figura);
      if (objetoCanva) {
        this.agregarObjetoAlCanvas(objetoCanva);
        this.vincularEventoMouseDown(objetoCanva);
      }
    });

    this.registrarEventoModificacion();
    this.registrarSuscripcionDatos();
    this.registrarEventoLimpiarSeleccion();
  }

  crearObjetoFabric(figura: SvgBase): fabric.Object | undefined {
    let objetoCanva: fabric.Object | undefined;

    switch (figura.forma) {
      case 'rect':
        objetoCanva = this.figuraService.crearRectangulo(figura);
        break;
      case 'text':
        objetoCanva = this.figuraService.crearTexto(figura);
        break;
      case 'line':
        objetoCanva = this.figuraService.crearLinea(figura);
        break;
      default:
        break;
    }

    return objetoCanva;
  }

  agregarObjetoAlCanvas(objetoCanva: fabric.Object) {
    this.canvas!.add(objetoCanva);
  }

  vincularEventoMouseDown(objetoCanva: fabric.Object) {
    objetoCanva.on('mousedown', (event: any) => {
      this.objetoSeleccionado = event.target;
    });
  }

  registrarEventoModificacion() {
    this.canvas!.on('object:modified', (event: any) => {
      const modifiedObject = event.target; // Objeto modificado en el canvas
      //console.log(event.target)
      if(modifiedObject instanceof fabric.Line) {
        console.log(modifiedObject.x2, modifiedObject.y2)
      }

      //Coordenadas pero de la caja no de la linea
      const coords = modifiedObject.lineCoords;

      // Obtener los datos actualizados del objeto
      const updatedData: SvgBase[] = [{
        id: modifiedObject.name,
        coordX: modifiedObject.left,
        coordY: modifiedObject.top,
        height: modifiedObject.height,
        width: modifiedObject.width,
        text: modifiedObject.text,

        x1: coords.tl.x,    //Le asignamos las coordenadas de la caja porque en el evento no obtenemos las
        y1: coords.tl.y,    //coordenadas de la linea en si al modificarse
        x2: coords.br.x,
        y2: coords.br.y,

        forma: modifiedObject.type,
      } as SvgBase];
      //console.log(updatedData)
      this.forzarActualizacion(modifiedObject)
      // Notificar al servicio de eventos sobre la actualización de datos
      this.dataService.actualizacionDatosSubject.next(updatedData)
    });
  }

  registrarSuscripcionDatos() {
    this.datosSubscription = this.dataService.actualizacionDatosSubject.subscribe(
      (datosActualizados: SvgBase[]) => {
        datosActualizados.forEach((updatedItem: SvgBase) => {
          const index = this.figuras.findIndex(item => item.id == updatedItem.id);
          if (index !== -1) {
            this.figuras[index] = updatedItem;
          } else {
            this.figuras.push(updatedItem);
          }
        });
      }
    );
  }

  registrarEventoLimpiarSeleccion() {
    this.canvas!.on('selection:cleared', () => {
      this.objetoSeleccionado = undefined;
    });
  }

  forzarActualizacion(objetoModificado: fabric.Text) {
    objetoModificado.scaleX! *= 0.9999999;
    objetoModificado.scaleY! *= 0.9999999;
    this.canvas!.renderAll();
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
    this.codoService.devolverAlmacen();
    this.dataService.devolverAlmacen();
  }

  devolverAlmacenTiempoReal() {
    this.dataService.leerTiempoReal();  //!TO DO: función en el servicio para dejar de modificar info
    this.interval = setInterval(() => {
      this.filtrarFigurasAñadirCanvas();  //Entramos al filtro de las figuras para tener el canvas
      this.canvas!.renderAll;             //actualizado con los valores que modificamos arriba
    }, 4000);
  }

  limpiaInterval() {
    if(this.interval) clearInterval(this.interval);
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
        this.objetoSeleccionado.fill = event.target.value;
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
    this.objetoSeleccionado = event.target.value;
  }

  persistirSVG() {
    console.log(this.figuras);
    this.dataService.guardarSvg(this.figuras);

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
    return seleccionado instanceof fabric.Line;
  }

  esTexto(seleccionado: object): boolean {
    return seleccionado instanceof fabric.Text;
  }

  editarTexto(objetoTexto: any) {
    if (objetoTexto instanceof fabric.Text) {
      // Mostrar el input
      const inputElement = this.nuevoTextoRef.nativeElement as HTMLInputElement;
      if (inputElement) {
        inputElement.style.display = 'inline-block';
        inputElement.value = objetoTexto.text!;
        inputElement.focus();
      }
    }
  }

  confirmarEdicion(objetoTexto: any, nuevoTexto: string) {
    if (objetoTexto instanceof fabric.Text) {
      if (nuevoTexto.trim() !== '') {
        objetoTexto.set({ text: nuevoTexto });
        this.forzarActualizacion(objetoTexto);
        this.canvas?.renderAll();
      }
    }

    // Ocultar el input después de editar
    const inputElement = this.nuevoTextoRef.nativeElement as HTMLInputElement;
    if (inputElement) {
      inputElement.style.display = 'none';
    }
  }
}
