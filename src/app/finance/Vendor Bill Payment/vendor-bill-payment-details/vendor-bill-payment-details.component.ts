import { Component, OnInit } from '@angular/core';
import { DocumentGenerated, OthrPaymentSummary, PaymentSummary, VendorBillPayment } from '../../Vendor Bills/vendor-bill-payment/VendorStaticData';
import { vendorBillPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorBillPaymentControl';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { GetAccountDetailFromApi } from '../../Vendor Payment/VendorPaymentAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VendorBillService } from '../../Vendor Bills/vendor-bill.service';

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
      Title: "Bill Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    debitNote: {
      Title: "Debit Note (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    paid: {
      Title: "Paid Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:115px",
    },
    pending: {
      Title: "Pending Amount(₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    payment: {
      Title: "Payment Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
  }

  TableStyle = "width:60%"
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
  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonPaymentSummaryArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;
  imageData: any = {};
  billNo: any;
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    private route: Router,
    private objVendorBillService: VendorBillService

  ) {
    // const PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      const PaymentData = route.getCurrentNavigation().extras.state.data;
      this.billNo = PaymentData.billNo;

    }
    // if (PaymentData) {
    //   //this.GetAdvancePaymentList()
    // } else {
    //   this.RedirectToTHCPayment()
    // }
  }
  RedirectToTHCPayment() {
    this.route.navigate(['/Finance/VendorPayment/VendorBillPayment']);
  }

  ngOnInit(): void {
    this.initializeVendorBillPayment();
    this.getBillDetail();
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

    this.jsonPaymentSummaryArray = this.vendorBillPaymentControl.getPaymentSummaryControl();
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonPaymentSummaryArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonPaymentSummaryArray]);
    this.jsonPaymentSummaryArray = this.jsonPaymentSummaryArray.slice(0, 1);
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
  save() {
    console.log(this.PaymentSummaryFilterForm.value);

  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
    switch (PaymentMode) {
      case 'Cheque':
        filterFunction = (x) => x.name !== 'CashAccount';

        break;
      case 'Cash':
        filterFunction = (x) => x.name !== 'ChequeOrRefNo' && x.name !== 'Bank';
        break;
      case 'RTGS/UTR':
        filterFunction = (x) => x.name !== 'CashAccount';
        break;
    }

    this.jsonPaymentSummaryArray = this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation = this.PaymentSummaryFilterForm.value.BalancePaymentlocation?.name
    switch (PaymentMode) {
      case 'Cheque':
        const responseFromAPIBank = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.PaymentSummaryFilterForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo = this.PaymentSummaryFilterForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();



        const CashAccount = this.PaymentSummaryFilterForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.PaymentSummaryFilterForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.PaymentSummaryFilterForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.PaymentSummaryFilterForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }
  async selectFileScanDocument(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "ScanSupportingdocument", this.
      PaymentSummaryFilterForm, this.imageData, "VendorBillPayment", 'Finance', this.jsonPaymentSummaryArray, allowedFormats);
  }
  //#region to preview image
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
  async getBillDetail() {
    const data = await this.objVendorBillService.getVendorBillDetails(this.billNo)
    console.log(data);

  }
}
