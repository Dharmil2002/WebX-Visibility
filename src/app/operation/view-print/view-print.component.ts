import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {

  constructor() { 
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `View Print is in under development!`,//
      showConfirmButton: true,
    })
  }

  ngOnInit(): void {

  }
  Close(): void {
    window.history.back();
  }

}
