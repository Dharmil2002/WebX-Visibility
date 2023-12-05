import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ThcPaymentFilterComponent } from "../Modal/thc-payment-filter/thc-payment-filter.component";
import { Router } from "@angular/router";
import { GetTHCListFromApi } from "../VendorPaymentAPIUtitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: "app-thc-payments",
  templateUrl: "./thc-payments.component.html",
})
export class ThcPaymentsComponent implements OnInit {
  tableData: any;
  breadScrums = [
    {
      title: "THC Payments",
      items: ["Home"],
      active: "THC Payments",
    },
  ];
  RequestData = {
    vendorList: [

    ],
    StartDate: new Date(-30),
    EndDate: new Date()
  }
  linkArray = [];
  menuItems = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    SrNo: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Vendor: {
      Title: "Vendor",
      class: "matcolumncenter",
      Style: "min-width:30%",
    },
    THCamount: {
      Title: "THC Amount",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    AdvancePending: {
      Title: "Advance Pending",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "Link",
      functionName: "AdvancePendingFunction"
    },
    BalanceUnbilled: {
      Title: "Balance Unbilled",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "Link",
      functionName: "BalanceUnbilledFunction"
    },
  };
  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["SrNo", "Vendor", "THCamount"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  isTableLode = true;
  constructor(private matDialog: MatDialog, private router: Router, private masterService: MasterService,) { }

  ngOnInit(): void {
    this.GetTHCData()
  }
  async GetTHCData() {
    const GetTHCData = await GetTHCListFromApi(this.masterService, this.RequestData)
    this.tableData = GetTHCData
  }

  AdvancePendingFunction(event) {
    console.log('AdvancePendingFunction', event)

    this.router.navigate(['/Finance/VendorPayment/AdvancePayment'], {
      state: {
        data: event.data
      },
    });
  }

  BalanceUnbilledFunction(event) {
    console.log('BalanceUnbilledFunction', event)
    this.router.navigate(['/Finance/VendorPayment/BalancePayment']);

  }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  filterFunction() {
    const dialogRef = this.matDialog.open(ThcPaymentFilterComponent, {
      data: { DefaultData: this.RequestData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.RequestData.StartDate = result.StartDate;
        this.RequestData.EndDate = result.EndDate;
        this.RequestData.vendorList = result.vendorNamesupport.map(item => item.value)
        this.GetTHCData()
      }
    });
  }
}
