import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class utilityService {
  constructor(private snackBar: MatSnackBar) {}
  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: [className],
    });
  }
  showSnackbarCssStyles(content, action, duration) {
    let sb = this.snackBar.open(content, action, {
      duration: duration,
      panelClass: ['custom-style'],
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }
  getDiffDays(startDate, endDate) {
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
  }
}
