import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { utilityService } from 'src/app/Utility/utility.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";
import { CustomerGroupControl } from "src/assets/FormControls/customer-group-master";

@Component({
  selector: 'app-customer-group-add',
  templateUrl: './customer-group-add.component.html',
})
export class CustomerGroupAddComponent implements OnInit {
  breadscrums: { title: string; items: string[]; active: string; }[];
  countryCode: any;
  action: string;
  isUpdate = false;
  groupTabledata: CustomerGroupMaster;
  groupTableForm: UntypedFormGroup;
  customerGroupFormControls: CustomerGroupControl;
  jsonControlGroupArray: any;
  savedData: CustomerGroupMaster;
  ngOnInit() {
    // throw new Error("Method not implemented.");
  }
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private Route: Router, private fb: UntypedFormBuilder,
    private service: utilityService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.countryCode = this.data.countryName;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.groupTabledata = this.data;
      this.breadscrums = [
        {
          title: "Customer Group Master",
          items: ["Home"],
          active: "Edit Customer Group Master",
        },
      ];
    } else {
      this.breadscrums = [
        {
          title: "Customer Group Master",
          items: ["Home"],
          active: "Add Customer Group Master",
        },
      ];
      this.groupTabledata = new CustomerGroupMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    // throw new Error("Method not implemented.");
    // Create StateFormControls instance to get form controls for different sections
    this.customerGroupFormControls = new CustomerGroupControl(this.groupTabledata, this.isUpdate);
    // Get form controls for Customer Group Details section
    this.jsonControlGroupArray = this.customerGroupFormControls.getFormControls();
    this.groupTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
    //this.Route.navigateByUrl("/Masters/StateMaster/StateMasterView");
  }
  save() {
    this.groupTableForm.controls["activeFlag"].setValue(this.groupTableForm.value.activeFlag == true ? "Y" : "N");
    this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
    this.service.exportData(this.groupTableForm.value)
  }
}