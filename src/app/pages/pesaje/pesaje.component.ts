import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import {
  Bascula,
  Bodega,
  Guia,
  GuiaParametros,
  InfoPeso,
  Peso,
  User,
} from '../../shared/interfaces/globales.interface';
import { GuardarPesos } from '../../shared/models/guardar-pesos.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';
import { GlobalService } from '../../core/interceptor/global.service';
import introJs from 'intro.js';

@Component({
  selector: 'app-pesaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pesaje.component.html',
  styleUrl: './pesaje.component.scss',
})
export class PesajeComponent implements OnInit {
  resBasculas: Bascula[] = [];
  pesoGuia: Peso[] = [];
  resGuiasXmani: Guia[] = [];
  infoPeso: InfoPeso = {
    CORRELATIVO: 0,
    PARAMETRO: 0,
    PESO_CODIGO: 0,
    PESO_ANIOCOD: 0,
  };

  infoInterna: any = {
    repeso: true,
    currentPage: 1,
  };

  detallePeso: any[] = [];
  basculaDefine: Bascula | null = null;
  selectBascula: Bascula = { BAS_COD: 'PRUE', BAS_ENDPOINT: '' };
  peso: number = 0;

  resBodegas: Bodega[] = [
    { title: 'IMPORTACIONES', TIPOGUIA_COD: 'CGI', BOD: 'I' },
    { title: 'COURIER', TIPOGUIA_COD: 'CGC', BOD: 'C' },
    { title: 'EXPORTACIONES', TIPOGUIA_COD: 'CGE', BOD: 'E' },
  ];

  guiaData: Guia = {
    GUIA: null,
    GUIA_ANIO: null,
    GUIA_CORR: null,
    TIPOGUIA_COD: null,
    GUIA_CONSIGNATARIO: null,
    GUIA_PIEZA: null,
    GUIA_PESO: null,
    GUIA_PESOKG: null,
    GUIA_REPESOKG: null,
    ESTADO_COD: null,
    GUIA_ORDEN: null,
    fecha: null,
    GUIA_PIEZACF: null,
  };

  guiaParametros: GuiaParametros = {
    guia_prefijo: '',
    guia_num: '',
    man_anio: '',
    man_corr: '',
    bod: null,
  };

  user: User = {
    USER_ID: 0,
    USER_GAFETE:'',
    BASCULAS:'N',
  };

