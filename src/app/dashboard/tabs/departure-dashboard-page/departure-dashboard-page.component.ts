import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { fetchDepartureDetails, fetchShipmentData } from "./departureUtils";
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-departure-dashboard-page",
  templateUrl: "./departure-dashboard-page.component.html",
})
export class DepartureDashboardPageComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  departure: any;
  @Input() arrivaldeparture: any;
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  breadscrums = [
    {
      title: "Departure Details",
      items: ["Dashboard"],
      active: "Departure Details",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };

  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [{ Row: "Action", Path: "Operation/CreateLoadingSheet" }];
  menuItems = [
    { label: "Create Trip" },
    { label: "Update Trip" },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [
    "activeFlag",
    "isActive",
    "isActiveFlag",
    "isMultiEmployeeRole",
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    RouteandSchedule: "Route and Schedule",
    VehicleNo: "Vehicle No",
    TripID: "Trip ID",
    Scheduled: "Scheduled",
    Expected: "Expected",
    Status: "Status",
    Hrs: "Hrs.",
    Action: "Action ",
  };

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    RouteandSchedule: "Route and Schedule",
    VehicleNo: "Vehicle No",
    TripID: "Trip ID",
    Scheduled: "Scheduled",
    Expected: "STA",
    Hrs: "Hrs.",
  };
  //#endregion

  IscheckBoxRequired: boolean;
  advancdeDetails: { data: { label: string; data: any }; viewComponent: any };
  viewComponent: any;
  shipmentData: any;
  boxData = [];
  loadingSheetData: any;
  departuredata: any[];
  // declararing properties

  constructor(
    private operationService: OperationService,
    private CnoteService: CnoteService,
    private datePipe: DatePipe
  ) {
    super();
    this.loadingSheetData = this.CnoteService.getLsData();
    this.departure = this.CnoteService.getDeparture();
    this.csvFileName = "departureData.csv";
    this.getdepartureDetail();
  }

  ngOnInit(): void {}
  dailogData(event) {}

  /**
   * Retrieves departure details from the API and updates the tableData property.
   * Also triggers fetching shipment data.
   */
  async getdepartureDetail() {
    // Fetch departure details from the API
    const departureTableData = await fetchDepartureDetails(
      this.companyCode,
      this.orgBranch,
      this.operationService,
      this.datePipe
    );

    // Update the tableData property with the retrieved data
    this.tableData = departureTableData;

    // Set tableload to false to indicate that the table loading is complete
    this.tableload = false;

    // Fetch shipment data
    this.fetchShipmentData();
  }
  /**
   * Fetches shipment data from the API and updates the boxData and tableload properties.
   */
  fetchShipmentData() {
    // Prepare request payload
    let req = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
    };

    // Send request and handle response
    this.operationService.operationPost("common/getall", req).subscribe({
      next: async (res: any) => {
        // Update shipmentData property with the received data
        this.shipmentData = res.data;

        // Fetch shipment result based on company code, orgBranch, and tableData
        const shipmentResult = await fetchShipmentData(
          this.companyCode,
          this.orgBranch,
          this.tableData,
          this.operationService
        );

        // Update boxData and tableload properties with the shipment result
        this.boxData = shipmentResult.boxData;
        this.tableload = false;
      },
    });
  }
}
