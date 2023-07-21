import { Component, OnInit } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import Swal from "sweetalert2";
import { getDocketDetailsFromApi, kpiData } from "./stockCommon";

@Component({
  selector: "app-stocks",
  templateUrl: "./stocks.component.html",
})
export class StocksComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  jsonUrl = "../../../assets/data/stocks.json";
  tableData: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Docket Stock",
      items: ["Dashboard"],
      active: "Docket Stock",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [{ Row: "Action", Path: "Masters/Docket/EwayBillDocketBookingV2" }];
  menuItems = [
    { label: "Create Run Sheet" },
    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    no: "Cnote",
    date: "Date",
    paymentType: "Pay-Type",
    contractParty: "Contract Party",
    orgdest: "Org-Dest",
    fromCityToCity: "Leg",
    noofPackages: "Packages",
    actualWeight: "Act-Wt(Kg)",
    chargedWeight: "Chrg-Wt(Kg)",
    status: "Status",
    Action: "Action",
  };
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    no: "Cnote",
    date: "Date of Cnote",
    paymentType: "Payment Type",
    contractParty: "Contract Party",
    originDestination: "Origin-Destination",
    fromCityToCity: "From City-To City",
    noofPackages: "No of Packages",
    actualWeight: "Actual Weight",
    chargedWeight: "Charged Weight",
    status: "Status",
    // "Action": "Action"
  };
  boxData: { count: any; title: any; class: string }[];
  branch = localStorage.getItem("Branch");
  // declararing properties
  constructor(private operationService: OperationService) {
    super();
    this.addAndEditPath = "Operation/QuickCreateDocket";
  }
  ngOnInit(): void {
    this.getDocketDetails();
  }

  /**
   * Retrieves docket details from the API and updates the tableData, boxData, and tableload properties.
   */
  async getDocketDetails() {
    try {
      // Send request and await response
      const modifiedData = await getDocketDetailsFromApi(
        this.companyCode,
        this.branch,
        this.operationService
      );

      // Update tableData property with the modified data
      this.tableData = modifiedData;

      // Generate KPI data based on the modified data
      this.boxData = kpiData(modifiedData);

      // Set tableload to false to indicate that the table loading is complete
      this.tableload = false;
    } catch (error) {
      // Handle error by displaying an error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Oops! Something went wrong. Please try again later.",
        showConfirmButton: true,
      });
    }
  }
}
