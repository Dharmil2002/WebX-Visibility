import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-vendor-tabs-index',
  templateUrl: './vendor-tabs-index.component.html'
})
export class VendorTabsIndexComponent implements AfterViewInit{
  // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  selectedTabIndex = 0;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //this.basicInfo;
    
  }
}
