import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: any = null;
  endpointApi: any = environment.enpointApi;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.user = this.getUser();
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getUser(): any | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getBasculas(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(this.endpointApi + 'getBasculas/', { headers: headers }).pipe(
      catchError(this.error)
    );
  }

  async authGafete(gafete: string) {
    const body = { gafete };  // El objeto que envías en la solicitud, como en el comando curl
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    try {
      const response = await this.http.post<any>(this.endpointApi + '/General/authGafete', body, { headers }).toPromise();
      if (!response.success) {
        console.log("errror inicinaod sesion");
        
        this.toastr.error(response.message);
      } else {
        // Guardar el token en sessionStorage
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.data));
        // Guardar el usuario actual
        this.user = response.data.data;

        // Navegar al dashboard después de iniciar sesión
        this.router.navigate(['/pesaje']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  }

  // Método para verificar si el token está presente en sessionStorage
  getProfile(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // Aquí podrías hacer una solicitud al backend para obtener el perfil del usuario
      return true;
    } else {
      this.logout();
      return false;
    }
  }
  
  // Método para cerrar sesión
  logout() {
    sessionStorage.removeItem('authToken');
    this.user = null;
    this.router.navigate(['/login']);
  }


  error(error: HttpErrorResponse) {
    //console.log("ss",error.error.error);
    let errorMessage = '';
    if (error.error.error) {
      errorMessage = error.error.error;
    } else if (error.error.message) {
      errorMessage = error.error.message;
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(errorMessage);
  }
}