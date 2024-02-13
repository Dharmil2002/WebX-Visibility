import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GenericService } from 'src/app/core/service/generic-services/generic-services';
import { StorageService } from 'src/app/core/service/storage.service';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { FilterBillingComponent } from '../pending-billing/filter-billing/filter-billing.component';
@Component({
  selector: 'app-invoice-management',
  templateUrl: './invoice-management.component.html'
})
export class InvoiceManagementComponent implements OnInit {
  tableLoad: boolean = true;// flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  linkArray = [
    { Row: "pendCol", Path: "Finance/InvoiceCollection" },
    { Row: "penAp", Path: "Finance/bill-approval" },
  ]
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  range: FormGroup;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  unBillingData: any;
  boxData: { count: number; title: string; class: string; }[];
  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  menuItems = [
  ];
  toggleArray = [];
  columnHeader = {
    billingParty: {
      Title: "Customer",
      class: "matcolumnleft",
      Style: "max-width: 300px",
    },
    genCnt: {
      Title: "Invoice Generated​",
      class: "matcolumnleft",
      Style: "max-width: 100px",
    },
    valueBl: {
      Title: "Value",
      class: "matcolumncenter",
      Style: "min-width: 100px",
    },
    penAp: {
      Title: "Pending Approval",
      class: "matcolumncenter",
      Style: "max-width: 220px",
    },
    penApAmt: {
      Title: "Value​",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    pendCol: {
      Title: "Pending Collection​",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    pendColAmt: {
      Title: "Value​",
      class: "matcolumncenter",
      Style: "min-width: 90px",
    }

  }
  staticField = [
    "billingParty",
    "genCnt",
    "valueBl",
    "pendColAmt",
    "penApAmt"
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  EventButton = {
    functionName: "openFilterDialog",
    name: "Filter",
    iconName: "filter_alt",
  };
  constructor(
    private InvoiceService: InvoiceServiceService,
    private DashboardFilterPage: FormBuilder,
    private storage: StorageService,
    private matDialog: MatDialog,
    private genericService: GenericService
  ) {
    this.range = this.DashboardFilterPage.group({
      start: new FormControl(),  // Create a form control for start date
      end: new FormControl(),    // Create a form control for end date
    });
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set default start and end dates when the component initializes
    this.range.controls["start"].setValue(lastweek);
    this.range.controls["end"].setValue(now);
    this.get(event);
  }

  async get(event) {
    this.tableLoad = true;  // Set tableLoad to true while fetching data
    // Fetch billing details asynchronously
    const requestData = {
      startDate: event ? event.start : this.range.controls.start.value,
      endDate: event ? event.end : this.range.controls.end.value,
      branch: this.storage.branch,
      customerName: event ? event.customer : [],
      locationNames: event ? event.bookLoc : []

    }
    const detail = await this.InvoiceService.getinvoiceDetailBill(requestData);
    this.unBillingData = await this.InvoiceService.getPendingDetails(requestData.startDate, requestData.endDate, requestData.customerName);
    // Format the start and end dates using DatePipe
    this.tableData = detail.filter((item) => item.pendColAmt != 0 || item.penApAmt != 0);
    this.tableLoad = false;
    this.getKpiCount();
  }
  openFilterDialog() {
    const dialogRef = this.matDialog.open(FilterBillingComponent, {
      width: "60%",
      position: {
        top: "20px",
      },
      disableClose: true,
      data: "",
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result != undefined) {
        this.get(result);
      }
      else {
        this.genericService.clearSharedData();
      }
    });
  }
  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  getKpiCount() {
    const invoiceGenerated = this.tableData.reduce((acc, curr) => acc + curr.genCnt, 0);
    const totolApproved = this.unBillingData.map((item) => item.dockets).length;
    const unBillamt = this.unBillingData.reduce((acc, item) => acc + item.sum, 0);
    // const invoiceGenerated= this.tableData.reduce((acc, curr) => acc + curr.genCnt, 0);
    const createShipDataObject = (
      count: number,
      title: string,
      className: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
    const pendingBilling = [
      createShipDataObject(invoiceGenerated, "Invoice Generated", "bg-c-Bottle-light"),
      createShipDataObject(unBillamt, "Unbilled Amount", "bg-c-Grape-light"),
      createShipDataObject(totolApproved, "Pending Approval", "bg-c-Daisy-light"),
      createShipDataObject(totolApproved, "Pending PODs", "bg-c-Grape-light"),
    ];
    this.boxData = pendingBilling
  }
}
