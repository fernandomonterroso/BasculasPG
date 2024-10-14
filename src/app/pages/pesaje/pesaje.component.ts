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
    private userService: UserService
  ) {
    this.guardarPesos = new GuardarPesos();
  }

  ngOnInit(): void {
    //this.getBasculas();
    this.getUser();
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
  }

  onBodegaChange(selectedBodega: any): void {
    if (selectedBodega) {
      //console.log('Bodega seleccionada:', selectedBodega.BOD); // Usando el operador ?
      this.getBasculas(selectedBodega.BOD);
    }
  }

  private modalElement!: HTMLElement;
  private modalInstance!: Modal;
  GetGuiaXManifiesto(): void {
    //guiaParametros.man_anio
    //this.guiaParametros.bod.TIPOGUIA_COD
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
    this.dataService.checkBascula(this.user.BASCULAS ? bascula.BAS_ENDPOINT: `https://localhost:7232/api/Bascula/v1`).subscribe({
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
      // Maneja el caso en que la guía es null
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
    if (this.guiaParametros.bod?.TIPOGUIA_COD) {
      this.dataService
        .getKeysGuia(
          `${this.guiaParametros.guia_prefijo}${this.guiaParametros.guia_num}`,
          this.guiaParametros.bod.TIPOGUIA_COD
        )
        .subscribe(
          (response) => {
            this.guiaData = response.data;
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

    this.dataService.getPesos(this.guiaData, correlativo).subscribe(
      (response) => {
        this.pesoGuia = response.data.data;
        this.infoPeso = response.data.informacion;

        if (!correlativo) {
          this.infoInterna.currentPage = response.data.informacion.CORRELATIVO;
        }

        //this.currentPage = response.data.informacion.CORRELATIVO;
        // Calcular totales
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
    if (this.infoPeso.CORRELATIVO != this.infoPeso.PARAMETRO) {
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
          this.getPesosHistorial(this.infoInterna.currentPage);
          this.toastr.success(res.message, 'Éxito');
          this.detallePeso = [];
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
    this.dataService.getPeso(bascula.BAS_ENDPOINT).subscribe({
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
}
