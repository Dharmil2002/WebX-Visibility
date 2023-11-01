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
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class DebitVoucherComponent implements OnInit {
  companyCode: number | null
  breadScrums = [
    {
      title: "Debit Voucher",
      items: ["Finance"],
      active: "Debit Voucher",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
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
  SACCodeList: any = [];
  LoadVoucherDetails = true;
  TDSAtLineItem: boolean = false;

  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };

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
  ) {
    this.companyCode = this.sessionService.getCompanyCode()
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
      collectionName: "account_group_detail",
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
      .map(x => ({ value: x.GroupCode, name: x.GroupName }))
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
    const Total = this.tableData.filter(item => item.TDSApplicable == "Yes").reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['Total']);
    }, 0);
    if (!isNaN(Total) && !isNaN(TDSRate)) {
      const TDSAmount = (Total * TDSRate) / 100;
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
    const CalculatedSumWithTDS = totalSumWithTDS - TDSAmount;
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

  async save() {
    // Create a new array to store the transformed data
    var transformedData = this.tableData.map(function (item) {
      // Split the "Ledger" value into "accCode" and "accName"
      var ledgerParts = item.Ledger.split(":");
      // Create a new object with the desired structure
      return {
        "accCode": ledgerParts[0],
        "accName": ledgerParts[1],
        "amount": item.Total,
        "narration": item.Narration
      };
    });
    console.log(this.DebitVoucherSummaryForm.value)
    let reqBody = {
      companyCode: this.companyCode,
      voucherNo: "VR0002",
      transDate: Date(),
      finYear: financialYear,
      branch: localStorage.getItem("Branch"),
      transType: "DebitVoucher",
      docType: "Voucher",
      docNo: "VR0002",
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
              "",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page after the success message is confirmed.
              this.navigationService.navigateTotab(
                "docket",
                "dashboard/Index"
              );
            }
          });
        },
      });
  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  showhidebuttonclick(event) {
    const dialogRef = this.matDialog.open(AddDebitAgainstDocumentModalComponent, {
      data: "request",
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {

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
          actions: ['Edit', 'Remove']
        }
        this.tableData.push(json);
        this.LoadVoucherDetails = true;
        this.StateChange("");
        this.calculateTDSAndTotal('')
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
        filterFunction = (x) => x.name !== 'CashAccount' && x.name !== 'ReceivedFromBank';

        break;
      case 'Cash':
        filterFunction = (x) => x.name !== 'Cheque/RefNo' && x.name !== 'Bank';
        break;
      case 'RTGS/UTR':
        filterFunction = (x) => x.name !== 'CashAccount' && x.name !== 'ReceivedFromBank' && x.name !== 'Cheque/RefNo';
        break;
    }
    this.jsonControlDebitVoucherTaxationPaymentDetailsArray = this.AlljsonControlDebitVoucherTaxationPaymentDetailsArray.filter(filterFunction);

    switch (PaymentMode) {
      case 'Cheque':
        const responseFromAPIBank = await GetAccountDetailFromApi(this.masterService, "BANK")
        this.filter.Filter(
          this.jsonControlDebitVoucherTaxationPaymentDetailsArray,
          this.DebitVoucherTaxationPaymentDetailsForm,
          responseFromAPIBank,
          "Bank",
          false
        );
        break;
      case 'Cash':
        const responseFromAPICash = await GetAccountDetailFromApi(this.masterService, "CASH")
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

    // this.jsonControlDebitVoucherTaxationGSTArray.forEach(item => {
    //   this.DebitVoucherTaxationGSTForm.get(item.name).setValue((GSTAmount / this.jsonControlDebitVoucherTaxationGSTArray.length).toFixed(2));
    // });

  }

  // Submit 
  Submit() {

  }
}
