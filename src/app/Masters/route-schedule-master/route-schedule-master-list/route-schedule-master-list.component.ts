import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
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
      "routeName": "Route",
      "scheduleCode": "Schedule No",
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
  toggleArray = ["isActive"]
  linkArray = []
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
      "type": "masters",
      "collection": "route_schedule_details"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.csv = res.data.map((obj, index) => {
            obj['srNo'] = index + 1
            obj['routeName'] = obj.routeName + ' - ' + obj.routeId;
            obj['applyDate'] = this.datePipe.transform(obj.applyDate, "dd/MM/yyyy");
            return obj;
          })
          this.tableLoad = false;
        }
      }
    })
  }
  IsActiveFuntion(det) {
    let id = det.id;
    // Remove the "id" field from the form controls
    delete det.id;
    //delete det.srNo;
    delete det.activeflag;
    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "routeSchedule",
      id: id,
      updates: det
    };

    // this.masterService.masterPut('common/update', req).subscribe({
    //     next: (res: any) => {
    //         if (res) {
    //             // Display success message
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Successful",
    //                 text: res.message,
    //                 showConfirmButton: true,
    //             });
    //         }
    //     }
    // });
  }
} 
