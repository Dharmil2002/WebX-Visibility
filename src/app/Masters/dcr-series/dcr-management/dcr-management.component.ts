import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-dcr-management',
  templateUrl: './dcr-management.component.html',
})
export class DcrManagementComponent implements OnInit {

  breadscrums = [
    {
      title: "DCR Management",
      items: ["Master"],
      active: "DCR Management"
    }
  ]
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  GetSelectedIndex(Index: number) {
    this.myTabGroup.selectedIndex = Index;
  }
  constructor() { }

  ngOnInit(): void {
    this.GetSelectedIndex(1)
  }

  onTabChange(event) {
    // this.tabName = event.tab.textLabel;
  }
}
