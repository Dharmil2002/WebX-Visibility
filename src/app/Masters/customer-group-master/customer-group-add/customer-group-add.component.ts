import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomerGroupMaster } from "src/app/core/models/Masters/customer-group-master";
import { CustomerGroupControl } from "src/assets/FormControls/customer-group-master";
import { getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: 'app-customer-group-add',
  templateUrl: './customer-group-add.component.html',
})
export class CustomerGroupAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  countryCode: any;
  action: string;
  isUpdate = false;
  groupTabledata: CustomerGroupMaster;
  groupTableForm: UntypedFormGroup;
  customerGroupFormControls: CustomerGroupControl;
  jsonControlGroupArray: any;
  savedData: CustomerGroupMaster;
  ngOnInit() {
  }
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService
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
      this.breadScrums = [
        {
          title: "Customer Group Master",
          items: ["Home"],
          active: "Edit Customer Group Master",
        },
      ];
    } else {
      this.breadScrums = [
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
    // Create StateFormControls instance to get form controls for different sections
    this.customerGroupFormControls = new CustomerGroupControl(this.groupTabledata, this.isUpdate);
    // Get form controls for Customer Group Details section
    this.jsonControlGroupArray = this.customerGroupFormControls.getFormControls();
    this.groupTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  //#region Save Function
  save() {
    this.groupTableForm.controls["activeFlag"].setValue(this.groupTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.groupTableForm.value.id;
      // Remove the "id" field from the form controls
      this.groupTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "customerGroup_detail",
        id: id,
        updates: this.groupTableForm.value
      };
      this.masterService.masterPut('common/update', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.groupTableForm.value.groupName);
      this.groupTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "customerGroup_detail",
        data: this.groupTableForm.value
      };
      this.masterService.masterPost('common/create', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/CustomerGroupMaster/CustomerGroupMasterList');
          }
        }
      });
    }
  }
  //#endregion

  //#region Function Call Handler
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
  //#endregion
}