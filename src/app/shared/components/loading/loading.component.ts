import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalService } from '../../../core/interceptor/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements AfterViewInit {
  isLoading$!: Subject<boolean>; // El Subject que contiene el estado de carga

  constructor(private _GlobalService: GlobalService) {}

  ngAfterViewInit() {
    this.isLoading$ = this._GlobalService.isLoading$;
  }
}
