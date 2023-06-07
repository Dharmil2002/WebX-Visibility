import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-pickup-delivery-planner',
  templateUrl: './pickup-delivery-planner.component.html',
})
export class PickupDeliveryPlannerComponent implements OnInit {
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
    setTimeout(() => {
      this.GetSelectedIndex(0)
    }, 0);
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  GetSelectedIndex(Index: number) {
    this.myTabGroup.selectedIndex = Index;
  }
}