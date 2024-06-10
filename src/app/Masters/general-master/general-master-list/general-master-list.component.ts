import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-general-master-list",
  templateUrl: "./general-master-list.component.html",
})
export class GeneralMasterListComponent implements OnInit {
  csv: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = [];
  companyCode: any = 0;
  linkArray = [];
  csvFileName:any;
  columnHeader = {
    srNo: {
      Title: "Sr No",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    headerDesc: {
      Title: "General Master",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    description: {
      Title: "Description",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    whereused: {
      Title: "Masters/Forms where used",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    actions: {
      Title: "Actions",
      class: "matcolumnleft",
      Style: "max-width:100px",
    },
    // "srNo": "Sr No",
    // "headerDesc": "General Master",
    // "description": "Description",
    // "whereused": "Masters/Forms where used",
    // "actions": "Actions"
  };
  headerForCsv = {
    srNo: "Sr No",
    headerDesc: "General Master",
    description: "Description",
    whereused : "Masters/Forms where used",
  };
  staticField = ["srNo", "headerDesc", "description", "whereused"];
  breadScrums = [
    {
      title: "General Master",
      items: ["Home"],
      active: "General Master",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  addAndEditPath: string;
  tableData: any[];
  constructor(
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.companyCode = this.storage.companyCode;
  }
  ngOnInit(): void {
    this.csvFileName="General Master"
    this.addAndEditPath = "/Masters/GeneralMaster/GeneralMasterCodeList";
    this.getGeneralDetails();
  }
  getGeneralDetails() {
    let req = {
      companyCode: this.storage.companyCode,
      collectionName: "CodeTypes",
      filter: {companyCode: this.storage.companyCode},
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
          this.tableLoad = false;
        }
      },
    });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
 
}
