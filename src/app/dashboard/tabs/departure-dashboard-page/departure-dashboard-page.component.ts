import { Component, Input, OnInit } from "@angular/core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { DepartureService } from "src/app/Utility/module/operation/departure/departure-service";
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

  columnHeader = {
    RouteandSchedule: {
      Title:"Route and Schedule",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    VehicleNo: {
      Title: "Vehicle No",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    TripID: {
      Title: "Trip ID",
      class: "matcolumnleft",
      Style: "min-width:200px",
      type:'windowLink',
      functionName:'OpenManifest'
    },
    Scheduled: {
      Title: "Scheduled",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Expected: {
      Title: "Expected",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Hrs: {
      Title: "Hrs",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  staticField = [
    "RouteandSchedule",
    "VehicleNo",
    "Scheduled",
    "Expected",
    "Hrs"
  ];
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
    private CnoteService: CnoteService,
    private departureService: DepartureService
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
    const departureTableData = await this.departureService.getRouteSchedule();
    // Update the tableData property with the retrieved data
    // Create a Set with the values to exclude
    const statusesToExclude = new Set([4,5]);
    // Filter departureTableData to exclude items with statuses in the Set
    this.tableData = departureTableData.filter(item => !statusesToExclude.has(item.status));
    // Set tableload to false to indicate that the table loading is complete
    this.tableload = false;
    this.fetchShipmentData();
    // Fetch shipment data
   // this.fetchShipmentData();
  }
  /**
   * Fetches shipment data from the API and updates the boxData and tableload properties.
   */
  fetchShipmentData() {
 // Create shipData objects
 const createShipDataObject = (
  count: number,
  title: string,
  className: string
) => ({
  count,
  title,
  class: `info-box7 ${className} order-info-box7`,
});

const shipData = [
  createShipDataObject(this.tableData.length, "Routes", "bg-c-Bottle-light"),
  createShipDataObject(this.tableData?.filter((x)=>x.VehicleNo).length||0, "Vehicles", "bg-c-Grape-light"),
  createShipDataObject(0, "Shipments", "bg-c-Daisy-light"),
  createShipDataObject(0, "Packages", "bg-c-Grape-light"),
];
  this.boxData=shipData;
  }

  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }


  OpenManifest(data){
    // console.log('data' ,data.TripID)

    const TripID = data.TripID
    const templateBody = {
      DocNo: TripID,
      templateName: 'Manifest View-Print'
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}
