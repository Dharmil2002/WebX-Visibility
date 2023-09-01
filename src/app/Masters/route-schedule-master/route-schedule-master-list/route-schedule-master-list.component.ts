import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { RouteScheduleDetComponent } from "../route-schedule-det/route-schedule-det.component";
@Component({
  selector: 'app-route-schedule-master-list',
  templateUrl: './route-schedule-master-list.component.html'
})
export class RouteScheduleMasterListComponent implements OnInit {
  data: [] | any;
  csv: any[];
  csvFileName: string;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  // Define column headers for the table
  columnHeader =
    {
      "srNo": "Sr No.",
      "scheduleCode": "Schedule No",
      "routeName": "Route",
      "applyDate": "Apply From",
      "entryBy": "Entry By",
      "scheduleType": "Schedule Type",
      "actions": "Actions",
    }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "srNo": "Sr No.",
    "routeName": "Route",
    "scheduleCode": "Schedule No",
    "applyDate": "Apply From",
    "entryBy": "Entry By",
    "scheduleType": "Schedule Type",
    "actions": "Actions",
  }
  //#endregion 
  datePipe: DatePipe = new DatePipe("en-US");
  breadScrums = [
    {
      title: "Route Schedule Master",
      items: ["Master"],
      active: "Route Schedule Master",
    }
  ];
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  toggleArray = [""];
  /*Below is Link Array it will Used When We Want a DrillDown
    Table it's Jst for set A Hyper Link on same You jst add row Name Which You
    want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'scheduleCode' }
  ];
  menuItems = [{ label: 'scheduleCode', componentDetails: RouteScheduleDetComponent }];
  addAndEditPath: string;
  viewComponent: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/RouteScheduleMaster/AddRouteScheduleMaster";//setting Path to add data
  }
  ngOnInit(): void {
    this.getRouteScheduleDetails();
    this.csvFileName = "Route Schedule Details"  //setting csv file Name so file will be saved as per this name
  }

  getRouteScheduleDetails() {
    let req = {
      "companyCode": this.companyCode,
      filter: {},
      "collectionName": "route_schedule_details"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.csv = res.data.map((obj, index) => {
            obj['srNo'] = index + 1
            obj['routeName'] = obj.routeName + ' - ' + obj.routeId;
            return obj;
          })
          this.tableLoad = false;
        }
      }
    })
  }
} 
