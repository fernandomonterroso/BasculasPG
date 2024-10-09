import { Component, HostListener, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Bascula,
  Bodega,
  Guia,
  GuiaParametros,
  InfoPeso,
  Peso,
} from '../../shared/interfaces/globales.interface';
import { GuardarPesos } from '../../shared/models/guardar-pesos.model';
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
  pesoGuia: Peso[] = [];
  infoPeso: InfoPeso = {
    CORRELATIVO: 0,
    PARAMETRO: 0,
    PESO_CODIGO: 0,
    PESO_ANIOCOD: 0,
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

  currentPage: number = 1; // Variable global para llevar la página actual

  guardarPesos: GuardarPesos;
  constructor(private dataService: DataService, private toastr: ToastrService) {
    this.guardarPesos = new GuardarPesos(); 
  }

  ngOnInit(): void {
    this.getBasculas();
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
      this.getPeso(
        this.resBasculas.find((item) => item.BAS_BUTTON === key)!
      );
    }
  }

  getGuiaXManifiesto(): void {
    console.log(
      'Consulta por manifiesto con parámetros: ',
      this.guiaParametros
    );
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
        //this.peso = res.peso;
      },
      error: (error) => {
        bascula.ACTIVA = false;
      },
    });
  }

  getGuiaData(): void {
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

  getPesosHistorial(correlativo:number=0) {

    if(correlativo){
      this.currentPage = correlativo;
    }

    this.dataService.getPesos(this.guiaData, correlativo).subscribe(
      (response) => {
        this.pesoGuia = response.data.data;
        this.infoPeso = response.data.informacion;

        if(!correlativo){
          this.currentPage = response.data.informacion.CORRELATIVO;
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
    this.guardarPesos.PESO_PESOBRUTOLB = this.pesoGuia.reduce((total, peso) => total + (peso.PESO_PESOBRUTOLB || 0), 0);
    this.guardarPesos.PESO_PESOBRUTOKG = this.pesoGuia.reduce(
      (total, peso) => total + (peso.Peso_Pesobrutokg || 0),
      0
    );
  }

  getPeso(bascula: Bascula): void {
   
    
    this.dataService.getPeso(bascula.BAS_ENDPOINT).subscribe({
      next: (res) => {
        this.peso = parseFloat(res.peso);
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
      DETPESO_PESOBRUTLB: (this.peso * 2.20462).toFixed(2),
      DETPESO_PESOBRUTOKG: this.peso.toFixed(2),
    };
    this.detallePeso.push(detalle);
    console.log(JSON.stringify(this.detallePeso));
    
    this.evaluateTara();
  }

  evaluateTara(): void {}
}
