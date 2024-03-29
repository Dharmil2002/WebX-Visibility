import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import Swal from 'sweetalert2';
import { AddVoucherDetailsModalComponent } from '../Modals/add-voucher-details-modal/add-voucher-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { DriversFromApi, GetAccountDetailFromApi, GetBankDetailFromApi, GetLocationDetailFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, GetsachsnFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './debitvoucherAPIUtitlity';
import { GetLedgerDocument, GetLedgercolumnHeader } from './debitvoucherCommonUtitlity';
import { AddDebitAgainstDocumentModalComponent } from '../Modals/add-debit-against-document-modal/add-debit-against-document-modal.component';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';
import { DebitVoucherPreviewComponent } from '../Modals/debit-voucher-preview/debit-voucher-preview.component';
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from 'src/app/Models/Finance/Finance';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
@Component({
  selector: 'app-debit-voucher',
  templateUrl: './debit-voucher.component.html',
})
export class DebitVoucherComponent implements OnInit {
  companyCode: number | null
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  breadScrums = [
    {
      title: "Debit Voucher",
      items: ["Finance"],
      active: "Debit Voucher",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-2";
  DebitVoucherControl: DebitVoucherControl;

  DebitVoucherSummaryForm: UntypedFormGroup;
  jsonControlDebitVoucherSummaryArray: any;

  //Taxation Form Config
  DebitVoucherTaxationTDSForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationTDSArray: any;

  DebitVoucherTaxationTCSForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationTCSArray: any;

  DebitVoucherTaxationGSTForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationGSTArray: any;
  AlljsonControlDebitVoucherTaxationGSTArray: any;

  DebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationPaymentSummaryArray: any;

  DebitVoucherTaxationPaymentDetailsForm: UntypedFormGroup;
  jsonControlDebitVoucherTaxationPaymentDetailsArray: any;
  AlljsonControlDebitVoucherTaxationPaymentDetailsArray: any;



  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Ledger', 'SACCode', 'DebitAmount', 'GSTRate', 'GSTAmount', 'Total', 'TDSApplicable', 'Narration']

  columnHeader = GetLedgercolumnHeader()
  AccountsBanksList: any;
  tableData: any = [];
  DebitAgainstDocumentList: any = [];
  SACCodeList: any = [];
  LoadVoucherDetails = true;
  TDSAtLineItem: boolean = false;

  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };
  imageData: any;
  PartyNameList: any;
  AllStateList: any;
  StateList: any;
  AccountGroupList: any;
  AllLocationsList: any;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private masterService: MasterService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
    private matDialog: MatDialog,
    private objImageHandling: ImageHandling,
    public snackBarUtilityService: SnackBarUtilityService,
  ) {
    this.companyCode = this.sessionService.getCompanyCode()
    // this.imageData = {
    //   'driverPhoto': this.DebitVoucherTaxationPaymentDetailsForm.driverPhoto
    // }
  }
  ngOnInit(): void {
    this.BindDataFromApi();
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.DebitVoucherControl = new DebitVoucherControl("");
    this.jsonControlDebitVoucherSummaryArray = this.DebitVoucherControl.getDebitVoucherSummaryArrayControls();
    this.DebitVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherSummaryArray]);

    this.jsonControlDebitVoucherTaxationTDSArray = this.DebitVoucherControl.getDebitVoucherTaxationTDSArrayControls();
    this.DebitVoucherTaxationTDSForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationTDSArray]);

    this.jsonControlDebitVoucherTaxationTCSArray = this.DebitVoucherControl.getDebitVoucherTaxationTCSArrayControls();
    this.DebitVoucherTaxationTCSForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationTCSArray]);

    this.jsonControlDebitVoucherTaxationGSTArray = this.DebitVoucherControl.getDebitVoucherTaxationGSTArrayControls();
    this.AlljsonControlDebitVoucherTaxationGSTArray = this.jsonControlDebitVoucherTaxationGSTArray;
    this.DebitVoucherTaxationGSTForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationGSTArray]);

    this.jsonControlDebitVoucherTaxationPaymentSummaryArray = this.DebitVoucherControl.getDebitVoucherTaxationPaymentSummaryArrayControls();
    this.DebitVoucherTaxationPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationPaymentSummaryArray]);

    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.DebitVoucherControl.getDebitVoucherTaxationPaymentDetailsArrayControls();
    this.AlljsonControlDebitVoucherTaxationPaymentDetailsArray = this.jsonControlDebitVoucherTaxationPaymentDetailsArray
    this.DebitVoucherTaxationPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherTaxationPaymentDetailsArray]);
    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.jsonControlDebitVoucherTaxationPaymentDetailsArray.slice(0, 1);

  }
  async BindDataFromApi() {
    const stateReqBody = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "state_master",
    };


    const resState = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map(x => ({
        value: x.ST, name: x.STNM
      }))
      .filter(x => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));



    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlDebitVoucherSummaryArray,
      this.DebitVoucherSummaryForm,
      this.AllLocationsList,
      "Accountinglocation",
      false
    );

    this.SACCodeList = await GetsachsnFromApi(this.masterService)
    console.log(this.SACCodeList)
  }
  async BindLedger(BindLedger) {
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_detail",
      filter: {
        pARTNM: BindLedger,
        // MainCategoryName: ["ASSET", "EXPENSE"],
        //   AccountingLocations: this.DebitVoucherSummaryForm.value.Accountinglocation?.name
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  StateChange(event) {

    const Partystate = this.DebitVoucherSummaryForm.value.Partystate;
    const Paymentstate = this.DebitVoucherSummaryForm.value.Paymentstate;
    if (Partystate && Paymentstate) {
      const IsStateTypeUT = this.AllStateList.find(item => item.STNM == Paymentstate).
        ISUT == true;
      const GSTAmount = this.tableData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue['GSTAmount']);
      }, 0);

      if (!IsStateTypeUT && Partystate.name == Paymentstate) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTAmount)
      }
      else if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTAmount)
      }
      else if (!IsStateTypeUT && Partystate.name != Paymentstate) {
        this.ShowOrHideBasedOnSameOrDifferentState("DIFF", GSTAmount)
      }

    }
  }
  ShowOrHideBasedOnSameOrDifferentState(Check, GSTAmount) {
    let filterFunction;
    switch (Check) {
      case 'UT':
        filterFunction = (x) => x.name !== 'IGST' && x.name !== 'SGST';
        break;
      case 'SAME':
        filterFunction = (x) => x.name !== 'IGST' && x.name !== 'UGST';
        break;
      case 'DIFF':
        filterFunction = (x) => x.name !== 'SGST' && x.name !== 'UGST' && x.name !== 'CGST';
        break;
    }
    this.jsonControlDebitVoucherTaxationGSTArray = this.AlljsonControlDebitVoucherTaxationGSTArray.filter(filterFunction);
    this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
      this.DebitVoucherTaxationGSTForm.get(item.name).setValue((GSTAmount / this.jsonControlDebitVoucherTaxationGSTArray.length).toFixed(2));
    });
    this.CalculatePaymentAmount();
  }
  calculateTDSAndTotal(event) {
    const TDSRate = Number(this.DebitVoucherTaxationTDSForm.value['TDSRate']);
    const DebitAmount = this.tableData.filter(item => item.TDSApplicable == "Yes").reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['DebitAmount']);
    }, 0);
    if (!isNaN(DebitAmount) && !isNaN(TDSRate)) {
      const TDSAmount = (DebitAmount * TDSRate) / 100;
      this.DebitVoucherTaxationTDSForm.controls.TDSDeduction.setValue(TDSAmount.toFixed(2));
      this.CalculatePaymentAmount();
    } else {
      console.error('Invalid input values for DebitAmount or GSTRate');
    }
  }
  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {

      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.addVoucherDetails(LedgerDetails)
    }
  }

  async PreparedforFieldChanged(event) {
    const Preparedfor = this.DebitVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.DebitVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    this.DebitVoucherSummaryForm.get("PANnumber").setValue("");
    this.DebitVoucherSummaryForm.get("PANnumber").enable();
    const partyNameControl = this.jsonControlDebitVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
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
    this.BindLedger(Preparedfor);
  }
  async PartyNameFieldChanged(event) {
    const Preparedfor = this.DebitVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.DebitVoucherSummaryForm.value.PartyName
    const Partystate = this.DebitVoucherSummaryForm.get('Partystate');
    Partystate.setValue("");
    let responseFromAPI: any;
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await GetSingleVendorDetailsFromApi(this.masterService, PartyName.value)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          responseFromAPI,
          "Partystate",
          false
        );
        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.DebitVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.DebitVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      case 'Customer':
        responseFromAPI = await GetSingleCustomerDetailsFromApi(this.masterService, PartyName.value)
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          responseFromAPI,
          "Partystate",
          false
        );
        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.DebitVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.DebitVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      default:
        this.filter.Filter(
          this.jsonControlDebitVoucherSummaryArray,
          this.DebitVoucherSummaryForm,
          this.StateList,
          "Partystate",
          false
        );


    }
  }
  TDSSectionFieldChanged(event) {
    this.DebitVoucherTaxationTDSForm.get("TDSRate").setValue(this.DebitVoucherTaxationTDSForm.value?.TDSSection?.rHUF)
    this.calculateTDSAndTotal('');

  }
  TCSSectionFieldChanged(event) {
    this.DebitVoucherTaxationTCSForm.get("TCSRate").setValue(this.DebitVoucherTaxationTCSForm.value?.TCSSection?.rHUF)
    this.calculateTCSAndTotal('');

  }
  calculateTCSAndTotal(event) {
    const TCSRate = Number(this.DebitVoucherTaxationTCSForm.value['TCSRate']);
    const DebitAmount = this.tableData.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['DebitAmount']);
    }, 0);
    if (!isNaN(DebitAmount) && !isNaN(TCSRate)) {
      const TCSAmount = (DebitAmount * TCSRate) / 100;
      this.DebitVoucherTaxationTCSForm.controls.TCSDeduction.setValue(TCSAmount.toFixed(2));
      this.CalculatePaymentAmount();
    } else {
      console.error('Invalid input values for DebitAmount or GSTRate');
    }
  }
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  CalculatePaymentAmount() {
    const totalSumWithTDS = this.tableData.filter(item => item.TDSApplicable == "Yes").reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['Total']);
    }, 0);
    const DebitAmountSumWithoutTDS = this.tableData.filter(item => item.TDSApplicable == "No").reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['Total']);
    }, 0);
    let TDSAmount = this.DebitVoucherTaxationTDSForm.controls.TDSDeduction.value || 0;
    let TCSAmount = this.DebitVoucherTaxationTCSForm.controls.TCSDeduction.value || 0;
    let GSTAmount = 0;
    this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
      const value = parseFloat(this.DebitVoucherTaxationGSTForm.get(item.name).value);
      GSTAmount += isNaN(value) ? 0 : value; // Check for NaN and handle it as 0
    });
    let TDSWithLineitems = 0;
    const TDSRate = Number(this.DebitVoucherTaxationTDSForm.value['TDSRate']);
    if (this.TDSAtLineItem) {
      this.tableData.filter(item => item.TDSApplicable == "Yes").forEach(item => {
        const TDSAmountForLineitem = parseFloat(item.DebitAmount) * TDSRate / 100;
        TDSWithLineitems += isNaN(TDSAmountForLineitem) ? 0 : TDSAmountForLineitem; // Check for NaN and handle it as 0
      });
      TDSAmount = TDSWithLineitems;
    }

    var parsedTDSAmount = parseFloat(TDSAmount) || 0;
    var parsedTCSAmount = parseFloat(TCSAmount) || 0;

    const CalculatedSumWithTDS = totalSumWithTDS - (parsedTDSAmount + parsedTCSAmount);
    const CalculatedSum = CalculatedSumWithTDS + DebitAmountSumWithoutTDS
    this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").setValue(CalculatedSum.toFixed(2));
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(CalculatedSum.toFixed(2));
  }
  OnChangeToggle(event) {
    this.TDSAtLineItem = event?.event?.checked
    this.calculateTDSAndTotal('')
  }

  async AddNewDebits() {
    this.addVoucherDetails('')
  }

  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  showhidebuttonclick(event) {
    const MaxAllowedAmount = this.tableData.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['DebitAmount']);
    }, 0);
    const request = {
      MaxAllowedAmount: MaxAllowedAmount,
      PartName: this.DebitVoucherSummaryForm.value.PartyName?.name,
      Origin: this.DebitVoucherSummaryForm.value.Accountinglocation?.name
    }
    const dialogRef = this.matDialog.open(AddDebitAgainstDocumentModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.DebitAgainstDocumentList = result;
      }
    });

  }
  toggleUpDown(event) {
    const totalPaymentAmount = this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const roundedValue = event.isUpDown ? Math.ceil(totalPaymentAmount) : Math.floor(totalPaymentAmount);
    this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(roundedValue);

  }
  // Add a new item to the table
  addVoucherDetails(event) {

    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      SACCode: this.SACCodeList,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(AddVoucherDetailsModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          this.tableData = this.tableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.tableData.length + 1,
          Ledger: result?.Ledger,
          LedgerHdn: result?.LedgerHdn,
          SACCode: result?.SACCode,
          SACCodeHdn: result?.SACCodeHdn,
          DebitAmount: result?.DebitAmount,
          GSTRate: result?.GSTRate,
          GSTAmount: result?.GSTAmount,
          Total: result?.Total,
          TDSApplicable: result?.TDSApplicable == true ? "Yes" : "No",
          Narration: result?.Narration,
          SubCategoryName: result?.SubCategoryName,
          actions: ['Edit', 'Remove']
        }
        console.log(json)
        this.tableData.push(json);
        this.LoadVoucherDetails = true;
        this.StateChange("");
        this.calculateTDSAndTotal('')
        this.calculateTCSAndTotal('')
      }
      this.LoadVoucherDetails = true;
    });


  }
  // Payment Modes Changes 
  async OnPaymentModeChange(event) {
    const PaymentMode = this.DebitVoucherTaxationPaymentDetailsForm.get("PaymentMode").value;
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
    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.AlljsonControlDebitVoucherTaxationPaymentDetailsArray.filter(filterFunction);
    const Accountinglocation = this.DebitVoucherSummaryForm.value.Accountinglocation?.name
    switch (PaymentMode) {
      case 'Cheque':
        this.AccountsBanksList = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        const responseFromAPIBank = await GetBankDetailFromApi(this.masterService, Accountinglocation)
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        const Bank = this.DebitVoucherTaxationPaymentDetailsForm.get('Bank');
        Bank.setValidators([Validators.required, autocompleteObjectValidator()]);
        Bank.updateValueAndValidity();

        const ChequeOrRefNo = this.DebitVoucherTaxationPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNo.setValidators([Validators.required]);
        ChequeOrRefNo.updateValueAndValidity();



        const CashAccount = this.DebitVoucherTaxationPaymentDetailsForm.get('CashAccount');
        CashAccount.setValue("");
        CashAccount.clearValidators();
        CashAccount.updateValueAndValidity();

        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH", Accountinglocation)
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPICash,
          "CashAccount",
          false
        );

        const CashAccountS = this.DebitVoucherTaxationPaymentDetailsForm.get('CashAccount');
        CashAccountS.setValidators([Validators.required, autocompleteObjectValidator()]);
        CashAccountS.updateValueAndValidity();

        const BankS = this.DebitVoucherTaxationPaymentDetailsForm.get('Bank');
        BankS.setValue("");
        BankS.clearValidators();
        BankS.updateValueAndValidity();

        const ChequeOrRefNoS = this.DebitVoucherTaxationPaymentDetailsForm.get('ChequeOrRefNo');
        ChequeOrRefNoS.setValue("");
        ChequeOrRefNoS.clearValidators();
        ChequeOrRefNoS.updateValueAndValidity();

        break;
      case 'RTGS/UTR':
        break;
    }

  }

  async AccountinglocationFieldChanged() {
    let Accountinglocation = this.DebitVoucherSummaryForm.value.Accountinglocation?.name
    let responseFromAPITDS = await GetAccountDetailFromApi(this.masterService, "TDS", Accountinglocation)
    let responseFromAPITCS = await GetAccountDetailFromApi(this.masterService, "TCS", Accountinglocation)
    this.filter.Filter(
      this.jsonControlDebitVoucherTaxationTDSArray,
      this.DebitVoucherTaxationTDSForm,
      responseFromAPITDS,
      "TDSSection",
      false
    );
    this.filter.Filter(
      this.jsonControlDebitVoucherTaxationTCSArray,
      this.DebitVoucherTaxationTCSForm,
      responseFromAPITCS,
      "TCSSection",
      false
    );

    const paymentstate = this.AllLocationsList.find(item => item.name == Accountinglocation)?.value
    this.DebitVoucherSummaryForm.get('Paymentstate').setValue(paymentstate);

  }

  // Submit 
  Submit() {
    const Accountinglocation = this.DebitVoucherSummaryForm.value.Accountinglocation?.name
    let FinalListOfDebitVoucher = [];
    // Calculate debit voucher
    var VoucherlineitemList = this.tableData.map(function (item) {
      return {
        "Instance": "debit voucher",
        "Value": "Voucher line item",
        "Ledgercode": item.LedgerHdn,
        "Ledgername": item.Ledger,
        "SubLedger": item.SubCategoryName,
        "Dr": parseFloat(item.DebitAmount).toFixed(2),
        "Cr": "",
        "Location": Accountinglocation,
        "Narration": item.Narration
      };
    });
    FinalListOfDebitVoucher = VoucherlineitemList;
    // Calculate Round Off 
    const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);
    if (PaymentAmount != NetPayable) {
      const Amount = NetPayable - PaymentAmount;
      const isAmountNegative = Amount < 0;

      var RoundOffList = {
        "Instance": "debit voucher",
        "Value": ledgerInfo['Round off Amount'].LeadgerName,
        "Ledgercode": ledgerInfo['Round off Amount'].LeadgerCode,
        "Ledgername": ledgerInfo['Round off Amount'].LeadgerName,
        "SubLedger": "EXPENSE",
        "Dr": isAmountNegative ? "" : Amount.toFixed(2),
        "Cr": isAmountNegative ? (-Amount).toFixed(2) : "",
        "Location": Accountinglocation,
        "Narration": ledgerInfo['Round off Amount'].LeadgerName,
      };

      FinalListOfDebitVoucher.push(RoundOffList)
    }

    this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
      let LeadgerCode;
      let LeadgerName;
      const itemInfo = ledgerInfo[item.name];
      if (itemInfo) {
        LeadgerCode = itemInfo.LeadgerCode;
        LeadgerName = itemInfo.LeadgerName;

      }
      else {
        this.snackBarUtilityService.ShowCommonSwal("error", "Item with name ${itemName} not found in ledgerInfo object. Please contact support.")
        return;
      }

      let GSTData = {
        "Instance": "debit voucher",
        "Value": LeadgerName,
        "Ledgercode": LeadgerCode,
        "Ledgername": LeadgerName,
        "SubLedger": "LIABILITY",
        "Dr": (parseFloat(this.DebitVoucherTaxationGSTForm.get(item.name).value)).toFixed(2),
        "Cr": "",
        "Location": Accountinglocation,
        "Narration": LeadgerName,
      };
      FinalListOfDebitVoucher.push(GSTData)
    });
    // TDS Section
    const TDSAmount = parseFloat(this.DebitVoucherTaxationTDSForm.get("TDSDeduction").value);
    const TDSSection = this.DebitVoucherTaxationTDSForm.get("TDSSection").value;

    if (TDSAmount > 0) {
      let TDSData = {
        "Instance": "debit voucher",
        "Value": "TDS",
        "Ledgercode": TDSSection.value,
        "Ledgername": TDSSection.name,
        "SubLedger": "LIABILITY",
        "Dr": "",
        "Cr": TDSAmount.toFixed(2),
        "Location": Accountinglocation,
        "Narration": TDSSection.name,
      };
      FinalListOfDebitVoucher.push(TDSData)
    }
    // TCS Section
    const TCSAmount = parseFloat(this.DebitVoucherTaxationTCSForm.get("TCSDeduction").value);
    const TCSSection = this.DebitVoucherTaxationTCSForm.get("TCSSection").value;

    if (TCSAmount > 0) {
      let TCSData = {
        "Instance": "debit voucher",
        "Value": "TCS",
        "Ledgercode": TCSSection.value,
        "Ledgername": TCSSection.name,
        "SubLedger": "LIABILITY",
        "Dr": "",
        "Cr": TCSAmount.toFixed(2),
        "Location": Accountinglocation,
        "Narration": TCSSection.name,
      };
      FinalListOfDebitVoucher.push(TCSData)
    }

    // const PayableAmount = FinalListOfDebitVoucher.filter(item => item.Dr).reduce((sum, item) => sum + parseFloat(item.Dr), 0);
    const PaymentMode = this.DebitVoucherTaxationPaymentDetailsForm.get("PaymentMode").value;
    let Leadgerdata;
    switch (PaymentMode) {
      case 'Cheque':
        const BankDetails = this.DebitVoucherTaxationPaymentDetailsForm.get("Bank").value;
        const AccountDetails = this.AccountsBanksList.find(item => item.bANCD == BankDetails?.value && item.bANM == BankDetails?.name)
        if (AccountDetails != undefined) {
          Leadgerdata = {
            name: AccountDetails?.aCNM,
            value: AccountDetails?.aCCD
          }
        } else {
          this.snackBarUtilityService.ShowCommonSwal("error", "Please select valid Bank Which is mapped with Account Master")
          return;
        }
        break;
      case 'Cash':
        Leadgerdata = this.DebitVoucherTaxationPaymentDetailsForm.get("CashAccount").value
        break;
      case 'RTGS/UTR':
        Leadgerdata = this.DebitVoucherTaxationPaymentDetailsForm.get("Bank").value
        break;
    }

    let PayableData = {
      "Instance": "debit voucher",
      "Value": PaymentMode,
      "Ledgercode": Leadgerdata?.value,
      "Ledgername": Leadgerdata?.name,
      "SubLedger": "BANK",
      "Dr": "",
      "Cr": NetPayable.toFixed(2),
      "Location": Accountinglocation,
      "Narration": ""
    };
    FinalListOfDebitVoucher.push(PayableData)

    const dialogRef = this.matDialog.open(DebitVoucherPreviewComponent, {
      data: FinalListOfDebitVoucher,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.SubmitRequest(FinalListOfDebitVoucher)
      }
    });
  }
  async SubmitRequest(FinalListOfDebitVoucher) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        let GSTAmount = 0;
        this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
          const value = parseFloat(this.DebitVoucherTaxationGSTForm.get(item.name).value);
          GSTAmount += isNaN(value) ? 0 : value; // Check for NaN and handle it as 0
        });

        const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
        const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);

        this.VoucherRequestModel.companyCode = this.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.DebitVoucherSummaryForm.value.Accountinglocation?.name
        this.VoucherRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.DebitVoucherCreation;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.DebitVoucherCreation];
        this.VoucherDataRequestModel.voucherCode = VoucherType.DebitVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.DebitVoucher];
        this.VoucherDataRequestModel.transDate = this.DebitVoucherSummaryForm.value.TransactionDate
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = localStorage.getItem("Branch");
        this.VoucherDataRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.accLocation = this.DebitVoucherSummaryForm.value.Accountinglocation?.name;
        this.VoucherDataRequestModel.preperedFor = this.DebitVoucherSummaryForm.value.Preparedfor;
        this.VoucherDataRequestModel.partyCode = this.DebitVoucherSummaryForm.value.PartyName?.value ?? "8888";
        this.VoucherDataRequestModel.partyName = this.DebitVoucherSummaryForm.value.PartyName?.name ?? this.DebitVoucherSummaryForm.value.PartyName;
        this.VoucherDataRequestModel.partyState = this.DebitVoucherSummaryForm.value.Partystate?.name;
        this.VoucherDataRequestModel.entryBy = this.DebitVoucherSummaryForm.value.Preparedby;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = this.DebitVoucherTaxationTDSForm.value.TDSSection.value;
        this.VoucherDataRequestModel.tdsSectionName = this.DebitVoucherTaxationTDSForm.value.TDSSection.name;
        this.VoucherDataRequestModel.tdsRate = Number(this.DebitVoucherTaxationTDSForm.value.TDSRate) ?? 0;
        this.VoucherDataRequestModel.tdsAmount = parseFloat(this.DebitVoucherTaxationTDSForm.value.TDSDeduction) || 0;
        this.VoucherDataRequestModel.tdsAtlineitem = this.TDSAtLineItem
        this.VoucherDataRequestModel.tcsSectionCode = this.DebitVoucherTaxationTCSForm.value.TCSSection.value;
        this.VoucherDataRequestModel.tcsSectionName = this.DebitVoucherTaxationTCSForm.value.TCSSection.name;
        this.VoucherDataRequestModel.tcsRate = Number(this.DebitVoucherTaxationTCSForm.value.TCSRate) ?? 0;
        this.VoucherDataRequestModel.tcsAmount = parseFloat(this.DebitVoucherTaxationTCSForm.value.TCSDeduction) || 0;

        this.VoucherDataRequestModel.IGST = parseFloat(this.DebitVoucherTaxationGSTForm.value.IGST) || 0;
        this.VoucherDataRequestModel.SGST = parseFloat(this.DebitVoucherTaxationGSTForm.value.SGST) || 0;
        this.VoucherDataRequestModel.CGST = parseFloat(this.DebitVoucherTaxationGSTForm.value.CGST) || 0;
        this.VoucherDataRequestModel.UGST = parseFloat(this.DebitVoucherTaxationGSTForm.value.UGST) || 0;
        this.VoucherDataRequestModel.GSTTotal = GSTAmount;

        this.VoucherDataRequestModel.GrossAmount = PaymentAmount;
        this.VoucherDataRequestModel.netPayable = NetPayable;
        this.VoucherDataRequestModel.roundOff = +(NetPayable - PaymentAmount).toFixed(2);
        this.VoucherDataRequestModel.voucherCanceled = false

        this.VoucherDataRequestModel.paymentMode = this.DebitVoucherTaxationPaymentDetailsForm.value.PaymentMode;
        this.VoucherDataRequestModel.refNo = this.DebitVoucherTaxationPaymentDetailsForm.value.ChequeOrRefNo;
        this.VoucherDataRequestModel.accountName = this.DebitVoucherTaxationPaymentDetailsForm.value.Bank.name;
        this.VoucherDataRequestModel.accountCode = this.DebitVoucherTaxationPaymentDetailsForm.value?.Bank.value;
        this.VoucherDataRequestModel.date = this.DebitVoucherTaxationPaymentDetailsForm.value.Date;
        this.VoucherDataRequestModel.scanSupportingDocument = this.imageData?.ScanSupportingdocument


        const companyCode = this.companyCode;
        const Branch = localStorage.getItem("Branch");

        let Accountdata = this.tableData.map(function (item) {
          return {

            "companyCode": localStorage.getItem("companyCode"),
            "voucherNo": "",
            "transCode": VoucherInstanceType.DebitVoucherCreation,
            "transType": VoucherInstanceType[VoucherInstanceType.DebitVoucherCreation],
            "voucherCode": VoucherType.DebitVoucher,
            "voucherType": VoucherType[VoucherType.DebitVoucher],
            "transDate": new Date(),
            "finYear": financialYear,
            "branch": localStorage.getItem("Branch"),
            "accCode": item.LedgerHdn,
            "accName": item.Ledger,
            "accCategory": item.SubLedger,
            "sacCode": item.SACCodeHdn.toString(),
            "sacName": item.SACCode,
            "debit": parseFloat(item.DebitAmount).toFixed(2),
            "credit": 0,
            "GSTRate": item.GSTRate,
            "GSTAmount": parseFloat(item.GSTAmount).toFixed(2),
            "Total": item.Total,
            "TDSApplicable": item.TDSApplicable == "Yes" ? true : false,
            "narration": item.Narration ?? ""
          };
        });
        var Data = FinalListOfDebitVoucher
          .filter(item => item.Value != "Voucher line item")
          .map(function (item) {
            const debitAmount = parseFloat(item.Dr) || 0;
            const creditAmount = parseFloat(item.Cr) || 0;

            return {
              "companyCode": localStorage.getItem("companyCode"),
              "voucherNo": "",
              "transCode": VoucherInstanceType.DebitVoucherCreation,
              "transType": VoucherInstanceType[VoucherInstanceType.DebitVoucherCreation],
              "voucherCode": VoucherType.DebitVoucher,
              "voucherType": VoucherType[VoucherType.DebitVoucher],
              "transDate": new Date(),
              "finYear": financialYear,
              "branch": localStorage.getItem("Branch"),
              "accCode": `${item.Ledgercode}`,
              "accName": item.Ledgername,
              "accCategory": item.SubLedger,
              "sacCode": "",
              "sacName": "",
              "debit": debitAmount.toFixed(2),
              "credit": creditAmount.toFixed(2),
              "GSTRate": 0,
              "GSTAmount": 0,
              "Total": (debitAmount + creditAmount).toFixed(2),
              "TDSApplicable": false,
              "narration": item.Narration ? item.Narration : item.Ledgername,
            };
          });

        var VoucherlineitemList = [...Accountdata, ...Data];

        var debitAgainstDocumentList = this.DebitAgainstDocumentList.map(function (item) {
          return {

            "companyCode": companyCode,
            "voucherNo": "",
            "transCode": VoucherInstanceType.DebitVoucherCreation,
            "transType": VoucherInstanceType[VoucherInstanceType.DebitVoucherCreation],
            "voucherCode": VoucherType.DebitVoucher,
            "voucherType": VoucherType[VoucherType.DebitVoucher],
            "transDate": new Date(),
            "finYear": financialYear,
            "branch": Branch,
            "Document": item?.Document,
            "DebitAmountAgaintsDocument": parseFloat(item?.DebitAmountAgaintsDocument) || 0,
            "DocumentType": item?.DocumentType,
          };
        });

        this.VoucherRequestModel.details = VoucherlineitemList
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = debitAgainstDocumentList;

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {
              var CreditData = FinalListOfDebitVoucher.filter(item => item.Dr == "" && item.Cr != "0.00").map(function (item) {
                return {
                  "accCode": `${item.Ledgercode}`,
                  "accName": item.Ledgername,
                  "accCategory": item.SubLedger,
                  "amount": item.Cr,
                  "narration": item.Narration ? item.Narration : item.Ledgername,
                };
              })
              var DebitData = FinalListOfDebitVoucher.filter(item => item.Cr == "" && item.Dr != "0.00").map(function (item) {
                return {
                  "accCode": `${item.Ledgercode}`,
                  "accName": item.Ledgername,
                  "accCategory": item.SubLedger,
                  "amount": item.Dr,
                  "narration": item.Narration ? item.Narration : item.Ledgername,
                };
              })
              let reqBody = {
                companyCode: this.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: localStorage.getItem("Branch"),
                transCode: VoucherInstanceType.DebitVoucherCreation,
                transType: VoucherInstanceType[VoucherInstanceType.DebitVoucherCreation],
                voucherCode: VoucherType.DebitVoucher,
                voucherType: VoucherType[VoucherType.DebitVoucher],
                docType: "Voucher",
                partyType: this.DebitVoucherSummaryForm.value.Preparedfor,
                docNo: "",
                partyCode: this.DebitVoucherSummaryForm.value.PartyName?.value ?? "8888",
                partyName: this.DebitVoucherSummaryForm.value.PartyName?.name ?? this.DebitVoucherSummaryForm.value.PartyName,
                entryBy: localStorage.getItem("UserName"),
                entryDate: Date(),
                debit: DebitData,
                credit: CreditData,

              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    Swal.fire({
                      icon: "success",
                      title: "Voucher Created Successfully",
                      text: "Voucher No: " + reqBody.voucherNo,
                      showConfirmButton: true,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        Swal.hideLoading();
                        setTimeout(() => {
                          Swal.close();
                        }, 2000);
                        this.navigationService.navigateTotab("Voucher", "dashboard/Index");
                      }
                    });
                  },
                  error: (err: any) => {

                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal("error", "Bad Request");
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });

            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }


    }, "Debit Voucher Generating..!");

  }
  UploadLedgerInformations(res) {
    // Create a new array to store the transformed data

  }
  //#region Driver Photo

  async test(event) {

  }

  async selectFileScanDocument(data) {
    // Call the uploadFile method from the service
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "ScanSupportingdocument", this.
      DebitVoucherTaxationPaymentDetailsForm, this.imageData, "Voucher", 'Finance', this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
      ["jpg", "png", "jpeg", "pdf"]);

  }
  openImageDialog(control) {
    const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.matDialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
}
