import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LoaderService } from './core/interceptor/loader.service';
import { Subject } from 'rxjs';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgbDatepickerModule, NavbarComponent,LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading$!: Subject<boolean>;

  constructor(
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {this.isLoading$ = this.loaderService.isLoading$;});
    //this.isLoading$ = this._GlobalService.isLoading$;
    //this.changeDetectorRef.detectChanges();
  }

}
