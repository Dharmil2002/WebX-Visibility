import { Component, ViewChild, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import {  Router } from "@angular/router";
@Component({
  selector: 'app-job-order-main-page',
  templateUrl: './job-order-main-page.component.html',
})
export class JobOrderMainPageComponent implements OnInit {
  tabName: any;
  selectedTabIndex = 0;
  @ViewChild("myTabGroup") tabGroup!: MatTabGroup;
  breadscrums = [
    {
      title: "Job Order",
      items: ["operations"],
      active: "Job Order",
    },
  ];
  menuDetail = [
    {
      id: "JobOrders",
      label: "Tab 1",
    },
    {
      id: "WorkOrders",
      label: "Tab 2",
    },
    {
      id: "VendorBills",
      label: "Tab 3",
    },
    {
      id: "JobTracker",
      label: "Tab 4",
    },
  ];
  constructor(private Route: Router,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
    }
  }
  ngOnInit(): void {
  }
  GetSelectedIndex(event) {
    this.selectedTabIndex=event;
  }
  onTabChange(event) {
    this.tabName = event.tab.textLabel;
  }
}
