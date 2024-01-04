import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { JournalVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/JournalVouchercontrol';

//import { DriversFromApi, UsersFromApi, customerFromApi, vendorFromApi } from './Jornal-voucher-api-Utils';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { DriversFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, UsersFromApi, customerFromApi, vendorFromApi } from '../Jornal-voucher-api-Utils';
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


  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
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
    //this.BindLedger(Preparedfor);
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

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
