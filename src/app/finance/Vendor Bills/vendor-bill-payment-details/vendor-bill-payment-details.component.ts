import { Component, OnInit } from "@angular/core";
import { vendorBillPaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorBillPaymentControl";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import {
  GetAccountDetailFromApi
} from "../../Vendor Payment/VendorPaymentAPIUtitlity";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import moment from "moment";
import { VendorBillService } from "../../Vendor Bills/vendor-bill.service";
import { BeneficiaryDetailComponent } from "../beneficiary-detail/beneficiary-detail.component";
import { MatDialog } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { Vendbillpayment } from "src/app/Models/Finance/VendorPayment";
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo, } from "src/app/Models/Finance/Finance";
import { StorageService } from "src/app/core/service/storage.service";
import { financialYear } from "src/app/Utility/date/date-utils";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { GenerateVendorBill } from '../../../Models/Finance/VendorPayment';

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

  tableData: any;

  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:200px"
    },
    Date: {
      Title: "Generation Date",
      class: "matcolumncenter",
    },
    TotalTHCAmount: {
      Title: "Bill Amount (₹)",
      class: "matcolumnright",
    },
    debitNote: {
      Title: "Debit Note (₹)",
      class: "matcolumnright",
    },
    AdvancePayedAmount: {
      Title: "Paid Amount (₹)",
      class: "matcolumnright",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumnright",
    },
    paymentAmount: {
      Title: "Payment Amount (₹)",
      class: "matcolumnright",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:8%",
    }
  };
  menuItems = [
    { label: 'Modify Bill Amount' },
  ]
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];
  addFlag = true;
  menuItemflag = true;

  staticField = ["paymentAmount", "TotalTHCAmount", "debitNote", "Date", "AdvancePayedAmount", "pendingAmount", "billNo"];
  summaryStaticField = ["amt", "institute", "ref", "paymentMethod"];
  documentSaticField = ["docNo", "document", "date"];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  isTableLode = false;
  vendorBillPaymentControl: vendorBillPaymentControl;
  jsonVendorBillPaymentArray: any;
  vendorbillPaymentForm: UntypedFormGroup;
  TotalAmountList = [
    {
      count: "0.00",
      title: "Total Bill Amount",
      class: `color-Success-light`,
    },
    {
      count: "0.00",
      title: "Total Debit Note",
      class: `color-Success-light`,
    },
    {
      count: "0.00",
      title: "Total Paid Amount",
      class: `color-Success-light`,
    },
    {
      count: "0.00",
      title: "Total Pending Amount",
      class: `color-Success-light`,
    },
    {
      count: "0.00",
      title: "Total Payment Amount",
      class: `color-Success-light`,
    },
  ];
  isFormLode = false;
  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonPaymentSummaryArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;
  imageData: any = {};
  billNo: any;
  billData: any;
  BillPaymentData: any;
  vendor: any;
  backPath: string;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  TotalBillAmount: number;
  TotalDebitNote: number;
  TotalPaidAmount: number;
  TotalPendingAmount: number;
  TotalPaymentAmount: number;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private route: Router,
    private objVendorBillService: VendorBillService,
    private dialog: MatDialog,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,
    private voucherServicesService: VoucherServicesService,

  ) {
    // this.billData =
    //   [
    //     {
    //       "vendor": "8888 : Krupesh",
    //       "_id": "10065-VB/MUMB/2324/000009",
    //       "vnCode": 8888,
    //       "vnName": "Krupesh",
    //       "billType": "Vendor Bill",
    //       "billNo": "VB/MUMB/2324/000009",
    //       "Date": "26/12/2023",
    //       "TotalTHCAmount": 10000,
    //       "AdvancePayedAmount": 2000,
    //       "billAmount": 8000,
    //       "pendingAmount": 1000,
    //       "paymentAmount": 1000,
    //       "Status": "Partially Paid",
    //       "StatusCode": 4,
    //       "vPan": "CASPJ2345J",
    //       "actions": ['Modify Bill Amount'],
    //       "isSelected": true
    //     },
    //     {
    //       "vendor": "8888 : Krupesh",
    //       "_id": "10065-VB/MUMB/2324/000012",
    //       "vnCode": 8888,
    //       "vnName": "Krupesh",
    //       "billType": "Vendor Bill",
    //       "billNo": "VB/MUMB/2324/000012",
    //       "Date": "27/12/2023",
    //       "TotalTHCAmount": 10000,
    //       "AdvancePayedAmount": 2000,
    //       "billAmount": 8000,
    //       "pendingAmount": 8000,
    //       "paymentAmount": 8000,
    //       "Status": "Approved",
    //       "StatusCode": 2,
    //       "vPan": "CASPJ2345J",
    //       "actions": [
    //         "Bill Payment",
    //         "Cancel Bill"
    //       ],
    //       "isSelected": true
    //     },
    //     {
    //       "vendor": "8888 : Krupesh",
    //       "_id": "10065-VB/MUMB/2324/000013",
    //       "vnCode": 8888,
    //       "vnName": "Krupesh",
    //       "billType": "Vendor Bill",
    //       "billNo": "VB/MUMB/2324/000013",
    //       "Date": "27/12/2023",
    //       "TotalTHCAmount": 5000,
    //       "AdvancePayedAmount": 1000,
    //       "billAmount": 4000,
    //       "pendingAmount": 4000,
    //       "paymentAmount": 4000,
    //       "Status": "Approved",
    //       "StatusCode": 2,
    //       "vPan": "CASPJ2345J",
    //       "actions": [
    //         "Bill Payment",
    //         "Cancel Bill"
    //       ],
    //       "isSelected": true
    //     }
    //   ]
    this.billData = this.route.getCurrentNavigation()?.extras?.state?.data;
    console.log("this.billData", this.billData);
  }

  ngOnInit(): void {
    this.backPath = "/Finance/VendorPayment/VendorBillPayment"
    if (this.billData) {
      this.vendor = this.billData[0]?.vendor;
      this.initializeVendorBillPayment();
      this.getBillDetail(this.billData);
      //  this.getBillPayment();
    } else {
      this.RedirectToVendorBillPayment()
    }
  }
  // Initialize the vendor bill payment module
  initializeVendorBillPayment() {

    // Initialize the vendor bill payment control with the request object
    this.vendorBillPaymentControl = new vendorBillPaymentControl();

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
    this.isFormLode = true;

    this.vendorbillPaymentForm.controls["VendorPANNumber"].setValue(this.billData[0]?.vPan)
  }
  async getBillDetail(TableData) {
    this.isTableLode = false;

    let data = TableData
      .filter(x => x.pendingAmount != 0)
      .map(x => ({
        ...x,
        debitNote: 0,
        payment: 0,
        isSelected: false,
        Date: x.Date,
        actions: ['Modify Bill Amount']
      }));
    this.tableData = data
    this.isTableLode = true;
  }

  selectCheckBox(event) {
    const SelectedData = this.tableData.filter((x) => x.isSelected == true);
    this.TotalBillAmount = 0;
    this.TotalDebitNote = 0;
    this.TotalPaidAmount = 0;
    this.TotalPendingAmount = 0;
    this.TotalPaymentAmount = 0;

    SelectedData.forEach((element) => {
      this.TotalBillAmount = this.TotalBillAmount + +element.TotalTHCAmount;
      this.TotalDebitNote = this.TotalDebitNote + +element.debitNote;
      this.TotalPaidAmount = this.TotalPaidAmount + +element.AdvancePayedAmount;
      this.TotalPendingAmount = this.TotalPendingAmount + +element.pendingAmount;
      this.TotalPaymentAmount = this.TotalPaymentAmount + +element.paymentAmount //this.TotalPaymentAmount + +element.billAmount;
    });

    this.TotalAmountList.forEach((x) => {
      if (x.title == "Total Bill Amount") {
        x.count = this.TotalBillAmount.toFixed(2);
      }
      if (x.title == "Total Debit Note") {
        x.count = this.TotalDebitNote.toFixed(2);
      }
      if (x.title == "Total Paid Amount") {
        x.count = this.TotalPaidAmount.toFixed(2);
      }
      if (x.title == "Total Pending Amount") {
        x.count = this.TotalPendingAmount.toFixed(2);
      }
      if (x.title == "Total Payment Amount") {
        x.count = this.TotalPaymentAmount.toFixed(2);
      }
    });
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
    // console.log(res);
    if (res.success && res.data.length != 0) {
      this.BillPaymentData = res.data[0];
      const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode");
      PaymentMode.setValue(this.BillPaymentData.mOD);
      var selectDate = new Date(this.BillPaymentData.dTM);
      const FormDate = this.PaymentSummaryFilterForm.get("Date");
      FormDate.setValue(selectDate);
      this.OnPaymentModeChange("");
    }
  }

  // Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
    const Accountinglocation =
      this.PaymentSummaryFilterForm.value.BalancePaymentlocation?.name;
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
        const Bank = this.PaymentSummaryFilterForm.get("Bank");
        Bank.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();

        const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case "Cash":
        const responseFromAPICash = await GetAccountDetailFromApi(
          this.masterService,
          "CASH", Accountinglocation);
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

  async getBeneficiaryData() {
    try {
      // Get vendor code from bill data
      const vnCode = this.billData[0]?.vnCode;

      // Fetch beneficiary details from API
      const beneficiaryModalData = await this.objVendorBillService.getBeneficiaryDetailsFromApi(vnCode);

      // Check if beneficiary data is available
      if (beneficiaryModalData.length > 0) {
        // Prepare request object for the dialog
        const request = {
          Details: beneficiaryModalData,
        };

        // Set tableLoad flag to false to indicate loading
        this.tableLoad = false;

        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.dialog.open(BeneficiaryDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
          this.tableLoad = true;
        });
      } else {
        // Display a warning if no beneficiary data is available
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please Add Beneficiary Details To View",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error('An error occurred:', error);
    }
  }

  RedirectToVendorBillPayment() {
    this.route.navigate(["/Finance/VendorPayment/VendorBillPayment"]);
  }
  //#region to save payment details
  // Creating voucher_trans And voucher_trans_details And voucher_trans_document collection 
  save() {
    const PaymenDetails = this.PaymentSummaryFilterForm.value
    const BillNo = this.billData.billNo
    this.snackBarUtilityService.commonToast(async () => {
      try {
        if (!PaymenDetails) {
          return this.snackBarUtilityService.ShowCommonSwal("error", "Please Fill Payment Details");
        }

        const PaymentAmount = parseFloat(
          this.TotalBillAmount.toFixed(2)
        );
        const NetPayable = parseFloat(
          this.TotalPendingAmount.toFixed(2)
        );

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.transCode = VoucherInstanceType.VendorBillPayment;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.VendorBillPayment];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode = this.billData[0]?.vnCode ? this.billData[0]?.vnCode.toString() : '';
        this.VoucherDataRequestModel.partyName = this.billData[0]?.vnName ? this.billData[0]?.vnName : '';
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = this.vendorbillPaymentForm.get("VendorPANNumber").value;

        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = undefined;
        this.VoucherDataRequestModel.tcsAmount = undefined;

        this.VoucherDataRequestModel.GrossAmount = NetPayable;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = 0;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = PaymenDetails.PaymentMode;
        this.VoucherDataRequestModel.refNo = PaymenDetails?.ChequeOrRefNo || "";
        this.VoucherDataRequestModel.accountName = PaymenDetails?.Bank?.name || "";
        this.VoucherDataRequestModel.accountCode = PaymenDetails?.Bank?.value || "";
        this.VoucherDataRequestModel.date = PaymenDetails.Date;
        this.VoucherDataRequestModel.scanSupportingDocument = "";

        var VoucherlineitemList = this.tableData.filter((x) => x.isSelected == true).map((item) => {
          return {
            companyCode: this.storage.companyCode,
            voucherNo: "",
            transCode: VoucherInstanceType.VendorBillPayment,
            transType: VoucherInstanceType[VoucherInstanceType.VendorBillPayment],
            voucherCode: VoucherType.JournalVoucher,
            voucherType: VoucherType[VoucherType.JournalVoucher],
            transDate: new Date(),
            finYear: financialYear,
            branch: this.storage.branch,
            accCode: ledgerInfo['Unbilled debtors'].LeadgerCode,
            accName: ledgerInfo['Unbilled debtors'].LeadgerName,
            accCategory: ledgerInfo['Unbilled debtors'].LeadgerCategory,
            debit: parseFloat(item.pendingAmount).toFixed(2),
            credit: 0,
            GSTRate: 0,
            GSTAmount: 0,
            Total: parseFloat(item.pendingAmount).toFixed(2),
            TDSApplicable: false,
            narration: "when Vendor Bill Payment against Bill No " + item.billNo,
          };
        });

        this.VoucherRequestModel.details = VoucherlineitemList;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {
          this.GenerateVendorBills(res?.data?.mainData?.ops[0].vNO, PaymenDetails);

          Swal.fire({
            icon: "success",
            title: "Voucher Created Successfully",
            text: "Voucher No: " + res?.data?.mainData?.ops[0].vNO,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.hideLoading();
              setTimeout(() => {
                Swal.close();
                this.RedirectToVendorBillPayment()
              }, 2000);
            }
          });
        }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
          .finally(() => {
          });

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "Fail To Submit Data..!"
        );
      }
    }, "Advance Payment Voucher Generating..!");
  }
  GenerateVendorBills(voucherno, PaymenDetails) {
    const GenerateVendorBill: GenerateVendorBill = {
      companyCode: this.companyCode,
      VocuherNo: voucherno,
      paymentMode: PaymenDetails.PaymentMode,
      refNo: PaymenDetails?.ChequeOrRefNo || "",
      accountName: PaymenDetails?.Bank?.name || "",
      date: PaymenDetails.Date,
      paymentAmount: this.TotalPendingAmount,
      branch: this.storage.branch,
      user: this.storage.userName,

      BillList: this.tableData.filter((x) => x.isSelected == true).map((item) => {
        return {
          billNo: item.billNo,
          // TotalTHCAmount: item.TotalTHCAmount,
          // AdvancePayedAmount: item.AdvancePayedAmount,
          // billAmount: item.billAmount,
          PaymentAmount: item.paymentAmount,
          // PendingAmount: item.pendingAmount - item.paymentAmount,
          ispartial: (item.pendingAmount - item.paymentAmount) == 0 ? false : true,
        }
      })
    }
    firstValueFrom(this.masterService.masterPost("finance/bill/GenerateVendorBills", GenerateVendorBill)).then((res: any) => {
      Swal.fire({
        icon: "success",
        title: "Bill Payment Done Successful",
        text: "Voucher No: " + voucherno,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.hideLoading();
          setTimeout(() => {
            Swal.close();
            this.RedirectToVendorBillPayment()
          }, 1000);
        }
      });

      console.log(res)
    }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })

  }
  async showPaymentAmountPrompt(data) {
    const { value } = await Swal.fire({
      title: 'Enter Payment Amount',
      input: 'number',
      showCancelButton: true,
      customClass: {
        validationMessage: 'my-validation-message',
      },
      preConfirm: async (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Payment Amount is required')
        } else if (inputValue > data.data.pendingAmount) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Payment Amount is greater than pending amount')
        } else if (inputValue < 0) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Payment Amount is less than zero')
        } else if (inputValue == 0) {
          Swal.showValidationMessage('<i class="fa fa-info-circle"></i> Payment Amount is zero')
        }
      },
    });

    return value;
  }

  async handleMenuItemClick(data) {
    if (data?.data) {
      try {
        const paymentAmount = await this.showPaymentAmountPrompt(data);

        if (paymentAmount != undefined) {
          this.tableLoad = false;

          this.tableData.find(x => x.billNo == data.data.billNo).paymentAmount = paymentAmount;
          this.tableLoad = true;
          this.selectCheckBox(false);

          Swal.fire('Success!', 'Payment Amount Entered Successfully!', 'success');
        }

      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  }


}