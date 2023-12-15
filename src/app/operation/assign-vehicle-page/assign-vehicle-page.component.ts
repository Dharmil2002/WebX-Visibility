import { Component, OnInit } from "@angular/core";
import { ViewPrintComponent } from "../view-print/view-print.component";
import {
  getVehicleStatusFromApi,
  AssignVehiclePageMethods,
  bindMarketVehicle,
} from "./assgine-vehicle-utility";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { AddMarketVehicleComponent } from "../add-market-vehicle/add-market-vehicle.component";
import { formatDate } from "src/app/Utility/date/date-utils";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";

@Component({
  selector: "app-assign-vehicle-page",
  templateUrl: "./assign-vehicle-page.component.html",
})
export class AssignVehiclePageComponent implements OnInit {
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branchCode = localStorage.getItem("Branch");
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  addFlag = true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  breadScrums = [
    {
      title: "Available Vehicle for Assignment",
      items: ["Home"],
      active: "Vehicle Assign",
    },
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = this._assignVehiclePageMethods.columnHeader[0];
  staticField = Object.keys(this.columnHeader);

  linkArray = [{ Row: "action" }];
  menuItems = [{ label: "action", componentDetails: ViewPrintComponent }];
  tableData: any = [];
  NavData: any;
  vendorTypes: AutoComplete[];

  constructor(
    private Route: Router,
    private _operationService: OperationService,
    public dialog: MatDialog,
    private _assignVehiclePageMethods: AssignVehiclePageMethods,
    private vehicleStatusService: VehicleStatusService,
    private markerVehicleService: MarkerVehicleService
  ) {

    this.staticField.pop();

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.NavData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
  }
  ngOnInit(): void {
    this.fetchAvailabelVehicles();
  }

  async fetchAvailabelVehicles() {
    try {
      const vehicleStatusData = await getVehicleStatusFromApi(
        this.companyCode,
        this._operationService
      );
      const sizeContainer = this.NavData.size;
      const checkCap = vehicleStatusData.filter(
        (x) => parseInt(x.capacity) >= parseInt(sizeContainer)
      );
      if (checkCap.length > 0) {
        const loadData = await this.vehicleStatusService.createTableData(
          this.NavData,
          checkCap
        );
        this.tableData = loadData;
        this.tableLoad = false;
      } else {
        Swal.fire({
          icon: "question",
          title: "Add Market Vehicle",
          text: "No vehicles are currently available at this location.Please add market a vehicle  using '+' Button.",
          confirmButtonText: "OK",
          showConfirmButton: true,
        });
        this.tableLoad = false;
      }
    } catch (error) {
      // Handle API call errors here
      console.error("Error fetching vehicle status:", error);
      // You can also set an error state or display a relevant message to the user
    }
  }

  toggleMarketVehicle() {
    // Add your event code for "OK" here
    // This code will run when the user clicks "OK"
    const dialogref = this.dialog.open(AddMarketVehicleComponent, {
      data: this.NavData,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.bindTableData(result);
    });
  }

  async bindTableData(result: any) {

    const existsInTableData = this.tableData.length > 0 ? this.tableData.some((x) => x.vehNo.toLowerCase() === result.vehicelNo.toLowerCase()) : false;
    if (existsInTableData) {
      Swal.fire({
        icon: "warning",
        title: "Vehicle Already Exists",
        text: "The vehicle is already available at this location.",
        confirmButtonText: "OK",
        showConfirmButton: true,
      });
      return false
    }
    const tableData = await bindMarketVehicle(result);
    const fromToCitySplit = this.NavData.fromToCity.split("-");

    if (fromToCitySplit.length !== 2) {
      // Handle the case where the split doesn't result in exactly 2 parts
      console.error("Invalid fromToCity format");
      return;
    }
    const [fromCity, toCity] = fromToCitySplit;
    const marketData = [tableData].map((item) => ({
      ...item,
      action: "Assign",
      fromCity,
      toCity,
      fromToCitySplit: `${fromCity}-${toCity}`,
      distance: 0,
      isMarket: true,
      eta: formatDate(item.eta, "dd/MM/yyyy HH:mm"),
    }));
    this.tableData = this.tableData
      ? this.tableData.concat(marketData)
      : marketData;
    Swal.fire({
      icon: "success",
      title: "Add Market Vehicle Successfully", // Update the title here
      showConfirmButton: true,
    });
    this.tableLoad = false;
  }

  addPopUp() {
    this.toggleMarketVehicle();
  }
}
