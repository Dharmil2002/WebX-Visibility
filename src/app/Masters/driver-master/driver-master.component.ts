import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-driver-master',
  templateUrl: './driver-master.component.html',
})
export class DriverMasterComponent implements OnInit {
  jsonUrl = '../../../assets/data/masters-data.json'
  data: [] | any;
  csv: any[];
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
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

  breadscrums = [
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
  constructor(private http: HttpClient){
      this.addAndEditPath = "/Masters/DriverMaster/AddDriverMaster";
  }
  ngOnInit(): void {
      //throw new Error("Method not implemented.");
      this.GetDriverDetails();
  }

  GetDriverDetails() {
      //throw new Error("Method not implemented."); CityData
      // Fetch data from the JSON endpoint
      this.http.get(this.jsonUrl).subscribe((res: any) => {
          this.data = res;
          this.csv = this.data['DriverData']
          // Extract relevant data arrays from the response
          //const tableArray = this.data['tabledata'];
          this.tableload = false;
      }
      );
  }
}