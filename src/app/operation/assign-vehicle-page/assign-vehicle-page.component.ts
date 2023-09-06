import { Component, HostListener, OnInit } from '@angular/core';
import { ViewPrintComponent } from '../view-print/view-print.component';
import { getVehicleStatusFromApi, AssignVehiclePageMethods } from './assgine-vehicle-utility';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { Router } from '@angular/router';
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';
import { RetryAndDownloadService } from 'src/app/core/service/api-tracking-service/retry-and-download.service';
@Component({
  selector: 'app-assign-vehicle-page',
  templateUrl: './assign-vehicle-page.component.html'
})
export class AssignVehiclePageComponent implements OnInit {
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branchCode = localStorage.getItem("Branch");
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation

  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  breadScrums = [
    {
      title: "Available Vehicle for Assignment",
      items: ["Home"],
      active: "Vehicle Assign",
    },
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = this._assignVehiclePageMethods.columnHeader[0];
  staticField = Object.keys(this.columnHeader)

  linkArray = [
    { Row: 'action' }
  ];
  menuItems = [{ label: 'action', componentDetails: ViewPrintComponent }];
  tableData: any;
  NavData: any;
  constructor(private Route: Router, private _operationService: OperationService, private _assignVehiclePageMethods: AssignVehiclePageMethods,
    private failedApiService: FailedApiServiceService,
    private retryAndDownloadService: RetryAndDownloadService,
    ) {
    this.staticField.pop()
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.NavData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
  }
  ngOnInit(): void {
    this.fetchAvailabelVehicles();
  }
  async fetchAvailabelVehicles() {
    try {
      const vehicleStatusData = await getVehicleStatusFromApi(this.companyCode, this._operationService);
      const [fromCity, ToCity] = this.NavData.fromToCity.split('-');
      this.tableData = vehicleStatusData.map(item => ({ ...item, action: 'Assign', fromCity: fromCity, toCity: ToCity, distance: 0 }));
      this.tableLoad = false;
    } catch (error) {
      // Handle API call errors here
      console.error('Error fetching vehicle status:', error);
      // You can also set an error state or display a relevant message to the user
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    this.dowloadData();
    // Your custom message
    const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';
    // Set the custom message
    $event.returnValue = confirmationMessage;

  }
  dowloadData() {
    const failedRequests = this.failedApiService.getFailedRequests();
    if (failedRequests.length > 0) {
      this.retryAndDownloadService.downloadFailedRequests();
    }
  }
}
