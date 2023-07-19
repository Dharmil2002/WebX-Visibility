import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-airport-master-list',
  templateUrl: './airport-master-list.component.html',
})
export class AirportMasterListComponent implements OnInit {
  data: [] | any;
  companyCode: any = parseInt(localStorage.getItem("companyCode")); 
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"]
  linkArray = []
  columnHeader = {
    "srNo":"Sr No",
    "airportCode":"Aiport Code",
    "airportName": "Airport Name",
    "city": "City",
    "alternateCity":"Alternate City",
    "countryCode":"Country Code",
    "activeFlag": "Active Flag",
    "actions": "Actions"
  };
  breadScrums = [
    {
      title: "Airport Master",
      items: ["Home"],
      active: "Airport Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  tableData: any;
  constructor(private masterService: MasterService) {
  this.addAndEditPath = "/Masters/AirportMaster/AddAirportMaster";
  }
  ngOnInit(): void {
    this.getAirportDetails();
  }
  //To get List data for Airport Master
  getAirportDetails() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "airport"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1
            };
          });
          this.csv = dataWithSrno
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      }
    })
  }

}