import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-bill-payment',
  templateUrl: './vendor-bill-payment.component.html'
})
export class VendorBillPaymentComponent implements OnInit {
  tabName: any;
  selectedTabIndex = 0; // Initialize with the default tab index
  breadscrums = [
    {
      title: "Vendor Bill Payment",
      items: ["Home"],
      active: "Vendor Bill Payment"
    }
  ]
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  menuDetail = [
    {
      "id": "VendorBills",
      "label": "Tab 1",
    },
    {
      "id": "OnlinePaymentApproval",
      "label": "Tab 2",
    },
  ]
  @ViewChild('myTabGroup') tabGroup!: MatTabGroup;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  onTabChange(event) {
    this.tabName = event.tab.textLabel;
  }

  GetSelectedIndex(event) {
    this.selectedTabIndex

  }
  ngAfterViewInit(): void {

    this.activeRoute.queryParams.subscribe(params => {
      const selectedTabName = params['tab'];
      if (selectedTabName) {
        // Convert the QueryList to an array
        const tabsArray = this.tabGroup._tabs.toArray();
        // Find the index of the tab with the matching text label
        const index = tabsArray.findIndex(tab => tab.textLabel === selectedTabName);
        if (index !== -1) {
          // Set the selectedIndex of the TabGroup
          this.tabGroup.selectedIndex = index;
        }
        if (selectedTabName == "0") {
          this.tabGroup.selectedIndex = 0;
        }
      }
    });
  }
}