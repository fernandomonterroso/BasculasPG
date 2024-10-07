import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { DataService } from '../../shared/services/data.service';
import { Bascula } from '../../shared/interfaces/globales.interface';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

@Component({
  selector: 'app-basculas',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './basculas.component.html',
  styleUrl: './basculas.component.scss',
})
export class BasculasComponent implements OnInit {
  basculas: Bascula[] = [];
  errorMessage: string = '';
  quickFilterValue: string = ''; // Almacena el valor del filtro global

  // Configuración de AG Grid
  themeClass = 'ag-theme-quartz';
  domLayout = 'autoHeight';
  paginationPageSize = 10; // Tamaño de página para la paginación

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    {
      field: 'BAS_COD',
      headerName: 'Código',
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'BAS_DESC',
      headerName: 'Descripción',
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'BAS_MARCA',
      headerName: 'Marca',
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'BAS_MODELO',
      headerName: 'Modelo',
      autoHeight: true,
      wrapText: true,
    },
    {
      field: 'BAS_SERIE',
      headerName: 'Serie',
      autoHeight: true,
      wrapText: true,
    },
    { field: 'ACTIVA', headerName: 'Activa', autoHeight: true, wrapText: true },
    {
      field: 'BAS_ENDPOINT',
      headerName: 'Enpoint',
      autoHeight: true,
      wrapText: true,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true, // Habilitar filtros individuales en las columnas
    sortable: true, // Habilitar ordenamiento
  };

  rowData: Bascula[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getBasculas(); // Obtener datos al inicializar el componente
  }

  getBasculas(): void {
    this.dataService.getBasculas('C').subscribe(
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
}
