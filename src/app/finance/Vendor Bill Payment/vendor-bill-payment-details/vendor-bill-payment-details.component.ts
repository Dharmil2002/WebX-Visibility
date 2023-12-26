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
import { DebitVoucherDataRequestModel, DebitVoucherRequestModel, } from "src/app/Models/Finance/Finance";
import { StorageService } from "src/app/core/service/storage.service";
import { financialYear } from "src/app/Utility/date/date-utils";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";

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
  tableData: any;

  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    bILLNO: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:200px"
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

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];
  addFlag = true;
  menuItemflag = true;

  staticField = ["bALAMT", "tHCAMT", "debitNote", "eNTDT", "aDVAMT", "payment", "bILLNO"];
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
  debitVoucherRequestModel = new DebitVoucherRequestModel();
  debitVoucherDataRequestModel = new DebitVoucherDataRequestModel();
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
    this.billData = this.route.getCurrentNavigation()?.extras?.state?.data;
    // console.log("this.billData", this.billData);
  }

  ngOnInit(): void {
    this.backPath = "/Finance/VendorPayment/VendorBillPayment"
    if (this.billData) {
      this.vendor = this.billData.vendor;
      this.initializeVendorBillPayment();
      this.getBillDetail();
      this.getBillPayment();
    } else {
      this.RedirectToVendorBillPayment()
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
      let data = res.data.map((x) => {
        return {
          ...x,
          debitNote: 0,
          payment: 0,
          isSelected: false,
          eNTDT: moment(x.eNTDT).format("DD/MM/YYYY"),
        };
      });
      this.tableData = data
      this.isTableLode = true;

      data.forEach(element => {
        if (element.Status === 'Cancel Bill') {
          // Remove all values from the actions array
          element.actions = [];
        }
      });
    }

  }

  selectCheckBox(event) {
    // console.log(event);
    // console.log("this.tableData", this.tableData);
    const SelectedData = this.tableData.filter((x) => x.isSelected == true);
    this.TotalBillAmount = 0;
    this.TotalDebitNote = 0;
    this.TotalPaidAmount = 0;
    this.TotalPendingAmount = 0;
    this.TotalPaymentAmount = 0;

    SelectedData.forEach((element) => {
      this.TotalBillAmount = this.TotalBillAmount + +element.tHCAMT;
      this.TotalDebitNote = this.TotalDebitNote + +element.debitNote;
      this.TotalPaidAmount = this.TotalPaidAmount + +element.aDVAMT;
      this.TotalPendingAmount = this.TotalPendingAmount + +element.bALAMT;
      this.TotalPaymentAmount = this.TotalPaymentAmount + +element.payment;
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

    this.vendorbillPaymentForm.controls["VendorPANNumber"].setValue(this.billData?.vPan)
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
  // save() {
  //   const selectedItems = this.tableData.filter(x => x.isSelected);

  //   if (selectedItems.length === 0) {
  //     this.snackBarUtilityService.ShowCommonSwal("info", "Please Select At Least One Bill");
  //     return;
  //   }

  //   selectedItems.forEach(item => {
  //     const vendbillpayment: Vendbillpayment = {
  //       _id: this.billData.billNo + "-" + item.tRIPNO,
  //       cID: this.companyCode,
  //       bILLNO: this.billData.billNo,
  //       vUCHNO: this.BillPaymentData ? this.BillPaymentData.vUCHNO : '',
  //       lOC: localStorage.getItem("CurrentBranchCode"),
  //       dTM: this.PaymentSummaryFilterForm.value.Date.toUTCString(),
  //       bILLAMT: item.bALAMT,
  //       pAYAMT: item.payment,
  //       aMT: item.tHCAMT,
  //       mOD: this.PaymentSummaryFilterForm.value.PaymentMode,
  //       bANK: this.PaymentSummaryFilterForm.value?.Bank?.name || "",
  //       tRNO: this.PaymentSummaryFilterForm.value?.ChequeOrRefNo || "",
  //       eNTDT: new Date(),
  //       eNTLOC: localStorage.getItem("CurrentBranchCode"),
  //       eNTBY: localStorage.getItem("UserName"),
  //     };

  //     console.log(vendbillpayment);

  //     const requestData = {
  //       companyCode: this.companyCode,
  //       collectionName: "vend_bill_payment",
  //       data: vendbillpayment,
  //     };
  //     console.log(requestData);

  //     firstValueFrom(this.masterService.masterPost("generic/create", requestData))
  //       .then((res: any) => {
  //         // Handle success if needed 
  //         Swal.fire({
  //           icon: "success",
  //           title: "Vendor Bill Payment Generated Successfully",
  //           text: "Bill No: " + this.billData.billNo,
  //           showConfirmButton: true,
  //         });
  //       })
  //       .catch(error => {
  //         this.snackBarUtilityService.ShowCommonSwal("error", error);
  //       });
  //   });


  // }

  async getBeneficiaryData() {
    try {
      // Get vendor code from bill data
      const vnCode = this.billData.vnCode;

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

        this.debitVoucherRequestModel.companyCode = this.companyCode;
        this.debitVoucherRequestModel.docType = "VR";
        this.debitVoucherRequestModel.branch = this.storage.branch;
        this.debitVoucherRequestModel.finYear = financialYear;

        this.debitVoucherDataRequestModel.companyCode = this.companyCode;
        this.debitVoucherDataRequestModel.voucherNo = "";
        this.debitVoucherDataRequestModel.transType = "BalancePayment";
        this.debitVoucherDataRequestModel.transDate = new Date();
        this.debitVoucherDataRequestModel.docType = "VR";
        this.debitVoucherDataRequestModel.branch = this.storage.branch;
        this.debitVoucherDataRequestModel.finYear = financialYear;

        this.debitVoucherDataRequestModel.accLocation = this.storage.branch;
        this.debitVoucherDataRequestModel.preperedFor = "Vendor";
        this.debitVoucherDataRequestModel.partyCode = this.billData.vnCode ? this.billData.vnCode.toString() : '';
        this.debitVoucherDataRequestModel.partyName = this.billData.vnName ? this.billData.vnName : '';
        // this.debitVoucherDataRequestModel.partyState =            this.VendorDetails?.vendorState;
        this.debitVoucherDataRequestModel.entryBy = this.storage.userName;
        this.debitVoucherDataRequestModel.entryDate = new Date();
        this.debitVoucherDataRequestModel.panNo = this.vendorbillPaymentForm.get("VendorPANNumber").value;
        // this.debitVoucherDataRequestModel.tdsSectionCode = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "";
        // this.debitVoucherDataRequestModel.tdsSectionName = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : ""
        // this.debitVoucherDataRequestModel.tdsRate = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0;
        // this.debitVoucherDataRequestModel.tdsAmount = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0;
        this.debitVoucherDataRequestModel.tdsAtlineitem = false;
        this.debitVoucherDataRequestModel.tcsSectionCode = undefined;
        this.debitVoucherDataRequestModel.tcsSectionName = undefined
        this.debitVoucherDataRequestModel.tcsRate = 0;
        this.debitVoucherDataRequestModel.tcsAmount = 0;

        // this.debitVoucherDataRequestModel.IGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0,
        //   this.debitVoucherDataRequestModel.SGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0,
        //   this.debitVoucherDataRequestModel.CGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0,
        //   this.debitVoucherDataRequestModel.UGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount) || 0,
        //   this.debitVoucherDataRequestModel.GSTTotal = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.debitVoucherDataRequestModel.paymentAmt = PaymentAmount;
        this.debitVoucherDataRequestModel.netPayable = NetPayable;
        this.debitVoucherDataRequestModel.roundOff = 0;
        this.debitVoucherDataRequestModel.voucherCanceled = false;

        this.debitVoucherDataRequestModel.paymentMode =
          PaymenDetails.PaymentMode;
        this.debitVoucherDataRequestModel.refNo =
          PaymenDetails?.ChequeOrRefNo || "";
        this.debitVoucherDataRequestModel.accountName =
          PaymenDetails?.Bank?.name || "";
        this.debitVoucherDataRequestModel.date =
          PaymenDetails.Date;
        this.debitVoucherDataRequestModel.scanSupportingDocument = ""; //this.imageData?.ScanSupportingdocument
        this.debitVoucherDataRequestModel.paymentAmtount = NetPayable;

        const companyCode = this.companyCode;
        const CurrentBranchCode = this.storage.branch;
        var VoucherlineitemList = this.tableData.filter((x) => x.isSelected == true).map((item) => {
          return {
            companyCode: companyCode,
            voucherNo: "",
            transType: "BalancePayment",
            transDate: new Date(),
            finYear: financialYear,
            branch: CurrentBranchCode,
            accCode: "TEST",
            accName: "TEST",
            // sacCode: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.value.toString(),
            // sacName: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.name.toString(),
            debit: parseFloat(item.debitNote).toFixed(2),
            credit: 0,
            GSTRate: 0,
            GSTAmount: 0,
            Total: parseFloat(item.tHCAMT).toFixed(2),
            TDSApplicable: false,
            narration: "",
          };
        });

        this.debitVoucherRequestModel.details = VoucherlineitemList;
        this.debitVoucherRequestModel.data = this.debitVoucherDataRequestModel;
        this.debitVoucherRequestModel.debitAgainstDocumentList = [];
        // console.log(this.debitVoucherRequestModel);

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.debitVoucherRequestModel)).then((res: any) => {
          this.vendbillpayment(BillNo, res?.data?.mainData?.ops[0].vNO, PaymenDetails)

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
  // step 5 create vend_bill_payment collection
  vendbillpayment(BillNo, voucherno, PaymenDetails) {
    this.tableData.filter((x) => x.isSelected == true).forEach((item) => {

      const vendbillpayment: Vendbillpayment = {
        _id: this.companyCode + "-" + BillNo + "-" + voucherno + "-" + item.tRIPNO,
        cID: this.companyCode,
        bILLNO: BillNo,
        vUCHNO: voucherno,
        lOC: this.storage.branch,
        dTM: PaymenDetails.Date,
        bILLAMT: item.aDVAMT,
        pAYAMT: item.bALAMT,
        pENDBALAMT: 0,
        aMT: item.tHCAMT,
        mOD: PaymenDetails.PaymentMode,
        bANK: PaymenDetails?.Bank?.name || "",
        tRNO: PaymenDetails?.ChequeOrRefNo || "",
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName,
      };

      const RequestData = {
        companyCode: this.companyCode,
        collectionName: "vend_bill_payment",
        data: vendbillpayment,
      };
      console.log(vendbillpayment);

      firstValueFrom(this.masterService.masterPost("generic/create", RequestData)).then((res: any) => {
        this.updateVendorBillDetail();

      }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
        .finally(() => {
        });
    })
    Swal.fire({
      icon: "success",
      title: "Vendor Bill Payment Generated Successfully",
      text: "Bill No: " + BillNo,
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
  updateVendorBillDetail() {
    // const data = {
    //   bSTAT: generateVoucher == true ? 4 : 1,
    //   bSTATNM: generateVoucher == true ? "Paid" : "Generated",
    //   pENDBALAMT: generateVoucher == true ? 0 : x.BalancePending,
    //   mODDT: new Date(),
    //   mODLOC: this.storage.branch,
    //   mODBY: this.storage.userName,
    // };
    // const bILLNO = this.billData.billNo;
    // const requestData = {
    //   companyCode: this.companyCode,
    //   collectionName: "vend_bill_det",
    //   filter: { bILLNO: bILLNO },
    //   data: data,
    // };

    // console.log(data);

    // firstValueFrom(this.masterService.masterPut("generic/update", requestData))
    //   .then((res: any) => {
    //     // Handle the response if needed
    //     console.log(res);
    //   })
    //   .catch((error: any) => {
    //     // Handle errors
    //     console.error("Error updating vendor bill details:", error);
    //   });
  }

  //#endregion
}