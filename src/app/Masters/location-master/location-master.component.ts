import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-location-master',
  templateUrl: './location-master.component.html',
})
export class LocationMasterComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []

  columnHeader = {
      "srNo": "Sr No",
      'locCode': 'Location Code',
      'locName': 'Location Name',
      'locAddress': 'Location Address',
      'reportLoc': 'Reporting Location',
      "activeFlag": "Active Status",
      "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
      'locCode': 'Location Code',
      'locName': 'Location Name',
      'locAddress': 'Location Address',
      'reportLoc': 'Reporting Location',
      "activeFlag": "Active Status",
  }

  breadScrums = [
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
  constructor(private masterService: MasterService){
  this.addAndEditPath = "/Masters/LocationMaster/AddLocationMaster";
  }
  ngOnInit(): void {
      //throw new Error("Method not implemented.");
      this.getLocationDetails();
  }
  
  getLocationDetails() {
    //throw new Error("Method not implemented."); 
    //Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {  
    this.data = res;
    this.csv = this.data['LocationData']
    //Extract relevant data arrays from the response
    //const tableArray = this.data['tabledata'];
    this.tableLoad = false;
    }
    );
  }
  
}