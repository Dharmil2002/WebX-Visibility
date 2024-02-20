import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditVoucherControl } from 'src/assets/FormControls/Finance/CreditVoucher/creditVoucher';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { StorageService } from 'src/app/core/service/storage.service';
import { AddCreditVoucherDetailsModalComponent } from './add-credit-voucher-details-modal/add-credit-voucher-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';
import { Router } from '@angular/router';
import { DriversFromApi, GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi, UsersFromApi, customerFromApi, vendorFromApi } from '../Debit Voucher/debitvoucherAPIUtitlity';
 
@Component({
  selector: 'app-credit-voucher',
  templateUrl: './credit-voucher.component.html'
})
export class CreditVoucherComponent implements OnInit {
  breadScrums = [
    {
      title: "Credit Voucher",
      items: ["Finance"],
      active: "Credit Voucher",
    },
  ];
  creditVoucherControl: CreditVoucherControl;

  creditVoucherSummaryForm: UntypedFormGroup;
  jsonControlCreditVoucherSummaryArray: any;
  columnHeader = {
    Ledger: {
      Title: "Ledger",
      class: "matcolumnfirst",
      Style: "min-width:200px",
    },
    CreditAmount: {
      Title: "Credit Amount ₹",
      class: "matcolumncenter",
      Style: "max-width:120px",
    },
    Narration: {
      Title: "Narration",
      class: "matcolumncenter",
      Style: "min-width:170px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:100px",
    }
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Ledger', 'CreditAmount', 'Narration']

  tableData: any = [];
  AccountGroupList: any;
  creditVoucherPaymentSummaryForm: UntypedFormGroup;
  jsonControlCreditVoucherPaymentSummaryArray: any;
  DebitVoucherControl: DebitVoucherControl;
  creditVoucherPaymentDetailsForm: UntypedFormGroup;
  jsonControlCreditVoucherPaymentDetailsArray: any;
  AlljsonControlCreditVoucherPaymentDetailsArray: any;
  AccountsBanksList: any;
  LoadVoucherDetails = true;
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService,
    private matDialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.bindData();
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.creditVoucherControl = new CreditVoucherControl("");
    this.jsonControlCreditVoucherSummaryArray = this.creditVoucherControl.getCreditVoucherSummaryArrayControls();
    this.creditVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherSummaryArray]);

    this.DebitVoucherControl = new DebitVoucherControl("");
    this.jsonControlCreditVoucherPaymentSummaryArray = this.DebitVoucherControl.getDebitVoucherTaxationPaymentSummaryArrayControls();

    this.creditVoucherPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherPaymentSummaryArray]);

    this.jsonControlCreditVoucherPaymentSummaryArray = this.jsonControlCreditVoucherPaymentSummaryArray
      .filter(x => x.name != 'Debitagainstdocument')
      .map(x => {
        x.generatecontrol = true;
        return x;
      });
    this.jsonControlCreditVoucherPaymentDetailsArray = this.DebitVoucherControl.getDebitVoucherTaxationPaymentDetailsArrayControls();

    this.AlljsonControlCreditVoucherPaymentDetailsArray = this.jsonControlCreditVoucherPaymentDetailsArray
    this.creditVoucherPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherPaymentDetailsArray]);
    this.jsonControlCreditVoucherPaymentDetailsArray = this.jsonControlCreditVoucherPaymentDetailsArray.slice(0, 1);
  }
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  async bindData() {

    const allLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlCreditVoucherSummaryArray,
      this.creditVoucherSummaryForm,
      allLocationsList,
      "Accountinglocation",
      false
    );
  }
  async ReceivedfromFieldChanged(event) {
    const Receivedfrom = this.creditVoucherSummaryForm.value.Receivedfrom;
    const PartyName = this.creditVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    const partyNameControl = this.jsonControlCreditVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Receivedfrom) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditVoucherSummaryArray,
          this.creditVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      default:
        partyNameControl.type = "text";
        PartyName.setValidators(Validators.required);
        PartyName.updateValueAndValidity();

    }
    this.BindLedger(Receivedfrom);
  }
  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.addCreditVoucherDetails(LedgerDetails)
    }
  }
  addCreditData() {
    this.addCreditVoucherDetails('')
  }
  addCreditVoucherDetails(event) {

    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(AddCreditVoucherDetailsModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          Ledger: result?.Ledger,
          CreditAmount: parseFloat(result?.CreditAmount || 0),
          LedgerHdn: result?.LedgerHdn,
          Narration: result?.Narration,
          actions: ['Edit', 'Remove']
        }
        this.tableData.push(json);
        this.LoadVoucherDetails = true;

      }
      this.CalculatePaymentAmount()
      this.LoadVoucherDetails = true;
    });

  }
  async BindLedger(BindLedger) {
    const account_groupReqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "account_detail",
      filter: {
        pARTNM: BindLedger
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const PaymentMode = this.creditVoucherPaymentDetailsForm.get("PaymentMode").value;
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
    this.jsonControlCreditVoucherPaymentDetailsArray = this.AlljsonControlCreditVoucherPaymentDetailsArray.filter(filterFunction);
    const Accountinglocation = this.creditVoucherSummaryForm.value.Accountinglocation?.name
    switch (PaymentMode) {
      case 'Cheque':
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlCreditVoucherPaymentDetailsArray,
          this.creditVoucherPaymentDetailsForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.creditVoucherPaymentDetailsForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo = this.creditVoucherPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();



        const CashAccount = this.creditVoucherPaymentDetailsForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonControlCreditVoucherPaymentDetailsArray,
          this.creditVoucherPaymentDetailsForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.creditVoucherPaymentDetailsForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.creditVoucherPaymentDetailsForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.creditVoucherPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  CalculatePaymentAmount() {
    const total = this.tableData.filter(item => item.CreditAmount).reduce((accumulator, currentValue) => {
      console.log(accumulator, currentValue);

      return accumulator + parseFloat(currentValue['CreditAmount']);
    }, 0);
    console.log(total);

    // const CalculatedSum = CalculatedSumWithTDS + DebitAmountSumWithoutTDS
    this.creditVoucherPaymentSummaryForm.get("PaymentAmount").setValue(total.toFixed(2));
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(total.toFixed(2));
  }
  toggleUpDown(event) {
    const totalPaymentAmount = this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value;
    const roundedValue = event.isUpDown ? Math.ceil(totalPaymentAmount) : Math.floor(totalPaymentAmount);
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(roundedValue);
  }
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.creditVoucherPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.creditVoucherPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
}