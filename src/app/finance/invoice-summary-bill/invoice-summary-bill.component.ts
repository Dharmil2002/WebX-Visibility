import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';
import { StateWiseSummaryControl } from 'src/assets/FormControls/state-wise-summary-control';

@Component({
  selector: 'app-invoice-summary-bill',
  templateUrl: './invoice-summary-bill.component.html'
})
export class InvoiceSummaryBillComponent implements OnInit {

  breadScrums = [
    {
      title: "Invoice Summary Bill",
      items: ["Finance"],
      active: "Invoice Summary Bill",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableLoad: boolean = true;
  invoiceTableForm: UntypedFormGroup;
  invoiceFormControls: StateWiseSummaryControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];
  router: any;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    sr: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    stateName: {
      Title: "State Name",
      class: "matcolumncenter",
      Style: "",
    },
    cnoteCount: {
      Title: "Cnote Count",
      class: "matcolumncenter",
      Style: "",
    },
    countSelected: {
      Title: "CountSelected",
      class: "matcolumncenter",
      Style: "",
    },
    subTotalAmount: {
      Title: "Sub Total Amount",
      class: "matcolumncenter",
      Style: "",
    },
    gstCharged: {
      Title: "GST Charged",
      class: "matcolumncenter",
      Style: "",
    },
    totalBillingAmount: {
      Title: "Total Billing Amount",
      class: "matcolumncenter",
      Style: "",
    }
  };
  columnHeader1 = {
    count: {
      Title: "Count",
      class: "matcolumncenter",
      Style: "",
    },
    subTotal: {
      Title: "Sub Total",
      class: "matcolumncenter",
      Style: "",
    },
    billTimeCharges: {
      Title: "Bill Time Charges",
      class: "matcolumncenter",
      Style: "",
    },
    totalAmount: {
      Title: "Total Amount",
      class: "matcolumncenter",
      Style: "",
    },
    gstRate: {
      Title: "GST Rate",
      class: "matcolumncenter",
      Style: "",
    },
    sgst: {
      Title: "SGST",
      class: "matcolumncenter",
      Style: "",
    },
    utgst: {
      Title: "UTGST",
      class: "matcolumncenter",
      Style: "",
    },
    cgst: {
      Title: "CGST",
      class: "matcolumncenter",
      Style: "",
    },
    igst: {
      Title: "IGST",
      class: "matcolumncenter",
      Style: "",
    },
    gstTotal: {
      Title: "GST Total",
      class: "matcolumncenter",
      Style: "",
    },
    total: {
      Title: "Total",
      class: "matcolumncenter",
      Style: "",
    },
  };
  tableData = [
    {
      sr: 1,
      stateName: "Maharashtra",
      cnoteCount: 1,
      countSelected: 1,
      subTotalAmount:1110.00,
      gstCharged:133.20,
      totalBillingAmount:1243.20
    }
  ];
  tableData1 = [
    {
      count: 0,
      subTotal: 0.00,
      billTimeCharges: 0.00,
      totalAmount: 0,
      gstRate: 12,
      sgst:0.00,
      utgst:0.00,
      cgst:0.00,
      igst:0.00,
      gstTotal:0,
      total:0.00,
    }
  ];
  staticField = ["sr", "select", "stateName", "cnoteCount", "countSelected", "subTotalAmount","gstCharged","totalBillingAmount"];
  staticField1 = ["count", "subTotal", "billTimeCharges", "totalAmount", "gstRate", "sgst","utgst","cgst","igst","gstTotal","total"];
  constructor(private fb: UntypedFormBuilder) {
    this.tableLoad = false;
    //#region fist table count
    const cnoteCount = calculateTotalField(this.tableData, 'cnoteCount');
    const countSelected = calculateTotalField(this.tableData, 'countSelected');
    const subTotalAmount = calculateTotalField(this.tableData, 'subTotalAmount');
    const gstCharged = calculateTotalField(this.tableData, 'gstCharged');
    const totalBillingAmount = calculateTotalField(this.tableData, 'totalBillingAmount');
    //#endregion

    //#region fist table KPICountData
    this.KPICountData = [
      {
        count: cnoteCount,
        title: "Total Cnote Count",
        class: `color-Grape-light`,
      },
      {
        count: countSelected,
        title: "Total Count Selected",
        class: `color-Bottle-light`,
      },
      {
        count: subTotalAmount,
        title: "Sub Total Amount",
        class: `color-Daisy-light`,
      },
      {
        count: gstCharged,
        title: "Total GST Charged",
        class: `color-Success-light`,
      },
      {
        count: totalBillingAmount,
        title: "Total Billing Amount",
        class: `color-Grape-light`,
      },
    ]
    //#endregion
  }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.invoiceFormControls = new StateWiseSummaryControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.invoiceFormControls.getstateWiseSummaryArrayControls();
    // Build the form group using formGroupBuilder function
    this.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  save() {}

}
