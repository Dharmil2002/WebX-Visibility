import { Component, OnInit } from '@angular/core';
import { DocumentGenerated, OthrPaymentSummary, PaymentSummary, VendorBillPayment } from '../../Vendor Bills/vendor-bill-payment/VendorStaticData';
import { vendorBillPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorBillPaymentControl';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-vendor-bill-payment-details',
  templateUrl: './vendor-bill-payment-details.component.html'
})
export class VendorBillPaymentDetailsComponent implements OnInit {
  breadScrums = [
    {
      title: "Vendor Bill Payment",
      items: ["Home"],
      active: "Vendor Bill Payment",
    },
  ];
  tableLoad = true; // flag , indicates if data is still lo or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableData = VendorBillPayment
  summaryData = PaymentSummary
  OthrTableData = OthrPaymentSummary
  documentData = DocumentGenerated
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:200px",
      type: "Link",
      functionName: "billNoFunction"
    },
    Date: {
      Title: "Generation Date",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    billAmount: {
      Title: "Bill Amount",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    debitNote: {
      Title: "Debit Note",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    paid: {
      Title: "Paid Amount",
      class: "matcolumnright",
      //Style: "max-width:115px",
    },
    pending: {
      Title: "Pending Amount",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    payment: {
      Title: "Payment Amount",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
  }
  summaryColumnHeader = {

    paymentMethod: {
      Title: "Payment Method",
      class: "matcolumncenter",
      // Style: "min-width:200px",
    },
    institute: {
      Title: "Payment institute",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    ref: {
      Title: "Reference No.",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    amt: {
      Title: "Amount",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },

  }
  documentHeader = {
    document: {
      Title: "Document",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    docNo: {
      Title: "Document Number",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    date: {
      Title: "Document Date",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  staticField = ['pending', 'billAmount', 'debitNote', 'Date', 'paid', 'payment']
  summaryStaticField = ["amt", "institute", "ref", "paymentMethod"]
  documentSaticField = ["docNo", "document", "date"]
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isTableLode = true;
  vendorBillPaymentControl: vendorBillPaymentControl;
  jsonVendorBillPaymentArray: any;
  vendorbillPaymentForm: UntypedFormGroup;
  TotalAmountList: { count: string; title: string; class: string; }[];
  constructor(private fb: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.initializeVendorBillPayment();
    this.TotalAmountList = [
      {
        count: "331800.00",
        title: "Total Bill Amount",
        class: `color-Success-light`,
      },
      {
        count: "10000.00",
        title: "Total Debit Note",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Total Paid Amount",
        class: `color-Success-light`,
      },
      {
        count: "251800.00",
        title: "Total Pending Amount",
        class: `color-Success-light`,
      },
      {
        count: "251800.00",
        title: "Total Payment Amount",
        class: `color-Success-light`,
      },
    ]
  }
  selectCheckBox(event) {
    console.log(event)
  }
  billNoFunction(event) {
    // const dialogRef = this.matDialog.open(THCAmountsDetailComponent, {
    //   data: "",
    //   width: "90%",
    //   height: "95%",
    //   disableClose: true,
    //   position: {
    //     top: "20px",
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result != undefined) {
    //     console.log(result)
    //   }
    // });
  }
  // Initialize the vendor bill payment module
  initializeVendorBillPayment() {
    // Create a request object with vendor details
    const RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
    }

    // Initialize the vendor bill payment control with the request object
    this.vendorBillPaymentControl = new vendorBillPaymentControl(RequestObj);

    // Retrieve the bill payment header array from the control
    this.jsonVendorBillPaymentArray = this.vendorBillPaymentControl.getbillPaymentHeaderArrayControl();
    this.vendorbillPaymentForm = formGroupBuilder(this.fb, [this.jsonVendorBillPaymentArray]);
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
  save(event) {
    console.log(this.summaryData);

  }
}
