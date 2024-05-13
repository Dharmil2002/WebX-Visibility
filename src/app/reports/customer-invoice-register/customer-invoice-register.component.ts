import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { CustInvRegFormControl } from 'src/assets/FormControls/Reports/Customer-invoice-register/CustomerInvoiceRegisterControls';
import { GetsachsnFromApi } from 'src/app/finance/Vendor Bills/VendorGeneralBill/general-bill-detail/generalbillAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-customer-invoice-register',
  templateUrl: './customer-invoice-register.component.html'
})
export class CustomerInvoiceRegisterComponent implements OnInit {

  //#region breadScrums
  breadScrums = [
    {
      title: "Customer Invoice Register Report ",
      items: ["Reports"],
      active: "Customer Invoice Register Report ",
    },
  ];
  //#endregion

  CustInvREGTableForm: UntypedFormGroup
  jsonCustInvREGFormArray: any
  CustInvREGFormControl: CustInvRegFormControl;
  stateName: any;
  stateStatus: any;
  SACCodeList: any = [];

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private objStateService: StateService,
    private masterService: MasterService,
    private filter: FilterUtils,

  ) {
    this.initializeFormControl()
  }


  ngOnInit(): void {
    this.getDropDownList()
  }

  //#region  initializeFormControl
  initializeFormControl() {
    this.CustInvREGFormControl = new CustInvRegFormControl();
    this.jsonCustInvREGFormArray =
      this.CustInvREGFormControl.getCustInvRegFormControls();
      this.stateName = this.jsonCustInvREGFormArray.find(
        (data) => data.name === "gSTE"
      )?.name;
      this.stateStatus = this.jsonCustInvREGFormArray.find(
        (data) => data.name === "gSTE"
      )?.additionalData.showNameAndValue;
    this.CustInvREGTableForm = formGroupBuilder(this.fb, [
      this.jsonCustInvREGFormArray,
    ]);
  }
  //#endregion

  //#region
  async getCustomer() {
    await this.customerService.getCustomerForAutoComplete
    (this.CustInvREGTableForm, this.jsonCustInvREGFormArray,
    "CUST", true);
  }
  //#endregion

  //#region
  async getDropDownList(){
    const statelist = await this.objStateService.getState();
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      statelist,
      this.stateName,
      this.stateStatus
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService);
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      this.SACCodeList,
      "sACCODE",
      false
    );
  }

  //#endregion

  //#region  functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
}
