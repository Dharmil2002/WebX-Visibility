import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol';
import { THCAmountsDetailComponent } from '../Modal/thcamounts-detail/thcamounts-detail.component';
import { VendorBalancePaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorbalancepaymentcontrol';

@Component({
  selector: 'app-balance-payment',
  templateUrl: './balance-payment.component.html',
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
      Style: "min-width:15%",
      type: "Link",
      functionName: "BalanceUnbilledFunction"
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
      Title: "THC Amount",
      class: "matcolumncenter",
      Style: "min-width:15%",
      type: "Link",
      functionName: "THCAmountFunction"
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
  staticField = ["GenerationDate", "VehicleNumber", "Advance", "BalancePending"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any = [
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
      BalancePending: "2000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
      BalancePending: "2000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
      BalancePending: "2000.00",
    },

  ];
  isTableLode = true;
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


  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private matDialog: MatDialog,) { }

  ngOnInit(): void {
    this.initializeFormControl();
    this.TotalAmountList = [
      {
        count: "15000.00",
        title: "Total Advance Amount",
        class: `color-Success-light`,
      },
      {
        count: "6000.00",
        title: "Total Balance Pending",
        class: `color-Success-light`,
      }
    ]
  }

  initializeFormControl(): void {
    let RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
      Numberofvehiclesregistered: "20"
    }
    this.vendorBalancePaymentControl = new VendorBalancePaymentControl(RequestObj);
    this.jsonControlVendorBalanceTaxationTDSFilterArray = this.vendorBalancePaymentControl.getVendorBalanceTaxationTDSArrayControls();
    this.VendorBalanceTaxationTDSFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalanceTaxationTDSFilterArray]);

    this.jsonControlVendorBalanceTaxationGSTFilterArray = this.vendorBalancePaymentControl.getVendorBalanceTaxationGSTArrayControls();
    this.VendorBalanceTaxationGSTFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalanceTaxationGSTFilterArray]);

    this.jsonControlVendorBalanceSummaryFilterArray = this.vendorBalancePaymentControl.getVendorBalanceSummaryArrayControls();
    this.VendorBalanceSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalanceSummaryFilterArray]);

    this.jsonControlVendorBalancePaymentFilterArray = this.vendorBalancePaymentControl.getVendorBalanceTaxationPaymentDetailsArrayControls();
    this.VendorBalancePaymentFilterForm = formGroupBuilder(this.fb, [this.jsonControlVendorBalancePaymentFilterArray]);

    this.jsonControlPaymentHeaderFilterArray = this.vendorBalancePaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentHeaderFilterArray]);

  }

  AdvancePendingFunction(event) {
    console.log('AdvancePendingFunction', event)
  }

  BalanceUnbilledFunction(event) {
    console.log('BalanceUnbilledFunction', event)
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
        console.log(result)
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
    console.log(event)
  }
  MakePayment() {
    this.MakePaymentVisible = true

  }
  BookVendorBill() {

  }

}
