import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UpdateRunSheetComponent } from "src/app/operation/update-run-sheet/update-run-sheet.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { CnoteService } from "src/app/core/service/Masters/CnoteService/cnote.service";
import { createRunSheetData } from "./runSheetHelper";
@Component({
  selector: "app-manage-runsheet",
  templateUrl: "./manage-runsheet.component.html",
})
export class ManageRunsheetComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  jsonUrl = "../../../assets/data/create-runsheet-data.json";
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  csv: any[];
  addAndEditPath: string;
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
  linkArray = [{ Row: "Action", Path: "Operation/UpdateRunSheet" }];
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
    private http: HttpClient,
    private Route: Router,
    private cnoteService: CnoteService
  ) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = "example/form";
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
    let runSheetJson = {
      runsheetdata: this.cnoteService?.getRunSheetData() || 0,
      updatedData: this.cnoteService?.getdepartRunSheetData() || 0
    }
    if (this.cnoteService?.getRunSheetData()) {
      this.shipmentData.push(...this.cnoteService?.getRunSheetData().shippingData)
    }

    this.getRunSheet(runSheetJson);

  }

  ngOnInit(): void {

  }
  getRunSheet(dataapi) {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data;
      let data = createRunSheetData(this.data, "", false);
      let departRunSheetData = this.cnoteService?.departRunSheetData || ''
      if (data) {
        let csv
        if (!dataapi && departRunSheetData) {
          csv = data.csv.map(item => {
            if (item.RunSheet === departRunSheetData.RunSheet) {
              item.Action = "Update Delivery",
                item.Status = "OUT FOR DELIVERY"
            }
            return item;
          });
        }
        else {

        }
        this.csv = data.csv;

        this.tableload = false;
        this.boxdata = data.boxdata;
        this.shipmentData.push(...this.data.shipment);
        if (dataapi) {

          let dataApiRunsheet = createRunSheetData(dataapi.runsheetdata, dataapi.updatedData, true);
          this.csv.push(...dataApiRunsheet.csv);
          if (departRunSheetData) {
            this.csv = data.csv.map(item => {
              if (item.RunSheet === departRunSheetData.RunSheet) {
                item.Action = "Update Delivery",
                  item.Status = "OUT FOR DELIVERY"
              }
              return item;
            });
          }
          let departVehicleData = {
            runSheetdetails: this.csv,
            shipments: dataapi.runsheetdata
          }
          this.cnoteService.setDepartvehicleData(departVehicleData);

          for (let newData of dataApiRunsheet.boxdata) {
            let existingData = this.boxdata.find((data) => data.title === newData.title);
            if (existingData) {
              existingData.count += newData.count;
            }
          }
          this.tableload = false;
        }
        /*this service is for pass data to depart Vehicle for scaning*/



        /*End*/

      }

    });

  }
  handleMenuItemClick(label: any, element) {
    this.Route.navigate(["Operation/UpdateRunSheet"], {
      state: {
        data: label.data,
      },
    });
  }
}
