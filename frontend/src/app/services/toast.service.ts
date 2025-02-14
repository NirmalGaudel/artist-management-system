import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Ok', {
      duration,
      panelClass: 'toast-success',
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  error(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'Ok', {
      duration,
      panelClass: 'toast-error',
      verticalPosition: 'top',
      horizontalPosition: 'center',
      politeness: 'assertive'
    });
  }
}
