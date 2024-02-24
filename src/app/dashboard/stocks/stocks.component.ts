import { Component, OnInit } from "@angular/core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import Swal from "sweetalert2";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { StorageService } from "src/app/core/service/storage.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
import { DocketStatus } from "src/app/Models/docStatus";

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
  menuItemflag: boolean = false;
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

  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    no: {
      Title: DocCalledAs.Docket,
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    date: {
      Title: `${DocCalledAs.Docket} Date`,
      class: "matcolumnleft",
      Style: "min-width:125px",
    },
    paymentType: {
      Title: "Pay Type",
      class: "matcolumnleft",
      Style: "min-width:15px",
    },
    contractParty: {
      Title:"Contract Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    orgdest: {
      Title:"Org-Dest",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    noofPackages: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    actualWeight: {
      Title: "Actual Weight",
      class: "matcolumncenter",
      Style: "min-width:145px",
    },
    chargedWeight: {
      Title: "Charged Weight",
      class: "matcolumncenter",
      Style: "min-width:155px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    no: DocCalledAs.Docket,
    date: `${DocCalledAs.Docket} Date`,
    paymentType: "Payment Type",
    contractParty: "Contract Party",
    orgdest: "Origin-Destination",
    fromCityToCity: "From City-To City",
    noofPackages: "No of Packages",
    actualWeight: "Actual Weight",
    chargedWeight: "Charged Weight",
    status: "Status",
    //"Action": "Action"
  };

  staticField = [
    "no",
    "date",
    "paymentType",
    "contractParty",
    "orgdest",
    "noofPackages",
    "actualWeight",
    "chargedWeight",
    "status"
  ];
  boxData: { count: any; title: any; class: string }[];
  branch = localStorage.getItem("Branch");
  // declararing properties
  constructor(
  private docketService:DocketService,
  private storage:StorageService
  ) {
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

      let matches = { 
        cID: this.storage.companyCode,
        cLOC: this.storage.branch ,
        sTS: { 'D$nin': [DocketStatus.Delivered,DocketStatus.Cancelled]}
      };

      const data =await this.docketService.getDocketList(matches);
      const modifiedData =await this.docketService.getMappingDocketDetails(data);
      this.boxData =await this.docketService.kpiData(data);
      this.tableData = modifiedData.reverse();
      this.tableload = false;
    } catch (error) {
      this.tableData =[];
      this.tableload = false;
    }
  }
}
