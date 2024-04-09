import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import * as StorageService from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-pickup-delivery-planner',
  templateUrl: './pickup-delivery-planner.component.html',
})
export class PickupDeliveryPlannerComponent implements AfterViewInit {

  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  GetSelectedIndex(Index: number) {
    this.myTabGroup.selectedIndex = Index;
  }

  // After the view is initialized, set the initial tab based on stored index
  ngAfterViewInit(): void {
    // Get the stored index from localStorage and parse it as a number
    const storedIndex = + StorageService.getItem('deliveryMRIndex');

    // Remove the stored index from localStorage
    localStorage.removeItem('deliveryMRIndex');

    // Determine the selected index based on the stored index or default to 0 if NaN
    const selectedIndex = isNaN(storedIndex) ? 0 : storedIndex;

    // Set the selected tab index
    this.GetSelectedIndex(selectedIndex);
  }
}
