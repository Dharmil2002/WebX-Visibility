import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
})
export class DriverMasterComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["ActiveFlag"]
  linkArray = []

  columnHeader = {
      "SrNo": "Sr No",
      'ManualDriverCode': 'Driver Code',
      'DriverName': 'Driver Name',
      'LicenseNo': 'License No',
      'ValidityDate': 'Validity Date',
      "ActiveFlag": "Active Status",
      "actions": "Actions"
  };
  headerForCsv = {
    "SrNo": "Sr No",
    'ManualDriverCode': 'Driver Code',
    'DriverName': 'Driver Name',
    'LicenseNo': 'License No',
    'ValdityDate': 'Validity Date',
    "ActiveFlag": "Active Status",
  }

  breadScrums = [
      {
        title: "Driver Master",
        items: ["Home"],
        active: "Driver Master",
      },
    ];

  dynamicControls = {
      add: true,
      edit: true,
      csv: false
  }
  cityActiveFlag: any;
  addAndEditPath: string;
  constructor(private masterService: MasterService){
      this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }
  ngOnInit(): void {
      //throw new Error("Method not implemented.");
      this.getDriverDetails();
  }

  
  getDriverDetails() {
    //throw new Error("Method not implemented."); 
    //Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {  
    this.data = res;
    this.csv = this.data['DriverData']
    //Extract relevant data arrays from the response
    //const tableArray = this.data['tabledata'];
    this.tableLoad = false;
    }
    );
  }
}