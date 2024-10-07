import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ApiResponse, Bascula } from '../interfaces/globales.interface';
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
      .get<ApiResponse<Bascula[]>>(`${this.endpointApi}/Data/getBasculasByBod?bodega_value=${bascula}`, { headers })
      .pipe(
        map((response: ApiResponse<Bascula[]>) => {
          if (response.success) {
            return response.data;  // Retorna las básculas desde data si success es true
          } else {
            throw new Error(response.message);  // Lanza un error con el mensaje si success es false
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.message || 'Error del servidor'));
        })
      );
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${this.endpointApi}getUsuario`);
  }

  getKeysGuia(guia: string, bodega: string): Observable<any> {
    const url = `${this.endpointApi}/Data/getKeysGuia?guia=${guia}&bodega=${bodega}`;
    return this.http.get<any>(url);
  }

  checkBascula(endpoint: string): Observable<any> {
    return this.http.get<any>(endpoint);
  }

  getPeso(endpoint: string): Observable<any> {
    return this.http.get<any>(endpoint);
  }

}
