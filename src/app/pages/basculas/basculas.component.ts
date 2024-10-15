import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importar FormsModule para usar ngModel
import { Router, RouterModule } from '@angular/router';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { DataService } from '../../shared/services/data.service';
import { Bascula, Bodega } from '../../shared/interfaces/globales.interface';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-basculas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AgGridAngular], // Asegúrate de importar FormsModule
  templateUrl: './basculas.component.html',
  styleUrl: './basculas.component.scss',
})
export class BasculasComponent implements OnInit {
  basculas: Bascula[] = [];
  errorMessage: string = '';
  quickFilterValue: string = ''; // Almacena el valor del filtro global
  selectedBodega: string = ''; // Variable para almacenar la bodega seleccionada

  resBodegas: Bodega[] = [
    { title: 'IMPORTACIONES', TIPOGUIA_COD: 'CGI', BOD: 'I' },
    { title: 'COURIER', TIPOGUIA_COD: 'CGC', BOD: 'C' },
    { title: 'EXPORTACIONES', TIPOGUIA_COD: 'CGE', BOD: 'E' },
  ];

  // Configuración de AG Grid
  themeClass = 'ag-theme-quartz';
  paginationPageSize = 10; // Tamaño de página para la paginación

  colDefs: ColDef[] = [
    { field: 'BAS_COD', headerName: 'Código', autoHeight: true, wrapText: true },
    { field: 'BAS_DESC', headerName: 'Descripción', autoHeight: true, wrapText: true },
    { field: 'BAS_MARCA', headerName: 'Marca', autoHeight: true, wrapText: true },
    { field: 'BAS_MODELO', headerName: 'Modelo', autoHeight: true, wrapText: true },
    { field: 'BAS_SERIE', headerName: 'Serie', autoHeight: true, wrapText: true },
    //{ field: 'ACTIVA', headerName: 'Activa', autoHeight: true, wrapText: true },
    { field: 'BAS_ENDPOINT', headerName: 'API', autoHeight: true, wrapText: true },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true, // Habilitar filtros individuales en las columnas
    sortable: true, // Habilitar ordenamiento
  };

  rowData: Bascula[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getBasculas('C'); // Obtener datos al inicializar el componente, usando 'C' por defecto
  }

  // Obtener básculas según la bodega seleccionada
  getBasculas(bodegaCode: string): void {
    this.dataService.getBasculas(bodegaCode).subscribe(
      (data: Bascula[]) => {
        this.rowData = data; // Asignar los datos de las básculas
      },
      (error) => {
        this.errorMessage = error.message || 'Error al obtener las básculas';
        console.error(this.errorMessage);
      }
    );
  }

  // Método para aplicar el filtro global
  onQuickFilterChanged(event: any) {
    this.quickFilterValue = event.target.value;
  }

  // Método para manejar el cambio de bodega
  onBodegaChange(event: any) {
    const selectedBodegaCode = event.target.value;
    this.getBasculas(selectedBodegaCode); // Llamar al servicio para obtener los datos según la bodega seleccionada
  }
}
