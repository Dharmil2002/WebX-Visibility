import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AddressMaster } from "src/app/core/models/Masters/address-master";
import { AddressControl } from "src/assets/FormControls/address-master";

@Component({
  selector: 'app-address-master-add',
  templateUrl: './address-master-add.component.html',
})
export class AddressMasterAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  countryCode: any;
  action: string;
  isUpdate = false;
  addressTabledata: AddressMaster;
  addressTableForm: UntypedFormGroup;
  addressFormControls: AddressControl;
  jsonControlGroupArray: any;
  // savedData: CustomerGroupMaster;
  ngOnInit() {
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
      this.addressTabledata = this.data;
      this.breadScrums = [
        {
          title: "Address Master",
          items: ["Home"],
          active: "Edit Address Master",
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
      this.addressTabledata = new AddressMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.addressFormControls = new AddressControl(this.addressTabledata, this.isUpdate);
    this.jsonControlGroupArray = this.addressFormControls.getFormControls();
    this.addressTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  save() {
    this.addressTableForm.controls["activeFlag"].setValue(this.addressTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.addressTableForm.value.id;
      this.addressTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "address",
        id: id,
        updates: this.addressTableForm.value
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
            this.Route.navigateByUrl('/Masters/AddressMaster/AddressMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.addressTableForm.value.manualCode);
      this.addressTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "address",
        data: this.addressTableForm.value
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
            this.Route.navigateByUrl('/Masters/AddressMaster/AddressMasterList');
          }
        }
      });
    }
  }
}