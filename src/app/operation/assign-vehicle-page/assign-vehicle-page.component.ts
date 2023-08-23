import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-assign-vehicle-page',
  templateUrl: './assign-vehicle-page.component.html'
})
export class AssignVehiclePageComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
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

  columnHeader = {
    vehicleNo: {
      Title: "Vehicle No",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    currentLocation: {
      Title: "Current Location",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    distance: {
      Title: "Distance (KMs)",
      class: "matcolumncenter",
      Style: "min-width:40px",
    },
    vehicleSize: {
      Title: "Vehicle Size (MTs)",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  //#endregion
  staticField = [
    "vehicleNo",
    "fromCity",
    "toCity",
    "currentLocation",
    "distance",
    "vehicleSize"
  ];
  linkArray = [
    { Row: 'action' }
  ];
  menuItems = [{ label: 'action', componentDetails: "" }];
  tableData: any;
  constructor(private masterService: MasterService) {
  }

  ngOnInit(): void {
    this.getPrqDetails();
  }
  getPrqDetails() {
    this.masterService.getJsonFileDetails("masterUrl").subscribe((res) => {
      if (res) {
        this.tableData = res.assignVehicle
        this.tableLoad = false;
      }
    });
  }
}
