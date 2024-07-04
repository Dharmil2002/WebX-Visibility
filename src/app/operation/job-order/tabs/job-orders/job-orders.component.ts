import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { DataService } from "src/app/core/service/job-order.service";
@Component({
  selector: "app-job-orders",
  templateUrl: "./job-orders.component.html",
})
export class JobOrdersComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: any = 0;
  addAndEditPath: string;
  csvFileName: string;
  filterColumn: boolean = true;
  allColumnFilter: any;
  tableData: any;
  menuItems = [
    { label: "Add work order", route: "/Operation/AddWorkOrder" },
    { label: "Close Job Order" },
  ];
  menuItemflag: boolean = true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    jOBNO: {
      Title: "Job Order",
      class: "matcolumnleft",
      // Style: "max-width:100px",
      Style: "min-width:80px",
      sticky: true,
    },
    wCNO: {
      Title: "Work Orders",
      class: "matcolumncenter",
      // Style: "max-width:100px",
      Style: "min-width:80px",
    },
    vEHNO: {
      Title: "Vehicle ",
      class: "matcolumnleft",
      // Style: "max-width:100px",
      Style: "min-width:80px",
    },
    jDT: {
      Title: "Job Order Date",
      class: "matcolumncenter",
      // Style: "max-width:100px",
      Style: "min-width:80px",
    },
    sTS: {
      Title: "Status",
      class: "matcolumnleft",
      // Style: "max-width:100px",
      Style: "min-width:80px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:80px; max-width:80px;",
      stickyEnd: true,
    },
  };
  staticField = ["jOBNO", "wCNO", "vEHNO", "jDT", "sTS"];
  data: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private operation: OperationService,
    private storage: StorageService,
    private dataService: DataService,
  ) {
    this.addAndEditPath = "Operation/AddJobOrder";
    this.allColumnFilter = this.columnHeader;
  }
  ngOnInit(): void {
    this.getJobOrdersData();
  }
  async handleMenuItemClick(data) {
    if (data.label.label == "Add work order") {
      this.dataService.setMenuItemData(data); // Set data in DataService
      this.router.navigateByUrl("/Operation/AddWorkOrder")
      // this.router.navigate(["/Operation/AddWorkOrder"], {
      //   state: {
      //     data: data,
      //   },
      // });
      
    }
  }
  async getJobOrdersData() {
    const requestObject = {
      companyCode: this.storage.companyCode,
      collectionName: "job_order_headers",
    };
    const res = await firstValueFrom(
      this.operation.operationPost("generic/get", requestObject)
    );
    if (res.success) {
      const data = res.data;
      const newArray = data.map((data) => ({
        ...data,
        vEHNO: data.vEHD.vEHNO,
        actions: ["Add work order", "Close Job Order"],
      }));
      this.tableData = newArray;
      this.tableLoad = false;
    }
  }
}
