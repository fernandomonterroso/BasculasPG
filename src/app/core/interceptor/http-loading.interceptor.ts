import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  constructor(private _GlobalService: GlobalService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //return next.handle(request);
  //}

  //this.loadingDialogService.openDialog();  
  this._GlobalService.showLoad();
 
    
  return next.handle(request).pipe(
    finalize(() => {
      //this.loadingDialogService.hideDialog();
      this._GlobalService.hideLoad();
      //console.log("adios");
    })
  ) as Observable<HttpEvent<any>>;
  /*
  if (!this.countRequest) {
    //this.idMessage = this.message.loading('Cargando...', { nzDuration: 0 }).messageId;
    console.log("hola",this.countRequest);
    
  }
  this.countRequest++;
  return next.handle(request)
    .pipe(
      finalize(() => {
        this.countRequest--;
        if (!this.countRequest) {
          console.log("adios",this.countRequest);
          //this.message.remove(this.idMessage);
        }
      })
    );
    */
  }
}
