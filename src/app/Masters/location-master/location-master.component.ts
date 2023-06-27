import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
})
export class LocationMasterComponent implements OnInit {
  jsonUrl = '../../../assets/data/masters-data.json'
  data: [] | any;
  csv: any[];
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["ActiveFlag"]
  linkArray = []

  columnHeader = {
      "SrNo": "Sr No",
      'LocationCode': 'Location Code',
      'LocationName': 'Location Name',
      'LocationAddress': 'Location Address',
      'ReportingLocation': 'Reporting Location',
      "ActiveFlag": "Active Status",
      "actions": "Actions"
  };
  headerForCsv = {
    "SrNo": "Sr No",
    'LocationCode': 'Location Code',
    'LocationName': 'Location Name',
    'LocationAddress': 'Location Address',
    'ReportingLocation': 'Reporting Location',
    "ActiveFlag": "Active Status"
  }

  breadscrums = [
      {
        title: "Location Master",
        items: ["Home"],
        active: "Location Master",
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
      this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
  }
  ngOnInit(): void {
      //throw new Error("Method not implemented.");
      this.GetLocationDetails();
  }

  GetLocationDetails() {
      //throw new Error("Method not implemented."); CityData
      // Fetch data from the JSON endpoint
      this.http.get(this.jsonUrl).subscribe((res: any) => {
          this.data = res;
          this.csv = this.data['LocationData']
          // Extract relevant data arrays from the response
          //const tableArray = this.data['tabledata'];
          this.tableload = false;
      }
      );
  }
}