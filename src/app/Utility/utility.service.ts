import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class utilityService {
  constructor(private snackBar: MatSnackBar) { }
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
  //#region This function exports data in JSON format and downloads it as a file

  // @param {Object} Data - The data object to be exported.
  exportData(Data,fileName) {
    // Convert the data object to a JSON string.
    const json = JSON.stringify(Data);

    // Create a new Blob object with the JSON data and set the MIME type to 'application/json'.
    const blob = new Blob([json], { type: 'application/json' });

    // Create a URL for the Blob object.
    const url = window.URL.createObjectURL(blob);

    // Create a new anchor element.
    const a = document.createElement('a');

    // Set the URL and filename for the anchor element.
    a.href = url;
    a.download =`${fileName}.json`;

    // Simulate a click on the anchor element to initiate the download.
    a.click();

    // Revoke the URL to free up memory.
    window.URL.revokeObjectURL(url);

    // Remove the anchor element from the DOM.
    a.remove();
  }
  //#endregion
}
