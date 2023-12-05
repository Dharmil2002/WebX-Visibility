import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
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
import { GetAdvancePaymentListFromApi } from "../VendorPaymentAPIUtitlity";

@Component({
  selector: "app-balance-payment",
  templateUrl: "./balance-payment.component.html",
})
export class BalancePaymentComponent implements OnInit {
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

  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private matDialog: MatDialog,
    private route: Router,
    // public dialog: MatDialog
  ) {
    this.PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    console.log(this.PaymentData);
    if (this.PaymentData) {
    } else {
      this.route.navigate(['/Finance/VendorPayment/THC-Payment']);
    }
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.GetAdvancePaymentList();
    this.TotalAmountList = [
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

  async GetAdvancePaymentList() {
    this.isTableLode = false
    const Filters = {
      "vendorName": this.PaymentData.Vendor,
      "balAmtAt": localStorage.getItem('Branch')
    }
    const GetAdvancePaymentData = await GetAdvancePaymentListFromApi(this.masterService, Filters)
    console.log('GetAdvancePaymentData',GetAdvancePaymentData)
    const Data = GetAdvancePaymentData.map((x,index)=>{
      return {
        GenerationDate:x.GenerationDate,
        VehicleNumber:x.VehicleNumber,
        Advance:x.Advance,
        BalancePending:x.OthersData.balAmt,
        THC:x.THC,
        THCamount:x.THCamount,
        isSelected:false,
      }
    })
    this.tableData = Data
    this.isTableLode = true
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
    this.VendorBalanceTaxationTDSFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlVendorBalanceTaxationTDSFilterArray,
    ]);

    this.jsonControlVendorBalanceTaxationGSTFilterArray =
      this.vendorBalancePaymentControl.getVendorBalanceTaxationGSTArrayControls();
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
      if(data.name == "Billbookingstate"){
        this.BillbookingstateCode = data.name;
        this.BillbookingstateStatus = data.additionalData.showNameAndValue;
      }
      if(data.name == "Vendorbillstate"){
        this.VendorbillstateCode = data.name;
        this.VendorbillstateStatus = data.additionalData.showNameAndValue;
        this.getStateDropdown()
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
    console.log(res)
    if (res.success) {
      const GSTSACcodeData = res.data.map((x)=>{
        return {
          name:x.SNM,
          value:x.SID,
        }
      })
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
    let req = {
      companyCode: this.companyCode,
      collectionName: "state_detail",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    console.log(res)
    if (res.success) {
      const StateData = res.data.map((x)=>{
        return {
          name:x.stateName,
          value:x.stateCode,
        }
      })
      this.filter.Filter(
        this.jsonControlVendorBalanceTaxationGSTFilterArray,
        this.VendorBalanceTaxationGSTFilterForm,
        StateData,
        this.BillbookingstateCode,
        this.BillbookingstateStatus
      );
      this.filter.Filter(
        this.jsonControlVendorBalanceTaxationGSTFilterArray,
        this.VendorBalanceTaxationGSTFilterForm,
        StateData,
        this.VendorbillstateCode,
        this.VendorbillstateStatus
      );
    }
  }

  async getTDSSectionDropdown() {
    let Accountinglocation = localStorage.getItem("CurrentBranchCode");
    let responseFromAPITDS = await GetAccountDetailFromApi(
      this.masterService,
      "TDS",
      Accountinglocation
    );
    console.log("responseFromAPITDS", responseFromAPITDS);
    this.filter.Filter(
      this.jsonControlVendorBalanceTaxationTDSFilterArray,
      this.VendorBalanceTaxationTDSFilterForm,
      responseFromAPITDS,
      this.TDSSectionCodeCode,
      this.TDSSectionCodeStatus
    );
  }

  TDSSectionFieldChanged(event) {
    console.log("event", event);
  }

  AdvancePendingFunction(event) {
    console.log("AdvancePendingFunction", event);
  }

  BalanceUnbilledFunction(event) {
    console.log("BalanceUnbilledFunction", event);
  }
  THCAmountFunction(event) {
    const dialogRef = this.matDialog.open(THCAmountsDetailComponent, {
      data: "",
      width: "90%",
      height: "95%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
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
    // console.log(event)
    let AdvanceTotle = 0;
    let BalancePending = 0;
    const SelectedData = event.filter((x) => x.isSelected);
    // if(SelectedData)
    SelectedData.forEach((x) => {
      AdvanceTotle = AdvanceTotle + parseInt(x.Advance);
      BalancePending = BalancePending + parseInt(x.BalancePending);
    });
    this.TotalAmountList.forEach((x) => {
      if (x.title == "Total Advance Amount") {
        x.count = AdvanceTotle.toFixed(2);
      }
      if (x.title == "Total Balance Pending") {
        x.count = BalancePending.toFixed(2);
      }
    });
  }

  BeneficiarydetailsViewFunctions(event){
    console.log("BeneficiarydetailsViewFunctions")
  }
  MakePayment() {
    // this.MakePaymentVisible = true;
    const dialogRef = this.matDialog.open(BlancePaymentPopupComponent, {
      data: "",
      width: "70%",
      height: "60%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
      }
    });
  }
  BookVendorBill() {}
}
