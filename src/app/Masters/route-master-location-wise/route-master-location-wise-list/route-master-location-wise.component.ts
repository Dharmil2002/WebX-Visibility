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
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCat': 'Route Category',
    "isActive": "Active Flag",
    "actions": "Actions"
  };
  headerForCsv = {
    "srNo": "Sr No",
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCat': 'Route Category',
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
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "routeMasterLocWise"
    }
  
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.csv = res.data.map((obj, index) => {
            obj["srNo"] = index + 1;
  
            // Extract loccd values from GSTdetails array
            const loccdValues = obj.GSTdetails.map((gst) => gst.loccd);
  
            // Concatenate loccd values with a hyphen
            const route = loccdValues.join("-");

            // Concatenate route and GSTdetails
            obj["routeName"] = route; // You can replace 'distKm' with the actual property you want to use
  
            return obj;
          });
          this.tableLoad = false;
        }
      }
    })
  }
  
}