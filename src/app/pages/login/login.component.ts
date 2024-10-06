import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  gafete: string = '';


  constructor(
    private userService: UserService,
) { }

  // Método para convertir el valor a mayúsculas
  convertToUppercase() {
    this.gafete = this.gafete.toUpperCase();
  }

  // Método de envío
  async aprobacion() {
    // Lógica para manejar el envío del formulario
    console.log('Gafete ingresado:', this.gafete);
    await this.userService.authGafete(this.gafete)
  }
}