import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: 'app-trip-route-master-list',
  templateUrl: './trip-route-master-list.component.html'
})
export class TripRouteMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader =
    {
      "srNo": "Sr No.",
      "tripRouteId": "Route Code",
      "routeDescription": "Route Description",
      "routeMode": "Route Mode",
      "controlLoc": "Controlling Location",
      "roundTrip": "Round Trip",
      "isActive": "Active Status",
      "actions": "Actions",
    }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "srNo": "Sr No.",
    "tripRouteId": "Route Code",
    "routeDescription": "Route Description",
    "routeMode": "Route Mode",
    "controlLoc": "Controlling Location",
    "roundTrip": "Round Trip",
    "actions": "Actions",
  }
  //#endregion 
  datePipe: DatePipe = new DatePipe("en-US");
  breadScrums = [
    {
      title: "Trip Route Master",
      items: ["Master"],
      active: "Trip Route Master",
    }
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  toggleArray = ["isActive"];
  /*Below is Link Array it will Used When We Want a DrillDown
  Table it's Jst for set A Hyper Link on same You jst add row Name Which You
  want hyper link and add Path which you want to redirect*/
  linkArray = [];
  menuItems = [];
  addAndEditPath: string;
  viewComponent: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/TripRouteMaster/TripRouteMasterAdd";//setting Path to add data
  }
  ngOnInit(): void {
    this.getRouteScheduleDetails();
    this.csvFileName = "Trip Route Details"  //setting csv file Name so file will be saved as per this name
  }

  getRouteScheduleDetails() {
    let req = {
      "companyCode": this.companyCode,
      filter: {},
      "collectionName": "trip_route_details"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.csv = res.data.map((obj, index) => {
            obj['srNo'] = index + 1
            obj['roundTrip'] = obj.roundTrip == true ? 'Y' : 'N';
            return obj;
          })
          this.tableLoad = false;
        }
      }
    })
  }
} 
