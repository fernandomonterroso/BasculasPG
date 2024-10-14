import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  isLoading$ = new Subject<boolean>();

  showLoad(): void {
    console.log("qqiewee");
    
    this.isLoading$.next(true);

    //console.log(this.isLoading$);
  }

  hideLoad(): void {
    console.log("qqiewee");
    this.isLoading$.next(false);
  }
}
