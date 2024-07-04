import { Component, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subject, firstValueFrom } from "rxjs";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { VendorPaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol";
import { THCAmountsDetailComponent } from "../Modal/thcamounts-detail/thcamounts-detail.component";
import { VendorBalancePaymentControl } from "src/assets/FormControls/Finance/VendorPayment/vendorbalancepaymentcontrol";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { GetAccountDetailFromApi } from "../../Debit Voucher/debitvoucherAPIUtitlity";
import { Router } from "@angular/router";
import {
  GetAdvancePaymentListFromApi,
  GetSingleVendorBillDetailsFromApi,
  GetSingleVendorDetailsFromApi,
  GetStateListFromAPI,
  GetTHCListBasdedOnBillNumberFromApi,
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
import {
  Vendbilldetails,
  Vendbillpayment,
  VendorBillEntry,
} from "src/app/Models/Finance/VendorPayment";
import { financialYear } from "src/app/Utility/date/date-utils";
import Swal from "sweetalert2";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { filter, map } from "rxjs/operators";
import { VendorBillService } from "../../Vendor Bills/vendor-bill.service";
import { BlancePaymentPopupComponent } from "../Modal/blance-payment-popup/blance-payment-popup.component";
import { StorageService } from "src/app/core/service/storage.service";
import { BeneficiaryDetailComponent } from "../../Vendor Bills/beneficiary-detail/beneficiary-detail.component";

@Component({
  selector: "app-balance-payment",
  templateUrl: "./balance-payment.component.html",
})
export class BalancePaymentComponent implements OnInit {
  vendorBillEntryModel = new VendorBillEntry();
  VendorDetails;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  breadScrums = [
    {
      title: "Balance Payments",
      items: ["Home"],
      active: "Balance Payments",
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
      Style: "min-width:20%",
      type: "Link",
      functionName: "BalanceUnbilledFunction",
    },
    GenerationDate: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    VehicleNumber: {
      Title: "Vehicle No.",
      class: "matcolumncenter",
      Style: "min-width:13%",
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
    BalancePending: {
      Title: "Balance Pending ⟨₹⟩",
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
  staticField = [
    "GenerationDate",
    "VehicleNumber",
    "Advance",
    "BalancePending",
  ];
  companyCode = 0;
  tableData: any[] = [];
  isTableLode = false;
  TotalAmountList: { count: any; title: string; class: string }[];
  vendorBalancePaymentControl: VendorBalancePaymentControl;
  protected _onDestroy = new Subject<void>();

  VendorBalanceTaxationTDSFilterForm: UntypedFormGroup;
  jsonControlVendorBalanceTaxationTDSFilterArray: any;

  VendorBalanceTaxationGSTFilterForm: UntypedFormGroup;
  jsonControlVendorBalanceTaxationGSTFilterArray: any;
  AlljsonControlVendorBalanceTaxationGSTFilterArray: any;

  AllStateList: any;
  StateList: any;

  VendorBalancePaymentFilterForm: UntypedFormGroup;
  jsonControlVendorBalancePaymentFilterArray: any;

  PaymentHeaderFilterForm: UntypedFormGroup;
  jsonControlPaymentHeaderFilterArray: any;
  TDSSectionCodeCode: any;
  TDSSectionCodeStatus: any;
  GSTSACcodeCode: any;
  GSTSACcodeStatus: any;
  BillbookingstateCode: any;
  BillbookingstateStatus: any;
  VendorbillstateCode: any;
  VendorbillstateStatus: any;
  BillPaymentData: any;
  TDSdata: any;
  AdvanceTotal: number;
  BalancePending: number;
  THCamount: number;
  AlljsonControlVendorBalanceTaxationTDSFilterArray: any;
  IsModifyAction = false;
  GSTSACcodeData: any;

  DebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationPaymentSummaryArray: any;

  ModifiedTHCList = [];
  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private masterService: MasterService,
    private matDialog: MatDialog,
    private objVendorBillService: VendorBillService,
    private storage: StorageService,
    private route: Router // public dialog: MatDialog
  ) {
    this.companyCode = this.storage.companyCode;
    this.BillPaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.IsModifyAction = this.route.getCurrentNavigation()?.extras?.state?.Type == "Modify" ? true : false;
    if (this.BillPaymentData) {
      if (this.IsModifyAction) {
        this.BillPaymentData.Vendor = this.BillPaymentData.vendor;
      }

    } else {
      this.route.navigate(["/Finance/VendorPayment/THC-Payment"]);
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.GetBalancePaymentList();

    this.TotalAmountList = [
      {
        count: "0.00",
        title: "Total THC Amount",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Total Advance Amount",
        class: `color-Success-light`,
      },
      {
        count: "0.00",
        title: "Total Balance Pending",
        class: `color-Success-light`,
      },
    ];
  }
  initializeFormControl(): void {
    let RequestObj;
    if (this.IsModifyAction) {
      RequestObj = {
        VendorPANNumber: this.BillPaymentData?.vPan || "",
        Numberofvehiclesregistered: "0",
      };
    }
    else {
      RequestObj = {
        VendorPANNumber: this.BillPaymentData?.VendorInfo?.pAN || "",
        Numberofvehiclesregistered: "0",
      };
    }

    this.vendorBalancePaymentControl = new VendorBalancePaymentControl(
      RequestObj
    );
    this.jsonControlVendorBalanceTaxationTDSFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationTDSArrayControls();
    this.AlljsonControlVendorBalanceTaxationTDSFilterArray =
      this.jsonControlVendorBalanceTaxationTDSFilterArray;
    this.VendorBalanceTaxationTDSFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalanceTaxationTDSFilterArray,
    ]);

    this.AlljsonControlVendorBalanceTaxationGSTFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationGSTArrayControls();
    this.jsonControlVendorBalanceTaxationGSTFilterArray =
      this.AlljsonControlVendorBalanceTaxationGSTFilterArray;
    this.VendorBalanceTaxationGSTFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
    ]);

    this.jsonControlVendorBalancePaymentFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationPaymentDetailsArrayControls();
    this.VendorBalancePaymentFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalancePaymentFilterArray,
    ]);

    this.jsonControlPaymentHeaderFilterArray =
      this.vendorBalancePaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlPaymentHeaderFilterArray,
    ]);

    this.jsonControlDebitVoucherTaxationPaymentSummaryArray = this.vendorBalancePaymentControl.getVendorBalancePaymentSummaryArrayControls();
    this.DebitVoucherTaxationPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationPaymentSummaryArray]);


    this.BindDropDowns();
  }
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  CalculatePaymentAmount() {
    const TotalTHCamount = this.tableData
      .filter(x => x.isSelected)
      .reduce((sum, x) => sum + parseInt(x.BalancePending), 0);

    let TDSAmount = parseFloat(this.VendorBalanceTaxationTDSFilterForm.controls.TDSAmount.value) || 0;
    let GSTAmount = parseFloat(this.VendorBalanceTaxationGSTFilterForm.controls.GSTAmount.value) || 0;


    const CalculatedSumWithTDS = TotalTHCamount - parseFloat(TDSAmount.toFixed(2));;
    const CalculatedSum = CalculatedSumWithTDS + parseFloat(GSTAmount.toFixed(2));;
    const formattedCalculatedSum = CalculatedSum.toFixed(2);

    this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").setValue(formattedCalculatedSum);
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(formattedCalculatedSum);

  }
  BindDropDowns() {
    this.jsonControlVendorBalanceTaxationTDSFilterArray.forEach((data) => {
      if (data.name == "TDSSection") {
        this.TDSSectionCodeCode = data.name;
        this.TDSSectionCodeStatus = data.additionalData.showNameAndValue;
        this.getTDSSectionDropdown();
      }
    });

    this.jsonControlVendorBalanceTaxationGSTFilterArray.forEach((data) => {
      if (data.name == "GSTSACcode") {
        this.GSTSACcodeCode = data.name;
        this.GSTSACcodeStatus = data.additionalData.showNameAndValue;
        this.getSACcodeDropdown();
      }
      if (data.name == "Billbookingstate") {
        this.BillbookingstateCode = data.name;
        this.BillbookingstateStatus = data.additionalData.showNameAndValue;
      }
      if (data.name == "Vendorbillstate") {
        this.VendorbillstateCode = data.name;
        this.VendorbillstateStatus = data.additionalData.showNameAndValue;
        this.getStateDropdown();
      }
    });
  }

  async GetBalancePaymentList() {
    this.isTableLode = false;
    let Filters

    if (this.IsModifyAction) {
      var StartDate = new Date();

      // Subtract 30 days
      StartDate.setDate(StartDate.getDate() - 30);
      Filters = {
        PaymentType: "Balance",
        Mode: this.BillPaymentData?.Mode,
        StartDate: StartDate,
        EndDate: new Date(),
        VendorInfo: {
          cD: this.BillPaymentData?.vnCode,
          nM: this.BillPaymentData?.vnName,
        }
      }
    } else {
      Filters = {
        PaymentType: "Balance",
        Mode: this.BillPaymentData?.Mode,
        StartDate: this.BillPaymentData?.StartDate,
        EndDate: this.BillPaymentData?.EndDate,
        VendorInfo: this.BillPaymentData?.VendorInfo,
      }
    }

    const GetAdvanceBillPaymentData = await GetAdvancePaymentListFromApi(
      this.masterService,
      Filters
    );


    const Data = GetAdvanceBillPaymentData.filter(item => item.AdvancePending == 0).map((x, index) => {
      return {
        GenerationDate: x.GenerationDate,
        VehicleNumber: x.VehicleNumber,
        Advance: x.Advance,
        BalancePending: x.OthersData.bALAMT,
        THC: x.THC,
        THCamount: x.THCamount,
        THCContraAmount: x.THCContraAmount,
        OthersData: x.OthersData,
        isSelected: false,
      };
    });
    if (this.IsModifyAction) {
      const GetBillData = await GetTHCListBasdedOnBillNumberFromApi(
        this.masterService,
        this.BillPaymentData?.billNo,
        this.BillPaymentData?.Mode || 'FTL'
      );
      const MappedGetBillData = GetBillData.map((x, index) => {
        return {
          GenerationDate: x.GenerationDate,
          VehicleNumber: x.VehicleNumber,
          Advance: x.Advance,
          BalancePending: x.OthersData.bALAMT,
          THC: x.THC,
          THCamount: x.THCamount,
          THCContraAmount: x.THCContraAmount,
          OthersData: x.OthersData,
          isSelected: true,
        }
      });
      this.tableData = [MappedGetBillData, Data].flat();
    } else {
      this.tableData = Data;
    }

    this.isTableLode = true;
    this.selectCheckBox();
    if (this.IsModifyAction) {
      this.GetBillDetails();
    }
  }
  async GetBillDetails() {

    const BillDetails = await GetSingleVendorBillDetailsFromApi(
      this.masterService,
      this.BillPaymentData?.billNo
    );
    // Set TDS Sections
    const FindData = this.TDSdata.find((x) => x.value == BillDetails?.tDS?.sEC);
    this.VendorBalanceTaxationTDSFilterForm.get("TDSExempted").setValue(BillDetails?.tDS?.eXMT);
    this.VendorBalanceTaxationTDSFilterForm.get("TDSSection").setValue(FindData);
    this.VendorBalanceTaxationTDSFilterForm.get("TDSRate").setValue(BillDetails?.tDS?.rATE);
    this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount").setValue(BillDetails?.tDS?.aMT);

    // Set GST Sections
    const SacCode = this.GSTSACcodeData.find((x) => x.value == BillDetails?.gST?.sAC);

    this.VendorBalanceTaxationGSTFilterForm.get("VendorGSTRegistered").setValue(BillDetails?.vND?.gSTREG);
    this.VendorBalanceTaxationGSTFilterForm.get("GSTSACcode").setValue(SacCode);
    const BillBookingState = this.StateList.find((x) => x.value == BillDetails?.sT);
    const VendorBillState = this.StateList.find((x) => x.value == BillDetails?.vND?.sT);

    this.VendorBalanceTaxationGSTFilterForm.get("Billbookingstate").setValue(BillBookingState);
    this.VendorBalanceTaxationGSTFilterForm.get("Vendorbillstate").setValue(VendorBillState);
    this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue(BillDetails?.gST?.tYP);
    this.VendorBalanceTaxationGSTFilterForm.get("GSTNumber").setValue(BillDetails?.vND?.gSTIN);
    this.VendorBalanceTaxationGSTFilterForm.get("VGSTNumber").setValue(BillDetails?.gSTIN);

    // Calculate And Set GST Data Based On State
    this.StateChange();

  }

  async getSACcodeDropdown() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "sachsn_master",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (res.success) {
      this.GSTSACcodeData = res.data.map((x) => {
        return {
          ...x,
          name: x.SNM,
          value: x.SID,
        };
      });
      this.filter.Filter(
        this.jsonControlVendorBalanceTaxationGSTFilterArray,
        this.VendorBalanceTaxationGSTFilterForm,
        this.GSTSACcodeData,
        this.GSTSACcodeCode,
        this.GSTSACcodeStatus
      );
    }
  }

  async getStateDropdown() {
    const resState = await GetStateListFromAPI(this.masterService);
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map((x) => ({
        value: x.ST, name: x.STNM
      }))
      .filter((x) => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
      this.VendorBalanceTaxationGSTFilterForm,
      this.StateList,
      this.BillbookingstateCode,
      this.BillbookingstateStatus
    );
    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
      this.VendorBalanceTaxationGSTFilterForm,
      this.StateList,
      this.VendorbillstateCode,
      this.VendorbillstateStatus
    );
    this.GetVendorInformation();
  }

  async GetVendorInformation() {
    if (!this.IsModifyAction) {
      const companyCode = this.storage.companyCode;
      const filter = { vendorCode: this.BillPaymentData?.VendorInfo?.cD };
      const req = { companyCode, collectionName: "vendor_detail", filter };
      const res: any = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );

      if (res.success && res.data.length != 0) {
        this.VendorDetails = res.data[0];

        if (this.VendorDetails?.otherdetails) {
          this.VendorBalanceTaxationGSTFilterForm.controls.VendorGSTRegistered.setValue(
            true
          );
          this.VendorBalanceTaxationGSTFilterForm.controls.GSTNumber.setValue(
            this.VendorDetails?.otherdetails[0]?.gstNumber
          );
          const getValue = this.StateList.find(
            (item) => item.name == this.VendorDetails?.otherdetails[0]?.gstState
          );
          this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.setValue(
            getValue || ""
          );
          this.EnableVendorGSTValidations();
        }
      }
    }
  }
  EnableVendorGSTValidations() {
    const GSTSACcode = this.VendorBalanceTaxationGSTFilterForm.get("GSTSACcode");
    GSTSACcode.setValidators([Validators.required, autocompleteObjectValidator(),]);
    GSTSACcode.updateValueAndValidity();

    const Billbookingstate = this.VendorBalanceTaxationGSTFilterForm.get("Billbookingstate");
    Billbookingstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
    Billbookingstate.updateValueAndValidity();

    const Vendorbillstate = this.VendorBalanceTaxationGSTFilterForm.get("Vendorbillstate");
    Vendorbillstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
    Vendorbillstate.updateValueAndValidity();
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
      this.jsonControlVendorBalanceTaxationTDSFilterArray,
      this.VendorBalanceTaxationTDSFilterForm,
      responseFromAPITDS,
      this.TDSSectionCodeCode,
      this.TDSSectionCodeStatus
    );
  }


  toggleTDSExempted() {
    const TDSExemptedValue =
      this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted;

    if (!TDSExemptedValue) {
      this.jsonControlVendorBalanceTaxationTDSFilterArray = this.AlljsonControlVendorBalanceTaxationTDSFilterArray;
      const TDSSection = this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([Validators.required, autocompleteObjectValidator(),]);

      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount = this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");

      TDSAmount.setValidators([Validators.required]);
      TDSAmount.updateValueAndValidity();
      this.getTDSSectionDropdown();
      this.CalculatePaymentAmount();

    } else {
      this.jsonControlVendorBalanceTaxationTDSFilterArray = this.AlljsonControlVendorBalanceTaxationTDSFilterArray.filter((x) => x.name == "TDSExempted");
      const TDSSection = this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount = this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();

      this.CalculatePaymentAmount();
    }
  }
  toggleVendorGSTRegistered() {

    const VendorGSTRegistered =
      this.VendorBalanceTaxationGSTFilterForm.value.VendorGSTRegistered;
    if (VendorGSTRegistered) {
      // this.jsonControlVendorBalanceTaxationGSTFilterArray = this.AlljsonControlVendorBalanceTaxationGSTFilterArray;

      const GSTSACcode = this.VendorBalanceTaxationGSTFilterForm.get("GSTSACcode");
      GSTSACcode.setValidators([Validators.required, autocompleteObjectValidator(),]);
      GSTSACcode.updateValueAndValidity();

      const Billbookingstate = this.VendorBalanceTaxationGSTFilterForm.get("Billbookingstate");
      Billbookingstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
      Billbookingstate.updateValueAndValidity();

      const Vendorbillstate = this.VendorBalanceTaxationGSTFilterForm.get("Vendorbillstate");
      Vendorbillstate.setValidators([Validators.required, autocompleteObjectValidator(),]);
      Vendorbillstate.updateValueAndValidity();

      this.getSACcodeDropdown();
      this.getStateDropdown();
      this.CalculatePaymentAmount();

    } else {
      // this.jsonControlVendorBalanceTaxationGSTFilterArray = this.AlljsonControlVendorBalanceTaxationGSTFilterArray.filter((x) => x.name == "VendorGSTRegistered");
      this.VendorBalanceTaxationGSTFilterForm.reset();

      // Clear validators and update value and validity for each form control
      Object.keys(this.VendorBalanceTaxationGSTFilterForm.controls).forEach(key => {
        const control = this.VendorBalanceTaxationGSTFilterForm.get(key);
        control.clearValidators();
        control.updateValueAndValidity();
      });
      // const GSTSACcode = this.VendorBalanceTaxationGSTFilterForm.get("GSTSACcode");
      // GSTSACcode.setValue("");
      // GSTSACcode.clearValidators();
      // GSTSACcode.updateValueAndValidity();

      // const Billbookingstate = this.VendorBalanceTaxationGSTFilterForm.get("Billbookingstate");
      // Billbookingstate.setValue("");
      // Billbookingstate.clearValidators();
      // Billbookingstate.updateValueAndValidity();

      // const Vendorbillstate = this.VendorBalanceTaxationGSTFilterForm.get("Vendorbillstate");
      // Vendorbillstate.setValue("");
      // Vendorbillstate.clearValidators();
      // Vendorbillstate.updateValueAndValidity();
      this.CalculatePaymentAmount();
    }
  }
  TDSSectionFieldChanged() {
    if (this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value) {
      const FindData = this.TDSdata.find(
        (x) =>
          x.value ==
          this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value
      );
      const TDSrate = FindData?.rOTHER?.toFixed(2) || 0;
      const TDSamount = ((TDSrate * this.BalancePending) / 100 || 0).toFixed(2);
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSRate"].setValue(
        TDSrate
      );
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSAmount"].setValue(
        TDSamount
      );
      this.CalculatePaymentAmount();
    }
  }

  BalanceUnbilledFunction(event) {
    const templateBody = {
      DocNo: event.data.THC,
      PartyField: "",
      templateName: "THC",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1500,height=800");
  }
  THCAmountFunction(event) {
    const RequestBody = {
      BillPaymentData: this.BillPaymentData,
      THCData: event?.data,
      Type: "balance",
      Mode: this.BillPaymentData?.Mode,
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
          const THCValueToCheck = event?.data.THC;

          const indexToRemove = this.ModifiedTHCList.findIndex(item => item.THC === THCValueToCheck);

          // If the THC value exists in the array, remove the object
          if (indexToRemove == -1) {
            this.ModifiedTHCList.push(event?.data);
          }
          this.GetBalancePaymentList();
          console.log(this.ModifiedTHCList)
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
    this.AdvanceTotal = 0;
    this.BalancePending = 0;
    this.THCamount = 0;

    const SelectedData = this.tableData.filter((x) => x.isSelected);
    SelectedData.forEach((x) => {
      this.AdvanceTotal = this.AdvanceTotal + parseInt(x.Advance);
      this.BalancePending = this.BalancePending + parseInt(x.BalancePending);
      this.THCamount = this.THCamount + parseInt(x.THCamount);
    });
    this.TotalAmountList.forEach((x) => {
      if (x.title == "Total Advance Amount") {
        x.count = this.AdvanceTotal.toFixed(2);
      }
      if (x.title == "Total Balance Pending") {
        x.count = this.BalancePending.toFixed(2);
      }
      if (x.title == "Total THC Amount") {
        x.count = this.THCamount.toFixed(2);
      }
    });
    this.TDSSectionFieldChanged();
    this.StateChange();
    this.CalculatePaymentAmount();
  }

  BeneficiarydetailsViewFunctions(event) {
    console.log("BeneficiarydetailsViewFunctions");
  }


  StateChange() {
    const formValues = this.VendorBalanceTaxationGSTFilterForm.value;
    const Billbookingstate = formValues.Billbookingstate;
    const Vendorbillstate = formValues.Vendorbillstate;
    const SACcode = formValues.GSTSACcode;

    if (Billbookingstate && Vendorbillstate && SACcode) {
      const IsStateTypeUT =
        this.AllStateList.find(
          (item) => item.STNM === Vendorbillstate.name
        ).ISUT == true;
      const GSTAmount = this.tableData
        .filter((item) => item.isSelected)
        .reduce((acc, curr) => acc + parseFloat(curr["THCamount"]), 0);
      const GSTdata = { GSTAmount, GSTRate: SACcode.GSTRT };

      if (!IsStateTypeUT && Billbookingstate.name == Vendorbillstate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("IGST");

      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("IGST");
      } else if (
        !IsStateTypeUT &&
        Billbookingstate.name != Vendorbillstate.name
      ) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTdata);
        this.VendorBalanceTaxationGSTFilterForm.get("GSTType").setValue("CGST/SGST");
      }
    }
  }

  ShowOrHideBasedOnSameOrDifferentState(Check, GSTdata) {
    const filterFunctions = {
      UT: (x) => x.name !== "IGSTRate" && x.name !== "SGSTRate",
      SAME: (x) => x.name !== "IGSTRate" && x.name !== "UGSTRate",
      DIFF: (x) =>
        x.name !== "SGSTRate" && x.name !== "UGSTRate" && x.name !== "CGSTRate",
    };

    const GSTinputType = ["SGSTRate", "UGSTRate", "CGSTRate", "IGSTRate"];

    this.jsonControlVendorBalanceTaxationGSTFilterArray =
      this.AlljsonControlVendorBalanceTaxationGSTFilterArray.filter(
        filterFunctions[Check]
      );

    const GSTinput = this.jsonControlVendorBalanceTaxationGSTFilterArray
      .filter((item) => GSTinputType.includes(item.name))
      .map((item) => item.name);

    const GSTCalculateAmount = (
      (GSTdata.GSTAmount * GSTdata.GSTRate) /
      (100 * GSTinput.length)
    ).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.VendorBalanceTaxationGSTFilterForm.get(rateKey).setValue(
        GSTCalculateRate
      );
      this.VendorBalanceTaxationGSTFilterForm.get(amountKey).setValue(
        GSTCalculateAmount
      );
    };
    GSTinput.forEach((x) => calculateValues(x, x.substring(0, 4) + "Amount"));

    this.VendorBalanceTaxationGSTFilterForm.get("TotalGSTRate").setValue(
      (+GSTCalculateRate * GSTinput.length).toFixed(2)
    );
    this.VendorBalanceTaxationGSTFilterForm.get("GSTAmount").setValue(
      (+GSTCalculateAmount * GSTinput.length).toFixed(2)
    );
    this.CalculatePaymentAmount();
  }

  RedirectToTHCPayment() {
    this.route.navigate(["/Finance/VendorPayment/THC-Payment"]);
  }

  async getBeneficiaryData() {
    try {
      // Fetch beneficiary details from API
      const beneficiaryModalData =
        await this.objVendorBillService.getBeneficiaryDetailsFromApi(
          this.IsModifyAction ? this.BillPaymentData.vnCode : this.BillPaymentData.Vendor
        );

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
        dialogRef.afterClosed().subscribe(() => { });
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
      console.error("An error occurred:", error);
    }
  }

  //#region Full Booking With Payment

  // Step 1  For Payment Details
  MakePayment() {
    const dialogRef = this.matDialog.open(BlancePaymentPopupComponent, {
      data: "",
      width: "70%",
      height: "60%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.BookVendorBill(result, true, false)
      }
    });
  }
  // Step 2 Create Vendor Bill in vend_bill_summary Collection And vend_bill_det collection and update thc_summary
  BookVendorBill(PaymenDetails, generateDebitVoucher, IsUpdate) {
    if (this.tableData.filter(x => x.isSelected).length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Select Atleast One THC"
      );
    } else {
      const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
      const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
      const RoundOffAmount = NetPayable - PaymentAmount;
      let dUEDT = new Date();
      let currentDate = new Date();
      dUEDT.setDate(currentDate.getDate() + 7);
      this.snackBarUtilityService.commonToast(async () => {
        try {
          const vendorBillEntry: VendorBillEntry = {
            companyCode: this.companyCode,
            docType: "VB",
            branch: this.storage.branch,
            finYear: financialYear,
            data: {
              cID: this.companyCode,
              docNo: IsUpdate ? this.BillPaymentData?.billNo : "",
              bDT: new Date(),
              tMOD: this.BillPaymentData?.Mode || "",
              lOC: this.VendorDetails?.vendorCity,
              sT: this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.value?.value,
              sTNM: this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.value?.name,
              gSTIN: this.VendorBalanceTaxationGSTFilterForm.controls.GSTNumber.value,
              tHCAMT: this.THCamount,
              aDVAMT: this.AdvanceTotal,
              bALAMT: NetPayable,
              rOUNOFFAMT: RoundOffAmount,
              bALPBAMT: generateDebitVoucher == true ? 0 : NetPayable,
              bSTAT: generateDebitVoucher == true ? 3 : 1,
              bSTATNM: generateDebitVoucher == true ? "Paid" : "Awaiting Approval",
              dOCTYP: "Transaction",
              dOCCD: "T",
              dUEDT: dUEDT,
              mANNUM: "",
              eNTDT: new Date(),
              eNTLOC: this.storage.branch,
              eNTBY: this.storage.userName,
              vND: {
                cD: IsUpdate ? this.BillPaymentData.vnCode : this.BillPaymentData?.VendorInfo?.cD,
                nM: IsUpdate ? this.BillPaymentData.vnName : this.BillPaymentData?.VendorInfo?.nM,
                pAN: this.PaymentHeaderFilterForm.controls.VendorPANNumber?.value,
                aDD: this.VendorDetails?.vendorAddress,
                mOB: this.VendorDetails?.vendorPhoneNo ? this.VendorDetails?.vendorPhoneNo.toString() : "",
                eML: this.VendorDetails?.emailId,
                gSTREG: this.VendorBalanceTaxationGSTFilterForm.controls.VendorGSTRegistered.value,
                sT: this.VendorBalanceTaxationGSTFilterForm.controls.Vendorbillstate.value?.value,
                sTNM: this.VendorBalanceTaxationGSTFilterForm.controls.Vendorbillstate.value?.name,
                gSTIN: this.VendorBalanceTaxationGSTFilterForm.controls.VGSTNumber.value
              },
              tDS: {
                eXMT: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted,
                sEC: !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "",
                sECD: !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : "",
                rATE: !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0,
                aMT: !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0,
              },
              gST: {
                sAC: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.value ? this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.value.toString() : "",
                sACNM: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.name ? this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.name.toString() : "",
                tYP: this.VendorBalanceTaxationGSTFilterForm.value.GSTType,
                rATE: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.TotalGSTRate) || 0,
                iGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTRate) || 0,
                cGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTRate) || 0,
                sGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTRate) || 0,
                uGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTRate) || 0,
                uGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount) || 0,
                iGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0,
                cGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0,
                sGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0,
                aMT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0,
              },
            },
            BillDetails: this.tableData.filter((x) => x.isSelected == true).map((x) => {
              return {
                cID: this.companyCode,
                bILLNO: "",
                tRIPNO: x.THC,
                tTYP: "THC",
                tMOD: this.BillPaymentData?.Mode,
                aDVAMT: x.Advance,
                bALAMT: x.BalancePending,
                tHCAMT: x.THCamount,
                eNTDT: new Date(),
                eNTLOC: this.storage.branch,
                eNTBY: this.storage.userName,
              }
            })
          };
          await
            firstValueFrom(this.voucherServicesService
              .FinancePost(`finance/bill/vendor/${IsUpdate ? 'update' : 'create'}`, vendorBillEntry)).then((res: any) => {
                this.SubmitJournalVoucherData(PaymenDetails, res?.data.data.ops[0].docNo, generateDebitVoucher)
              }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
              .finally(() => {

              });
        } catch (error) {
          this.snackBarUtilityService.ShowCommonSwal("error", error);
        }
      }, "Balance Payment Generating..!");
    }
  }

  //setep 3 Creating voucher_trans And voucher_trans_details And voucher_trans_document collection 
  SubmitJournalVoucherData(PaymenDetails, BillNo, generateDebitVoucher) {
    this.snackBarUtilityService.commonToast(() => {
      try {

        const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
        const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
        const RoundOffAmount = NetPayable - PaymentAmount;

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BalancePayment;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BalancePayment];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.tableData[0].OthersData?.cLOC || this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode = "" + this.tableData[0].OthersData?.vND?.cD || "";
        this.VoucherDataRequestModel.partyName = this.tableData[0].OthersData?.vND?.nM || "";
        this.VoucherDataRequestModel.partyState = this.VendorBalanceTaxationGSTFilterForm.controls.Vendorbillstate.value?.name || "";
        this.VoucherDataRequestModel.paymentState = this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.value?.name || "";
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = this.PaymentHeaderFilterForm.get("VendorPANNumber").value;
        this.VoucherDataRequestModel.tdsSectionCode = !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "";
        this.VoucherDataRequestModel.tdsSectionName = !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : "";
        this.VoucherDataRequestModel.tdsRate = !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0;
        this.VoucherDataRequestModel.tdsAmount = !this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0;
        this.VoucherDataRequestModel.SGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0;
        this.VoucherDataRequestModel.CGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0;
        this.VoucherDataRequestModel.UGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount) || 0;
        this.VoucherDataRequestModel.GSTTotal = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = RoundOffAmount;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = ""
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        const SelectedData = this.tableData.filter((x) => x.isSelected == true);
        const voucherlineItems = this.GetJournalVoucherLedgers(SelectedData, BillNo, PaymentAmount, NetPayable, RoundOffAmount);

        // get sum of debit and credit
        const debitTotal = voucherlineItems.reduce((acc, curr) => acc + curr.debit, 0);
        const creditTotal = voucherlineItems.reduce((acc, curr) => acc + curr.credit, 0);
        if (debitTotal != creditTotal) {
          this.snackBarUtilityService.ShowCommonSwal("error", "Debit and Credit amount should be equal..!");
          return;
        }
        // if debit and credit amount is equal 0 then show error
        if (debitTotal == 0 && creditTotal == 0) {
          if (generateDebitVoucher) {
            this.SubmitDebitVoucherData(PaymenDetails, BillNo)
          } else {
            Swal.fire({
              icon: "success",
              title: "Bill Generated Successfully",
              text: "Bill No: " + BillNo,
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.hideLoading();
                setTimeout(() => {
                  Swal.close();
                  this.RedirectToTHCPayment()
                }, 1000);
              }
            });
          }
        } else {


          this.VoucherRequestModel.details = voucherlineItems;
          this.VoucherRequestModel.data = this.VoucherDataRequestModel;
          this.VoucherRequestModel.debitAgainstDocumentList = [];
          firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {

            let reqBody = {
              companyCode: this.storage.companyCode,
              voucherNo: res?.data?.mainData?.ops[0].vNO,
              transDate: Date(),
              finYear: financialYear,
              branch: this.tableData[0].OthersData?.cLOC || this.storage.branch,
              transCode: VoucherInstanceType.BalancePayment,
              transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
              voucherCode: VoucherType.JournalVoucher,
              voucherType: VoucherType[VoucherType.JournalVoucher],
              docType: "Voucher",
              partyType: "Vendor",
              docNo: BillNo,
              partyCode: "" + this.tableData[0].OthersData?.vND?.cD || "",
              partyName: this.tableData[0].OthersData?.vND?.nM || "",
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
            firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then((res: any) => {
              if (res) {
                this.voucherServicesService.UpdateVoucherNumbersInVendBillSummary(BillNo, reqBody.voucherNo);
                if (generateDebitVoucher) {
                  this.SubmitDebitVoucherData(PaymenDetails, BillNo)
                } else {

                  Swal.fire({
                    icon: "success",
                    title: "Voucher And Bill Generated Successfully",
                    text: "Bill No: " + BillNo + " Voucher No: " + reqBody.voucherNo,
                    showConfirmButton: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.hideLoading();
                      setTimeout(() => {
                        Swal.close();
                        this.RedirectToTHCPayment()
                      }, 1000);
                    }
                  });
                }
              } else {
                this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Do Account Posting..!");
              }
            });
          }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
            .finally(() => {
            });
        }

      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "Fail To Submit Data..!"
        );
      }
    }, "Balance Payment Voucher Generating..!");
  }
  //setep 4 Creating voucher_trans And voucher_trans_details And voucher_trans_document collection 
  SubmitDebitVoucherData(PaymenDetails, BillNo) {
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
        const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
        const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
        const RoundOffAmount = NetPayable - PaymentAmount;

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BalancePayment;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BalancePayment];
        this.VoucherDataRequestModel.voucherCode = PaymentMode != "Journal" ? VoucherType.DebitVoucher : VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = PaymentMode != "Journal" ? VoucherType[VoucherType.DebitVoucher] : VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode = this.tableData[0].OthersData?.vND?.cD || "";
        this.VoucherDataRequestModel.partyName = this.tableData[0].OthersData?.vND?.nM || "";
        this.VoucherDataRequestModel.partyState = this.VendorDetails?.vendorState;
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = this.PaymentHeaderFilterForm.get("VendorPANNumber").value;
        this.VoucherDataRequestModel.tdsSectionCode = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "";
        this.VoucherDataRequestModel.tdsSectionName = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : ""
        this.VoucherDataRequestModel.tdsRate = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0;
        this.VoucherDataRequestModel.tdsAmount = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0;
        this.VoucherDataRequestModel.SGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0;
        this.VoucherDataRequestModel.CGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0;
        this.VoucherDataRequestModel.UGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount) || 0;
        this.VoucherDataRequestModel.GSTTotal = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.VoucherDataRequestModel.GrossAmount = NetPayable;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = RoundOffAmount;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = PaymentMode;
        this.VoucherDataRequestModel.refNo = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.ChequeOrRefNo : "";
        this.VoucherDataRequestModel.accountName = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANM : LeadgerDetails?.name || "";
        this.VoucherDataRequestModel.accountCode = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANCD : LeadgerDetails?.value || "";
        this.VoucherDataRequestModel.date = (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.date : "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        this.VoucherDataRequestModel.transactionNumber = BillNo;

        const voucherlineItems = this.GetDebitVoucherLedgers(NetPayable, BillNo, PaymenDetails);

        this.VoucherRequestModel.details = voucherlineItems;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {


          let reqBody = {
            companyCode: this.storage.companyCode,
            voucherNo: res?.data?.mainData?.ops[0].vNO,
            transDate: Date(),
            finYear: financialYear,
            branch: this.storage.branch,
            transCode: VoucherInstanceType.BalancePayment,
            transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
            voucherCode: PaymentMode != "Journal" ? VoucherType.DebitVoucher : VoucherType.JournalVoucher,
            voucherType: PaymentMode != "Journal" ? VoucherType[VoucherType.DebitVoucher] : VoucherType[VoucherType.JournalVoucher],
            docType: "Voucher",
            partyType: "Vendor",
            docNo: BillNo,
            partyCode: "" + this.tableData[0].OthersData?.vND?.cD || "",
            partyName: this.tableData[0].OthersData?.vND?.nM || "",
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
          firstValueFrom(this.voucherServicesService.FinancePost("fin/account/posting", reqBody)).then((res: any) => {
            if (res) {
              this.voucherServicesService.UpdateVoucherNumbersInVendBillSummary(BillNo, reqBody.voucherNo);
              this.DoVendorBillPayment(BillNo, reqBody.voucherNo, PaymenDetails)
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
  DoVendorBillPayment(BillNo, voucherno, PaymenDetails) {

    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
    const PaymentMode = PaymenDetails.PaymentMode;
    let LeadgerDetails;
    if (PaymentMode == "Cash") {
      LeadgerDetails = PaymenDetails.CashAccount;
    }
    if (PaymentMode == "Journal") {
      LeadgerDetails = PaymenDetails.JournalAccount;
    }
    const vendbillpayment: Vendbillpayment = {
      _id: this.companyCode + "-" + BillNo + "-" + voucherno,
      cID: this.companyCode,
      bILLNO: BillNo,
      vUCHNO: voucherno,
      lOC: this.storage.branch,
      dTM: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.date : "",
      bILLAMT: NetPayable,
      pAYAMT: NetPayable,
      pENDBALAMT: 0,
      aMT: NetPayable,
      mOD: PaymentMode,
      bANK: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANM : LeadgerDetails?.name || "",
      bANKCD: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.Bank.bANCD : LeadgerDetails?.value || "",
      tRNO: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.ChequeOrRefNo : "",
      tDT: (PaymentMode === 'Cheque' || PaymentMode === 'RTGS/UTR') ? PaymenDetails.date : "",
      eNTDT: new Date(),
      eNTLOC: this.storage.branch,
      eNTBY: this.storage.userName,
    };

    const RequestData = {
      companyCode: this.companyCode,
      collectionName: "vend_bill_payment",
      data: vendbillpayment,
    };

    firstValueFrom(this.masterService.masterPost("generic/create", RequestData)).then((res: any) => {

    }).catch((error) => {
      this.snackBarUtilityService.ShowCommonSwal("error", error);
    });

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
          this.RedirectToTHCPayment()
        }, 1000);
      }
    });
  }
  //#endregion

  GetJournalVoucherLedgers(SelectedData, BillNo, PaymentAmount, NetPayable, RoundOffAmount) {

    const createVoucher = (accCode, accName, TDSApplicable, accCategory, debit, credit, THC, BillNo, sacCode = "", sacName = "") => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BalancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: SelectedData.OthersData?.cLOC || this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacCode,
      sacName: sacName,
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: debit + credit,
      TDSApplicable: TDSApplicable,
      narration: `When Vendor Bill Generated For : ${THC}  Against Bill No : ${BillNo}`
    });

    const Result = [];

    SelectedData.forEach((DataItem) => {
      let OtherChargePositiveAmt = 0;
      let OtherChargeNegativeAmt = 0;
      const ModifiedData = this.ModifiedTHCList.find(x => x.THC === DataItem.THC)
      if (ModifiedData) {
        const DiffrenceResult = this.findDifference(ModifiedData.OthersData.cHG, DataItem?.OthersData?.cHG);
        console.log(DiffrenceResult);
        DiffrenceResult.forEach((item) => {
          if (item.oPS == "+") {
            const GetLeadgerInfo = ledgerInfo[item.cHGNM];
            if (item.aMT.oldValue < item.aMT.newValue) {
              if (GetLeadgerInfo) {
                Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, false, GetLeadgerInfo.LeadgerCategory, +(Math.abs(item.aMT.difference)), 0, DataItem.THC, BillNo));
              }
              else {
                OtherChargePositiveAmt += +(Math.abs(item.aMT.difference));
              }
            }
            if (item.aMT.oldValue > item.aMT.newValue) {
              if (GetLeadgerInfo) {
                Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, false, GetLeadgerInfo.LeadgerCategory, 0, +(Math.abs(item.aMT.difference)), DataItem.THC, BillNo));
              }
              else {
                OtherChargeNegativeAmt += +(Math.abs(item.aMT.difference));
              }
            }
          } else {
            const GetLeadgerInfo = ledgerInfo[item.cHGNM];
            if (item.aMT.oldValue < item.aMT.newValue) {
              if (GetLeadgerInfo) {
                Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, false, GetLeadgerInfo.LeadgerCategory, 0, +(Math.abs(item.aMT.difference)), DataItem.THC, BillNo));
              }
              else {
                OtherChargeNegativeAmt += +(Math.abs(item.aMT.difference));
              }
            }
            if (item.aMT.oldValue > item.aMT.newValue) {
              if (GetLeadgerInfo) {
                Result.push(createVoucher(GetLeadgerInfo.LeadgerCode, GetLeadgerInfo.LeadgerName, false, GetLeadgerInfo.LeadgerCategory, +(Math.abs(item.aMT.difference)), 0, DataItem.THC, BillNo));
              }
              else {
                OtherChargePositiveAmt += +(Math.abs(item.aMT.difference));
              }
            }
          }
        });
      }

      if (OtherChargePositiveAmt != 0) {
        Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, false, ledgerInfo['EXP001009'].LeadgerCategory, OtherChargePositiveAmt, 0, DataItem.THC, BillNo));
      }
      if (OtherChargeNegativeAmt != 0) {
        Result.push(createVoucher(ledgerInfo['EXP001009'].LeadgerCode, ledgerInfo['EXP001009'].LeadgerName, false, ledgerInfo['EXP001009'].LeadgerCategory, 0, OtherChargeNegativeAmt, DataItem.THC, BillNo));
      }

      // Push TDS Sectiond Data
      if (!this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted) {
        if (+this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount != 0) {
          Result.push(createVoucher(
            this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value,
            this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name,
            true,
            "LIABILITY",
            0,
            +this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount,
            DataItem.THC,
            BillNo
          ));
        }
      }
      if (RoundOffAmount != 0) {
        Result.push(createVoucher(ledgerInfo['EXP001042'].LeadgerCode, ledgerInfo['EXP001042'].LeadgerName, false, ledgerInfo['EXP001042'].LeadgerCategory, RoundOffAmount > 0 ? RoundOffAmount : 0, RoundOffAmount < 0 ? RoundOffAmount : 0, DataItem.THC, BillNo));
      }
      // Push GST Data
      if (this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount != 0) {
        if (this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount != 0) {
          Result.push(createVoucher(ledgerInfo['LIA002004'].LeadgerCode, ledgerInfo['LIA002004'].LeadgerName, false, ledgerInfo['LIA002004'].LeadgerCategory, +this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount, 0, DataItem.THC, BillNo, this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(), this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()));
        } else if (this.VendorBalancePaymentFilterForm.value.CGSTAmount != 0 && this.VendorBalancePaymentFilterForm.value.SGSTAmount != 0) {
          Result.push(createVoucher(ledgerInfo['LIA002003'].LeadgerCode, ledgerInfo['LIA002003'].LeadgerName, false, ledgerInfo['LIA002003'].LeadgerCategory, +this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount, 0, DataItem.THC, BillNo, this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(), this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()));
          Result.push(createVoucher(ledgerInfo['LIA002001'].LeadgerCode, ledgerInfo['LIA002001'].LeadgerName, false, ledgerInfo['LIA002001'].LeadgerCategory, +this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount, 0, DataItem.THC, BillNo, this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(), this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()));
        } else if (this.VendorBalancePaymentFilterForm.value.UGSTAmount != 0) {
          Result.push(createVoucher(ledgerInfo['LIA002002'].LeadgerCode, ledgerInfo['LIA002002'].LeadgerName, false, ledgerInfo['LIA002002'].LeadgerCategory, +this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount, 0, DataItem.THC, BillNo, this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.value.toString(), this.VendorBalanceTaxationGSTFilterForm.value?.GSTSACcode?.name.toString()));
        }
      }
    });
    const TotalDebit = Result.reduce((a, b) => a + parseFloat(b.debit), 0);
    const TotalCredit = Result.reduce((a, b) => a + parseFloat(b.credit), 0);

    let difference = TotalDebit - TotalCredit;

    Result.push(createVoucher(
      ledgerInfo['LIA001002'].LeadgerCode,
      ledgerInfo['LIA001002'].LeadgerName,
      false,
      ledgerInfo['LIA001002'].LeadgerCategory,
      difference > 0 ? 0 : Math.abs(difference),
      difference < 0 ? 0 : Math.abs(difference),
      "",
      BillNo
    ));

    return Result;
  }
  GetDebitVoucherLedgers(NetPayable, BillNo, paymentData) {
    const PaymentMode = paymentData.PaymentMode;
    const createVoucher = (accCode, accName, accCategory, debit, credit, BillNo) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BalancePayment,
      transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
      voucherCode: PaymentMode != "Journal" ? VoucherType.DebitVoucher : VoucherType.JournalVoucher,
      voucherType: PaymentMode != "Journal" ? VoucherType[VoucherType.DebitVoucher] : VoucherType[VoucherType.JournalVoucher],
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
    if (PaymentMode == "Cash") {
      const CashAccount = paymentData.CashAccount;
      Result.push(createVoucher(CashAccount.aCNM, CashAccount.aCCD, "ASSET", 0, NetPayable, BillNo));
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
  // Function to find the difference between two arrays of objects
  findDifference(first, second) {
    const difference = [];

    first.forEach((item, index) => {
      const diffItem = {};
      for (const key in item) {
        if (item.hasOwnProperty(key) && (key === "cHGID" || key === "cHGNM" || key === "oPS" || key === "aMT")) {
          if (item[key] !== second[index][key]) {
            diffItem[key] = {
              oldValue: item[key],
              newValue: second[index][key],
              difference: second[index][key] - item[key]
            };
          }
        }
      }
      if (Object.keys(diffItem).length !== 0) {
        difference.push({
          ...item,
          ...diffItem
        });
      }
    });

    return difference;
  }
  isFormValid() {
    let isValid = this.tableData.length > 0;

    if (!this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted) {
      isValid = isValid && this.VendorBalanceTaxationTDSFilterForm.valid;
    }
    if (this.VendorBalanceTaxationGSTFilterForm.value.VendorGSTRegistered) {
      isValid = isValid && this.VendorBalanceTaxationGSTFilterForm.valid;
    }

    return isValid;
  }
}
