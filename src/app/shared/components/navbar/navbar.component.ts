import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {}

  collapsed = true;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
