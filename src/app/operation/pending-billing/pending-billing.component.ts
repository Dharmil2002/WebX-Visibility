import { Component, OnInit } from '@angular/core';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';
import { ReplaySubject } from 'rxjs';
import { menuAccesDropdown } from 'src/app/Models/Comman Model/CommonModel';
import { MatDialog } from '@angular/material/dialog';
import { FilterBillingComponent } from './filter-billing/filter-billing.component';
import { ShipmentEditBillingComponent } from './shipment-edit-billing/shipment-edit-billing.component';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { GenericService } from 'src/app/core/service/generic-services/generic-services';

@Component({
  selector: 'app-pending-billing',
  templateUrl: './pending-billing.component.html'
})
export class PendingBillingComponent implements OnInit {
  tableLoad: boolean = true;// flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string;
  drillDownPath: string;
  isTouchUIActivated = false;
  data: any;
  csv: any;
  uploadComponent: any;
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime.
  menuItemflag: boolean = true;
  boxData: { count: number; title: string; class: string; }[];
  linkArray = [
    { Row: "action", Path: "Finance/InvoiceSummaryBill", title: { "status": 1 } },
    { Row: 'dockets', Path: '', componentDetails: ShipmentEditBillingComponent, title: { "shipment": "apDkt" } },
    { Row: 'pendShipment', Path: '', componentDetails: ShipmentEditBillingComponent, title: { "shipment": "penDkt" } },
  ]
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  public filteredMultiLocation: ReplaySubject<menuAccesDropdown[]> =
    new ReplaySubject<menuAccesDropdown[]>(1);
  orgBranch: string = localStorage.getItem("Branch");
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  /*Below is Link Array it will Used When We Want a DrillDown
 Table it's Jst for set A Hyper Link on same You jst add row Name Which You
 want hyper link and add Path which you want to redirect*/
  toggleArray = [];
  columnHeader = {
    billingParty: {
      Title: "Customer",
      class: "matcolumnleft",
      Style: "max-width: 390px",
    },
    dockets: {
      Title: "Shipment",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    pendShipment: {
      Title: "Pending Approval",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    sum: {
      Title: "Unbilled Amount (₹)",
      class: "matcolumncenter",
      Style: "min-width: 100px",
    },
    action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width: 200px",
    }
  }
  staticField = [
    "billingParty",
    "sum"
  ]
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  billingDetail: any[];
  menuItems = [];
  EventButton = {
    functionName: "openFilterDialog",
    name: "Filter",
    iconName: "filter_alt",
  };
  constructor(
    private invoiceService: InvoiceServiceService,
    private matDialog: MatDialog,
    private genericService: GenericService
  ) {

    this.getFilterData();

  }
  getFilterData() {
    const now = new Date();
    const data = {
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 10
      ),
      end: now,
      customer: []
    }
    this.get(data);
  }
  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }

  ngOnInit(): void {

    // Set default start and end dates when the component initializes
    /// this.range.controls["start"].setValue(lastweek);
    //this.range.controls["end"].setValue(now);
  }


  async get(data) {
    this.tableLoad = true;
    const unBillingData = await this.invoiceService.getPendingDetails(data.start, data.end, data.customer);
    this.tableData = unBillingData.map(item => {
      item.action = item.dockets != 0 ? "Generate Invoice" : "";
      return item;
    });
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
        this.getFilterData()
        this.genericService.clearSharedData();
      }
    });
  }
  reloadData(result) {
    if (result != undefined) {
      this.getKpiCount();
      this.get(result);
    }
    else {
      this.getKpiCount();
      this.getFilterData()
      this.genericService.clearSharedData();
    }
  }
  getKpiCount() {
    const totalShipment = this.tableData.reduce((acc, item) => acc + item.pendShipment, 0);
    const totolApproved = this.tableData.reduce((acc, item) => acc + item.dockets, 0); //this.tableData.map((item) => item.dockets).length;
    const unBillamt = this.tableData.reduce((acc, item) => acc + item.sum, 0);
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
      createShipDataObject(totalShipment, "Unbilled Shipments", "bg-c-Bottle-light"),
      createShipDataObject(unBillamt, "Unbilled Amount", "bg-c-Grape-light"),
      createShipDataObject(totolApproved, "Approved for Billing ", "bg-c-Daisy-light"),
      createShipDataObject(totolApproved, "Pending PODs", "bg-c-Grape-light"),
    ];
    this.boxData = pendingBilling
  }
}
