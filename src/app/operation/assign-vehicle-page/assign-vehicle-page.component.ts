import { Component, OnInit } from '@angular/core';

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
    currentLoc: {
      Title: "Current Location",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    distance: {
      Title: "Distance",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    ftlType: {
      Title: "FTL Type",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    Action: {
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
    "currentLoc",
    "distance",
    "ftlType",
  ];
  constructor() {
  }

  ngOnInit(): void {
    this.getPrqDetails();
  }
  getPrqDetails() {
    this.tableLoad = false;
  }
}
