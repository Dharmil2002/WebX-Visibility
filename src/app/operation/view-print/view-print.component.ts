import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
  Close(): void {
    window.history.back();
  }

}
