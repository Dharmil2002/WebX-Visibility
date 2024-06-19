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
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
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
    AdvancePaymentAmount: {
      Title: "Advance Payment ⟨₹⟩",
      class: "matcolumncenter",
      Style: "min-width:15%",
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
  staticField = ["GenerationDate", "VehicleNumber", "Advance", "AdvancePaymentAmount"];
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

  VendorAdvanceTaxationTDSFilterForm: UntypedFormGroup;
  jsonControlVendorAdvanceTaxationTDSFilterArray: any;
  AlljsonControlVendorAdvanceTaxationTDSFilterArray: any;

  TotalAmountList: { count: any; title: string; class: string }[];
  PaymentData;
  VendorDetails;
  TDSdata: any;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  isInterBranchControl = false;
  ModifdTHCDataList = [];
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
    private controlPanel: ControlPanelService,
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
  async ngOnInit(): Promise<void> {
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
      {
        count: "00",
        title: "Total Advance Payment",
        class: `color-Success-light`,
      }
    ];
    this.GetVendorInformation();
    this.SetMastersData();
    this.getTDSSectionDropdown();
    const filter = {
      cID: this.storage.companyCode,
      mODULE: "THC",
      aCTIVE: true,
      rULEID: { D$in: ["THCIBC"] }
    }
    const res: any = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.isInterBranchControl = res.find(x => x.rULEID === "THCIBC").vAL
    }
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
    // Update AdvancePaymentAmount in tableData based on the ModifdTHCDataList
    this.ModifdTHCDataList.forEach((x) => {
      const index = this.tableData.findIndex((y) => y.THC === x.THCNo);
      if (index > -1) {
        this.tableData[index].AdvancePaymentAmount = x.AdvancePaymentAmount;
      }

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

    this.jsonControlVendorAdvanceTaxationTDSFilterArray =
      this.vendorPaymentControl.getVendorAdvanceTaxationTDSArrayControls();
    this.AlljsonControlVendorAdvanceTaxationTDSFilterArray =
      this.jsonControlVendorAdvanceTaxationTDSFilterArray;

    this.VendorAdvanceTaxationTDSFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorAdvanceTaxationTDSFilterArray,
    ]);
  }
  toggleTDSExempted() {
    const TDSExemptedValue =
      this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted;

    if (!TDSExemptedValue) {
      this.jsonControlVendorAdvanceTaxationTDSFilterArray = this.AlljsonControlVendorAdvanceTaxationTDSFilterArray;
      const TDSSection = this.VendorAdvanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([Validators.required, autocompleteObjectValidator(),]);

      const TDSRate = this.VendorAdvanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount = this.VendorAdvanceTaxationTDSFilterForm.get("TDSAmount");

      TDSAmount.setValidators([Validators.required]);
      TDSAmount.updateValueAndValidity();
      this.getTDSSectionDropdown();

    } else {
      this.jsonControlVendorAdvanceTaxationTDSFilterArray = this.AlljsonControlVendorAdvanceTaxationTDSFilterArray.filter((x) => x.name == "TDSExempted");
      const TDSSection = this.VendorAdvanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorAdvanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount = this.VendorAdvanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    }
    this.TDSSectionFieldChanged()
  }
  async getTDSSectionDropdown() {
    let Accountinglocation = this.storage.branch;
    let responseFromAPITDS = await GetAccountDetailFromApi(
      this.masterService,
      "TDS",
      Accountinglocation
    );
    this.TDSdata = responseFromAPITDS;
    this.filter.Filter(
      this.jsonControlVendorAdvanceTaxationTDSFilterArray,
      this.VendorAdvanceTaxationTDSFilterForm,
      responseFromAPITDS,
      "TDSSection",
      true
    );
  }
  TDSSectionFieldChanged() {
    const selectedData = this.tableData.filter((x) => x.isSelected);
    const totalAdvancePayment = selectedData.reduce(
      (total, item) => total + parseInt(item.AdvancePaymentAmount),
      0
    );

    if (this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.value) {
      const FindData = this.TDSdata.find(
        (x) =>
          x.value ==
          this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.value
      );
      const TDSrate = FindData?.rOTHER?.toFixed(2) || 0;
      const AdvancePaymentAmount = this.PayableSummaryFilterForm.value?.AdvancePaymentAmount || 0;

      const TDSamount = ((TDSrate * parseFloat(AdvancePaymentAmount)) / 100 || 0).toFixed(2);
      this.VendorAdvanceTaxationTDSFilterForm.controls["TDSRate"].setValue(
        TDSrate
      );
      this.VendorAdvanceTaxationTDSFilterForm.controls["TDSAmount"].setValue(
        TDSamount || 0
      );
    }
    const TDSAmount = parseFloat(this.VendorAdvanceTaxationTDSFilterForm.get("TDSAmount").value) || 0;
    this.TotalAmountList.forEach((x) => {
      if (x.title === "Total Advance Payment") {
        x.count = (totalAdvancePayment + TDSAmount).toFixed(2);
      }
    });
    this.PayableSummaryFilterForm.get("AdvancePaymentAmount").setValue(
      (totalAdvancePayment + TDSAmount).toFixed(2)
    );

  }
  BalanceUnbilledFunction(event) {
    const templateBody = {
      DocNo: event.data.THC,
      templateName: "THC",
      PartyField: "",
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
          // Push the modified THC data to the ModifdTHCDataList if exist same thc then update else push
          const index = this.ModifdTHCDataList.findIndex(
            (x) => x.THCNo === result.data.THC
          );
          if (index > -1) {
            this.ModifdTHCDataList[index] = result.data;
          } else {
            this.ModifdTHCDataList.push(result.data);
          }
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
    const totalAdvancePayment = selectedData.reduce(
      (total, item) => total + parseInt(item.AdvancePaymentAmount),
      0
    );

    this.TotalAmountList.forEach((x) => {
      if (x.title === "Total THC Amount") {
        x.count = totalTHCAmount.toFixed(2);
      }
      if (x.title === "Total Advance") {
        x.count = totalAdvance.toFixed(2);
      }
      if (x.title === "Total Advance Payment") {
        x.count = totalAdvancePayment.toFixed(2);
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
    this.PayableSummaryFilterForm.get("AdvancePaymentAmount").setValue(
      totalAdvancePayment.toFixed(2)
    );
    this.TDSSectionFieldChanged();
  }
  // Payment Modes Changes
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
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

    this.jsonControlPaymentSummaryFilterArray =
      this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation =
      this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name;
    switch (PaymentMode) {
      case "Cheque":
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

        // Remove Journal Account
        const JournalAccount = this.PaymentSummaryFilterForm.get("JournalAccount");
        JournalAccount.setValue("");
        JournalAccount.clearValidators();
        JournalAccount.updateValueAndValidity();

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
          this.jsonControlPaymentSummaryFilterArray,
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
      VoucherNo: outputData[key],
      AdvancePendingAmount: inputData.find(x => x.THCNo === key).AdvancePendingAmount,
      data: inputData.find(x => x.THCNo === key).data
    }));

    const isSelectedData = ResultList;
    isSelectedData.forEach((x) => {
      // If aDVAMT Exist Then Push x.VoucherNo to aDVVUCH in commonBody
      const VouchersArray = x.data?.OthersData?.aDVVUCH ? [...x.data.OthersData.aDVVUCH] : [];
      if (Array.isArray(x.VoucherNo)) {
        VouchersArray.push(...x.VoucherNo);
      } else {
        console.error("x.VoucherNo is not an array");
      }

      let commonBody;
      commonBody = {
        aDVPENAMT: parseFloat(x.AdvancePendingAmount),
        aDVVUCH: VouchersArray,
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
        if (this.isInterBranchControl) {
          // Process Debit Requests
          for (let i = 0; i < selectedData.length; i++) {
            const data = selectedData[i];
            const result = await firstValueFrom(this.createDebitRequest(data, true));
            const { docNo: THCNo, vNO: VoucherNo } = result.data.ops[0];
            const AdvancePendingAmount = (parseFloat(data.AdvancePending) - parseFloat(data.AdvancePaymentAmount)).toFixed(2);

            const ResultObject = {
              THCNo,
              VoucherNo,
              AdvancePendingAmount,
              data
            };


            Response.push(ResultObject);
          }
        } else {
          for (let i = 0; i < selectedData.length; i++) {
            const data = selectedData[i];
            const result = await firstValueFrom(this.createJournalRequest(data));

            const { docNo: THCNo, vNO: VoucherNo } = result.data.ops[0];
            const AdvancePendingAmount = (parseFloat(data.AdvancePending) - parseFloat(data.AdvancePaymentAmount)).toFixed(2);

            const ResultObject = {
              THCNo,
              VoucherNo,
              AdvancePendingAmount,
              data
            };


            Response.push(ResultObject);
          }

          // Process Debit Requests
          for (let i = 0; i < selectedData.length; i++) {
            const data = selectedData[i];
            const result = await firstValueFrom(this.createDebitRequest(data, false));

            const { docNo: THCNo, vNO: VoucherNo } = result.data.ops[0];
            const AdvancePendingAmount = (parseFloat(data.AdvancePending) - parseFloat(data.AdvancePaymentAmount)).toFixed(2);

            const ResultObject = {
              THCNo,
              VoucherNo,
              AdvancePendingAmount,
              data
            };

            Response.push(ResultObject);
          }
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
  createDebitRequest(data: any, InterBranch): Observable<any> {
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
    let LeadgerDetails;
    if (PaymentMode == "Cash") {
      LeadgerDetails = this.PaymentSummaryFilterForm.get("CashAccount").value;
    }
    if (PaymentMode == "Journal") {
      LeadgerDetails = this.PaymentSummaryFilterForm.get("JournalAccount").value;
    }

    const AdvancePaymentAmount = this.PayableSummaryFilterForm.get("AdvancePaymentAmount").value;
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
        tdsSectionCode: !this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.value : "",
        tdsSectionName: !this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.name : "",
        tdsRate: !this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorAdvanceTaxationTDSFilterForm.value.TDSRate : 0,
        tdsAmount: !this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorAdvanceTaxationTDSFilterForm.value.TDSAmount : 0,
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
        GrossAmount: InterBranch == true ? parseFloat(data?.THCamount) : parseFloat(AdvancePaymentAmount),
        netPayable: InterBranch == true ? parseFloat(data?.THCamount) : parseFloat(AdvancePaymentAmount),
        roundOff: 0,
        voucherCanceled: false,
        paymentMode: PaymentMode,
        refNo: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("ChequeOrRefNo").value : "",
        accountName: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Bank").value?.bANM : LeadgerDetails?.name,
        accountCode: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Bank").value?.bANCD : LeadgerDetails?.value,
        date: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? this.PaymentSummaryFilterForm.get("Date").value : "",
        scanSupportingDocument: "",
        transactionNumber: data?.THC
      }
    };

    // Retrieve voucher line items
    const voucherlineItems = this.GetDebitVoucherLedgers(data, AdvancePaymentAmount);
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


  GetDebitVoucherLedgers(thc, AdvancePaymentAmount) {

    const createVoucher = (accCode, debit, credit, THCNo, accName = null, accCategory = null) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.AdvancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.AdvancePayment],
      voucherCode: VoucherType.DebitVoucher,
      voucherType: VoucherType[VoucherType.DebitVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode: ledgerInfo[accCode]?.LeadgerCode || accCode,
      accName: ledgerInfo[accCode]?.LeadgerName || accName,
      accCategory: ledgerInfo[accCode]?.LeadgerCategory || accCategory,
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
    let TDSAmount = parseFloat(this.VendorAdvanceTaxationTDSFilterForm.value.TDSAmount) || 0;
    const balAMT = ConvertToNumber(thc.THCamount - thc.AdvancePaymentAmount, 3);
    const THCAmount = parseFloat(thc.THCamount) + TDSAmount;
    /*In case of Inter Branch Control
     Debit thc.THCamount to LIA003004
     Credit thc.Advance to AST003001
     Credit balAMT to LIA001002, if balAMT > 0
    */
    if (this.isInterBranchControl) {
      Result.push(createVoucher('LIA003004', THCAmount, 0, thc.THC));
      if (balAMT > 0) {
        Result.push(createVoucher('LIA001002', 0, balAMT, thc.THC));
      }
    }
    else {
      Result.push(createVoucher('LIA001002', parseFloat(AdvancePaymentAmount), 0, thc.THC));
    }
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    const PaymentAmountWithoutTDS = parseFloat((AdvancePaymentAmount - TDSAmount).toString());
    if (PaymentMode == "Cash") {
      const CashAccount = this.PaymentSummaryFilterForm.get("CashAccount").value;
      Result.push(createVoucher(CashAccount.aCCD, 0, PaymentAmountWithoutTDS, thc.THC, CashAccount.aCNM, "ASSET"));
    }
    else if (PaymentMode == "Journal") {
      const JournalAccount = this.PaymentSummaryFilterForm.get("JournalAccount").value;
      Result.push(createVoucher(JournalAccount.value, 0, PaymentAmountWithoutTDS, thc.THC, JournalAccount.name, "ASSET"));
    }
    else if (PaymentMode == "Cheque" || PaymentMode == "RTGS/UTR") {
      const BankDetails = this.PaymentSummaryFilterForm.get("Bank").value;
      Result.push(createVoucher(BankDetails.value, 0, PaymentAmountWithoutTDS, thc.THC, BankDetails.name, "ASSET"));
    }

    // Push TDS Sectiond Data
    if (!this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted) {
      if (+this.VendorAdvanceTaxationTDSFilterForm.value.TDSAmount != 0) {
        Result.push(createVoucher(
          this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.value,
          0,
          +this.VendorAdvanceTaxationTDSFilterForm.value.TDSAmount,
          thc.THC,
          this.VendorAdvanceTaxationTDSFilterForm.value.TDSSection.name,
          "LIABILITY",
        ));
      }
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
  isFormValid() {
    let isValid = this.tableData.length > 0 && this.PaymentSummaryFilterForm.valid
      && this.PayableSummaryFilterForm.valid;

    if (!this.VendorAdvanceTaxationTDSFilterForm.value.TDSExempted) {
      isValid = isValid && this.VendorAdvanceTaxationTDSFilterForm.valid;
    }

    return isValid;
  }
}
