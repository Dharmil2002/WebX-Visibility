import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { GenericActions } from "src/app/config/myconstants";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SwalerrorMessage } from "src/app/Utility/Validation/Message/Message";
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
    private storage: StorageService,
    private masterService: MasterService,
  ) {
    this.addAndEditPath = "Operation/AddJobOrder";
    this.allColumnFilter = this.columnHeader;
  }
  ngOnInit(): void {
    this.getWorkOrderData();
  }
  async handleMenuItemClick(data) {
    debugger
    const label = data.label.label;

    if (data.label.label == "New Work Order") {
      this.router.navigateByUrl("/Operation/AddWorkOrder");
    }
    let details = {};
    let successMessage = "";
  
    switch (label) {
      case "Approve":
        details = {
          sTATUS: "Approved",
          // aPBY: this.storage.loginName,
          // aPDT: new Date(),
        };
        successMessage = "Successfully Approved";
        break;
      case "Update":
        details = {
          sTATUS: "Updated",
          mODBY: this.storage.loginName,
          mODDT: new Date(),
          mODLOC: this.storage.branch,
        };
        successMessage = "Successfully Updated";
        break;
      case "Close":
        details = {
          sTATUS: "Closed",
          cSBY: this.storage.loginName,
          cSDT: new Date(),
        };
        successMessage = "Successfully Closed";
        break;
      case "Cancel":
    
      const result = await Swal.fire({
        title: 'Reason For Cancel?',
        html: `<input type="text" id="swal-input1" class="swal2-input" placeholder="Additional comments">`,
        focusConfirm: false,
        showCancelButton: true,
        width: "auto",
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          return (document.getElementById('swal-input1') as HTMLInputElement).value;
        }
      });

      if (result.isConfirmed) {
        if (data.data.docNo) {
           details = {
            sTATUS: "Cancel",
            cL: true,
            cLDT: new Date(),
            cREMARKS: result.value
          };
          successMessage = "Successfully Cancelled";
        }
      } else {
        Swal.fire("Error", "Error in Voucher Reverse Accounting Entry", "error");
      }
      break;
      default:
        return;
    }
    try {
       const req = {
        companyCode: this.storage.companyCode,
        collectionName: "work_order_headers",
        filter: { docNo: data.data.docNo },
        update: details,
      };

      const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
      if (res.success) {
        this.getWorkOrderData();
        Swal.fire({
          icon: "success",
          title: successMessage,
          text: res.message,
          showConfirmButton: true,
        });
        this.router.navigateByUrl("/Operation/JobOrder");
      }
    } catch (error) {
      console.error("Error updating work order:", error);
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
