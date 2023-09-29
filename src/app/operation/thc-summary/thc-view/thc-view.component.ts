import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-thc-view',
  templateUrl: './thc-view.component.html'
})
export class ThcViewComponent implements OnInit {
  docketDetail: any;

  constructor(public dialogRef: MatDialogRef<ThcViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
       this.docketDetail=data;
     }

  ngOnInit(): void {
  }
  //#region to print 
  printPage() {
    var printContents = document.getElementById('printableArea').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }
  //#endregion
  //#region  to close the popup
  close() {
    this.dialogRef.close();
  }
}
