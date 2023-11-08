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
import { DriversFromApi, GetAccountDetailFromApi, GetLocationDetailFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, GetsachsnFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './debitvoucherAPIUtitlity';
import { GetLedgerDocument, GetLedgercolumnHeader } from './debitvoucherCommonUtitlity';
import { AddDebitAgainstDocumentModalComponent } from '../Modals/add-debit-against-document-modal/add-debit-against-document-modal.component';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';
import { DebitVoucherPreviewComponent } from '../Modals/debit-voucher-preview/debit-voucher-preview.component';
import { DebitVoucherDataRequestModel, DebitVoucherRequestModel } from 'src/app/Models/Finance/Finance';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class DebitVoucherComponent implements OnInit {
  companyCode: number | null
  debitVoucherRequestModel = new DebitVoucherRequestModel();
  debitVoucherDataRequestModel = new DebitVoucherDataRequestModel();
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
      collectionName: "state_detail",
    };
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_detail",
      filter: {},
    };

    const resState = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
    this.AllStateList = resState?.data;
    this.StateList = resState?.data
      .map(x => ({
        value: x.stateCode, name: x.stateName
      }))
      .filter(x => x != null)
      .sort((a, b) => a.name.localeCompare(b.name));

    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.AccountCode, name: x.AccountDescription, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));

    this.filter.Filter(
      this.jsonControlDebitVoucherSummaryArray,
      this.DebitVoucherSummaryForm,
      this.StateList,
      "Partystate",
      true
    );

    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlDebitVoucherSummaryArray,
      this.DebitVoucherSummaryForm,
      this.AllLocationsList,
      "Accountinglocation",
      false
    );
    const paymentstate = this.AllLocationsList.find(item => item.name == localStorage.getItem("Branch"))?.value
    this.DebitVoucherSummaryForm.get('Paymentstate').setValue(paymentstate);

    this.SACCodeList = await GetsachsnFromApi(this.masterService)
    console.log(this.SACCodeList)
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
      const IsStateTypeUT = this.AllStateList.find(item => item.stateName == Paymentstate).stateType == "UT";
      const GSTAmount = this.tableData.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue['GSTAmount']);
      }, 0);
      if (IsStateTypeUT) {
        this.ShowOrHideBasedOnSameOrDifferentState("UT", GSTAmount)
      }
      else if (!IsStateTypeUT && Partystate.name == Paymentstate) {
        this.ShowOrHideBasedOnSameOrDifferentState("SAME", GSTAmount)
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
        filterFunction = (x) => x.name !== 'IGST' && x.name !== 'SGST' && x.name !== 'CGST';
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
    this.DebitVoucherTaxationTDSForm.get("TDSRate").setValue(this.DebitVoucherTaxationTDSForm.value?.TDSSection?.ACdetail?.CorporateTDS)
    this.calculateTDSAndTotal('');

  }
  TCSSectionFieldChanged(event) {
    this.DebitVoucherTaxationTCSForm.get("TCSRate").setValue(this.DebitVoucherTaxationTCSForm.value?.TCSSection?.ACdetail?.CorporateTCS)
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
    const totalSumWithoutTDS = this.tableData.filter(item => item.TDSApplicable == "No").reduce((accumulator, currentValue) => {
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
        const TDSAmountForLineitem = parseFloat(item.Total) * TDSRate / 100;
        TDSWithLineitems += isNaN(TDSAmountForLineitem) ? 0 : TDSAmountForLineitem; // Check for NaN and handle it as 0
      });
      TDSAmount = TDSWithLineitems;
    }
    const CalculatedSumWithTDS = totalSumWithTDS - TDSAmount - TCSAmount;
    const CalculatedSum = CalculatedSumWithTDS + totalSumWithoutTDS
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
      PartName: this.DebitVoucherSummaryForm.value.PartyName?.name
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
        const responseFromAPIBank = await GetAccountDetailFromApi(this.masterService, "BANK", Accountinglocation)
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPIBank,
          "Bank",
          false
        );
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
        "Dr": item.DebitAmount,
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
      var RoundOffList = {
        "Instance": "debit voucher",
        "Value": "Round Off Amount",
        "Ledgercode": "AC007",
        "Ledgername": "Round off ledger",
        "SubLedger": "ASSET",
        "Dr": Amount.toFixed(2),
        "Cr": "",
        "Location": Accountinglocation,
        "Narration": ""
      };
      FinalListOfDebitVoucher.push(RoundOffList)
    }

    this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
      let GSTData = {
        "Instance": "debit voucher",
        "Value": item.name,
        "Ledgercode": item.name,
        "Ledgername": `${item.name} Payable`,
        "SubLedger": "LIABILITY",
        "Dr": (parseFloat(this.DebitVoucherTaxationGSTForm.get(item.name).value) / this.jsonControlDebitVoucherTaxationGSTArray.length).toFixed(2),
        "Cr": "",
        "Location": Accountinglocation,
        "Narration": ""
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
        "Ledgercode": TDSSection.name,
        "Ledgername": TDSSection.value,
        "SubLedger": "LIABILITY",
        "Dr": "",
        "Cr": TDSAmount.toFixed(2),
        "Location": Accountinglocation,
        "Narration": ""
      };
      FinalListOfDebitVoucher.push(TDSData)
    }
    // TCS Section
    const TCSAmount = parseFloat(this.DebitVoucherTaxationTCSForm.get("TCSDeduction").value);
    const TCSSection = this.DebitVoucherTaxationTCSForm.get("TCSSection").value;

    if (TDSAmount > 0) {
      let TCSData = {
        "Instance": "debit voucher",
        "Value": "TCS",
        "Ledgercode": TCSSection.name,
        "Ledgername": TCSSection.value,
        "SubLedger": "LIABILITY",
        "Dr": "",
        "Cr": TCSAmount.toFixed(2),
        "Location": Accountinglocation,
        "Narration": ""
      };
      FinalListOfDebitVoucher.push(TCSData)
    }

    // const PayableAmount = FinalListOfDebitVoucher.filter(item => item.Dr).reduce((sum, item) => sum + parseFloat(item.Dr), 0);
    const PaymentMode = this.DebitVoucherTaxationPaymentDetailsForm.get("PaymentMode").value;
    let Leadgerdata;
    switch (PaymentMode) {
      case 'Cheque':
        Leadgerdata = this.DebitVoucherTaxationPaymentDetailsForm.get("Bank").value
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
        this.SubmitRequest()
      }
    });
  }
  async SubmitRequest() {
    let GSTAmount = 0;
    this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
      const value = parseFloat(this.DebitVoucherTaxationGSTForm.get(item.name).value);
      GSTAmount += isNaN(value) ? 0 : value; // Check for NaN and handle it as 0
    });

    const PaymentAmount = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value);
    const NetPayable = parseFloat(this.DebitVoucherTaxationPaymentSummaryForm.get("NetPayable").value);

    this.debitVoucherRequestModel.companyCode = this.companyCode;
    this.debitVoucherRequestModel.docType = "VR";
    this.debitVoucherRequestModel.branch = localStorage.getItem("CurrentBranchCode");
    this.debitVoucherRequestModel.finYear = financialYear


    this.debitVoucherDataRequestModel.companyCode = this.companyCode;
    this.debitVoucherDataRequestModel.voucherNo = "";
    this.debitVoucherDataRequestModel.transType = "DebitVoucher";
    this.debitVoucherDataRequestModel.transDate = this.DebitVoucherSummaryForm.value.TransactionDate
    this.debitVoucherDataRequestModel.docType = "VR";
    this.debitVoucherDataRequestModel.branch = localStorage.getItem("CurrentBranchCode");
    this.debitVoucherDataRequestModel.finYear = financialYear

    this.debitVoucherDataRequestModel.accLocation = this.DebitVoucherSummaryForm.value.Accountinglocation?.name;
    this.debitVoucherDataRequestModel.preperedFor = this.DebitVoucherSummaryForm.value.Preparedfor;
    this.debitVoucherDataRequestModel.partyCode = this.DebitVoucherSummaryForm.value.PartyName?.value;
    this.debitVoucherDataRequestModel.partyName = this.DebitVoucherSummaryForm.value.PartyName?.name;
    this.debitVoucherDataRequestModel.partyState = this.DebitVoucherSummaryForm.value.Partystate?.name;
    this.debitVoucherDataRequestModel.entryBy = this.DebitVoucherSummaryForm.value.Preparedby;
    this.debitVoucherDataRequestModel.entryDate = new Date().toUTCString()
    this.debitVoucherDataRequestModel.panNo = ""

    this.debitVoucherDataRequestModel.tdsSectionCode = this.DebitVoucherTaxationTDSForm.value.TDSSection.value;
    this.debitVoucherDataRequestModel.tdsSectionName = this.DebitVoucherTaxationTDSForm.value.TDSSection.name;
    this.debitVoucherDataRequestModel.tdsRate = this.DebitVoucherTaxationTDSForm.value.TDSRate;
    this.debitVoucherDataRequestModel.tdsAmount = this.DebitVoucherTaxationTDSForm.value.TDSDeduction;
    this.debitVoucherDataRequestModel.tdsAtlineitem = this.TDSAtLineItem

    this.debitVoucherDataRequestModel.tcsSectionCode = this.DebitVoucherTaxationTCSForm.value.TCSSection.value;
    this.debitVoucherDataRequestModel.tcsSectionName = this.DebitVoucherTaxationTCSForm.value.TCSSection.name;
    this.debitVoucherDataRequestModel.tcsRate = this.DebitVoucherTaxationTCSForm.value.TCSRate;
    this.debitVoucherDataRequestModel.tcsAmount = this.DebitVoucherTaxationTCSForm.value.TCSDeduction;

    this.debitVoucherDataRequestModel.IGST = this.DebitVoucherTaxationGSTForm.value.IGST || 0;
    this.debitVoucherDataRequestModel.SGST = this.DebitVoucherTaxationGSTForm.value.SGST || 0;
    this.debitVoucherDataRequestModel.CGST = this.DebitVoucherTaxationGSTForm.value.CGST || 0;
    this.debitVoucherDataRequestModel.UGST = this.DebitVoucherTaxationGSTForm.value.UGST || 0;
    this.debitVoucherDataRequestModel.GSTTotal = GSTAmount;

    this.debitVoucherDataRequestModel.paymentAmt = PaymentAmount;
    this.debitVoucherDataRequestModel.netPayable = NetPayable;
    this.debitVoucherDataRequestModel.roundOff = NetPayable - PaymentAmount
    this.debitVoucherDataRequestModel.voucherCanceled = false

    this.debitVoucherDataRequestModel.paymentMode = this.DebitVoucherTaxationPaymentDetailsForm.value.PaymentMode;
    this.debitVoucherDataRequestModel.refNo = this.DebitVoucherTaxationPaymentDetailsForm.value.ChequeOrRefNo;
    this.debitVoucherDataRequestModel.accountName = this.DebitVoucherTaxationPaymentDetailsForm.value.Bank.name;
    this.debitVoucherDataRequestModel.date = this.DebitVoucherTaxationPaymentDetailsForm.value.Date;
    this.debitVoucherDataRequestModel.scanSupportingDocument = this.imageData?.ScanSupportingdocument
    this.debitVoucherDataRequestModel.paymentAmtount = NetPayable


    const companyCode = this.companyCode;
    const CurrentBranchCode = localStorage.getItem("CurrentBranchCode");
    var VoucherlineitemList = this.tableData.map(function (item) {
      return {

        "companyCode": companyCode,
        "voucherNo": "",
        "transType": "DebitVoucher",
        "transDate": new Date(),
        "finYear": financialYear,
        "branch": CurrentBranchCode,
        "accCode": item.LedgerHdn,
        "accName": item.Ledger,
        "sacCode": item.SACCodeHdn.toString(),
        "sacName": item.SACCode,
        "debit": item.DebitAmount,
        "credit": 0,
        "GSTRate": item.GSTRate,
        "GSTAmount": item.GSTAmount,
        "Total": item.Total,
        "TDSApplicable": item.TDSApplicable == "Yes" ? true : false,
        "narration": item.Narration
      };
    });

    var debitAgainstDocumentList = this.DebitAgainstDocumentList.map(function (item) {
      return {

        "companyCode": companyCode,
        "voucherNo": "",
        "transType": "DebitVoucher",
        "transDate": new Date(),
        "finYear": financialYear,
        "branch": CurrentBranchCode,
        "Document": item?.Document,
        "DebitAmountAgaintsDocument": parseFloat(item?.DebitAmountAgaintsDocument) || 0,
        "DocumentType": item?.DocumentType,
      };
    });

    this.debitVoucherRequestModel.details = VoucherlineitemList
    this.debitVoucherRequestModel.data = this.debitVoucherDataRequestModel;
    this.debitVoucherRequestModel.debitAgainstDocumentList = debitAgainstDocumentList;

    const res = await this.voucherServicesService
      .FinancePost("fin/account/voucherentry", this.debitVoucherRequestModel)
      .toPromise();
    if (res) {
      this.UploadLedgerInformations(res)
    }

  }
  UploadLedgerInformations(res) {
    // Create a new array to store the transformed data
    var transformedData = this.tableData.map(function (item) {
      // Split the "Ledger" value into "accCode" and "accName"
      return {
        "accCode": item.Ledger,
        "accName": item.LedgerHdn,
        "amount": item.Total,
        "narration": item.Narration
      };
    });
    let reqBody = {
      companyCode: this.companyCode,
      voucherNo: res?.data?.mainData?.insertedId,
      transDate: Date(),
      finYear: financialYear,
      branch: localStorage.getItem("CurrentBranchCode"),
      transType: "DebitVoucher",
      docType: "Voucher",
      docNo: res?.data?.mainData?.insertedId,
      partyCode: this.DebitVoucherSummaryForm.value?.PartyName?.value,
      partyName: this.DebitVoucherSummaryForm.value?.PartyName?.name,
      entryBy: localStorage.getItem("UserName"),
      entryDate: Date(),
      debit: transformedData,
      credit: transformedData,

    };
    this.voucherServicesService
      .FinancePost("fin/account/posting", reqBody)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: "success",
            title: "Voucher Created Successfully",
            text:
              "VocherNo: " + reqBody.docNo,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page after the success message is confirmed.
              this.navigationService.navigateTotab(
                "Voucher",
                "dashboard/Index"
              );
            }
          });
        },
      });
  }
  //#region Driver Photo

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
