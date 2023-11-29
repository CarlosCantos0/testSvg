import { Component, ElementRef, EventEmitter, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { SvgBase } from 'src/app/interfaces/svgBase.interface';
import { CodoService } from 'src/app/services/codo.service';
import { FiguraService } from 'src/app/services/figura.service';
import { CanvasService } from '../../services/canvas.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { IpersistenciaSvg } from 'src/app/interfaces/ipersistencia-svg';
import { ProviderService } from '../../services/provider.service';
import { Group } from 'fabric/fabric-impl';
import { estadoBorde } from '../../interfaces/svgBase.interface';

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
export class VistaPreviaComponent {

  tipoBorde: string = 'neutral'

  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild('nuevoTexto') nuevoTextoRef!: ElementRef;

  private usedIds: Set<number> = new Set<number>();

  interval: any;

  private datosSubscription: Subscription | undefined;

  canvas: fabric.Canvas | undefined;
  objetoSeleccionado: fabric.Object | undefined;

  figuras: SvgBase[] = [];    //lista con los distintos elementos
  height: number = 0;
  width: number = 0;
  editar: boolean = false;

  dataService!: IpersistenciaSvg

  constructor(
    private providerService: ProviderService,
    public figuraService: FiguraService,
    private codoService: CodoService,
    private canvasService: CanvasService
  ) {
    providerService.instanciarServicioPersistencia()
      .then(servicio => {
        this.dataService = servicio
        this.actualizarDatos();
        this.cargar();
      })
  }


  cargar() {
    this.canvas = this.canvasService.inicializarCanvas();
    this.canvas.renderAll();
    this.filtrarFigurasAñadirCanvas();
    //console.log(this.figuras)

  }

  // Método para dibujar las figuras en el canvas
  private async filtrarFigurasAñadirCanvas() {
    await this.actualizarDatos();
    this.canvas!.clear()
    this.figurasAlmacen(this.figuras);
    //this.asignarEstadoInicialALineas();
    console.log(this.figuras)
  }

  // Método para actualizar en this.figuras la información de los distintos elementos
  async actualizarDatos(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const data = await this.dataService.leerLayout();
        this.figuras = data;
        resolve();
      }, 500);
    });
  }

  //Recorremos la lista de figuras y las añadimos al canvas y lo vinculamos con sus actualizaciones
  figurasAlmacen(figuras: SvgBase[]) {
    figuras.forEach((figura) => {
      const objetoCanva = this.crearObjetoFabric(figura);
      if (objetoCanva) {
        this.agregarObjetoAlCanvas(objetoCanva);    //Agregamos los objetos al Canvas
        this.vincularEventoMouseDown(objetoCanva);  //Vinculamos estos objetos con el evento de pulsar para obtener el objetoSeleccionado
      }
    });

    this.registrarEventoModificacion();   //Con el evento de fabric.js tomamos los objetos que se modifican para almacenarlos
    //this.registrarSuscripcionDatos();
    this.limpiarSeleccion();              //Si pulsamos una zona vacía del canvas quitamos cualquier registro de seleccion
  }

  //Dependiendo de la .forma de nuestro elemento llamamos a un método u otro
  crearObjetoFabric(figura: SvgBase): fabric.Object | undefined {
    let objetoCanva: fabric.Object | undefined;

    switch (figura.forma) {
      case 'rect':
        objetoCanva = this.figuraService.crearRectanguloAlmacen(figura);
        break;
      case 'text':
        objetoCanva = this.figuraService.crearTextoAlmacen(figura);
        break;
      case 'line':
        objetoCanva = this.figuraService.crearLineaAlmacen(figura);
        break;
      default:
        break;
    }
    this.canvas!.renderAll();
    return objetoCanva;
  }

  //Este método llama a crear figuras dependiendo de lo que elijamos en el HTML
  crearNuevaFigura(crearFunc: () => fabric.Object) {
    let objetoCanva: fabric.Object | undefined;
    objetoCanva = crearFunc();
    if (objetoCanva) {
      this.agregarObjetoAlCanvas(objetoCanva);
      this.vincularEventoMouseDown(objetoCanva);
    }
  }

  //Llamada para hacer un cuadrado nuevo
  figuraCuadradoNuevo() {
    this.crearNuevaFigura(() => this.figuraService.crearCuadradoGenerico());
  }

  //Llamada para hacer una linea nueva
  figuraLienaNueva() {
    this.crearNuevaFigura(() => this.figuraService.crearLineaGenerica());
  }

  //Llamada para hacer un texto nuevo
  figuraTextoNuevo() {
    this.crearNuevaFigura(() => this.figuraService.crearTextoGenerico());
  }

  //Le pasamos un objeto y lo añade al canvas
  agregarObjetoAlCanvas(objetoCanva: fabric.Object) {
    if (objetoCanva instanceof fabric.Line) {
      this.actualizarLineaEnAlmacen(objetoCanva); //Llamamos el método para poder visualizar la animación
    }
    this.canvas!.add(objetoCanva);
  }

  //Vinculamos elemento con el click del mouse
  vincularEventoMouseDown(objetoCanva: fabric.Object) {
    objetoCanva.on('mousedown', (event: any) => {
      this.objetoSeleccionado = event.target;
    });
  }

  //Registramos los valores cuando se modifican dependiendo de que tipo de objeto
  registrarEventoModificacion() {
    this.canvas!.on('object:modified', (event: any) => {

      const modifiedObject = event.target; // Objeto modificado en el canvas¡
      let updatedData = {} as SvgBase[];

      //Si se trata de una Linea
      if (modifiedObject instanceof fabric.Line) updatedData = this.elementoLinea(modifiedObject);


      //Si se trata de un Texto
      if (modifiedObject instanceof fabric.Text) updatedData = this.elementoTexto(modifiedObject);

      //Si se trata de un cuadrado-rectangulo
      if (modifiedObject instanceof fabric.Rect) updatedData = this.elementoCuadrado(modifiedObject);

      this.forzarActualizacion(modifiedObject)
      // Notificar al servicio de eventos sobre la actualización de datos
      this.dataService.actualizacionDatosSubject.next(updatedData)
    });
  }

  actualizarTextoEnElementoAlmacen(objeto: fabric.Object) {
    let updatedData = {} as SvgBase[];
    if (objeto instanceof fabric.Text) {
      updatedData = this.elementoTexto(objeto);
    }
    // Notificar al servicio de eventos sobre la actualización de datos
    this.dataService.actualizacionDatosSubject.next(updatedData)
  }

  actualizarLineaEnAlmacen(linea: fabric.Object) {
    setInterval(() => {
      //console.log('actualizando linea')
      let updatedData = {} as SvgBase[];
      if (linea instanceof fabric.Line) {
        updatedData = this.elementoLinea(linea);
      }
      //console.log(updatedData)
      // Notificar al servicio de eventos sobre la actualización de datos
      this.dataService.actualizacionDatosSubject.next(updatedData)
      this.forzarActualizacionCanvas(linea)   //Hay que forzar la actualización para ver reflejado los cambios por pantalla
      this.canvas!.renderAll();
    }, 300)
  }

  //Asignamos los valores a la línea
  elementoLinea(modifiedObject: any): SvgBase[] {
    const coords = modifiedObject.lineCoords;
    modifiedObject.setCoords //! TODO

    //console.log(x1, y1, x2, y2)

    return [{
      id: parseInt(modifiedObject.name!, 10),
      coordX: modifiedObject.left!,
      coordY: modifiedObject.top!,
      height: modifiedObject.height!,
      width: modifiedObject.width!,

      x1: coords.tl.x,    //Le asignamos las coordenadas de la caja porque en el evento no obtenemos las
      y1: coords.tl.y,    //coordenadas de la línea en sí al modificarse
      x2: coords.br.x,
      y2: coords.br.y,

      forma: modifiedObject.type!,
      fill: modifiedObject.fill!.toString(),
      stroke: modifiedObject.stroke!,
      rellenado: true,
      sizeLetter: NaN,
      strokeWidth: modifiedObject.strokeWidth!,
      svgContent: modifiedObject.toSVG(),
      scaleX: modifiedObject.scaleX!,
      scaleY: modifiedObject.scaleY!,
      name: modifiedObject.name!,
      text: '',
      fonts: '',
      angle: NaN,
      strokeDashArray: modifiedObject.strokeDashArray,
      estadoBorde: modifiedObject.estadoBorde
    }];
  }

  //Asignamos los valores a los cuadrados-rectangulos
  elementoCuadrado(modifiedObject: fabric.Rect): SvgBase[] {
    return [{
      id: parseInt(modifiedObject.name!, 10),
      coordX: modifiedObject.left!,
      coordY: modifiedObject.top!,
      text: '',
      forma: 'rect',
      fonts: '',
      rellenado: false,
      width: modifiedObject.width! * modifiedObject.scaleX!,
      height: modifiedObject.height! * modifiedObject.scaleY!,
      stroke: modifiedObject.stroke!,
      fill: modifiedObject.fill!.toString(),
      svgContent: modifiedObject.toSVG(),
      strokeWidth: modifiedObject.strokeWidth!,
      sizeLetter: NaN,
      x1: NaN,
      x2: NaN,
      y1: NaN,
      y2: NaN,
      name: modifiedObject.name!,
      scaleX: modifiedObject.scaleX!,
      scaleY: modifiedObject.scaleY!,
      angle: modifiedObject.angle!,
      strokeDashArray: modifiedObject.strokeDashArray!,
      estadoBorde: ''
    }];
  }

  //Asignamos los valores al texto
  elementoTexto(modifiedObject: fabric.Text): SvgBase[] {
    modifiedObject.angle!
    return [{
      id: parseInt(modifiedObject.name!, 10),
      coordX: modifiedObject.left!,
      coordY: modifiedObject.top!,
      text: modifiedObject.text!,
      forma: 'text',
      fonts: modifiedObject.fontFamily!,
      rellenado: true,
      width: modifiedObject.width! * modifiedObject.scaleX!,
      height: modifiedObject.height! * modifiedObject.scaleY!,
      scaleX: modifiedObject.scaleX!,
      scaleY: modifiedObject.scaleY!,
      stroke: modifiedObject.stroke!,
      fill: modifiedObject.fill!.toString(),
      svgContent: modifiedObject.toSVG(),
      strokeWidth: modifiedObject.strokeWidth!,
      sizeLetter: modifiedObject.fontSize!,
      x1: NaN,
      x2: NaN,
      y1: NaN,
      y2: NaN,
      name: modifiedObject.name!,
      angle: modifiedObject.angle!,
      strokeDashArray: modifiedObject.strokeDashArray!,
      estadoBorde: ''
    }];
  }

  //Si pulsamos en medio del canvas donde no hay elementos limpiamos la ultima entrada
  limpiarSeleccion() {
    this.canvas!.on('selection:cleared', () => {
      this.objetoSeleccionado = undefined;
    });
  }

  //Forzamos la actualización parar por ejemplo poder visualizar el color cuando lo cambiamos
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
  }

  //Almacen con cambios en tiempo real
  devolverAlmacenTiempoReal() {
    this.dataService.leerTiempoReal();  //!TO DO: función en el servicio para dejar de modificar info
    this.interval = setInterval(() => {
      this.filtrarFigurasAñadirCanvas();  //Entramos al filtro de las figuras para tener el canvas
      this.canvas!.renderAll();             //actualizado con los valores que modificamos arriba
    }, 4000);
  }

  //Desactivamos el almacen en tiempo real
  limpiaInterval() {
    if (this.interval) clearInterval(this.interval);
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

  //Modificar el color
  actualizarColor(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.fill = event.target.value;
        this.forzarActualizacionCanvas(this.objetoSeleccionado);//Para ver el nuevo color necesitamos hacer una actualización (forzosa?)
        this.actualizarColorEnAlmacen(this.objetoSeleccionado);
      }
    }
  }

  //Modificar el color del borde
  actualizarColorBorde(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.stroke = event.target.value;
        this.forzarActualizacionCanvas(this.objetoSeleccionado); //Para ver el nuevo color necesitamos hacer una actualización (forzosa?)
        this.actualizarColorEnAlmacen(this.objetoSeleccionado);
      }
    }
  }

  //Asigna el valor del color en el json server
  actualizarColorEnAlmacen(objeto: fabric.Object) {
    let updatedData = {} as SvgBase[];

    if (objeto instanceof fabric.Line) {
      updatedData = this.elementoLinea(objeto);
    } else if (objeto instanceof fabric.Text) {
      updatedData = this.elementoTexto(objeto);
    } else {
      updatedData = this.elementoCuadrado(objeto);
    }
    // Notificar al servicio de eventos sobre la actualización de datos
    this.dataService.actualizacionDatosSubject.next(updatedData)
  }

  // Forzamos la actualización del color para verlo reflejado en el canvas reduciendo el tamaño del objeto a modificar
  forzarActualizacionCanvas(objetoSeleccionado: any) {
    objetoSeleccionado.scaleX! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje X para forzar una actualizacion del color
    objetoSeleccionado.scaleY! *= 0.9999999; // Reduce la escala en un 0.0001% en el eje Y
    this.canvas!.renderAll();
    this.editar = false;
  }

  //Devuelve por consola el string para el SVG y lo guarda en el back
  persistirSVG() {
    console.log(this.figuras);
    this.dataService.guardarSvg(this.figuras);  //hace la petición con el back para guardar los distintos elementos en un json

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

  eliminarFigura(objetoSeleccionado: fabric.Object) {
    this.canvas!.remove(objetoSeleccionado);
    const index = this.figuras.findIndex(item => objetoSeleccionado.name! == item.id.toString());
    if (index !== -1) {
      console.log(index)
      this.figuras.splice(index, 1);
      //this.reajustarIDs();
      this.canvas!.renderAll();
      // console.log(this.figuras)
    }
    this.dataService.eliminarElemento(objetoSeleccionado).subscribe();
  }

  //Retorna un boolean dependiendo si es line o no
  esLinea(seleccionado: object) {
    return (seleccionado instanceof fabric.Line);
  }

  //Devuelve true si es un texto
  esTexto(objeto: any): objeto is fabric.Text {
    return objeto && objeto.text !== undefined;
  }

  //Edición del texto que tenemos dentro del elementos de texto
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

  //Vinculado con un botón para confirmar la edición
  confirmarEdicion(objetoTexto: fabric.Object, nuevoTexto: string) {
    if (objetoTexto instanceof fabric.Text) {
      if (nuevoTexto.trim() !== '') {
        objetoTexto.set({ text: nuevoTexto });
        console.log(nuevoTexto)
        this.actualizarTextoEnElementoAlmacen(objetoTexto)
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

  limpiarCanvas() {
    if (this.canvas) {
      this.canvas.clear();
      this.figuras.splice(0)
      this.canvas!.selection = true;
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.loadSvg(content);
      };
      reader.readAsText(file);
    }
  }

  loadSvg(svgContent: string): void {
    if (this.canvas !== undefined) {
      fabric.loadSVGFromURL(`data:image/svg+xml;base64,${btoa(svgContent)}`, (objects, options) => {
        const group = fabric.util.groupSVGElements(objects, options);

        // Limpiar el canvas antes de agregar los nuevos elementos
        this.canvas!.clear();

        // Desagrupar el objeto para acceder a los elementos individuales
        if (group instanceof fabric.Group) {
          group.getObjects().forEach((element) => {
            //this.canvas!.selection = true;
            // Agregar elementos individuales al canvas
            this.canvas!.add(element);
          });
        }
        // Renderizar el canvas con los elementos individuales del SVG
        this.canvas!.renderAll();
      });
    }
  }

  getFigurasPorTipo(tipo: string): SvgBase[] {
    return this.figuras.filter(figura => figura.forma === tipo);
  }

  //Selector de trabajo para las líneas
  actualizarEstadoLinea(linea: fabric.Object) {
    if (linea instanceof fabric.Line) {
      let colorBorde = 'black';
      if (this.tipoBorde === 'conCurro') {
        colorBorde = '#00FE18'; // Asignar el color verde si se selecciona 'Con curro'
      } else if (this.tipoBorde === 'sinCurro') {
        colorBorde = '#FF0000'; // Asignar el color rojo si se selecciona 'Sin curro'
      } else if (this.tipoBorde === '10min') {
        colorBorde = '#0033FE'
      } else if (this.tipoBorde === '30min') {
        colorBorde = '#FEC800'
      } else {
        colorBorde = '#000000';
      }

      // Asignar el color al borde del objeto seleccionado
      (this.objetoSeleccionado as fabric.Line).set('stroke', colorBorde);

      // Renderizar el canvas para reflejar los cambios
      this.canvas!.renderAll();
    }
  }

  // asignarEstadoInicialALineas() {
  //   console.log(this.figuras)
  //   this.figuras.forEach((figura) => {
  //     if (figura.forma == 'line') {
  //       let borde: estadoBorde = 'conCurro'
  //       let colorLinea = figura.stroke;

  //       if (colorLinea === '#00FE18') {
  //         borde = 'conCurro';
  //       } else if (colorLinea === '#FF0000') {
  //         borde = 'sinCurro';
  //       } else if (colorLinea === '#0033FE') {
  //         borde = '10min';
  //       } else if (colorLinea === '#FEC800') {
  //         borde = '30min';
  //       } else if (colorLinea === '#000000') {
  //         borde = 'neutral';
  //       }

  //       figura.estadoBorde = borde;
  //       console.log(figura.estadoBorde)
  //       // Actualizar el estado de la línea basado en el color
  //       //this.actualizarEstadoLinea(figura);
  //       // Encuentra la línea correspondiente en el canvas y actualiza su estado
  //       const lineaEnCanvas = this.buscarLineaEnCanvasPorId(figura.id.toString());
  //       if (lineaEnCanvas) {
  //         console.log(lineaEnCanvas)
  //         this.actualizarEstadoLinea(lineaEnCanvas);
  //       }
  //     }
  //   });
  // }

  // buscarLineaEnCanvasPorId(id: string): fabric.Object | undefined {
  //   return this.canvas!.getObjects().find((objeto) => objeto.name === id);
  // }
}
