import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customer-contract-tabs-index',
  templateUrl: './customer-contract-tabs-index.component.html',
})
export class CustomerContractTabsIndexComponent implements AfterViewInit {
  // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  breadscrums = [
    {
      title: "Customer Contract",
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