import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol';
import { THCAmountsDetailComponent } from '../Modal/thcamounts-detail/thcamounts-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GetAccountDetailFromApi, GetAdvancePaymentListFromApi, GetLocationDetailFromApi } from '../VendorPaymentAPIUtitlity';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
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
  tableData;
  AllLocationsList: any;
  isTableLode = true;

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
  constructor(private filter: FilterUtils,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
    private route: Router,
    private matDialog: MatDialog,) {
    // Retrieve the passed data from the state

    this.PaymentData = this.route.getCurrentNavigation()?.extras?.state?.data;
    console.log(this.PaymentData);

    if (this.PaymentData) {
      this.GetAdvancePaymentList()
    } else {
      this.RedirectToTHCPayment()
    }
  }
  RedirectToTHCPayment() {
    this.route.navigate(['/Finance/VendorPayment/THC-Payment']);
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
      }
    ]
    this.GetAdvancePaymentList()
    this.SetMastersData();
  }
  async GetAdvancePaymentList() {
    const Filters = {
      "vendorName": this.PaymentData.Vendor,
      "advPdAt": localStorage.getItem('Branch')
    }
    const GetAdvancePaymentData = await GetAdvancePaymentListFromApi(this.masterService, Filters)
    this.tableData = GetAdvancePaymentData
  }
  async SetMastersData() {
    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlPayableSummaryFilterArray,
      this.PayableSummaryFilterForm,
      this.AllLocationsList,
      "BalancePaymentlocation",
      false
    );
    const paymentstate = this.AllLocationsList.find(item => item.name == localStorage.getItem('CurrentBranchCode'))
    this.PayableSummaryFilterForm.get('BalancePaymentlocation').setValue(paymentstate);
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
    this.AlljsonControlPaymentSummaryFilterArray = this.jsonControlPaymentSummaryFilterArray;
    this.PaymentSummaryFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentSummaryFilterArray]);
    this.jsonControlPaymentSummaryFilterArray = this.jsonControlPaymentSummaryFilterArray.slice(0, 1);


    this.jsonControlPaymentHeaderFilterArray = this.vendorPaymentControl.getTPaymentHeaderFilterArrayControls();
    this.PaymentHeaderFilterForm = formGroupBuilder(this.fb, [this.jsonControlPaymentHeaderFilterArray]);
  }

  AdvancePendingFunction(event) {
    console.log('AdvancePendingFunction', event)
  }

  BalanceUnbilledFunction(event) {
    console.log('BalanceUnbilledFunction', event)
    const templateBody = {
      DocNo: event.data.THC,
      templateName: 'thc'
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1500,height=800');
  }
  THCAmountFunction(event) {
    const RequestBody = {
      PaymentData: this.PaymentData,
      THCData: event?.data
    }
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
    const selectedData = event.filter(x => x.isSelected);

    const totalTHCAmount = selectedData.reduce((total, item) => total + parseInt(item.THCamount), 0);
    const totalAdvance = selectedData.reduce((total, item) => total + parseInt(item.Advance), 0);

    this.TotalAmountList.forEach(x => {
      if (x.title === "Total THC Amount") {
        x.count = totalTHCAmount.toFixed(2);
      }
      if (x.title === "Total Advance") {
        x.count = totalAdvance.toFixed(2);
      }
    });

    this.PayableSummaryFilterForm.get("TotalTHCAmount").setValue(totalTHCAmount.toFixed(2));
    this.PayableSummaryFilterForm.get("AdvanceAmount").setValue(totalAdvance.toFixed(2));
    this.PayableSummaryFilterForm.get("BalancePayable").setValue((totalTHCAmount - totalAdvance).toFixed(2));

  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const PaymentMode = this.PaymentSummaryFilterForm.get("PaymentMode").value;
    let filterFunction;
    switch (PaymentMode) {
      case 'Cheque':
        filterFunction = (x) => x.name !== 'CashAccount';

        break;
      case 'Cash':
        filterFunction = (x) => x.name !== 'ChequeOrRefNo' && x.name !== 'Bank';
        break;
      case 'RTGS/UTR':
        filterFunction = (x) => x.name !== 'CashAccount';
        break;
    }

    this.jsonControlPaymentSummaryFilterArray = this.AlljsonControlPaymentSummaryFilterArray.filter(filterFunction);
    const Accountinglocation = this.PayableSummaryFilterForm.value.BalancePaymentlocation?.name
    switch (PaymentMode) {
      case 'Cheque':
        const responseFromAPIBank = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
          this.PaymentSummaryFilterForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.PaymentSummaryFilterForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo = this.PaymentSummaryFilterForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();



        const CashAccount = this.PaymentSummaryFilterForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonControlPaymentSummaryFilterArray,
          this.PaymentSummaryFilterForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.PaymentSummaryFilterForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.PaymentSummaryFilterForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.PaymentSummaryFilterForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }
  Submit() {

  }
}
