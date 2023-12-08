import { Component, OnInit } from "@angular/core";
import {
  DocumentGenerated,
  OthrPaymentSummary,
  PaymentSummary,
  VendorBillPayment,
} from "../../Vendor Bills/vendor-bill-payment/VendorStaticData";
import { vendorBillPaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorBillPaymentControl";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { GetAccountDetailFromApi } from "../../Vendor Payment/VendorPaymentAPIUtitlity";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { VendorBillService } from "../../Vendor Bills/vendor-bill.service";
import { firstValueFrom } from "rxjs";
import moment from "moment";

@Component({
  selector: "app-vendor-bill-payment-details",
  templateUrl: "./vendor-bill-payment-details.component.html",
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
  // tableData = VendorBillPayment
  tableData:any


  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    bILLNO: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:200px",
      type: "Link",
      functionName: "billNoFunction",
    },
    eNTDT: {
      Title: "Generation Date",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    tHCAMT: {
      Title: "Bill Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    debitNote: {
      Title: "Debit Note (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    aDVAMT: {
      Title: "Paid Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:115px",
    },
    bALAMT: {
      Title: "Pending Amount(₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    payment: {
      Title: "Payment Amount (₹)",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
  };

  TableStyle = "width:60%";
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];
  addFlag = true;
  menuItemflag = true;

  staticField = [
    "bALAMT",
    "tHCAMT",
    "debitNote",
    "eNTDT",
    "aDVAMT",
    "payment",
  ];
  summaryStaticField = ["amt", "institute", "ref", "paymentMethod"];
  documentSaticField = ["docNo", "document", "date"];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isTableLode = false;
  vendorBillPaymentControl: vendorBillPaymentControl;
  jsonVendorBillPaymentArray: any;
  vendorbillPaymentForm: UntypedFormGroup;
  TotalAmountList = [
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
  ];
  isFormLode = false
  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonPaymentSummaryArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;
  imageData: any = {};
  billNo: any;
  billData: any;
  BillPaymentData: any;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    private route: Router,
    private objVendorBillService: VendorBillService
  ) {
    this.billData = this.route.getCurrentNavigation()?.extras?.state?.data;
  }

  ngOnInit(): void {
    if (this.billData) {
      this.initializeVendorBillPayment();
    this.getBillDetail();
    } else {
      this.route.navigate(["/Finance/VendorPayment/VendorBillPayment"]);
    }
    
  }
  async getBillDetail() {
    this.isTableLode = false;
    let req = {
      companyCode: this.companyCode,
      collectionName: "vend_bill_det",
      filter: { bILLNO: this.billData.billNo },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      this.tableData = res.data.map((x)=>{
        return{
          ...x,
          debitNote:0,
          payment:0,
          eNTDT:moment(x.eNTDT).format("DD/MM/YYYY")
        }
      });
      this.isTableLode = true;
    }
  }

  
  selectCheckBox(event) {
    console.log(event);
  }
  billNoFunction(event) {}
  // Initialize the vendor bill payment module
  initializeVendorBillPayment() {
    // Create a request object with vendor details
    const RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
    };

    // Initialize the vendor bill payment control with the request object
    this.vendorBillPaymentControl = new vendorBillPaymentControl(RequestObj);

    // Retrieve the bill payment header array from the control
    this.jsonVendorBillPaymentArray =
      this.vendorBillPaymentControl.getbillPaymentHeaderArrayControl();
    this.vendorbillPaymentForm = formGroupBuilder(this.fb, [
      this.jsonVendorBillPaymentArray,
    ]);

    this.jsonPaymentSummaryArray =
      this.vendorBillPaymentControl.getPaymentSummaryControl();
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonPaymentSummaryArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonPaymentSummaryArray,
    ]);
    this.jsonPaymentSummaryArray = this.jsonPaymentSummaryArray.slice(0, 1);
    this.isFormLode = true
    this.getBillPayment()
  }

  async getBillPayment() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "vend_bill_payment",
      filter: { bILLNO: this.billData.billNo },
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    console.log(res);
    if (res.success && res.data.length != 0) {
      this.BillPaymentData = res.data[0]
      const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode");
      PaymentMode.setValue(this.BillPaymentData.mOD);
      var selectDate = new Date(this.BillPaymentData.dTM);
      const FormDate = this.PaymentSummaryFilterForm.get("Date");
      FormDate.setValue(selectDate);
      this.OnPaymentModeChange("")
    }
  }
 
  // Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
    switch (PaymentMode) {
      case "Cheque":
        filterFunction = (x) => x.name !== "CashAccount";

        break;
      case "Cash":
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank";
        break;
      case "RTGS/UTR":
        filterFunction = (x) => x.name !== "CashAccount";
        break;
    }

    this.jsonPaymentSummaryArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation =
      this.PaymentSummaryFilterForm.value.BalancePaymentlocation?.name;
    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetAccountDetailFromApi(
          this.masterService,
          "BANK",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const SelectOpt = responseFromAPIBank.find(x => x.name == this.BillPaymentData.bANK) 
        const Bank = this.PaymentSummaryFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.setValue(SelectOpt);
        Bank.updateValueAndValidity();


        const ChequeOrRefNo =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.setValue(this.BillPaymentData.tRNO);
        ChequeOrRefNo.updateValueAndValidity();


        const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.PaymentSummaryFilterForm.get("Bank");
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        break;
    }
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
}
