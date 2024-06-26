import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
@Component({
  selector: "app-work-orders",
  templateUrl: "./work-orders.component.html",
})
export class WorkOrdersComponent implements OnInit {
  jsonUrl = "../../../assets/data/work-order-data.json";
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: any = 0;
  addAndEditPath: string;
  csvFileName: string;
  filterColumn: boolean = true;
  allColumnFilter: any;
  tableData: any;
  menuItems = [
    { label: "New Work Order" },
    { label: "Approve" },
    { label: "Update" },
    { label: "Close" },
    { label: "Cancel" },
  ];
  menuItemflag: boolean = true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    wORKNO: {
      Title: "Work order",
      class: "matcolumnleft",
      Style: "min-width:150px",
      sticky: true,
    },
    JobOrderDate: {
      Title: "Job Order Date",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    vHNO: {
      Title: "Vehicle ",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    cATEGORY: {
      Title: "Category",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    IssuedTo: {
      Title: "Issued To",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    Vendor: {
      Title: "Vendor/workshop",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    jOBNO: {
      Title: "Job Order",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    sTATUS: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:80px; max-width:80px;",
      stickyEnd: true,
    },
  };
  staticField = [
    "wORKNO",
    "JobOrderDate",
    "vHNO",
    "cATEGORY",
    "IssuedTo",
    "Vendor",
    "jOBNO",
    "sTATUS",
  ];
  data: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private operation: OperationService,
    private storage: StorageService
  ) {
    this.addAndEditPath = "Operation/AddJobOrder";
    this.allColumnFilter = this.columnHeader;
  }
  ngOnInit(): void {
    this.getWorkOrderData();
  }
  async handleMenuItemClick(data) {
    if (data.label.label == "New Work Order") {
      this.router.navigateByUrl("/Operation/AddWorkOrder");
    }
  }
  async getWorkOrderData() {
    const requestObject = {
      companyCode: this.storage.companyCode,
      collectionName: "work_order_headers",
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/get", requestObject)
    );
    if (res.success) {
      const data = res.data;
      const newArray = data.map((data) => ({
        ...data,
        Vendor:`${data.vEND.vCD}:${data.vEND.vNM}`,
        actions: ["New Work Order", "Approve", "Update", "Close", "Cancel"],
      }));
      this.tableData = newArray;
      console.log(this.tableData);
      this.tableLoad = false;
    }
  }
}
