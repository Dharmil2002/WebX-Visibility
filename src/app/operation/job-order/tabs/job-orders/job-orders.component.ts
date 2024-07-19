import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { firstValueFrom } from "rxjs";
import { StorageService } from "src/app/core/service/storage.service";
import { DataService } from "src/app/core/service/job-order.service";
import { JobOrderService } from "src/app/core/service/jobOrder-service/jobOrder-services.service";
import { Action } from "rxjs/internal/scheduler/Action";
import Swal from "sweetalert2";
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
    { label: "Cancel" },
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
      Style: "min-width:80px",
      sticky: true,
    },
    wCNO: {
      Title: "Work Orders",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    vEHNO: {
      Title: "Vehicle ",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    jDT: {
      Title: "Job Order Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    sTS: {
      Title: "Status",
      class: "matcolumnleft",
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
    private router: Router,
    private operation: OperationService,
    private storage: StorageService,
    private dataService: DataService,
    private jobOrder: JobOrderService
  ) {
    this.addAndEditPath = "Operation/AddJobOrder";
    this.allColumnFilter = this.columnHeader;
  }
  ngOnInit(): void {
    this.getJobOrdersData();
  }
  async handleMenuItemClick(data) {
    const label = data.label.label;
    switch (label) {
      case "New Job order":
        this.router.navigateByUrl("Operation/AddJobOrder");
        break;
      case "Add work order":
        this.dataService.setMenuItemData(data); // Set data in DataService
        this.router.navigateByUrl("Operation/AddWorkOrder");
        break;
      case "Close Job Order":
        this.router.navigate(["Operation/AddJobOrder"], {
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
              sTS: "Cancelled",
              cLBY: this.storage.userName,
              cL: true,
              cLDT: new Date(),
              cRMRK: result.value,
            };
            const res = await this.jobOrder.updateJobOrder(
              { docNo: data.data.docNo },
              details
            );
            if (res) {
              Swal.fire({
                icon: "success",
                title: "JobOrder Successfully Cancelled",
                showConfirmButton: true,
              }).then(() => {
                this.getJobOrdersData();
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
  async getJobOrdersData() {
    const res = await this.jobOrder.getJobOrderData({
      cID: this.storage.companyCode,
    });
    if (res) {
      const api = res.map((x) => {
        return this.jobOrder.getWorkOrdersWithFilters([
          { D$match: { jOBNO: x.jOBNO } },
          { D$project: { _id: 0, sTATUS: 1, jOBNO: 1 } },
        ]);
      });
      const apires = await Promise.all(api);
      const flatApiRes = apires.flat();
      const newArray = res.map((data) => {
        const apiDataList = flatApiRes.filter(
          (api) => api.jOBNO === data.jOBNO
        );
        let actions = [];
        const allClosedOrCancelled = apiDataList.every(
          (apiData) =>
            apiData.sTATUS === "Closed" || apiData.sTATUS === "Cancelled"
        );
        !apiDataList.length
          ? (actions = ["Add work order", "Cancel"])
          : allClosedOrCancelled
          ? (actions = ["Add work order", "Close Job Order"])
          : (actions = ["Add work order"]);
        const newItem = {
          ...data,
          vEHNO: data.vEHD.vEHNO,
          actions: actions,
        };
        if (newItem.sTS === "Cancelled" || newItem.sTS === "Closed") {
          newItem.actions = [];
        }
        return newItem;
      });
      this.tableData = newArray;
      this.tableLoad = false;
    }
  }
}
