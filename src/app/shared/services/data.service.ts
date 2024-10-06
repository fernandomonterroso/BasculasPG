import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Bascula } from '../models/bascula.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  endpointApi: any = environment.enpointApi;
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
  }

  getBasculas(bascula: string): Observable<Bascula[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.http
      .get<{ success: boolean; message: string; data: Bascula[] }>(`${this.endpointApi}/Data/getBasculasByBod?bodega_value=${bascula}`, { headers })
      .pipe(
        map((response: { success: boolean; message: string; data: Bascula[] }) => {
          if (response.success) {
            return response.data;  // Retorna las básculas desde data si success es true
          } else {
            throw new Error(response.message);  // Lanza un error con el mensaje si success es false
          }
        }),
        catchError(error => {
          console.error('Error en la solicitud de básculas:', error);
          return throwError(() => new Error(error.message || 'Error del servidor'));
        })
      );
  }
}
