import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol';
import { THCAmountsDetailComponent } from '../Modal/thcamounts-detail/thcamounts-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-advance-payments',
  templateUrl: './advance-payments.component.html'
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
      Style: "min-width:20%",
    },
    THCamount: {
      Title: "THC Amount",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "Link",
      functionName: "THCAmountFunction"
    },
    Advance: {
      Title: "Advance",
      class: "matcolumncenter",
      Style: "min-width:20%",
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
  staticField = ["GenerationDate", "VehicleNumber", "Advance"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any = [
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },

  ];
  isTableLode = true;

  vendorPaymentControl: VendorPaymentControl;
  protected _onDestroy = new Subject<void>();

  PayableSummaryFilterForm: UntypedFormGroup;
  jsonControlPayableSummaryFilterArray: any;

  PaymentSummaryFilterForm: UntypedFormGroup;
  jsonControlPaymentSummaryFilterArray: any;

  PaymentHeaderFilterForm: UntypedFormGroup;
  jsonControlPaymentHeaderFilterArray: any;

  TotalAmountList: { count: any; title: string; class: string }[];
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private matDialog: MatDialog,) { }

  ngOnInit(): void {
    this.initializeFormControl();
    this.TotalAmountList = [
      {
        count: "15000.00",
        title: "Total THC Amount",
        class: `color-Success-light`,
      },
      {
        count: "6000.00",
        title: "Total Advance",
        class: `color-Success-light`,
      }
    ]
  }

  initializeFormControl(): void {
    let RequestObj = {
      VendorPANNumber: "AACCG464648ZS",
      Numberofvehiclesregistered: "20"
    }
    this.vendorPaymentControl = new VendorPaymentControl(RequestObj);
    this.jsonControlPayableSummaryFilterArray = this.vendorPaymentControl.getTPayableSummaryFilterArrayControls();
    this.PayableSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPayableSummaryFilterArray]);

    this.jsonControlPaymentSummaryFilterArray = this.vendorPaymentControl.getTPaymentSummaryFilterArrayControls();
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentSummaryFilterArray]);

    this.jsonControlPaymentHeaderFilterArray = this.vendorPaymentControl.getTPaymentHeaderFilterArrayControls();
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
}
