import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Observable, Subject, firstValueFrom, forkJoin, throwError, timer } from "rxjs";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { VendorPaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol";
import { THCAmountsDetailComponent } from "../Modal/thcamounts-detail/thcamounts-detail.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
  GetAccountDetailFromApi,
  GetAdvancePaymentListFromApi,
  GetLocationDetailFromApi,
  GetSingleVendorDetailsFromApi,
} from "../VendorPaymentAPIUtitlity";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import {
  VoucherDataRequestModel,
  VoucherInstanceType,
  VoucherRequestModel,
  VoucherType,
  ledgerInfo,
} from "src/app/Models/Finance/Finance";
import { financialYear } from "src/app/Utility/date/date-utils";
import Swal from "sweetalert2";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { VendorBillService } from "../../Vendor Bills/vendor-bill.service";
import { StorageService } from "src/app/core/service/storage.service";
import { VendorsVehicleDetailComponent } from "../Modal/vendors-vehicle-detail/vendors-vehicle-detail.component";
import { BeneficiaryDetailComponent } from "../../Vendor Bills/beneficiary-detail/beneficiary-detail.component";
import { catchError, concatMap, filter, finalize, mergeMap, switchMap } from 'rxjs/operators';
import { GetBankDetailFromApi } from "../../Debit Voucher/debitvoucherAPIUtitlity";
@Component({
  selector: "app-advance-payments",
  templateUrl: "./advance-payments.component.html",
})
export class AdvancePaymentsComponent implements OnInit {
  breadScrums = [
    {
      title: "Advance Payments",
      items: ["Home"],
      active: "Advance Payments",
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
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    THC: {
      Title: "THC",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "BalanceUnbilledFunction",
    },
    GenerationDate: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    VehicleNumber: {
      Title: "Vehicle No.",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    THCamount: {
      Title: "THC Amount ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "THCAmountFunction",
    },
    Advance: {
      Title: "Advance ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    // AdvancePending: {
    //   Title: "Advance Pending ⟨₹⟩",
    //   class: "matcolumncenter",
    //   Style: "min-width:15%",
    // },
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
  staticField = ["GenerationDate", "VehicleNumber", "Advance"];
  companyCode = 0;
  tableData;
  AllLocationsList: any;
  isTableLode = false;
  AccountsBanksList: any;
  vendorPaymentControl: VendorPaymentControl;
  protected _onDestroy = new Subject<void>();

  PayableSummaryFilterForm: UntypedFormGroup;
  jsonControlPayableSummaryFilterArray: any;

  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonControlPaymentSummaryFilterArray: any;
  AlljsonControlPaymentSummaryFilterArray: any;

  PaymentHeaderFilterForm: UntypedFormGroup;
  jsonControlPaymentHeaderFilterArray: any;

  TotalAmountList: { count: any; title: string; class: string }[];
  PaymentData;
  VendorDetails;

  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  constructor(
    private filter: FilterUtils,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private route: Router,
    private objVendorBillService: VendorBillService,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private matDialog: MatDialog,
    private storage: StorageService,
  ) {
    // Retrieve the passed data from the state
    this.companyCode = this.storage.companyCode;
    this.PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (this.PaymentData) {
      this.GetAdvancePaymentList();
    } else {
      this.RedirectToTHCPayment();
    }
  }
  RedirectToTHCPayment() {
    this.route.navigate(["/Finance/VendorPayment/THC-Payment"]);
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.TotalAmountList = [
      {
        count: "00",
        title: "Total THC Amount",
        class: `color-Success-light`,
      },
      {
        count: "00",
        title: "Total Advance",
        class: `color-Success-light`,
      },
    ];
    this.GetVendorInformation();
    this.SetMastersData();
  }
  async GetVendorInformation() {
    this.VendorDetails = await GetSingleVendorDetailsFromApi(
      this.masterService,
      this.PaymentData?.VendorInfo?.cD
    );
    // Set Existing Vendor Data 

    this.PaymentHeaderFilterForm.get("VendorPANNumber").setValue(
      this.PaymentData?.VendorInfo?.pAN
    );
    this.getVendorsVehicles(false);

  }
  async GetAdvancePaymentList() {
    this.isTableLode = false;
    const Filters = {
      PaymentType: "Advance",
      StartDate: this.PaymentData?.StartDate,
      EndDate: this.PaymentData?.EndDate,
      VendorInfo: this.PaymentData?.VendorInfo,
      Mode: this.PaymentData?.Mode
    };
    const GetAdvancePaymentData = await GetAdvancePaymentListFromApi(
      this.masterService,
      Filters
    );
    this.tableData = GetAdvancePaymentData.map((x) => {
      return {
        isSelected: false,
        ...x,
      };
    });
    this.isTableLode = true;
    this.selectCheckBox()
  }
  async SetMastersData() {
    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService);
    this.filter.Filter(
      this.jsonControlPayableSummaryFilterArray,
      this.PayableSummaryFilterForm,
      this.AllLocationsList,
      "BalancePaymentlocation",
      false
    );

    const paymentstate = this.AllLocationsList.find(
      (item) => item.name == this.storage.branch
    );
    this.PayableSummaryFilterForm.get("BalancePaymentlocation").setValue(
      paymentstate
    );
  }
  initializeFormControl(): void {
    this.vendorPaymentControl = new VendorPaymentControl("");
    this.jsonControlPayableSummaryFilterArray =
      this.vendorPaymentControl.getTPayableSummaryFilterArrayControls();
    this.PayableSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPayableSummaryFilterArray,
    ]);

    this.jsonControlPaymentSummaryFilterArray =
      this.vendorPaymentControl.getTPaymentSummaryFilterArrayControls();
    this.AlljsonControlPaymentSummaryFilterArray =
      this.jsonControlPaymentSummaryFilterArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentSummaryFilterArray,
    ]);
    this.jsonControlPaymentSummaryFilterArray =
      this.jsonControlPaymentSummaryFilterArray.slice(0, 1);

