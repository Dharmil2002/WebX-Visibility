import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-pickup-delivery-planner',
  templateUrl:'./pickup-delivery-planner.component.html',
})
export class PickupDeliveryPlannerComponent implements OnInit {
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  GetSelectedIndex(Index: number) {
    this.myTabGroup.selectedIndex = Index;
  }
  ngOnInit() {
      this.GetSelectedIndex(1)
  }
}
