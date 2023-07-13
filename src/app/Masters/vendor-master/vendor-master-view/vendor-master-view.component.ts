import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-master-view',
  templateUrl: './vendor-master-view.component.html'
})
export class VendorMasterViewComponent {
  vendorData: any;
  vendordet: any;

  constructor(public dialogRef: MatDialogRef<VendorMasterViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.vendordet = data;
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
  //#endregion
}
