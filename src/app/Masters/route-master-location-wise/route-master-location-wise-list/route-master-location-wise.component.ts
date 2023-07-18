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
  toggleArray = ["active"]
  linkArray = []
  columnHeader = {
    "srNo": "Sr No",
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCategory': 'Route Category',
    "active": "Active Flag",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCategory': 'Route Category',
    "active": "Active Flag"
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
    csv: true
  }
  addAndEditPath: string;
  csvFileName: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/RouteLocationWise/RouteAdd";
    this.csvFileName = "Route Master Location Details"  //setting csv file Name so file will be saved as per this name
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