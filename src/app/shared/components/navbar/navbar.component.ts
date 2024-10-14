import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importa RouterModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] // Asegúrate de que sea styleUrls
})
export class NavbarComponent implements OnInit {
  currentRoute: string;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    router.events.subscribe(() => {
      if (this.router.url !== this.currentRoute) {
        this.currentRoute = this.router.url;
      }
    });
  }

  public option = 0;

  ngOnInit(): void {
    this.checkInactivity();  // Comienza a monitorear la inactividad
  }

  collapsed = true;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    sessionStorage.clear(); // Limpiar el sessionStorage por completo
    window.location.href = '/login'; // Redirigir a login
  }

  // Monitorear la actividad del usuario (movimiento del mouse, clics y teclas)
  //@HostListener('window:mousemove')
  @HostListener('window:click')
  @HostListener('window:keydown')
  resetExpiration() {
    this.updateExpiration();
  }

  // Actualizar el tiempo de expiración (reiniciar cada vez que hay actividad)
  updateExpiration() {
    const newExpiration = Date.now() + 15 * 60 * 1000; // 15 minutos
    sessionStorage.setItem('expiration', newExpiration.toString());
  }

  // Verificar periódicamente si la sesión ha expirado
  checkInactivity() {
    setInterval(() => {
      const expiration = sessionStorage.getItem('expiration');
      if (expiration && Date.now() > parseInt(expiration)) {
        this.logout();  // Cierra sesión y redirige al login si ha expirado
      }
    }, 1000 * 60); // Comprobar cada minuto
  }
}
