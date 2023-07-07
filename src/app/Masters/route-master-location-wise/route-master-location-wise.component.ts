import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-route-master-location-wise',
  templateUrl: './route-master-location-wise.component.html'
})
export class RouteMasterLocationWiseComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["isActive"]
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    'cityName': 'City Name',
    'stateName': 'State',
    'zoneName': 'Zone',
    'odaFlag': 'ODA Flag',
    "isActive": "Active Flag",
    "actions": "Actions"
  };
  headerForCsv = {
    'cityId': "City Code",
    'companyCode': "CompanyCode",
    'cityName': "City Name",
    'stateName': "State Name",
    'zoneName': "Zone Name",
    'isActive': "IsActive",
  }
  breadScrums = [
    {
      title: "Route Location Wise Master",
      items: ["Masters"],
      active: "Route Location Wise Master",
    },
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: false
  }
  addAndEditPath: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/CityMaster/AddCity";
  }
  ngOnInit(): void {
    this.getRouteDetails();
  }
  getRouteDetails() {
    // Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.data = res;
      this.csv = this.data['routeLocationData']
      this.tableLoad = false;
    }
    );
  }
}