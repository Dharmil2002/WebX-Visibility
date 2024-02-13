import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consingment-summary',
  templateUrl: './consingment-summary.component.html'
})
export class ConsingmentSummaryComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note Summary Tracking ",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
