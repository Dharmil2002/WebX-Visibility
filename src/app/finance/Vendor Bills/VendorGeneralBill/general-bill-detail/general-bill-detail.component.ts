import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-bill-detail',
  templateUrl: './general-bill-detail.component.html',
})
export class GeneralBillDetailComponent implements OnInit {
  breadScrums = [
    {
      title: "Vendor Bill Generation",
      items: ["Home"],
      active: "Vendor Bill Generation",
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
