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
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';
import Swal from 'sweetalert2';
import { AddVoucherDetailsModalComponent } from '../Modals/add-voucher-details-modal/add-voucher-details-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { DriversFromApi, GetLocationDetailFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './debitvoucherAPIUtitlity';
import { GetLedgerDocument, GetLedgercolumnHeader } from './debitvoucherCommonUtitlity';
import { AddDebitAgainstDocumentModalComponent } from '../Modals/add-debit-against-document-modal/add-debit-against-document-modal.component';
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class CreditDebitVoucherComponent implements OnInit {
  companyCode: number | null
  breadScrums = [
    {
      title: "Debit Voucher",
      items: ["Finance"],
      active: "Debit Voucher",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  creditDebitVoucherControl: CreditDebitVoucherControl;

  CreditDebitVoucherSummaryForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherSummaryArray: any;

  //Taxation Form Config
  CreditDebitVoucherTaxationTDSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTDSArray: any;

  CreditDebitVoucherTaxationTCSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTCSArray: any;

  CreditDebitVoucherTaxationGSTForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationGSTArray: any;
  AlljsonControlCreditDebitVoucherTaxationGSTArray: any;

  CreditDebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationPaymentSummaryArray: any;

  CreditDebitVoucherTaxationPaymentDetailsForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationPaymentDetailsArray: any;



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
  LoadVoucherDetails = true;


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
    this.creditDebitVoucherControl = new CreditDebitVoucherControl("");
    this.jsonControlCreditDebitVoucherSummaryArray = this.creditDebitVoucherControl.getCreditDebitVoucherSummaryArrayControls();
    this.CreditDebitVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherSummaryArray]);

    this.jsonControlCreditDebitVoucherTaxationTDSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTDSArrayControls();
    this.CreditDebitVoucherTaxationTDSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTDSArray]);

    this.jsonControlCreditDebitVoucherTaxationTCSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTCSArrayControls();
    this.CreditDebitVoucherTaxationTCSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTCSArray]);

    this.jsonControlCreditDebitVoucherTaxationGSTArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationGSTArrayControls();
    this.AlljsonControlCreditDebitVoucherTaxationGSTArray = this.jsonControlCreditDebitVoucherTaxationGSTArray;
    this.CreditDebitVoucherTaxationGSTForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationGSTArray]);

    this.jsonControlCreditDebitVoucherTaxationPaymentSummaryArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationPaymentSummaryArrayControls();
    this.CreditDebitVoucherTaxationPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationPaymentSummaryArray]);

    this.jsonControlCreditDebitVoucherTaxationPaymentDetailsArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationPaymentDetailsArrayControls();
    this.CreditDebitVoucherTaxationPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationPaymentDetailsArray]);

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
      this.jsonControlCreditDebitVoucherSummaryArray,
      this.CreditDebitVoucherSummaryForm,
      this.StateList,
      "Partystate",
      true
    );

    this.AllLocationsList = await GetLocationDetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlCreditDebitVoucherSummaryArray,
      this.CreditDebitVoucherSummaryForm,
      this.AllLocationsList,
      "Accountinglocation",
      false
    );
    const paymentstate = this.AllLocationsList.find(item => item.name == localStorage.getItem("Branch"))?.value
    this.CreditDebitVoucherSummaryForm.get('Paymentstate').setValue(paymentstate);

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
    const Partystate = this.CreditDebitVoucherSummaryForm.value.Partystate;
    const Paymentstate = this.CreditDebitVoucherSummaryForm.value.Paymentstate;
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
    this.jsonControlCreditDebitVoucherTaxationGSTArray = this.AlljsonControlCreditDebitVoucherTaxationGSTArray.filter(filterFunction);
    this.jsonControlCreditDebitVoucherTaxationGSTArray.forEach(item => {
      this.CreditDebitVoucherTaxationGSTForm.get(item.name).setValue((GSTAmount / this.jsonControlCreditDebitVoucherTaxationGSTArray.length).toFixed(2));
    });
    this.CalculatePaymentAmount();
  }
  calculateTDSAndTotal(event) {
    const TDSRate = Number(this.CreditDebitVoucherTaxationTDSForm.value['TDSRate']);
    const Total = this.tableData.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['Total']);
    }, 0);
    if (!isNaN(Total) && !isNaN(TDSRate)) {
      const TDSAmount = (Total * TDSRate) / 100;
      this.CreditDebitVoucherTaxationTDSForm.controls.TDSDeduction.setValue(TDSAmount.toFixed(2));
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
    const Preparedfor = this.CreditDebitVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.CreditDebitVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    const partyNameControl = this.jsonControlCreditDebitVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
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
    const Preparedfor = this.CreditDebitVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.CreditDebitVoucherSummaryForm.value.PartyName
    const Partystate = this.CreditDebitVoucherSummaryForm.get('Partystate');
    Partystate.setValue("");
    let responseFromAPI = [];
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await GetSingleVendorDetailsFromApi(this.masterService, PartyName.value)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          responseFromAPI,
          "Partystate",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await GetSingleCustomerDetailsFromApi(this.masterService, PartyName.value)
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          responseFromAPI,
          "Partystate",
          false
        );
        break;
      default:
        this.filter.Filter(
          this.jsonControlCreditDebitVoucherSummaryArray,
          this.CreditDebitVoucherSummaryForm,
          this.StateList,
          "Partystate",
          false
        );


    }
  }
  OnChangeCheckBox(event) {
    const TotalPaymentAmount = this.CreditDebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const netPayable = event?.event?.checked ? Math.ceil(TotalPaymentAmount) : TotalPaymentAmount;
    this.CreditDebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(netPayable);
  }
  CalculatePaymentAmount() {
    const totalSum = this.tableData.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue['Total']);
    }, 0);
    debugger
    const TDSAmount = this.CreditDebitVoucherTaxationTDSForm.controls.TDSDeduction.value || 0;
    let GSTAmount = 0;
    this.jsonControlCreditDebitVoucherTaxationGSTArray.forEach(item => {
      const value = parseFloat(this.CreditDebitVoucherTaxationGSTForm.get(item.name).value);
      GSTAmount += isNaN(value) ? 0 : value; // Check for NaN and handle it as 0
    });

    const CalculatedSum = totalSum + GSTAmount - TDSAmount
    this.CreditDebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").setValue(CalculatedSum.toFixed(2));
    this.CreditDebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(CalculatedSum.toFixed(2));
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
    console.log(this.CreditDebitVoucherSummaryForm.value)
    let reqBody = {
      companyCode: this.companyCode,
      voucherNo: "VR0002",
      transDate: Date(),
      finYear: financialYear,
      branch: localStorage.getItem("Branch"),
      transType: "DebitVoucher",
      docType: "Voucher",
      docNo: "VR0002",
      partyCode: this.CreditDebitVoucherSummaryForm.value?.PartyName?.value,
      partyName: this.CreditDebitVoucherSummaryForm.value?.PartyName?.name,
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
    const totalPaymentAmount = this.CreditDebitVoucherTaxationPaymentSummaryForm.get("PaymentAmount").value;
    const roundedValue = event.isUpDown ? Math.ceil(totalPaymentAmount) : Math.floor(totalPaymentAmount);
    this.CreditDebitVoucherTaxationPaymentSummaryForm.get("NetPayable").setValue(roundedValue);

  }
  // Add a new item to the table
  addVoucherDetails(event) {
    const SACCode = [
      { "name": "Local conveyance", "value": "12022" },
      { "name": "Telecom services", "value": "12088" },
      { "name": "Telecom services", "value": "12089" }
    ];
    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      SACCode: SACCode,
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
      }
      this.LoadVoucherDetails = true;
    });


  }
}
