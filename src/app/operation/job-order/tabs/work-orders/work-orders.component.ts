import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { DataService } from "src/app/core/service/job-order.service";
import { JobOrderService } from "src/app/core/service/jobOrder-service/jobOrder-services.service";
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

  menuItems = [{ label: "Update" }, { label: "Close" }, { label: "Cancel" }];
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
    jDT: {
      Title: "Job Order Date",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    vEHNO: {
      Title: "Vehicle ",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    cATEGORY: {
      Title: "Category",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    tYPE: {
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
    "jDT",
    "vEHNO",
    "cATEGORY",
    "tYPE",
    "Vendor",
    "jOBNO",
    "sTATUS",
  ];
  data: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private dataService: DataService,
    private joborder: JobOrderService,
    private masterService: MasterService
  ) {
    this.addAndEditPath = "Operation/AddJobOrder";
    this.allColumnFilter = this.columnHeader;
  }
  ngOnInit(): void {
    this.getWorkOrderData();
  }
  async handleMenuItemClick(data) {
    const label = data.label.label;
    switch (label) {
      case "Update":
        this.dataService.setMenuItemData(data);
        this.router.navigate(["Operation/AddWorkOrder"], {
          state: {
            data: data,
          },
        });
        break;
      case "Close":
        this.dataService.setMenuItemData(data);
        this.router.navigate(["Operation/AddWorkOrder"], {
          state: {
            data: data,
          },
        });
        break;
      case "Cancel":
        const result = await Swal.fire({
          title: "Reason For Cancel?",
          html: `<input type="text" id="swal-input1" class="swal2-input" placeholder="Additional comments">`,
          focusConfirm: false,
          showCancelButton: true,
          width: "auto",
          cancelButtonText: "Cancel",
          preConfirm: () => {
            return (document.getElementById("swal-input1") as HTMLInputElement)
              .value;
          },
        });
        if (result.isConfirmed) {
          if (data.data.docNo) {
            let details = {
              sTATUS: "Cancelled",
              cLBY: this.storage.userName,
              cL: true,
              cLDT: new Date(),
              cREMARKS: result.value,
            };
            const res = await this.joborder.updateWorkOrder(
              "work_order_headers",
              { docNo: data.data.docNo },
              details
            );
            if (res) {
              Swal.fire({
                icon: "success",
                title: "WorkOrder Successfully Cancelled",
                showConfirmButton: true,
              }).then(() => {
                this.getWorkOrderData();
              });
            }
          }
        } else {
          return;
        }
        break;
      default:
        return;
    }
  }
  async getWorkOrderData() {
    const res = await this.joborder.getWorkOrderData({
      cID: this.storage.companyCode,
      lOC: this.storage.branch,
    });
    if (res) {
      const data = res;
      const newArray = data.map((item) => {
        const newItem = {
          ...item,
          actions: ["Update", "Close", "Cancel"],
        };
        if (newItem.sTATUS === "Cancelled" || newItem.sTATUS === "Closed") {
          newItem.actions = [];
        }
        // Conditionally add the Vendor property
        if (item?.vEND?.vCD && item?.vEND?.vNM) {
          newItem.Vendor = `${item.vEND.vCD}:${item.vEND.vNM}`;
        }
        return newItem;
      });

      this.tableData = newArray;
      this.tableLoad = false;
    }
  }
}