    this.jsonControlPaymentHeaderFilterArray =
      this.vendorPaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentHeaderFilterArray,
    ]);
  }

  AdvancePendingFunction(event) {
    console.log("AdvancePendingFunction", event);
  }

  BalanceUnbilledFunction(event) {
    console.log("BalanceUnbilledFunction", event);
    const templateBody = {
      DocNo: event.data.THC,
      templateName: "THC View-Print",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1500,height=800");
  }

  THCAmountFunction(event) {
    const RequestBody = {
      BillPaymentData: this.PaymentData,
      THCData: event?.data,
      Type: "Advance",
      Mode: this.PaymentData?.Mode,
    };
    const dialogRef = this.matDialog.open(THCAmountsDetailComponent, {
      data: RequestBody,
      width: "90%",
      height: "95%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (result.success) {
          this.GetAdvancePaymentList();
        }
      }
    });
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
  selectCheckBox() {
    const selectedData = this.tableData.filter((x) => x.isSelected);

    const totalTHCAmount = selectedData.reduce(
      (total, item) => total + parseInt(item.THCamount),
      0
    );
    const totalAdvance = selectedData.reduce(
      (total, item) => total + parseInt(item.Advance),
      0
    );

    this.TotalAmountList.forEach((x) => {
      if (x.title === "Total THC Amount") {
        x.count = totalTHCAmount.toFixed(2);
      }
      if (x.title === "Total Advance") {
        x.count = totalAdvance.toFixed(2);
      }
    });

    this.PayableSummaryFilterForm.get("TotalTHCAmount").setValue(
      totalTHCAmount.toFixed(2)
    );
    this.PayableSummaryFilterForm.get("AdvanceAmount").setValue(
      totalAdvance.toFixed(2)
    );
    this.PayableSummaryFilterForm.get("BalancePayable").setValue(
      (totalTHCAmount - totalAdvance).toFixed(2)
    );
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

    this.jsonControlPaymentSummaryFilterArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation =
      this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name;
    switch (PaymentMode) {
      case "Cheque":
        // const responseFromAPIBank = await GetAccountDetailFromApi(
        //   this.masterService,
        //   "BANK",
        //   Accountinglocation
        // );
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
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
          "CASH",
          Accountinglocation
        );
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
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


  UpdateTHCAmount(inputData, Mode = "FTL") {
    const outputData = {};

    inputData.forEach(item => {
      if (!outputData[item.THCNo]) {
        outputData[item.THCNo] = [item.VoucherNo];
      } else {
        outputData[item.THCNo].push(item.VoucherNo);
      }
    });

    const ResultList = Object.keys(outputData).map(key => ({
      THCNo: key,
      VoucherNo: outputData[key]
    }));

    const isSelectedData = ResultList;
    isSelectedData.forEach((x) => {
      let commonBody;
      commonBody = {
        aDVPENAMT: 0,
        aDVVUCH: x.VoucherNo,
        mODDT: new Date(),
        mODLOC: this.storage.branch,
        mODBY: this.storage.userName,
      }
      const reqBody = {
        companyCode: this.companyCode,
        collectionName: Mode === "FTL" ? 'thc_summary' : 'thc_summary_ltl',
        filter: {
          cID: this.storage.companyCode,
          docNo: x.THCNo
        },
        update: commonBody,
      };
      firstValueFrom(this.masterService.masterPut('generic/update', reqBody)).then((res: any) => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Voucher Created Successfully And THC Updated Successfully",
            text: "Voucher No: " + x.VoucherNo.toLocaleString(),
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.hideLoading();
              setTimeout(() => {
                Swal.close();
              }, 2000);
              this.RedirectToTHCPayment();
            }
          });
        }
      }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
        .finally(() => {
        });
    })
  }
  convertFieldsToNumbers(formValue) {
    return Object.keys(formValue).reduce((acc, key) => {
      acc[key] = parseFloat(formValue[key]);
      return acc;
    }, {});
  }
  async getBeneficiaryData() {
    try {
      // Fetch beneficiary details from API
      const beneficiaryModalData = await this.objVendorBillService.getBeneficiaryDetailsFromApi(this.PaymentData?.VendorInfo
        ?.cD);

      // Check if beneficiary data is available
      if (beneficiaryModalData.length > 0) {
        // Prepare request object for the dialog
        const request = {
          Details: beneficiaryModalData,
        };


        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.matDialog.open(BeneficiaryDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
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
  BalancePaymentlocationFieldChanged(event) {
    console.log(event)
    this.OnPaymentModeChange(event);
  }
  async getVendorsVehicles(OpenAble = false) {
    try {
      // Fetch beneficiary details from API
      const VendorWiseVehicleData = await this.objVendorBillService.getVendorsWiseVehicleList(this.PaymentData?.VendorInfo
        ?.nM);
      this.PaymentHeaderFilterForm.get("Numberofvehiclesregistered").setValue(VendorWiseVehicleData.length);

      // Check if beneficiary data is available
      if (VendorWiseVehicleData.length > 0 && OpenAble) {
        // Prepare request object for the dialog
        const request = {
          Details: VendorWiseVehicleData,
        };


        // Open the BeneficiaryDetailComponent dialog
        const dialogRef = this.matDialog.open(VendorsVehicleDetailComponent, {
          data: request,
          width: "100%",
          disableClose: true,
          position: {
            top: "20px",
          },
        });

        // Subscribe to dialog's afterClosed event to set tableLoad flag back to true
        dialogRef.afterClosed().subscribe(() => {
        });
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error('An error occurred:', error);
    }
  }
  vehiclesregisteredview(event) {

    this.getVendorsVehicles(true);
  }



  Submit() {
    const selectedData = this.tableData.filter(item => item.isSelected);

    if (selectedData.length === 0) {
      this.snackBarUtilityService.ShowCommonSwal("info", "Please Select Atleast One THC");
      return;
    }

    this.snackBarUtilityService.commonToast(async () => {
      try {
        const Response = [];

        // Process Journal Requests
        for (let i = 0; i < selectedData.length; i++) {
          const data = selectedData[i];
          const result = await firstValueFrom(this.createJournalRequest(data));

          const ResultObject = {
            THCNo: result.data.ops[0].docNo,
            VoucherNo: result.data.ops[0].vNO
          };

          Response.push(ResultObject);
        }

        // Process Debit Requests
        for (let i = 0; i < selectedData.length; i++) {
          const data = selectedData[i];
          const result = await firstValueFrom(this.createDebitRequest(data));

          const ResultObject = {
            THCNo: result.data.ops[0].docNo,
            VoucherNo: result.data.ops[0].vNO
          };

          Response.push(ResultObject);
        }

        this.UpdateTHCAmount(Response, this.PaymentData?.Mode);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error);
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 2000);
      }
    }, "Advance Payment Voucher Generating..!");
  }
  createJournalRequest(data: any): Observable<any> {
    // Construct the voucher request payload
    const voucherRequest = {
      companyCode: this.companyCode,
      docType: "VR",
      branch: this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name,
      finYear: financialYear,
      details: [],
      debitAgainstDocumentList: [],
      data: {
        transCode: VoucherInstanceType.AdvancePayment,
        transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
        voucherCode: VoucherType.JournalVoucher,
        voucherType: VoucherType[VoucherType.JournalVoucher],
        transDate: new Date(),
        docType: "VR",
        branch: this.storage.branch,
        finYear: financialYear,
        accLocation: this.storage.branch,
        preperedFor: "Vendor",
        partyCode: data?.OthersData?.vND?.cD || "",
        partyName: data?.OthersData?.vND?.nM,
        partyState: this.VendorDetails?.vendorState || "",
        entryBy: this.storage.userName,
        entryDate: new Date(),
        panNo: this.PaymentHeaderFilterForm.get("VendorPANNumber").value,
        tdsSectionCode: undefined,
        tdsSectionName: undefined,
        tdsRate: 0,
        tdsAmount: 0,
        tdsAtlineitem: false,
        tcsSectionCode: undefined,
        tcsSectionName: undefined,
        tcsRate: 0,
        tcsAmount: 0,
        IGST: 0,
        SGST: 0,
        CGST: 0,
        UGST: 0,
        GSTTotal: 0,
        GrossAmount: parseFloat(data?.THCamount),
        netPayable: parseFloat(data?.THCamount),
        roundOff: 0,
        voucherCanceled: false,
        paymentMode: "",
        refNo: "",
        accountName: "",
        accountCode: "",
        date: "",
        scanSupportingDocument: "",
        transactionNumber: data?.THC
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.GetJournalVoucherLedgers(data);
    voucherRequest.details = voucherlineItems;

    // Validate debit and credit amounts
    if (voucherlineItems.reduce((acc, item) => acc + parseFloat(item.debit), 0) != voucherlineItems.reduce((acc, item) => acc + parseFloat(item.credit), 0)) {
      this.snackBarUtilityService.ShowCommonSwal("error", "Debit and Credit Amount Should be Equal");
      // Return an observable with an error
      return;
    }

    // Create and return an observable representing the HTTP request
    return this.voucherServicesService.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        let reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.AdvancePayment,
          transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
          voucherCode: VoucherType.JournalVoucher,
          voucherType: VoucherType[VoucherType.JournalVoucher],
          docType: "Voucher",
          partyType: "Vendor",
          docNo: data.THC,
          partyCode: "" + data?.OthersData?.vND?.cD || "",
          partyName: data?.OthersData?.vND?.nM || "",
          entryBy: this.storage.userName,
          entryDate: Date(),
          debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.debit,
              "narration": item.narration ?? ""
            };
          }),
          credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.credit,
              "narration": item.narration ?? ""
            };
          }),
        };

        return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }
  createDebitRequest(data: any): Observable<any> {
    // Construct the voucher request payload
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = this.PaymentSummaryFilterForm.get("Bank").value;
      const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
      if (AccountDetails != undefined) {
        this.PaymentSummaryFilterForm.get("Bank").setValue(AccountDetails)
      } else {
        this.snackBarUtilityService.ShowCommonSwal("info", "Please select valid Bank Which is mapped with Account Master")
        return;
      }
    }
    const voucherRequest = {
      companyCode: this.companyCode,
      docType: "VR",
      branch: this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name,
      finYear: financialYear,
      details: [],
      debitAgainstDocumentList: [],
      data: {
        transCode: VoucherInstanceType.AdvancePayment,
        transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
        voucherCode: VoucherType.DebitVoucher,
        voucherType: VoucherType[VoucherType.DebitVoucher],
        transDate: new Date(),
        docType: "VR",
        branch: this.storage.branch,
        finYear: financialYear,
        accLocation: this.storage.branch,
        preperedFor: "Vendor",
        partyCode: data?.OthersData?.vND?.cD || "",
        partyName: data?.OthersData?.vND?.nM,
        partyState: this.VendorDetails?.vendorState || "",
        entryBy: this.storage.userName,
        entryDate: new Date(),
        panNo: this.PaymentHeaderFilterForm.get("VendorPANNumber").value,
        tdsSectionCode: undefined,
        tdsSectionName: undefined,
        tdsRate: 0,
        tdsAmount: 0,
        tdsAtlineitem: false,
        tcsSectionCode: undefined,
        tcsSectionName: undefined,
        tcsRate: 0,
        tcsAmount: 0,
        IGST: 0,
        SGST: 0,
        CGST: 0,
        UGST: 0,
        GSTTotal: 0,
        GrossAmount: parseFloat(data?.THCamount),
        netPayable: parseFloat(data?.THCamount),
        roundOff: 0,
        voucherCanceled: false,
        paymentMode: PaymentMode,
        refNo: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("ChequeOrRefNo").value : "",
        accountName: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Bank").value?.bANM : this.PaymentSummaryFilterForm.get("CashAccount").value?.name,
        accountCode: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Bank").value?.bANCD : this.PaymentSummaryFilterForm.get("CashAccount").value?.value,
        date: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Date").value : "",
        scanSupportingDocument: "",
        transactionNumber: data?.THC
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.GetDebitVoucherLedgers(data);
    voucherRequest.details = voucherlineItems;

    // Validate debit and credit amounts
    if (voucherlineItems.reduce((acc, item) => acc + parseFloat(item.debit), 0) != voucherlineItems.reduce((acc, item) => acc + parseFloat(item.credit), 0)) {
      this.snackBarUtilityService.ShowCommonSwal("error", "Debit and Credit Amount Should be Equal");
      // Return an observable with an error
      return;
    }

    // Create and return an observable representing the HTTP request
    return this.voucherServicesService.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while creating voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      }),
      mergeMap((res: any) => {
        let reqBody = {
          companyCode: this.storage.companyCode,
          voucherNo: res?.data?.mainData?.ops[0].vNO,
          transDate: Date(),
          finYear: financialYear,
          branch: this.storage.branch,
          transCode: VoucherInstanceType.AdvancePayment,
          transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
          voucherCode: VoucherType.DebitVoucher,
          voucherType: VoucherType[VoucherType.DebitVoucher],
          docType: "Voucher",
          partyType: "Vendor",
          docNo: data.THC,
          partyCode: "" + data?.OthersData?.vND?.cD || "",
          partyName: data?.OthersData?.vND?.nM || "",
          entryBy: this.storage.userName,
          entryDate: Date(),
          debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.debit,
              "narration": item.narration ?? ""
            };
          }),
          credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
            return {
              "accCode": item.accCode,
              "accName": item.accName,
              "accCategory": item.accCategory,
              "amount": item.credit,
              "narration": item.narration ?? ""
            };
          }),
        };

        return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
      }),
      catchError((error) => {
        // Handle the error here
        console.error('Error occurred while posting voucher:', error);
        // Return a new observable with the error
        return throwError(error);
      })
    );
  }
  GetDebitVoucherLedgers(SelectedData) {

    const createVoucher = (accCode, accName, accCategory, debit, credit, THCNo) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.AdvancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
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
      narration: `When Advance Paid against THC NO : ${THCNo}`,
    });

    const Result = [];

    Result.push(createVoucher(ledgerInfo['LIA001002'].LeadgerCode, ledgerInfo['LIA001002'].LeadgerName, ledgerInfo['LIA001002'].LeadgerCategory, parseFloat(SelectedData.Advance), 0, SelectedData.THC));

    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    if (PaymentMode == "Cash") {
      const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount").value;
      Result.push(createVoucher(CashAccount.aCCD, CashAccount.aCNM, "ASSET", 0, parseFloat(SelectedData.Advance), SelectedData.THC));
    }
    if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = this.PaymentSummaryFilterForm.get("Bank").value;
      Result.push(createVoucher(BankDetails.value, BankDetails.name, "ASSET", 0, parseFloat(SelectedData.Advance), SelectedData.THC));
    }

    return Result;
  }
  GetJournalVoucherLedgers(SelectedData) {

    const createVoucher = (accCode, accName, accCategory, debit, credit, THCNo) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.AdvancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
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
      narration: `When Expense Booked against THC NO : ${THCNo}`,
    });

    const Result = [];

    let OtherChargePositiveAmt = 0;
    let OtherChargeNegativeAmt = 0;
    const AllCharges: any[] = SelectedData?.OthersData?.cHG;
    AllCharges.forEach((item) => {
      if (item.aMT != 0) {
        if (item.oPS == "+") {
          const GetLeadgerInfo = ledgerInfo[item.cHGNM];
          if (GetLeadgerInfo) {
            Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, GetLeadgerInfo.LeadgerCategory, +item.aMT, 0, SelectedData.THC));
          } else {
            OtherChargePositiveAmt += parseFloat(item.aMT);
          }
        } else {
          const GetLeadgerInfo = ledgerInfo[item.cHGNM];
          if (GetLeadgerInfo) {
            Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, GetLeadgerInfo.LeadgerCategory, 0, (+item.aMT * -1), SelectedData.THC));
          } else {
            OtherChargeNegativeAmt += (parseFloat(item.aMT) * -1);
          }
        }
      }
    });

    if (OtherChargePositiveAmt != 0) {
      Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, ledgerInfo['EXP001009'].LeadgerCategory, OtherChargePositiveAmt, 0, SelectedData.THC));
    }
    if (OtherChargeNegativeAmt != 0) {
      Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, ledgerInfo['EXP001009'].LeadgerCategory, 0, OtherChargeNegativeAmt, SelectedData.THC));
    }
    Result.push(createVoucher(ledgerInfo['EXP001003'].LeadgerCode, ledgerInfo['EXP001003'].LeadgerName, ledgerInfo['EXP001003'].LeadgerCategory, parseFloat(SelectedData.THCContraAmount), 0, SelectedData.THC));
    Result.push(createVoucher(ledgerInfo['LIA001002'].LeadgerCode, ledgerInfo['LIA001002'].LeadgerName, ledgerInfo['LIA001002'].LeadgerCategory, 0, parseFloat(SelectedData.THCamount), SelectedData.THC));
    return Result;
  }
}
