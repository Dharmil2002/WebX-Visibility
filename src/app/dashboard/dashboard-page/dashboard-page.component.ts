import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {

  breadscrums = [
    {
      title: "Dashboard",
      items: ["dashboard"],
      active: "Dashboard"
    }
  ]
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  constructor(private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit() {
   
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  GetSelectedIndex(Index: number) {
    this.myTabGroup.selectedIndex = Index;
  }
}
