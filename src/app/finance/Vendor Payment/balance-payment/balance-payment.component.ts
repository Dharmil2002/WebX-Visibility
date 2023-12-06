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
import { GetAccountDetailFromApi } from "../../credit-debit-voucher/debitvoucherAPIUtitlity";
import { BlancePaymentPopupComponent } from "../blance-payment-popup/blance-payment-popup.component";
import { Router } from "@angular/router";
import {
  GetAdvancePaymentListFromApi,
  GetSingleVendorDetailsFromApi,
  GetStateListFromAPI,
} from "../VendorPaymentAPIUtitlity";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { DebitVoucherDataRequestModel, DebitVoucherRequestModel } from "src/app/Models/Finance/Finance";
import { Vendbilldetails, VendorBillEntry } from "src/app/Models/Finance/VendorPayment";
import { financialYear } from "src/app/Utility/date/date-utils";
import Swal from "sweetalert2";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-balance-payment",
  templateUrl: "./balance-payment.component.html",
})
export class BalancePaymentComponent implements OnInit {
  vendorBillEntryModel = new VendorBillEntry();
  VendorDetails;
  breadScrums = [
    {
      title: "Balance Payments",
      items: ["Home"],
      active: "Balance Payments",
    },
  ];
  linkArray = [];
  menuItems = [];
  MakePaymentVisible: Boolean = false;

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
      Title: "THC Amount",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "THCAmountFunction",
    },
    Advance: {
      Title: "Advance",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    BalancePending: {
      Title: "Balance Pending",
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
  VendorBalanceSummaryFilterForm: UntypedFormGroup;
  jsonControlVendorBalanceSummaryFilterArray: any;

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
  PaymentData: any;
  TDSdata: any;
  AdvanceTotle: number;
  BalancePending: number;
  THCamount: number;
  AlljsonControlVendorBalanceTaxationTDSFilterArray: any;

  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private voucherServicesService: VoucherServicesService,
    public snackBarUtilityService: SnackBarUtilityService,
    private masterService: MasterService,
    private matDialog: MatDialog,
    private route: Router // public dialog: MatDialog
  ) {
    this.PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (this.PaymentData) {
    } else {
      this.route.navigate(["/Finance/VendorPayment/THC-Payment"]);
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.GetAdvancePaymentList();
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
    this.GetVendorInformation();
  }
  async GetVendorInformation() {
    this.VendorDetails = await GetSingleVendorDetailsFromApi(this.masterService, this.PaymentData.Vendor)
    this.PaymentHeaderFilterForm.get("VendorPANNumber").setValue(this.VendorDetails?.panNo)
    this.PaymentHeaderFilterForm.get("Numberofvehiclesregistered").setValue(0)


  }
  async GetAdvancePaymentList() {
    this.isTableLode = false;
    const Filters = {
      vendorName: this.PaymentData.Vendor,
      balAmtAt: localStorage.getItem("Branch"),
    };
    const GetAdvancePaymentData = await GetAdvancePaymentListFromApi(
      this.masterService,
      Filters
    );
    const Data = GetAdvancePaymentData.map((x, index) => {
      return {
        GenerationDate: x.GenerationDate,
        VehicleNumber: x.VehicleNumber,
        Advance: x.Advance,
        BalancePending: x.OthersData.balAmt,
        THC: x.THC,
        THCamount: x.THCamount,
        isSelected: false,
      };
    });
    this.tableData = Data;
    this.isTableLode = true;
  }

  initializeFormControl(): void {
    let RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
      Numberofvehiclesregistered: "20",
    };
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

    this.jsonControlVendorBalanceTaxationGSTFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationGSTArrayControls();
    this.AlljsonControlVendorBalanceTaxationGSTFilterArray =
      this.jsonControlVendorBalanceTaxationGSTFilterArray;
    this.VendorBalanceTaxationGSTFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalanceTaxationGSTFilterArray,
    ]);

    this.jsonControlVendorBalanceSummaryFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceSummaryArrayControls();
    this.VendorBalanceSummaryFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalanceSummaryFilterArray,
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
    this.bindDropDwon();
  }
  bindDropDwon() {
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
      const GSTSACcodeData = res.data.map((x) => {
        return {
          ...x,
          name: x.SNM,
          value: x.SID,
        };
      });
      this.filter.Filter(
        this.jsonControlVendorBalanceTaxationGSTFilterArray,
        this.VendorBalanceTaxationGSTFilterForm,
        GSTSACcodeData,
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
        value: x.stateCode,
        name: x.stateName,
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
  }

  async getTDSSectionDropdown() {
    let Accountinglocation = localStorage.getItem("CurrentBranchCode");
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
    }
  }

  TDSSectionFieldChanged() {
    if (this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value) {
      const FindData = this.TDSdata.find(
        (x) =>
          x.value ==
          this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value
      );
      const TDSrate = FindData.ACdetail.CorporateTDS.toFixed(2);
      const TDSamount = ((TDSrate * this.THCamount) / 100 || 0).toFixed(2);
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSRate"].setValue(
        TDSrate
      );
      this.VendorBalanceTaxationTDSFilterForm.controls["TDSAmount"].setValue(
        TDSamount
      );
    }
  }

  AdvancePendingFunction(event) {
    console.log("AdvancePendingFunction", event);
  }

  BalanceUnbilledFunction(event) {
    const templateBody = {
      DocNo: event.data.THC,
      templateName: "thc",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1500,height=800");
  }
  THCAmountFunction(event) {
    const RequestBody = {
      PaymentData: this.PaymentData,
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
        console.log("result", result);
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
  selectCheckBox(event) {
    this.AdvanceTotle = 0;
    this.BalancePending = 0;
    this.THCamount = 0;

    const SelectedData = event.filter((x) => x.isSelected);
    SelectedData.forEach((x) => {
      this.AdvanceTotle = this.AdvanceTotle + parseInt(x.Advance);
      this.BalancePending = this.BalancePending + parseInt(x.BalancePending);
      this.THCamount = this.THCamount + parseInt(x.THCamount);
    });
    this.TotalAmountList.forEach((x) => {
      if (x.title == "Total Advance Amount") {
        x.count = this.AdvanceTotle.toFixed(2);
      }
      if (x.title == "Total Balance Pending") {
        x.count = this.BalancePending.toFixed(2);
      }
      if (x.title == "Total THC Amount") {
        x.count = this.THCamount.toFixed(2);
      }
    });
    this.TDSSectionFieldChanged();
    this.StateChange()
  }

  BeneficiarydetailsViewFunctions(event) {
    console.log("BeneficiarydetailsViewFunctions");
  }
  MakePayment() {
    const dialogRef = this.matDialog.open(BlancePaymentPopupComponent, {
      data: "",
      width: "70%",
      height: "60%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
      }
    });
  }


  StateChange() {
    const formValues = this.VendorBalanceTaxationGSTFilterForm.value;
    const Billbookingstate = formValues.Billbookingstate;
    const Vendorbillstate = formValues.Vendorbillstate;
    const SACcode = formValues.GSTSACcode;

    if (Billbookingstate && Vendorbillstate && SACcode) {
      const IsStateTypeUT = this.AllStateList.find(item => item.stateName === Vendorbillstate.name).stateType === 'UT';
      const GSTAmount = this.tableData.filter(item => item.isSelected).reduce((acc, curr) => acc + parseFloat(curr['BalancePending']), 0);
      const GSTdata = { GSTAmount, GSTRate: SACcode.GSTRT };

      if (!IsStateTypeUT && Billbookingstate.name == Vendorbillstate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState('SAME', GSTdata);
      } else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState('UT', GSTdata);
      } else if (!IsStateTypeUT && Billbookingstate.name != Vendorbillstate.name) {
        this.ShowOrHideBasedOnSameOrDifferentState('DIFF', GSTdata);
      }
    }
  }

  ShowOrHideBasedOnSameOrDifferentState(Check, GSTdata) {
    const filterFunctions = {
      'UT': x => x.name !== 'IGSTRate' && x.name !== 'SGSTRate',
      'SAME': x => x.name !== 'IGSTRate' && x.name !== 'UGSTRate',
      'DIFF': x => x.name !== 'SGSTRate' && x.name !== 'UGSTRate' && x.name !== 'CGSTRate'
    };

    const GSTinputType = ['SGSTRate', 'UGSTRate', 'CGSTRate', 'IGSTRate'];

    this.jsonControlVendorBalanceTaxationGSTFilterArray = this.AlljsonControlVendorBalanceTaxationGSTFilterArray.filter(filterFunctions[Check]);

    const GSTinput = this.jsonControlVendorBalanceTaxationGSTFilterArray
      .filter(item => GSTinputType.includes(item.name))
      .map(item => item.name);

    const GSTCalculateAmount = ((GSTdata.GSTAmount * GSTdata.GSTRate) / (100 * GSTinput.length)).toFixed(2);
    const GSTCalculateRate = (GSTdata.GSTRate / GSTinput.length).toFixed(2);

    const calculateValues = (rateKey, amountKey) => {
      this.VendorBalanceTaxationGSTFilterForm.get(rateKey).setValue(GSTCalculateRate);
      this.VendorBalanceTaxationGSTFilterForm.get(amountKey).setValue(GSTCalculateAmount);
    };
    GSTinput.forEach(x => calculateValues(x, x.substring(0, 4) + 'Amount'));

    this.VendorBalanceTaxationGSTFilterForm.get('TotalGSTRate').setValue((+GSTCalculateRate * GSTinput.length).toFixed(2));
    this.VendorBalanceTaxationGSTFilterForm.get('GSTAmount').setValue((+GSTCalculateAmount * GSTinput.length).toFixed(2));
  }
  BookVendorBill() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const vendorBillEntry: VendorBillEntry = {
          companyCode: this.companyCode,
          docType: "VB",
          branch: localStorage.getItem("CurrentBranchCode"),
          finYear: financialYear,
          data: {
            companyCode: this.companyCode,
            cID: this.companyCode,
            docNo: "",
            bDT: new Date(),
            lOC: this.VendorDetails?.vendorCity,
            sT: this.VendorDetails?.vendorState,
            gSTIN: this.VendorDetails?.otherdetails?.[0].gstNumber,
            tHCAMT: this.THCamount,
            aDVAMT: this.AdvanceTotle,
            bALAMT: this.BalancePending,
            rOUNOFFAMT: 0,
            bALPBAMT: this.BalancePending,
            bSTAT: 1,
            bSTATNM: "Generated",
            cNL: false,
            cNLDT: new Date(),
            cNBY: localStorage.getItem("UserName"),
            cNRES: "",
            eNTDT: new Date(),
            eNTLOC: localStorage.getItem("CurrentBranchCode"),
            eNTBY: localStorage.getItem("UserName"),
            mODDT: new Date(),
            mODLOC: "",
            mODBY: "",
            vND: {
              cD: this.VendorDetails?.vendorCode,
              nM: this.VendorDetails?.vendorName,
              pAN: this.VendorDetails?.panNo,
              aDD: this.VendorDetails?.vendorAddress,
              mOB: this.VendorDetails?.vendorPhoneNo.toString(),
              eML: this.VendorDetails?.emailId,
              gSTREG: this.VendorDetails?.otherdetails?.[0].gstNumber ? true : false,
              sT: this.VendorDetails?.otherdetails?.[0].gstState,
              gSTIN: this.VendorDetails?.otherdetails?.[0].gstNumber,
            },
            tDS: {
              eXMT: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted,
              sEC: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? "" : this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.value,
              sECD: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? "" : this.VendorBalanceTaxationTDSFilterForm.value.TDSSection.name,
              rATE: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? 0 : this.VendorBalanceTaxationTDSFilterForm.value.TDSRate,
              aMT: this.VendorBalanceTaxationTDSFilterForm.value.TDSExempted ? 0 : this.VendorBalanceTaxationTDSFilterForm.value.TDSAmount,
            },
            gST: {
              sAC: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.value.toString(),
              sACNM: this.VendorBalanceTaxationGSTFilterForm.value.GSTSACcode?.name.toString(),
              tYP: this.VendorBalanceTaxationGSTFilterForm.value.GSTType,
              rATE: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.TotalGSTRate) || 0,
              iGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTRate) || 0,
              cGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTRate) || 0,
              sGRT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTRate) || 0,
              iGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.IGSTAmount) || 0,
              cGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.CGSTAmount) || 0,
              sGST: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.SGSTAmount) || 0,
              aMT: parseFloat(this.VendorBalanceTaxationGSTFilterForm.value.GSTAmount) || 0,
            },
          },
        };
        firstValueFrom(this.voucherServicesService
          .FinancePost("finance/bill/vendor/create", vendorBillEntry)).then((res: any) => {
            this.SetVendorBillEntry(res?.data?.insertedId)
          }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
          .finally(() => {

          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error);
      }
    }, "Balance Payment Generating..!");

  }
  SetVendorBillEntry(BillNo) {
    this.tableData.filter((x) => x.isSelected == true).forEach((item) => {

      const vendbilldet: Vendbilldetails = {
        _id: BillNo + "-" + item.THC,
        cID: this.companyCode,
        bILLNO: BillNo,
        tRIPNO: item.THC,
        tTYP: "THC",
        aDVAMT: item.Advance,
        bALAMT: item.BalancePending,
        tHCAMT: item.THCamount,
        eNTDT: new Date(),
        eNTLOC: localStorage.getItem("CurrentBranchCode"),
        eNTBY: localStorage.getItem("UserName"),
      };

      const RequestData = {
        companyCode: this.companyCode,
        collectionName: "vend_bill_det",
        data: vendbilldet,
      };

      firstValueFrom(this.masterService.masterPost("generic/create", RequestData)).then((res: any) => {

      }).catch((error) => { this.snackBarUtilityService.ShowCommonSwal("error", error); })
        .finally(() => {
        });
    })
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
        }, 2000);
      }
    });
  }
}
