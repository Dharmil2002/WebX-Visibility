import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuAccessService } from 'src/app/core/service/menu-access/menu-access.service';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('myTabGroup') tabGroup!: MatTabGroup;
  mode: string = localStorage.getItem("Mode");
  breadscrums = [
    {
      title: "Network Logistics Management",
      items: ["Home"],
      active: "Network Logistics Management"
    }
  ]
  selectedTabIndex = 0; // Initialize with the default tab index
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  detailtab: number;
  menuDetail = [
    {
      "id": "dashboardcount",
      "label": "Tab 1",
      "permission": ["LTL"]
    },
    {
      "id": "DocketStock",
      "label": "Tab 2",
      "permission": ["LTL"]
    },
    {
      "id": "Arrivals",
      "label": "Tab 3",
      "permission": ["LTL"]
    },
    {
      "id": "Departures",
      "label": "Tab 4",
      "permission": ["LTL"]
    }, {
      "id": "Delivery",
      "label": "Tab 5",
      "permission": ["LTL"]
    }, {
      "id": "POD",
      "label": "Tab 6",
      "permission": ["LTL"]
    }, {
      "id": "PRQ",
      "label": "Tab 7",
      "permission": ["Export", "FTL", "EXIM"]
    },
    {
      "id": "docket",
      "label": "Tab 8",
      "permission": ["Export", "FTL", "EXIM"]
    },
    {
      "id": "Job",
      "label": "Tab 9",
      "permission": ["Export", "Import", "EXIM"]
    }, {
      "id": "Rake",
      "label": "Tab 10",
      "permission": ["Import", "EXIM"]
    }, {
      "id": "Tracker",
      "label": "Tab 11",
      "permission": ["Export", "Import", "EXIM"]
    },
    {
      "id": "pending",
      "label": "Tab 12",
      "permission": ["Billing​"]
    },
    {
      "id": "invoiceBilling",
      "label": "Tab 13",
      "permission": ["Billing​"]
    },
    {
      "id": "invoiceBilling",
      "label": "Tab 14",
      "permission": ["Billing​"]
    },
    {
      "id": "THC",
      "label": "Tab 15",
      "permission": ["Export", "FTL", "EXIM"]
    },
    {
      "id": "THCUpdate",
      "label": "Tab 16",
      "permission": ["Export", "FTL", "EXIM"]
    },
    {
      "id": "Voucher",
      "label": "Tab 17",
      "permission": ['Accounts']
    },
    {
      "id": "BankReconciliation",
      "label": "Tab 18",
      "permission": ['Accounts']
    },
     {
      "id": "TDSReconciliation",
      "label": "Tab 18",
      "permission": ['Accounts']
    },
    {
      "id": "Analytics",
      "label": "Tab 19",
      "permission": ['Accounts']
    },
  ];
  tabName: any;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private Route: Router,
    private _menuAccessService: MenuAccessService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {

    }
  }

  ngOnInit() {

  }
  hasPermission(id: string): boolean {
    return this._menuAccessService.hasPermission(id, this.menuDetail, this.mode);
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef?.detectChanges();
  }

  GetSelectedIndex(event) {
    this.selectedTabIndex
    // if (Index == 2) {

    // }
    // this.myTabGroup.selectedIndex = Index;
  }
  onTabChange(event) {
    this.tabName = event.tab.textLabel;
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
