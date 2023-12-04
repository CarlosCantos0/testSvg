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

  estadoBorde: string = 'neutral'
  nombrePersonalizado: string = 'figura 1'

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

  private almacenIntervalos: any = {}

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
        this.dataService.elementosGestor.subscribe(elementos => {
          this.figuras = elementos
          this.figurasAlmacen(this.figuras)
        })
      });
  }

  cargar() {
    this.canvas = this.canvasService.inicializarCanvas();
    this.canvas.renderAll();
    this.filtrarFigurasAñadirCanvas();
  }

  // Método para dibujar las figuras en el canvas
  private async filtrarFigurasAñadirCanvas() {
    await this.actualizarDatos();
    this.canvas!.clear()
    this.figurasAlmacen(this.figuras);
  }

  // Método para actualizar en this.figuras la información de los distintos elementos
  async actualizarDatos(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const data = await this.dataService.leerJson();
        this.figuras = data;
        resolve();
      }, 500);
    });
  }

  //Recorremos la lista de figuras y las añadimos al canvas y lo vinculamos con sus actualizaciones
  figurasAlmacen(figuras: SvgBase[]) {
    this.canvas!.clear();
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
      this.actualizarLineaEnAlmacen(objetoCanva); //Llamamos el método para poder visualizar la animación de la linea
      this.actualizarEstadoLinea(objetoCanva, 'neutral');
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

      console.log('actualizar')
      const modifiedObject = event.target; // Objeto modificado en el canvas¡
      let updatedData = {} as SvgBase[];

      //Si se trata de una Linea
      if (modifiedObject instanceof fabric.Line) {
        updatedData = this.elementoLinea(modifiedObject);
      }

      //Si se trata de un Texto
      if (modifiedObject instanceof fabric.Text) {
         updatedData = this.elementoTexto(modifiedObject);
      }

      //Si se trata de un cuadrado-rectangulo
      if (modifiedObject instanceof fabric.Rect) {
      updatedData = this.elementoCuadrado(modifiedObject);
      }

      this.forzarActualizacion(modifiedObject)
      this.actualizarFiguraAlmacen(updatedData);
      console.log(this.figuras);
    });
  }

  //Asignamos los valores a la línea
  elementoLinea(modifiedObject: any): SvgBase[] {
    const coords = modifiedObject.lineCoords;
    modifiedObject.setCoords //! TODO

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
      estadoBorde: modifiedObject.estadoBorde,
      nombrePersonalizado: ''
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
      estadoBorde: '',
      nombrePersonalizado: ''
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
      estadoBorde: '',
      nombrePersonalizado: ''
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

  //Modo lectura en tiempo real
  leerTiempoReal() {
    this.dataService.cambioTexto.subscribe(() => {  //Event Emitter para informar sobre el cambio
      this.desactivarDragAndDrop();
    });
    this.desactivarDragAndDrop();
    this.dataService.leerTiempoReal();
  }

  desactivarDragAndDrop() {
    if (this.canvas) {
      this.canvas.forEachObject((obj: fabric.Object) => {
        obj.selectable = false; // Desactivar la interacción de arrastrar y soltar
      });
      this.canvas.selection = false; // Desactivar la selección de múltiples objetos
      this.canvas.renderAll(); // Renderizar el canvas para aplicar los cambios
    }
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

  //Actualiza el texto en el almacen para tener los valores actualizados
  actualizarTexto(texto: fabric.Object) {
    this.actualizarValoresObjetoEnAlmacen(texto);
  }

  actualizarLineaEnAlmacen(linea: fabric.Object) {
    setInterval(() => {
      //console.log('actualizando linea')
      let updatedData = {} as SvgBase[];
      if (linea instanceof fabric.Line) {
        updatedData = this.elementoLinea(linea);
      }
      //console.log(updatedData)
      this.actualizarFiguraAlmacen(updatedData)
      this.forzarActualizacionCanvas(linea)   //Hay que forzar la actualización para ver reflejado los cambios por pantalla
      this.canvas!.renderAll();
    }, 150)
  }


  //Modificar el color
  actualizarColor(event: any) {
    if (this.canvas && this.objetoSeleccionado) {
      if (this.objetoSeleccionado instanceof fabric.Rect || this.objetoSeleccionado instanceof fabric.Text) {
        this.objetoSeleccionado.fill = event.target.value;
      }
        this.forzarActualizacionCanvas(this.objetoSeleccionado);//Para ver el nuevo color necesitamos hacer una actualización (forzosa?)
        this.actualizarValoresObjetoEnAlmacen(this.objetoSeleccionado);
    }
  }

  //Modificar el color del borde
  actualizarColorBorde(event: any) {
    if (this.canvas) {
      if (this.objetoSeleccionado) {
        this.objetoSeleccionado.stroke = event.target.value;
        this.forzarActualizacionCanvas(this.objetoSeleccionado); //Para ver el nuevo color necesitamos hacer una actualización (forzosa?)
        this.actualizarValoresObjetoEnAlmacen(this.objetoSeleccionado);
      }
    }
  }

  //Asigna el valor del color en el json server
  actualizarValoresObjetoEnAlmacen(objeto: fabric.Object) {
    let updatedData: SvgBase[] = [];

    if (objeto instanceof fabric.Line) {
      console.log('linea')
      updatedData = this.elementoLinea(objeto);
    } else if (objeto instanceof fabric.Text) {
      console.log('texto')
      updatedData = this.elementoTexto(objeto);
    } else {
      console.log('cuadrado')
      updatedData = this.elementoCuadrado(objeto);
    }
    //Asignamos los valores de actualización al objeto
    //! Ya que el método principal funciona con object:modified pero cuando cambias el color no salta el evento por lo que tenemos este método
    this.actualizarFiguraAlmacen(updatedData);
  }

  actualizarFiguraAlmacen(updatedData: SvgBase[]) {
    const index = this.figuras.findIndex((figura) => figura.id === updatedData[0].id);
    if (index !== -1) {
      // Actualiza los datos en this.figuras
      this.figuras[index] = updatedData[0];
    } else {
      console.error('El objeto no se encontró en this.figuras');
      this.figuras.push(updatedData[0])
    }
  }

  // Forzamos la actualización del color para verlo reflejado en el canvas reduciendo el tamaño del objeto a modificar
  forzarActualizacionCanvas(objetoSeleccionado: any) {
    objetoSeleccionado.scaleX! *= 0.9999999; //! Reduce la escala en un 0.000001% en el eje X para forzar una actualizacion gráfica
    objetoSeleccionado.scaleY! *= 0.9999999; // Reduce la escala en un 0.000001% en el eje Y
    this.canvas!.renderAll();
    this.editar = false;
  }

  //Devuelve por consola el string para el SVG y lo guarda en el back
  persistirSVG() {
    console.log(this.figuras);
    this.dataService.guardarSvg(this.figuras)  //hace la petición con el back para guardar los distintos elementos en un json
    .then((aver) => console.log('mu bien', aver))
    .catch(error => console.error('Algo mal', error))

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
  //! Para persistir el indexZ deberemos de modificar el orden en el que se guardarán los objetos en nuestra lista
  traerAlFrente(): void {
    const clickedObject = this.canvas!.getActiveObject();
    if (clickedObject) {
      this.canvas!.bringToFront(clickedObject);
    }
    this.contextMenu.closeMenu();
  }

  //Modifica el indexZ para llevar al fondo a la figura seleccionada
  //! Para persistir el indexZ deberemos de modificar el orden en el que se guardarán los objetos en nuestra lista
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
      this.canvas!.renderAll();
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

  //Vacía el canvas de objetos y nuestro almacen
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

  //Carga de nuestro sistema de ficheros local un .svg en el lienzo
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

  //Separa por tipo de figuras en el HTML
  getFigurasPorTipo(tipo: string): SvgBase[] {
    return this.figuras.filter(figura => figura.forma === tipo);
  }

  //Selector de trabajo para las líneas
  actualizarEstadoLinea(linea: fabric.Object, estadoBorde: string) {
    this.alterarEstadoLinea(linea, estadoBorde)

    if (linea.stroke === '#00FE18') {
      console.log('linea color exacto')
      this.intervaloAnimacion(linea)
    } else this.limpiarEstado(linea)

    // Renderizar el canvas para reflejar los cambios
    this.canvas!.renderAll();
  }

  private alterarEstadoLinea(linea: fabric.Object, estadoBorde: string): void {
    let alternar: boolean = false;
    if (linea instanceof fabric.Line) {
      let colorBorde = 'black';
      if (estadoBorde === 'conCurro') {
        colorBorde = '#00FE18';
        (linea as fabric.Line).set('stroke', colorBorde)
      } else if (estadoBorde === 'sinCurro') {
        colorBorde = '#FF0000';
        linea.strokeDashArray = [NaN];
        (linea as fabric.Line).set('stroke', colorBorde)
      } else if (estadoBorde === '10min') {
        colorBorde = '#0033FE';
        linea.strokeDashArray = [NaN];
        (linea as fabric.Line).set('stroke', colorBorde)
      } else if (estadoBorde === '30min') {
        colorBorde = '#FEC800';
        linea.strokeDashArray = [NaN];
        (linea as fabric.Line).set('stroke', colorBorde)
      } else if (estadoBorde === 'neutral') {
        colorBorde = '#000000';
        linea.strokeDashArray = [NaN];
        //(this.objetoSeleccionado as fabric.Line).set('stroke', colorBorde)
      }
    }
  }

  intervaloAnimacion(linea: fabric.Object) {
    this.almacenIntervalos[linea.name!] = setInterval(() => {
      this.animate(linea)
      this.canvas!.renderAll();
    }, 500)
  }

  animate(linea: fabric.Object) {
    if (linea.strokeDashArray![0] === 7) {
      linea.strokeDashArray = [3, 8, 7];
    } else {
      linea.strokeDashArray = [7, 5, 14];
    }
  }

  limpiarEstado(linea: fabric.Object) {
    clearInterval(this.almacenIntervalos[linea.name!]); // Detener la animación
  }

  cambiarNombrePersonalizado(figuraParam: fabric.Object, nombre: string) {
    const index = this.figuras.findIndex(figura => figura.id === parseFloat(figuraParam.name!));
    this.figuras[index].nombrePersonalizado = this.nombrePersonalizado;
  }
}
