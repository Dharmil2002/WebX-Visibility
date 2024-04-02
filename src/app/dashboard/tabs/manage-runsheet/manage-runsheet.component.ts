import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UpdateRunSheetComponent } from "src/app/operation/update-run-sheet/update-run-sheet.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { RunSheetService } from "src/app/Utility/module/operation/runsheet/runsheet.service";
import { StorageService } from "src/app/core/service/storage.service";
import { createShipDataObject } from "src/app/Utility/commonFunction/dashboard/dashboard";
@Component({
  selector: "app-manage-runsheet",
  templateUrl: "./manage-runsheet.component.html",
})
export class ManageRunsheetComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath:string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Manage Run Sheet",
      items: ["Dashboard"],
      active: "Manage Run Sheet",
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
   const 
  linkArray = [
    { Row: "Action", Path: "Operation/UpdateRunSheet" }
  ];
  menuItems = [
    {
      label: "Depart",
      componentDetails: UpdateRunSheetComponent,
      function: "GeneralMultipleView",
    },
    { label: "Update Delivery" },

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
    RunSheet: "Run Sheet",
    vehicleNo: "Vehicle No",
    Cluster: "Cluster",
    Shipments: "Shipments",
    Packages: "Packages",
    WeightKg: "Weight Kg",
    VolumeCFT: "Volume CFT",
    Status: "Status",
    Action: "Action",
  };
  centerAlignedData = ['Shipments', 'Packages', 'WeightKg', 'VolumeCFT'];
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  columnWidths = {
    'RunSheet': 'min-width:19%'
  };
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    RunSheet: "Run Sheet",
    Cluster: "Cluster",
    Shipments: "Shipments",
    Packages: "Packages",
    WeightKg: "Weight Kg",
    VolumeCFT: "Volume CFT",
  };
  //#endregion

  IscheckBoxRequired: boolean;
  advancdeDetails: { data: { label: string; data: any }; viewComponent: any };
  viewComponent: any;
  boxdata: any[];
  shipmentData: any[];
  // declararing properties

  constructor(
    private Route: Router,
    private storage:StorageService,
    private runsheetService: RunSheetService
  ) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath='Operation/UpdateDelivery';
    this.IscheckBoxRequired = true;
    this.drillDownPath = "example/drillDown";
    this.getManagedRunSheetDetails();
    //.uploadComponent = undefined;
  }
  getManagedRunSheetDetails() {
    this.runSheetDetails();
  }

  runSheetDetails() {
    this.shipmentData = [];
    this.getRunSheet();
  }

  ngOnInit(): void {

  }
  async getRunSheet() {
     const runSheetData = await this.runsheetService.getRunSheetManagementData({cID:this.storage.companyCode,lOC:this.storage.branch,oPSST:{"D$in":[1,2]}});
     const tableData=await this.runsheetService.getRunSheetManagementFieldMapping(runSheetData);
     this.tableData =tableData;
     const shipment=tableData.reduce((total, shipment) => total + shipment.Shipments, 0);
     const uniqueClusterNames = new Set(tableData.map(item => item.Cluster));
     const shipData = [
      createShipDataObject(uniqueClusterNames.size, "Clusters", "bg-c-Bottle-light"),
      createShipDataObject(shipment, "Shipments for Delivery", "bg-c-Grape-light"),
    ];
    this.boxdata = shipData;
    this.tableload = false;
   
  }
  handleMenuItemClick(label: any, element) {
    this.Route.navigate(["Operation/UpdateRunSheet"], {
      state: {
        data: label.data,
      },
    });
  }
}
