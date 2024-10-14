import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLoading$ = new Subject<boolean>();

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }


  showLoad():void{
    this.isLoading$.next(true);
  };

  hideLoad():void{
    this.isLoading$.next(false);
  };


}
