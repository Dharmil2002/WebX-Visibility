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
    updateDate: "Created Date",
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

  constructor(private masterService: MasterService) { }

  ngOnInit(): void {
    this.csvFileName = "Fleet Details";
    this.addAndEditPath = "/Masters/FleetMaster/AddFleetMaster";
    this.getVehicleTypeName();
    this.getFleetDetails();
  }

  // #region Get Data of Fleet
  async getFleetDetails() {
    try {
      const fleetData = await this.fetchFleetData();
      if (fleetData) {
        const vehicleTypeData = await this.getVehicleTypeName();
        const modifiedData = this.processFleetData(fleetData, vehicleTypeData);
        this.updateTableData(modifiedData);
      }
    } catch (error) {
      // Handle errors
    }
  }
  // #endregion

  // #region Fetch Fleet Data
  fetchFleetData() {
    const req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "fleet_master",
    };
    return this.masterService.masterPost("generic/get", req).toPromise();
  }
  // #endregion

  // #region Process Fleet Data
  processFleetData(fleetData, vehicleTypeData) {
    return fleetData.data.map(obj => {
      const vehicleType = vehicleTypeData.find(x => x.vehicleTypeCode === obj.vehicleType);
      obj.vehicleType = vehicleType ? vehicleType.vehicleTypeName : '';
      return obj;
    }).sort((a, b) => {
      const dateA = new Date(a.updateDate).getTime(); // Convert to a number
      const dateB = new Date(b.updateDate).getTime(); // Convert to a number
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      return 0; // Handle invalid dates or NaN values
    });
  }
  // #endregion

  // #region Update Table Data
  updateTableData(sortedData) {
    this.csv = sortedData;
    this.tableData = sortedData;
    this.tableLoad = false;
  }
  // #endregion

  // #region Get Vehicle Type Name
  async getVehicleTypeName() {
    const req = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: 'vehicleType_detail',
    };
    const response = await this.masterService.masterPost('generic/get', req).toPromise();
    return response.data;
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
