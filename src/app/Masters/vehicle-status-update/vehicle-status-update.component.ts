import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-status-update',
  templateUrl: './vehicle-status-update.component.html'
})
export class VehicleStatusUpdateComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  addAndEditPath: string;
  data: [] | any;
  uploadComponent: any;
  csvFileName: string;
  toggleArray = ["isActive"];
  linkArray = [];
  csv: any;
  tableData: any;
  
  dynamicControls = {
      add: true,
      edit: true,
      csv: true
  }
  breadScrums = [
      {
          title: "Vehicle Status",
          items: ["Master"],
          active: "Vehicle Status",
      },
  ];
  columnHeader = {
      "srNo": "Sr No",
      "vehNo": "Vehicle No",
      "status": "Status",
      "tripId": "Trip Id",
  };
  headerForCsv = {
    "srNo": "Sr No",
    "vehNo": "Vehicle No",
    "status": "Status",
    "tripId": "Trip Id",
  };
  constructor() { }

  ngOnInit(): void {
    this.getVehicleStatus();
  }
  getVehicleStatus(){
    
  }
}