  guardarPesos: GuardarPesos;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private _GlobalService: GlobalService
  ) {
    this.guardarPesos = new GuardarPesos();
  }

  ngOnInit(): void {
    //this.getBasculas();
    this.getUser();
    this.startTour();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.infoPeso?.CORRELATIVO }, (_, i) => i + 1);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
  
    if (this.resBasculas.some((item) => item.BAS_BUTTON === key)) {
      event.preventDefault();
      this.getPeso(this.resBasculas.find((item) => item.BAS_BUTTON === key)!);
    } 
    // Si se presiona Ctrl + F12
    else if (event.ctrlKey && event.code === 'F12') {
      event.preventDefault();
      this.basculasActivas();
    }
    // Si se presiona Ctrl + F11
    else if (event.ctrlKey && event.code === 'F11') {
      event.preventDefault();
      this.postPeso();
    }
  }
  

  onBodegaChange(selectedBodega: any): void {
    if (selectedBodega) {
      this.getBasculas(selectedBodega.BOD);
    }
  }

  private modalElement!: HTMLElement;
  private modalInstance!: Modal;
  GetGuiaXManifiesto(): void {
    if (this.guiaParametros.bod?.TIPOGUIA_COD) {
      this.dataService
        .GetGuiaXManifiesto(
          this.guiaParametros.man_anio,
          this.guiaParametros.man_corr,
          this.guiaParametros.bod.TIPOGUIA_COD
        )
        .subscribe(
          (response) => {
            console.log('respondio');
            this.resGuiasXmani = response.data;
            console.log(this.resGuiasXmani);

            this.modalElement = document.getElementById(
              'exampleModal'
            ) as HTMLElement;

            // Crear una instancia del modal
            this.modalInstance = new Modal(this.modalElement);
            this.modalInstance.show();
          },
          (error) => {
            this.toastr.error(error.error.message);
          }
        );
    } else {
      this.toastr.error('Bodega no seleccionada.');
    }
  }

  getUser(): void {
    const user = this.userService.getUser();
    if (user) {
      this.user = user;
    } else {
      console.error('No user found in session storage');
    }
  }

  getBasculas(bodega: string): void {
    this.dataService.getBasculas(bodega).subscribe({
      next: (res) => {
        this.resBasculas = res;
        this.basculasActivas();
      },
      error: (error) => {
        this.toastr.error(error);
      },
    });
  }

  basculasActivas(): void {
    this.resBasculas.forEach((bascula) => {
      this.verificarBascula(bascula);
    });
  }

  verificarBascula(bascula: Bascula): void {
    this.dataService.checkBascula(this.user.BASCULAS ? bascula.BAS_ENDPOINT: `https://apibasculas.sistemasdeguatemala.online/api/Bascula/v1`).subscribe({
      next: (res) => {
        bascula.ACTIVA = res.peso ? true : false;
        //this.peso = res.peso;
      },
      error: (error) => {
        bascula.ACTIVA = false;
      },
    });
  }

  guiaDeManifiesto(guia: string | null): void {
    if (guia == null) {
      return;
    }
    this.guiaParametros.guia_prefijo = guia.substring(0, 3);
    this.guiaParametros.guia_num = guia.substring(3);
    this.modalInstance.hide();
    this.getGuiaData();
  }
  //getGuiaData

  getGuiaData(): void {
    this.infoInterna.currentPage = 1;
    //this.infoInterna
    if (this.guiaParametros.bod?.TIPOGUIA_COD) {
      this.dataService
        .getKeysGuia(
          `${this.guiaParametros.guia_prefijo}${this.guiaParametros.guia_num}`,
          this.guiaParametros.bod.TIPOGUIA_COD
        )
        .subscribe(
          (response) => {
            this.guiaData = response.data;
            this.guiaParametros.man_anio = response.data.MAN_ANIO;
            this.guiaParametros.man_corr = response.data.MAN_CORR;
            this.getPesosHistorial();
          },
          (error) => {
            this.toastr.error(error.error.message);
          }
        );
    } else {
      this.toastr.error('Bodega no seleccionada.');
    }
  }

  getPesosHistorial(correlativo: number = 0) {
    if (correlativo) {
      this.infoInterna.currentPage = correlativo;
    }
    this._GlobalService.showLoad();
    this.dataService.getPesos(this.guiaData, correlativo).subscribe(
      (response) => {
        this.pesoGuia = response.data.data;
        this.infoPeso = response.data.informacion;

        if (!correlativo) {
          this.infoInterna.currentPage = response.data.informacion.CORRELATIVO;
        }

        this.calcularTotales();
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  calcularTotales() {
    this.guardarPesos.PESO_PESOBRUTOLB = parseFloat(
      this.pesoGuia
        .reduce(
          (total, peso) => total + (peso.PESO_PESOBRUTOLB || 0), // Sumar cada peso
          0
        )
        .toFixed(2) // Formato a 2 decimales
    );
    this.guardarPesos.PESO_PESOBRUTOKG = parseFloat(
      this.pesoGuia
        .reduce(
          (total, peso) => total + (peso.Peso_Pesobrutokg || 0), // Sumar cada peso
          0
        )
        .toFixed(2)
    );
    this.guardarPesos.PESO_NETOKG = parseFloat(
      this.pesoGuia
        .reduce(
          (total, peso) => total + (peso.PESO_NETOKG || 0), // Sumar cada peso
          0
        )
        .toFixed(2)
    );
    this.guardarPesos.PESO_TARAKG = parseFloat(
      this.pesoGuia
        .reduce(
          (total, peso) => total + (peso.PESO_TARAKG || 0), // Sumar cada peso
          0
        )
        .toFixed(2)
    );
  }

  validatePeso(): boolean {

    if(this.detallePeso.length<1){
      this.toastr.warning("Ningun peso por guardar.");
      return false;
    }else if(this.guiaData.GUIA == null){
      this.toastr.warning("Consultar guia primero.");
      return false;
    }else if (this.infoPeso.CORRELATIVO != this.infoInterna.currentPage) {
      this.toastr.error('No puedes modificar un peso menor al último', 'Error');
      return false;
    }
    return true;
  }

  sendPesoData(): void {
    this.dataService
      .postPesos(
        this.detallePeso,
        this.infoInterna,
        this.guiaData,
        this.guiaParametros,
        this.infoPeso
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message, 'Éxito');
          this.detallePeso = [];
          this.getGuiaData();
        },
        error: (error) => {
          this.toastr.error(
            error.error?.message || 'Error inesperado',
            'Error'
          );
        },
      });
  }

  postPeso(): void {
    if (!this.validatePeso()) {
      return;
    }

    this.sendPesoData();
  }

  getPeso(bascula: Bascula): void {
    this.dataService.getPeso(this.user.BASCULAS ? bascula.BAS_ENDPOINT: `https://apibasculas.sistemasdeguatemala.online/api/Bascula/v1`).subscribe({
      next: (res) => {
        this.peso = parseFloat(res.peso);
        if (this.peso > 0) {
          this.addPesoToDetail(bascula.BAS_COD, this.peso);
        }else{
          this.toastr.warning("peso en bascula debe ser mayor a 0.","Alerta");
        }
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message ||
            'Ocurrio un error inesperado al obtener el peso en la bascula',
          'Error obteniendo peso'
        );
      },
    });
  }

  limpiarDatos(): void {}

  addPesoToDetail(BAS_COD: string, peso: number): void {
    const detalle = {
      PESO_BASCULA: this.peso,
      PESO_PESOBRUTOLB: (this.peso * 2.20462).toFixed(2),
      PESO_PESOBRUTOKG: this.peso.toFixed(2),
      BAS_COD: BAS_COD,
      PESO_CANTPIEZA: 0,
      PESO_TARAKG: 0, // Inicialmente 0, editable en la tabla
      USER_ID: this.user.USER_ID,
      PESO_CORREEQUIPO: this.detallePeso.length + 1, // Número de ítem generado automáticamente
      PESO_NETOKG: peso.toFixed(2), // Inicialmente igual al peso bruto menos TARA
      BAS_BODEGA: this.resBodegas.find(
        (x) => x.TIPOGUIA_COD == this.guiaData.TIPOGUIA_COD
      )?.BOD,
    };
    this.detallePeso.push(detalle);
  }

  updatePesoNeto(index: number): void {
    
    const detalle = this.detallePeso[index];
    // Actualiza el valor de PESO_NETOKG en base al peso bruto y TARA
    detalle.PESO_NETOKG = (
      parseFloat(detalle.PESO_PESOBRUTOKG) -
      parseFloat(detalle.PESO_TARAKG || 0)
    ).toFixed(2);
  }

  evaluateTara(): void {}

  imprimirPase(): void {

    if(this.guiaData.GUIA == null){
      this.toastr.warning("No hay informacion para imprimir");
      return;
    }

    const element = document.getElementById("tabla_pesos");
    if (!element) return;
  
    // Obtener la fecha y hora actual para la impresión
    const fechaImpresion = new Date().toLocaleString();
  
    // Información de la boleta
    const guiaTable = `
      <div style="width: 100%; margin: 0; padding: 0;">
        <!-- Encabezado de la boleta -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Depósito Aduanero Temporal</h1>
          <p style="margin: 0; font-size: 14px;">Boleta de Pesaje - Información de la Guía</p>
          <p style="margin: 0; font-size: 12px;">Fecha de Impresión: ${fechaImpresion}</p>
        </div>
  
        <!-- Tabla de información de la guía -->
        <table style="width: 100%; margin-bottom: 20px;">
          <thead>
            <tr>
              <th colspan="2" style="text-align: center; font-size: 18px; font-weight: bold; padding-bottom: 10px;">Información de la Guía</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold; width: 30%;">Guía:</td>
              <td style="padding: 8px; text-align: left; width: 70%;">${this.guiaData.GUIA}</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Año:</td>
              <td style="padding: 8px; text-align: left;">${this.guiaData.GUIA_ANIO}</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Consignatario:</td>
              <td style="padding: 8px; text-align: left;">${this.guiaData.GUIA_CONSIGNATARIO}</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Orden:</td>
              <td style="padding: 8px; text-align: left;">${this.guiaData.GUIA_ORDEN}</td>
            </tr>
            <tr>
              <td style="padding: 8px; text-align: right; font-weight: bold;">Fecha de ingreso:</td>
              <td style="padding: 8px; text-align: left;">${this.guiaData.fecha}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  
    // Concatenar las dos tablas
    const combinedHtml = guiaTable + element.outerHTML;
  
    // Generar PDF con ambas tablas
    this.dataService.createPdf(combinedHtml).subscribe(blob => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${this.guiaData.GUIA}.pdf`;
      a.click();
      window.URL.revokeObjectURL(a.href);
    });
  }

  removePeso(index: number) {
    this.detallePeso.splice(index, 1); // Eliminar el elemento del array
  }
  
  // NO IMPORTANTES
  startTour() {
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          title: 'Bievenido',
          intro: "al sistema de toma de pesos por medio de lectura del puerto searial y almacenar el peso en una guia. Te recomiendo ir cumpliendo los pasos directamente. Datos de prueba: \n https://docs.google.com/spreadsheets/d/1Cgx3OVYTxmySDn0zffBiSo-tdoXhZyFw/edit?usp=drive_link&ouid=110731917126285182293"
        },
        {
          element: '#selectBodega', // Elemento bodega
          intro: 'Selecciona la bodega en este campo.',
          position: 'bottom'
        },{
          element: '#guiaInfo', // Elemento guía
          intro: 'Aquí puedes consultar la información de la guía ingresando el prefijo y el número.',
          position: 'bottom'
        },{
          element: '#porManifiesto',
          intro: 'Aquí puedes consultar la información de la guía ingresando el año correlativo de manifiesto.',
          position: 'bottom'
        },{
          element: '#listaBasculas',
          title: 'Listado de basculas',
          intro: 'Veras el listado de basculas disponibles, presiona la tecla que indica o el botton directamente.',
          position: 'bottom'
        },
        {
          element: '#tabla_pesos', // Elemento historial de pesaje
          intro: 'Aquí puedes visualizar el historial de pesaje de la guia consultada con detalles de peso bruto, neto, y fecha.',
          position: 'top'
        },
        {
          element: '#guardarPeso', // Elemento para guardar peso
          intro: 'Este botón guarda el peso de la lectura del puerto serial.',
          position: 'top'
        },
        {
          element: '#imprimirPase', // Elemento para imprimir pase
          intro: 'Imprime la boleta de pesaje haciendo clic en este botón.',
          position: 'top'
        },{
          title: 'Listo!',
          intro: "Puedes tomar pesos. Datos de prueba: \n https://docs.google.com/spreadsheets/d/1Cgx3OVYTxmySDn0zffBiSo-tdoXhZyFw/edit?usp=drive_link&ouid=110731917126285182293"
        },
      ],
      exitOnOverlayClick: false
    });

    // Mostrar el tour solo la primera vez
    intro.oncomplete(() => {
      localStorage.setItem('tourCompleted', 'true');
    });

    // Mostrar el tour solo si no se ha completado
    if (!localStorage.getItem('tourCompleted')) {
      intro.start();
    }
  }
}
