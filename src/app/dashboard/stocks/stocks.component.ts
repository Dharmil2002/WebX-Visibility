import { Component, OnInit } from "@angular/core";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import Swal from "sweetalert2";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { StorageService } from "src/app/core/service/storage.service";
import { DocCalledAsModel } from "src/app/shared/constants/docCalledAs";
import { DocketStatus } from "src/app/Models/docStatus";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";


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
  companyCode: number = 0;
  menuItemflag: boolean = false;
  DocCalledAs: DocCalledAsModel;

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
  linkArray = [{ Row: "Action", Path: "Operation/consignment-entry-ltl" }];

  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {};
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {};

  staticField = [];

  boxData: { count: any; title: any; class: string }[];
  branch = "";
  // declararing properties
  constructor(
  private docketService:DocketService,
  private storage:StorageService,
  private controlPanel:ControlPanelService
  ) {
    super();
    this.companyCode = this.storage.companyCode;
    this.branch = this.storage.branch;
    this.addAndEditPath = "Operation/QuickCreateDocket";
    this.DocCalledAs = controlPanel.DocCalledAs;

    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Stock`,
        items: ["Dashboard"],
        active: `${this.DocCalledAs.Docket} Stock`,
      },
    ];

    const config = this.getControlConfig();
    this.columnHeader = config.columnHeader;
    this.headerForCsv = config.headerForCsv;
    this.staticField = config.staticField;
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
        sTS: { 'D$nin': [DocketStatus.Delivered,DocketStatus.Cancelled, DocketStatus.Del_MR_Generated]}
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

  getControlConfig() {
    return {
    columnHeader: {
      no: {
        Title: this.DocCalledAs.Docket,
        class: "matcolumnleft",
        Style: "min-width:15%",
        sticky: true
      },
      sfx: {
        Title: "SFX",
        class: "matcolumnleft",
        Style: "min-width:15%",
        datatype:"number"
      },
      date: {
        Title: `${this.DocCalledAs.Docket} Date`,
        class: "matcolumncenter",
        Style: "min-width:125px",
        datatype: "date"
      },
      paymentType: {
        Title: "Pay Type",
        class: "matcolumncenter",
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
        class: "matcolumnright",
        Style: "max-width:70px",
      },
      actualWeight: {
        Title: "Actual Weight",
        class: "matcolumnright",
        Style: "min-width:145px",
        //datatype: "number",
        //decimalPlaces: 2
      },
      chargedWeight: {
        Title: "Charged Weight",
        class: "matcolumnright",
        Style: "min-width:155px",
        //datatype: "number",
        //decimalPlaces: 2
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
        stickyEnd: true,
      },
    } ,
 
    headerForCsv: {
      no: this.DocCalledAs.Docket,
      date: `${this.DocCalledAs.Docket} Date`,
      paymentType: "Payment Type",
      contractParty: "Contract Party",
      orgdest: "Origin-Destination",
      fromCityToCity: "From City-To City",
      noofPackages: "No of Packages",
      actualWeight: "Actual Weight",
      chargedWeight: "Charged Weight",
      status: "Status",
      //"Action": "Action"
    }, 
    staticField: [
      "no",
      "date",
      "sfx",
      "paymentType",
      "contractParty",
      "orgdest",
      "noofPackages",
      "actualWeight",
      "chargedWeight",
      "status"
    ]
  };
  }
}
