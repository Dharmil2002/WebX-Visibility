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
import { GetBankDetailFromApi } from "../../Debit Voucher/debitvoucherAPIUtitlity";

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
      Style: "min-width:200px",
      datatype: "string"
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
    PayedAmount: {
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
    { label: 'Partial Payment' },
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

  staticField = ["paymentAmount", "TotalTHCAmount", "debitNote", "Date", "PayedAmount", "pendingAmount", "billNo"];
  summaryStaticField = ["amt", "institute", "ref", "paymentMethod"];
  documentSaticField = ["docNo", "document", "date"];
  companyCode: any = 0;
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
    this.companyCode = this.storage.companyCode;
    this.billData = this.route.getCurrentNavigation()?.extras?.state?.data;
    console.log(this.billData)
  }

  ngOnInit(): void {
    this.backPath = "/Finance/VendorPayment/VendorBillPayment"
    if (this.billData) {
      this.vendor = this.billData[0]?.vendor;
      this.initializeVendorBillPayment();
      this.getBillDetail(this.billData);
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
      //this.vendorBillPaymentControl.getPaymentSummaryControl();
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
        debitNote: (x.TotalTHCAmount) - (x.pendingAmount + x.PayedAmount),
        payment: 0,
        isSelected: false,
        Date: x.Date,
        actions: ['Partial Payment']
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
      this.TotalPaidAmount = this.TotalPaidAmount + +element.PayedAmount;
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
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "JournalAccount";
        break;
      case "Cash":
        filterFunction = (x) => x.name !== "ChequeOrRefNo" && x.name !== "Bank" && x.name !== "JournalAccount";
        break;
      case "RTGS/UTR":
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "JournalAccount";
        break;
      case "Journal":
        filterFunction = (x) => x.name !== "CashAccount" && x.name !== "Bank" && x.name !== "ChequeOrRefNo";
        break;
    }

    this.jsonPaymentSummaryArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);

    switch (PaymentMode) {
      case "Cheque":
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)

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

        // Remove Journal Account
        const JournalAccount = this.PaymentSummaryFilterForm.get("JournalAccount");
        JournalAccount.setValue("");
        JournalAccount.clearValidators();
        JournalAccount.updateValueAndValidity();

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

        // Remove Journal Account
        const JournalAccounts = this.PaymentSummaryFilterForm.get("JournalAccount");
        JournalAccounts.setValue("");
        JournalAccounts.clearValidators();
        JournalAccounts.updateValueAndValidity();

        break;
      case "RTGS/UTR":
        break;
      case "Journal":
        const responseFromAPIJournal = await GetAccountDetailFromApi(
          this.masterService);
        this.filter.Filter(
          this.jsonPaymentSummaryArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIJournal,
          "JournalAccount",
          false
        );

        const JournalAccountS = this.PaymentSummaryFilterForm.get("JournalAccount");
        JournalAccountS.setValidators([
          Validators.required,
          autocompleteObjectValidator(),
        ]);
        JournalAccountS.updateValueAndValidity();

        const BankSS = this.PaymentSummaryFilterForm.get("Bank");
        BankSS.setValue("");
        BankSS.clearValidators();
        BankSS.updateValueAndValidity();

        const ChequeOrRefNoSS =
          this.PaymentSummaryFilterForm.get("ChequeOrRefNo");
        ChequeOrRefNoSS.setValue("");
        ChequeOrRefNoSS.clearValidators();
        ChequeOrRefNoSS.updateValueAndValidity();

        const CashAccountSS = this.PaymentSummaryFilterForm.get("CashAccount");
        CashAccountSS.setValue("");
        CashAccountSS.clearValidators();
        CashAccountSS.updateValueAndValidity();
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
    const BillNoList = this.billData.map(item => item.billNo)
    const BillNo = BillNoList.join(",")
    this.snackBarUtilityService.commonToast(async () => {
      try {
        if (!PaymenDetails) {
          return this.snackBarUtilityService.ShowCommonSwal("error", "Please Fill Payment Details");
        }
        const PaymentMode = PaymenDetails.PaymentMode;
        if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
          const BankDetails = PaymenDetails.Bank;
          const AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", this.storage.branch)
          const AccountDetails = AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
          if (AccountDetails != undefined) {
            PaymenDetails.Bank = AccountDetails;
          } else {
            this.snackBarUtilityService.ShowCommonSwal("info", "Please select valid Bank Which is mapped with Account Master")
            return;
          }
        }
        let
          LeadgerDetails;
        if (PaymentMode == "Cash") {
          LeadgerDetails = PaymenDetails.CashAccount;
        }
        if (PaymentMode == "Journal") {
          LeadgerDetails = PaymenDetails.JournalAccount;
        }
        const NetPayable = parseFloat(
          this.TotalPaymentAmount.toFixed(2)
        );

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.transCode = VoucherInstanceType.VendorBillPayment;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.VendorBillPayment];
        this.VoucherDataRequestModel.voucherCode = PaymentMode != "Journal" ? VoucherType.DebitVoucher : VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = PaymentMode != "Journal" ? VoucherType[VoucherType.DebitVoucher] : VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode = "" + this.billData[0]?.vnCode ? this.billData[0]?.vnCode.toString() : '';
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
        this.VoucherDataRequestModel.refNo = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.ChequeOrRefNo : "";
        this.VoucherDataRequestModel.accountName = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANM : LeadgerDetails?.name || "";
        this.VoucherDataRequestModel.accountCode = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANCD : LeadgerDetails?.value || "";
        this.VoucherDataRequestModel.date = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Date : "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";

        var VoucherlineitemList = this.GetDebitVoucherLedgers(NetPayable, BillNo, PaymenDetails);

        this.VoucherRequestModel.details = VoucherlineitemList;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {

          let reqBody = {
            companyCode: this.storage.companyCode,
            voucherNo: res?.data?.mainData?.ops[0].vNO,
            transDate: Date(),
            finYear: financialYear,
            branch: this.storage.branch,
            transCode: VoucherInstanceType.VendorBillPayment,
            transType: VoucherInstanceType[VoucherInstanceType.VendorBillPayment],
            voucherCode: PaymentMode != "Journal" ? VoucherType.DebitVoucher : VoucherType.JournalVoucher,
            voucherType: PaymentMode != "Journal" ? VoucherType[VoucherType.DebitVoucher] : VoucherType[VoucherType.JournalVoucher],
            docType: "Voucher",
            partyType: "Vendor",
            docNo: BillNo,
            partyCode: "" + this.billData[0]?.vnCode ? this.billData[0]?.vnCode.toString() : '',
            partyName: this.billData[0]?.vnName ? this.billData[0]?.vnName : '',
            entryBy: this.storage.userName,
            entryDate: Date(),
            debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
              return {
                "accCode": item.accCode,
                "accName": item.accName,
                "accCategory": item.accCategory,
                "amount": item.debit,
                "narration": item.narration ?? ""
              };
            }),
            credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
              return {
                "accCode": item.accCode,
                "accName": item.accName,
                "accCategory": item.accCategory,
                "amount": item.credit,
                "narration": item.narration ?? ""
              };
            }),
          };
          firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then((res: any) => {
            if (res) {
              this.GenerateVendorBills(reqBody.voucherNo, PaymenDetails);
              Swal.fire({
                icon: "success",
                title: "Voucher Created Successfully",
                text: "Voucher No: " + reqBody.voucherNo,
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
    const PaymentMode = PaymenDetails.PaymentMode;
    let LeadgerDetails;
    if (PaymentMode == "Cash") {
      LeadgerDetails = PaymenDetails.CashAccount;
    }
    if (PaymentMode == "Journal") {
      LeadgerDetails = PaymenDetails.JournalAccount;
    }
    const GenerateVendorBill: GenerateVendorBill = {
      companyCode: this.companyCode,
      VocuherNo: voucherno,
      paymentMode: PaymentMode,
      refNo: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.ChequeOrRefNo : "",
      accountName: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANM : LeadgerDetails?.name || "",
      date: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.date : "",
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
  GetDebitVoucherLedgers(NetPayable, BillNo, paymentData) {

    const createVoucher = (accCode, accName, accCategory, debit, credit, BillNo) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.VendorBillPayment,
      transType: VoucherInstanceType[VoucherInstanceType.VendorBillPayment],
      voucherCode: VoucherType.DebitVoucher,
      voucherType: VoucherType[VoucherType.DebitVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: "",
      sacName: "",
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Vendor bill payment has been issued : ${BillNo}`
    });

    const Result = [];



    Result.push(createVoucher(ledgerInfo['LIA001002'].LeadgerCode, ledgerInfo['LIA001002'].LeadgerName, ledgerInfo['LIA001002'].LeadgerCategory, NetPayable, 0, BillNo));
    const PaymentMode = paymentData.PaymentMode;
    if (PaymentMode == "Cash") {
      const CashAccount = paymentData.CashAccount;
      Result.push(createVoucher(CashAccount.aCCD, CashAccount.aCNM, "ASSET", 0, NetPayable, BillNo));
    }
    if (PaymentMode == "Journal") {
      const JournalAccount = paymentData.JournalAccount;
      Result.push(createVoucher(JournalAccount.value, JournalAccount.name, "ASSET", 0, NetPayable, BillNo));
    }
    if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = paymentData.Bank;
      Result.push(createVoucher(BankDetails.value, BankDetails.name, "ASSET", 0, NetPayable, BillNo));
    }
    return Result;
  }

}