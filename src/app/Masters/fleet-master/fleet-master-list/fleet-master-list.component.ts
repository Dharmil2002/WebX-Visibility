import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-fleet-master-list",
  templateUrl: "./fleet-master-list.component.html",
})
export class FleetMasterListComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  tableLoad = true; // flag , indicates if data is still loading or not , used to show loading animation
  toggleArray = ["activeFlag"];
  linkArray = [];
  addAndEditPath: string;
  csvFileName: string;
  csv: any;
  tableData: any;

  breadScrums = [
    {
      title: "Fleet Master",
      items: ["Master"],
      active: "Fleet Master",
    },
  ];

  dynamicControls = {
    add: true,
    edit: true,
    csv: true,
  };

  columnHeader = {
    srNo: "Sr No",
    vehicleNo: "Vehicle No",
    vehicleType: "Vehicle Type",
    insuranceExpiryDate: "Insurance Expiry Date",
    fitnessValidityDate: "Fitness Validity Date",
    activeFlag: "Active Status",
    actions: "Action",
  };

  headerForCsv = {
    vehicleNo: "Vehicle No",
    vehicleType: "Vehicle Type",
    insuranceExpiryDate: "Insurance Expiry Date",
    fitnessValidityDate: "Fitness Validity Date",
    activeFlag: "Active Status",
  };

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.csvFileName = "Fleet Details";
    this.addAndEditPath = "/Masters/FleetMaster/AddFleetMaster";
    this.getFleetDetails();
  }

  //#region Get Data of Fleet
  getFleetDetails() {
    let req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "fleet_master",
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const dataWithSrno = res.data.map((obj, index) => {
            return {
              ...obj,
              srNo: index + 1,
            };
          });
          this.csv = dataWithSrno;
          this.tableData = dataWithSrno;
          this.tableLoad = false;
        }
      },
    });
  }
  //#endregion

  async IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      collectionName: "fleet_master",
      filter: {
        _id: id,
      },
      update: det,
    };
    const res = await this.masterService
      .masterPut("generic/update", req)
      .toPromise();
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getFleetDetails();
    }
  }
}
