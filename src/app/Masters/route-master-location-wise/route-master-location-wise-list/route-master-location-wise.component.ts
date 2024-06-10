import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-route-master-location-wise",
  templateUrl: "./route-master-location-wise.component.html",
})
export class RouteMasterLocationWiseComponent implements OnInit {
  data: [] | any;
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  columnHeader = {
    eNTDT: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "max-width:130px",
    },
    routeMode: {
      Title: "Route Mode",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    routeId: {
      Title: "Route Code",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    routeName: {
      Title: "Route Name",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    routeCat: {
      Title: "Route Category",
      class: "matcolumnleft",
      Style: "max-width:300px",
    },
    isActive: {
      type: "Activetoggle",
      Title: "Active Flag",
      class: "matcolumnleft",
      Style: "max-width:100px",
      functionName: "isActiveFuntion",
    },
    actions: {
      Title: "Actions",
      class: "matcolumnleft",
      Style: "max-width:100px",
    },
  };

  headerForCsv = {
    // "srNo": "Sr No",
    routeMode: "Route Mode",
    routeId: "Route Code",
    routeName: "Route Name",
    routeCat: "Route Category",
    isActive: "Active Flag",

  };
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
    csv: true,
  };
  staticField = ["eNTDT", "routeMode", "routeId", "routeName", "routeCat"];
  addAndEditPath: string;
  csvFileName: string;
  constructor(
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.addAndEditPath = "/Masters/RouteLocationWise/RouteAdd";
    this.csvFileName = "Route Master Location Details"; //setting csv file Name so file will be saved as per this name
  }
  ngOnInit(): void {
    this.getRouteDetails();
  }

  getRouteDetails() {
    let req = {
      companyCode: this.storage.companyCode,
      filter: {companyCode: this.storage.companyCode},
      collectionName: "routeMasterLocWise",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        console.log(res);

        if (res) {
          this.csv = res.data.map((x) => {
            x.eNTDT = formatDocketDate(x.eNTDT);
            return x;
          });
          this.tableLoad = false;
        }
      },
    });
  }
  async isActiveFuntion(det) {
    let id = det.data._id;
    // Remove the "id" field from the form controls
    delete det.data._id;
    // delete det.srNo;
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "routeMasterLocWise",
      filter: { _id: id },
      update: { isActive: det.data.isActive },
    };
    let reqTrip = {
      companyCode: this.storage.companyCode,
      collectionName: "trip_Route_Schedule",
      filter: { rUTCD: id },
      update: { iSACT: det.data.isActive },
    };
    const res = await firstValueFrom(
      this.masterService.masterPut("generic/update", req)
    );
    await firstValueFrom(
      this.masterService.masterPut("generic/update", reqTrip)
    );
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
  

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
