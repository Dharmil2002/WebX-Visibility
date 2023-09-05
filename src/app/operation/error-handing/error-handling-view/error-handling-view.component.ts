import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-handling-view',
  templateUrl: './error-handling-view.component.html'
})
export class ErrorHandlingViewComponent implements OnInit {
  outBoxData: any;
  showDetails = false;
  constructor(public dialogRef: MatDialogRef<ErrorHandlingViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.outBoxData=data
     }

  ngOnInit(): void {
  }
  toggleRequestDetails() {
    this.showDetails = !this.showDetails;
  }
  close() {
    this.dialogRef.close();
  }
}
