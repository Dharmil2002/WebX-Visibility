import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-index',
  templateUrl: './vendor-index.component.html' 
})
export class VendorIndexComponent implements OnInit {
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Vendor Contract",
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
