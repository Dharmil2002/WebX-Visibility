import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delivery-mr-other-details',
  templateUrl: './delivery-mr-other-details.component.html'
})
export class DeliveryMrOtherDetailsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeliveryMrOtherDetailsComponent>,) { }

  ngOnInit(): void {
  }
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
}
