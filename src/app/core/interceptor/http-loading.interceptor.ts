import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private globalService: GlobalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests++ === 0 && this.globalService.showLoad(); // Mostrar cargando si es la primera solicitud
    return next.handle(request).pipe(
      finalize(() => --this.activeRequests === 0 && this.globalService.hideLoad()) // Ocultar cargando si no hay solicitudes activas
    );
  }
}
