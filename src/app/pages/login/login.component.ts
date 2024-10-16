import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { UserService } from '../../shared/services/user.service';
import introJs from 'intro.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  gafete: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.startTour();
  }

  // Método para convertir el valor a mayúsculas
  convertToUppercase() {
    this.gafete = this.gafete.toUpperCase();
  }

  // Método de envío
  async aprobacion() {
    // Lógica para manejar el envío del formulario
    console.log('Gafete ingresado:', this.gafete);
    await this.userService.authGafete(this.gafete);
  }


  

  startTour() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '#gafete',
          title: 'Número de Gafete',
          intro:
            'Introduce tu número de gafete aquí. Asegúrate de que esté en el formato correcto, para entrar con pruebas ingresa 00-00000.',
          position: 'bottom',
        },
        {
          element: '.btn-primary',
          title: 'Ingresar',
          intro:
            'Una vez que hayas ingresado tu número de gafete, haz clic en este botón para acceder al sistema.',
          position: 'bottom',
        },
      ],
      exitOnOverlayClick: false
    });

    intro.oncomplete(() => {
      localStorage.setItem('tourGafete', 'true');
    });

    if (!localStorage.getItem('tourGafete')) {
      intro.start();
    }
    
  }
}
