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
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any;
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
    // this.BillPaymentData = {
    //   "vendor": "8888 : Krupesh",
    //   "_id": "10065-VB/MUMB/2324/000015",
    //   "vnCode": 8888,
    //   "vnName": "Krupesh",
    //   "billType": "Vendor Bill",
    //   "billNo": "VB/MUMB/2324/000015",
    //   "Date": "28/12/2023",
    //   "TotalTHCAmount": 5000,
    //   "AdvancePayedAmount": 1000,
    //   "billAmount": 4000,
    //   "pendingAmount": 4000,
    //   "paymentAmount": 4000,
    //   "Status": "Awaiting Approval",
    //   "StatusCode": 1,
    //   "vPan": "CASPJ2345J",
    //   "actions": [
    //     "Approve Bill",
    //     "Hold Payment",
    //     "Cancel Bill",
    //     "Modify"
    //   ],
    //   "isSelected": false
    // }
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
        StartDate: this.BillPaymentData?.StartDate,
        EndDate: this.BillPaymentData?.EndDate,
        VendorInfo: this.BillPaymentData?.VendorInfo,
      }
    }

    const GetAdvanceBillPaymentData = await GetAdvancePaymentListFromApi(
      this.masterService,
      Filters
    );


    const Data = GetAdvanceBillPaymentData.map((x, index) => {
      return {
        GenerationDate: x.GenerationDate,
        VehicleNumber: x.VehicleNumber,
        Advance: x.Advance,
        BalancePending: x.OthersData.bALAMT,
        THC: x.THC,
        THCamount: x.THCamount,
        OthersData: x,
        isSelected: false,
      };
    });
    if (this.IsModifyAction) {
      const GetBillData = await GetTHCListBasdedOnBillNumberFromApi(
        this.masterService,
        this.BillPaymentData?.billNo
      );
      const MappedGetBillData = GetBillData.map((x, index) => {
        return {
          GenerationDate: x.GenerationDate,
          VehicleNumber: x.VehicleNumber,
          Advance: x.Advance,
          BalancePending: x.OthersData.bALAMT,
          THC: x.THC,
          THCamount: x.THCamount,
          OthersData: x,
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
        console.log("this.VendorDetails", this.VendorDetails);

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
          console.log("getValue", getValue);
          this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.setValue(
            getValue || ""
          );
        }
        console.log("VendorDetails", res);
      }
    }
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

  GSTSACcodeFieldChanged() { }

  toggleTDSExempted() {
    const TDSExemptedValue =
      this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted;

    if (TDSExemptedValue) {
      this.jsonControlVendorBalanceTaxationTDSFilterArray =
        this.AlljsonControlVendorBalanceTaxationTDSFilterArray;
      const TDSSection =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValidators([Validators.required]);
      const TDSAmount =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValidators([Validators.required]);
      TDSAmount.updateValueAndValidity();
      this.getTDSSectionDropdown();
    } else {
      this.jsonControlVendorBalanceTaxationTDSFilterArray =
        this.AlljsonControlVendorBalanceTaxationTDSFilterArray.filter(
          (x) => x.name == "TDSExempted"
        );
      const TDSSection =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSSection");
      TDSSection.setValue("");
      TDSSection.clearValidators();
      const TDSRate = this.VendorBalanceTaxationTDSFilterForm.get("TDSRate");
      TDSRate.setValue("");
      TDSRate.clearValidators();
      const TDSAmount =
        this.VendorBalanceTaxationTDSFilterForm.get("TDSAmount");
      TDSAmount.setValue("");
      TDSAmount.clearValidators();
      TDSAmount.updateValueAndValidity();
    }
  }

  TDSSectionFieldChanged() {
    if (this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value) {
      const FindData = this.TDSdata.find(
        (x) =>
          x.value ==
          this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value
      );
      const TDSrate = FindData.rOTHER.toFixed(2);
      const TDSamount = ((TDSrate * this.THCamount) / 100 || 0).toFixed(2);
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
      templateName: "THC View-Print",
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
          this.GetBalancePaymentList();
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
  BookVendorBill(PaymenDetails, generateVoucher, IsUpdate) {
    if (this.tableData.filter(x => x.isSelected).length == 0) {
      this.snackBarUtilityService.ShowCommonSwal(
        "info",
        "Please Select Atleast One THC"
      );
    } else {
      const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
      const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
      const RoundOffAmount = NetPayable - PaymentAmount;
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
              lOC: this.VendorDetails?.vendorCity,
              sT: this.VendorBalanceTaxationGSTFilterForm.controls.Vendorbillstate.value?.value,
              gSTIN: this.VendorBalanceTaxationGSTFilterForm.controls.VGSTNumber.value,
              tHCAMT: this.THCamount,
              aDVAMT: this.AdvanceTotal,
              bALAMT: NetPayable,
              rOUNOFFAMT: RoundOffAmount,
              bALPBAMT: generateVoucher == true ? 0 : NetPayable,
              bSTAT: generateVoucher == true ? 4 : 1,
              bSTATNM: generateVoucher == true ? "Paid" : "Awaiting Approval",
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
                sT: this.VendorBalanceTaxationGSTFilterForm.controls.Billbookingstate.value?.value,
                gSTIN: this.VendorBalanceTaxationGSTFilterForm.controls.GSTNumber.value,
              },
              tDS: {
                eXMT: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted,
                sEC: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "",
                sECD: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : "",
                rATE: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0,
                aMT: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0,
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
                tMOD: "FTL",
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
                if (generateVoucher) {
                  this.SubmitVoucherData(PaymenDetails, res?.data.data.ops[0].docNo)
                } else {
                  Swal.fire({
                    icon: "success",
                    title: `Bill ${IsUpdate ? 'Updated' : 'Generated'} Successfully`,
                    text: "Bill No: " + res?.data.data.ops[0].docNo,
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
  SubmitVoucherData(PaymenDetails, BillNo) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        if (!PaymenDetails) {
          return this.snackBarUtilityService.ShowCommonSwal("error", "Please Fill Payment Details");
        }

        // const PaymentAmount = parseFloat(
        //   this.THCamount.toFixed(2)
        // );
        // const NetPayable = parseFloat(
        //   this.THCamount.toFixed(2)
        // );
        const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
        const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
        const RoundOffAmount = NetPayable - PaymentAmount;

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        // this.VoucherDataRequestModel.companyCode = this.companyCode;
        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BalancePayment;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BalancePayment];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch =
          this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation =
          this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Vendor";
        this.VoucherDataRequestModel.partyCode =
          this.tableData[0].OthersData?.vendorCode;
        this.VoucherDataRequestModel.partyName =
          this.tableData[0].OthersData?.vendorName;
        this.VoucherDataRequestModel.partyState =
          this.VendorDetails?.vendorState;
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo =
          this.PaymentHeaderFilterForm.get("VendorPANNumber").value;
        this.VoucherDataRequestModel.tdsSectionCode = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value : "";
        this.VoucherDataRequestModel.tdsSectionName = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name : ""
        this.VoucherDataRequestModel.tdsRate = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSRate : 0;
        this.VoucherDataRequestModel.tdsAmount = this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? +this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount : 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = undefined;
        this.VoucherDataRequestModel.tcsSectionName = undefined
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0,
          this.VoucherDataRequestModel.SGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0,
          this.VoucherDataRequestModel.CGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0,
          this.VoucherDataRequestModel.UGST = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.UGSTAmount) || 0,
          this.VoucherDataRequestModel.GSTTotal = parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0;

        this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = RoundOffAmount;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = PaymenDetails.PaymentMode;
        this.VoucherDataRequestModel.refNo = PaymenDetails?.ChequeOrRefNo || "";
        this.VoucherDataRequestModel.accountName = PaymenDetails?.Bank?.name || "";
        this.VoucherDataRequestModel.accountCode = PaymenDetails?.Bank?.value || "";
        this.VoucherDataRequestModel.date = PaymenDetails.Date;
        this.VoucherDataRequestModel.scanSupportingDocument = ""; //this.imageData?.ScanSupportingdocument
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        const companyCode = this.companyCode;
        const CurrentBranchCode = this.storage.branch;

        var VoucherlineitemList = this.tableData.filter((x) => x.isSelected == true).map((item) => {
          return {
            companyCode: companyCode,
            voucherNo: "",
            transCode: VoucherInstanceType.BalancePayment,
            transType: VoucherInstanceType[VoucherInstanceType.BalancePayment],
            voucherCode: VoucherType.JournalVoucher,
            voucherType: VoucherType[VoucherType.JournalVoucher],
            transDate: new Date(),
            finYear: financialYear,
            branch: CurrentBranchCode,
            accCode: "TEST",
            accName: "TEST",
            sacCode: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.value.toString(),
            sacName: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.name.toString(),
            debit: parseFloat(item.THCamount).toFixed(2),
            credit: 0,
            GSTRate: 0,
            GSTAmount: 0,
            Total: parseFloat(item.THCamount).toFixed(2),
            TDSApplicable: false,
            narration: "when THC Payment done for " + item.THC + " against Bill No " + BillNo,
          };
        });

        this.VoucherRequestModel.details = VoucherlineitemList;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        firstValueFrom(this.voucherServicesService.FinancePost("fin/account/voucherentry", this.VoucherRequestModel)).then((res: any) => {

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
                this.RedirectToTHCPayment()
              }, 1000);
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

    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
    const vendbillpayment: Vendbillpayment = {
      _id: this.companyCode + "-" + BillNo + "-" + voucherno,
      cID: this.companyCode,
      bILLNO: BillNo,
      vUCHNO: voucherno,
      lOC: this.storage.branch,
      dTM: PaymenDetails.Date,
      bILLAMT: NetPayable,
      pAYAMT: NetPayable,
      pENDBALAMT: 0,
      aMT: NetPayable,
      mOD: PaymenDetails.PaymentMode,
      bANK: PaymenDetails?.Bank?.name || "",
      tRNO: PaymenDetails?.ChequeOrRefNo || "",
      tDT: PaymenDetails.Date,
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


}
