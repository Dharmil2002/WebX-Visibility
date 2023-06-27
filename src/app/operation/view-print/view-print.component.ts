import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GenericTableComponent } from '../../shared-components/Generic Table/generic-table.component';

@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {

  constructor(private Route: Router,public dialogRef: MatDialogRef<GenericTableComponent>) { 
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `View Print is in under development!`,//
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dialogRef.close();
        // Call your function here 
        
      }
    });
  }

  ngOnInit(): void {

  }
  Close(): void {
    window.history.back();
  }
  goBack(tabIndex: number): void {
  }
}
