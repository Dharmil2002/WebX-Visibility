import { Component, OnInit } from '@angular/core';
import { formatDocketDate } from 'src/app/Utility/commonFunction/arrayCommonFunction/uniqArray';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

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
    // "srNo": "Sr No",
    "eNTDT": 'Created Date',
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCat': 'Route Category',
    "isActive": "Active Flag",
    "actions": "Actions"
  };
  headerForCsv = {
    // "srNo": "Sr No",
    'routeMode': 'Route Mode',
    'routeId': 'Route Code',
    'routeName': 'Route Name',
    'routeCat': 'Route Category',
    "isActive": "Active Flag"
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
    };
    this.masterService.masterPost('generic/get', req).subscribe({
        next: (res: any) => {
            if (res) {
                this.csv = res.data.map((x)=>{x.eNTDT=formatDocketDate(x.eNTDT); return x} );;
                this.tableLoad = false;
            }
        }
    });
}

  async isActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    // delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "routeMasterLocWise",
      filter: { _id: id },
      update: det
    };
    const res = await this.masterService.masterPut("generic/update", req).toPromise()
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getRouteDetails();
    }
  }

}