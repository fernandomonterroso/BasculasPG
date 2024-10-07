import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bascula, Bodega, GuardarPesos, Guia, GuiaParametros } from '../../shared/interfaces/globales.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pesaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pesaje.component.html',
  styleUrl: './pesaje.component.scss',
})
export class PesajeComponent implements OnInit {
  resBasculas: Bascula[] = [];
  resConsultaPeso = { data: [], informacion: [] };
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

  guardarPesos: GuardarPesos = {
    PESO_CFRIO: false,
    COBRO_ENCAJA: false,
  };

  guiaParametros: GuiaParametros = {
    guia_prefijo: '',
    guia_num: '',
    man_anio: '',
    man_corr: '',
    bod: null,
  };

  constructor(private dataService: DataService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getBasculas();
    this.getUser();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key;

    if (this.resBasculas.some((item) => item.BAS_BUTTON === key)) {
      event.preventDefault();
      this.verificarBascula(
        this.resBasculas.find((item) => item.BAS_BUTTON === key)!
      );
    }
  }



  getGuiaXManifiesto(): void {
    console.log('Consulta por manifiesto con parámetros: ', this.guiaParametros);
  }

  getUser(): void {
    this.dataService.getUser().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  getBasculas(): void {
    this.dataService.getBasculas('I').subscribe({
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
    this.dataService.checkBascula(bascula.BAS_ENDPOINT).subscribe({
      next: (res) => {
        bascula.ACTIVA = res.peso ? true : false;
        this.peso = res.peso;
      },
      error: (error) => {
        bascula.ACTIVA = false;
      },
    });
  }

  getGuiaData(): void {
    if (this.guiaParametros.bod?.TIPOGUIA_COD) {
      this.dataService.getKeysGuia(
        `${this.guiaParametros.guia_prefijo}${this.guiaParametros.guia_num}`,
        this.guiaParametros.bod.TIPOGUIA_COD
      ).subscribe(
        (response) => {
          this.guiaData = response.data;
          console.log('Datos de la guía:', this.guiaData);
        },
        (error) => {          
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.toastr.error('Bodega no seleccionada.');
    }
  }

  getPeso(): void {
    if (!this.selectBascula.BAS_ENDPOINT) {
      alert('Seleccionar bascula o parametro.');
      return;
    }

    this.dataService.getPeso(this.selectBascula.BAS_ENDPOINT).subscribe({
      next: (res) => {
        this.peso = res.peso;
        if (this.peso > 0) {
          this.addPesoToDetail();
        }
      },
      error: (error) => {
        console.error('Error obteniendo peso:', error);
      },
    });
  }

  limpiarDatos(): void {}

  addPesoToDetail(): void {
    const detalle = {
      DETPESO_BASCULA: this.peso,
      DETPESO_BASCULALB: (this.peso * 2.20462).toFixed(2),
      DETPESO_PESOBRUTOKG: this.peso.toFixed(2),
    };
    this.detallePeso.push(detalle);
    this.evaluateTara();
  }

  evaluateTara(): void {}
}
