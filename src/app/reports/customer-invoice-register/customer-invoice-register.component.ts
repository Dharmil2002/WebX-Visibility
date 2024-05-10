import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { CustInvRegFormControl } from 'src/assets/FormControls/Reports/Customer-invoice-register/CustomerInvoiceRegisterControls';

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

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService
  ) {
    this.initializeFormControl()
  }


  ngOnInit(): void {
  }

  //#region  initializeFormControl
  initializeFormControl() {
    this.CustInvREGFormControl = new CustInvRegFormControl();
    this.jsonCustInvREGFormArray =
      this.CustInvREGFormControl.getCustInvRegFormControls();
    this.CustInvREGTableForm = formGroupBuilder(this.fb, [
      this.jsonCustInvREGFormArray,
    ]);
  }
  //#endregion

  //#region
  // async getCustomer(event) {
  //   await this.customerService.getCustomerForAutoComplete(
  //     this.CustInvREGTableForm,
  //     this.jsonCustInvREGFormArray,
  //     event.field.name,
  //     true
  //   );
  // }
  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(this.CustInvREGTableForm, this.jsonCustInvREGFormArray, event.field.name, true);
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
