import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ThcPaymentFilterComponent } from "../Modal/thc-payment-filter/thc-payment-filter.component";

@Component({
  selector: "app-thc-payments",
  templateUrl: "./thc-payments.component.html",
})
export class ThcPaymentsComponent implements OnInit {
  breadScrums = [
    {
      title: "THC Payments",
      items: ["Home"],
      active: "List",
    },
  ];
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
  tableData: any = [
    {
      SrNo: "1",
      Vendor: "V001: Adarsh Roadlines",
      THCamount: "234500.45",
      AdvancePending: "126400.00",
      BalanceUnbilled: "108100.00",
    },
    {
      SrNo: "2",
      Vendor: "V003: KJ Transport",
      THCamount: "210980.00",
      AdvancePending: "178900.50",
      BalanceUnbilled: "178900.50",
    },
    {
      SrNo: "3",
      Vendor: "V0223: Kanishka Roadlines",
      THCamount: "178650.60",
      AdvancePending: "87600.50",
      BalanceUnbilled: "87600.50",
    },
    {
      SrNo: "4",
      Vendor: "V0223: Kanishka Roadlines",
      THCamount: "178650.60",
      AdvancePending: "87600.50",
      BalanceUnbilled: "87600.50",
    },
    {
      SrNo: "5",
      Vendor: "V0223: Kanishka Roadlines",
      THCamount: "178650.60",
      AdvancePending: "87600.50",
      BalanceUnbilled: "87600.50",
    },

  ];
  isTableLode = true;
  constructor(private matDialog: MatDialog,) { }

  ngOnInit(): void {
    this.filterFunction()
  }

  AdvancePendingFunction(event) {
    console.log('AdvancePendingFunction', event)
  }

  BalanceUnbilledFunction(event) {
    console.log('BalanceUnbilledFunction', event)
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
    let RequestData = {
      vendorList: [
        "V0006", "V0007"
      ],
      StartDate: "2023-11-21T18:30:00.000Z",
      EndDate: "2023-11-23T18:30:00.000Z"

    }
    const dialogRef = this.matDialog.open(ThcPaymentFilterComponent, {
      data: { DefaultData: RequestData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result)
      }
    });
  }
}
