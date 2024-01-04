import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { JournalVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/JournalVouchercontrol';

//import { DriversFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './Jornal-voucher-api-Utils';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DriversFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, UsersFromApi, customerFromApi, vendorFromApi } from '../Jornal-voucher-api-Utils';
import { GetLedgercolumnHeader } from '../jornalvoucherCommonUtitlity';
import { MatDialog } from '@angular/material/dialog';
import { JournalVoucherCreationModalComponent } from '../Modals/journal-voucher-creation-modal/journal-voucher-creation-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-journal-voucher-creation',
  templateUrl: './journal-voucher-creation.component.html',
})
export class JournalVoucherCreationComponent implements OnInit {
  breadScrums = [
    {
      title: "Journal Voucher",
      items: ["Finance"],
      active: "Journal Voucher",
    },
  ];
  JournalVoucherControl: JournalVoucherControl;

  JournalVoucherSummaryForm: UntypedFormGroup;
  jsonControlJournalVoucherSummaryArray: any;

  LoadVoucherDetails = true;
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


  staticField = ['Ledger', 'DebitAmount', 'CreditAmount', 'Narration']
  columnHeader = GetLedgercolumnHeader()
  tableData: any = [];
  AccountGroupList: any;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private router: Router,
    private matDialog: MatDialog,
    private filter: FilterUtils,) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.JournalVoucherControl = new JournalVoucherControl("");
    this.jsonControlJournalVoucherSummaryArray = this.JournalVoucherControl.getJournalVoucherSummaryArrayControls();
    this.JournalVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlJournalVoucherSummaryArray]);

  }
  async PreparedforFieldChanged(event) {
    const Preparedfor = this.JournalVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.JournalVoucherSummaryForm.get('PartyName');
    PartyName.setValue("");
    this.JournalVoucherSummaryForm.get("PANnumber").setValue("");
    this.JournalVoucherSummaryForm.get("PANnumber").enable();
    const partyNameControl = this.jsonControlJournalVoucherSummaryArray.find(x => x.name === "PartyName");
    partyNameControl.type = "dropdown";
    PartyName.setValidators([Validators.required, autocompleteObjectValidator()]);
    PartyName.updateValueAndValidity();
    let responseFromAPI = [];
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await vendorFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Customer':
        responseFromAPI = await customerFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Employee':
        responseFromAPI = await UsersFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
          responseFromAPI,
          "PartyName",
          false
        );
        break;
      case 'Driver':
        responseFromAPI = await DriversFromApi(this.masterService)
        this.filter.Filter(
          this.jsonControlJournalVoucherSummaryArray,
          this.JournalVoucherSummaryForm,
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
    const Preparedfor = this.JournalVoucherSummaryForm.value.Preparedfor;
    const PartyName = this.JournalVoucherSummaryForm.value.PartyName
    let responseFromAPI: any;
    switch (Preparedfor) {
      case 'Vendor':
        responseFromAPI = await GetSingleVendorDetailsFromApi(this.masterService, PartyName.value)
        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.JournalVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.JournalVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      case 'Customer':
        responseFromAPI = await GetSingleCustomerDetailsFromApi(this.masterService, PartyName.value)

        if (responseFromAPI[0]?.othersdetails?.PANnumber) {
          this.JournalVoucherSummaryForm.get("PANnumber").setValue(responseFromAPI[0]?.othersdetails?.PANnumber);
          this.JournalVoucherSummaryForm.get("PANnumber").disable();
        }
        break;
      default:

    }
  }

  handleMenuItemClick(data) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {

      const LedgerDetails = this.tableData.find(x => x.id == data.data.id);
      this.addJournalDetails(LedgerDetails)
    }
  }
  AddNewJournals() {
    this.addJournalDetails('')

  }
  async BindLedger(BindLedger) {
    const account_groupReqBody = {
      companyCode: localStorage.getItem('companyCode'),
      collectionName: "account_detail",
      filter: {
        pARTNM: BindLedger,
      },
    };
    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.aCCD, name: x.aCNM, ...x }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  // Add a new item to the table
  addJournalDetails(event) {

    const EditableId = event?.id
    const request = {
      LedgerList: this.AccountGroupList,
      Details: event,
    }
    this.LoadVoucherDetails = false;
    const dialogRef = this.matDialog.open(JournalVoucherCreationModalComponent, {
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
          DebitAmount: result?.DebitAmount,
          CreditAmount: result?.CreditAmount,
          Narration: result?.Narration,
          actions: ['Edit', 'Remove']
        }
        this.tableData.push(json);
        this.LoadVoucherDetails = true;
      }
      this.LoadVoucherDetails = true;
    });
  }
  Submit() {
    console.log(this.JournalVoucherSummaryForm.value);
    console.log(this.tableData);

  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
