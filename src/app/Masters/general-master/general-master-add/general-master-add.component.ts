import { Component, Inject,OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';
import { GeneralMaster } from 'src/app/core/models/Masters/general-master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { GeneralMasterControl } from 'src/assets/FormControls/general-master';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-general-master-add',
  templateUrl: './general-master-add.component.html',
})
export class GeneralMasterAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  countryCode: any;
  action: string;
  isUpdate = false;
  generalTabledata: GeneralMaster;
 generalTableForm: UntypedFormGroup;
  generalFormControls: GeneralMasterControl;
  jsonControlGroupArray: any;
 // savedData: CustomerGroupMaster;
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
      this.generalTabledata = this.data;
      this.breadScrums = [
        {
          title: "General Master",
          items: ["Home"],
          active: "Edit General Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "General Master",
          items: ["Home"],
          active: "Add General Master",
        },
      ];
      this.generalTabledata = new GeneralMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    // Create StateFormControls instance to get form controls for different sections
    this.generalFormControls = new GeneralMasterControl(this.generalTabledata, this.isUpdate);
    // Get form controls for Customer Group Details section
    this.jsonControlGroupArray = this.generalFormControls.getFormControls();
    this.generalTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  //#region Save Function
  save() {
    this.generalTableForm.controls["activeFlag"].setValue(this.generalTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.generalTableForm.value.id;
      // Remove the "id" field from the form controls
      this.generalTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "general",
        id: id,
        updates: this.generalTableForm.value
      };
      // this.masterService.masterPut('common/update', req).subscribe({
      //   next: (res: any) => {
      //     if (res) {
      //       // Display success message
      //       Swal.fire({
      //         icon: "success",
      //         title: "Successful",
      //         text: res.message,
      //         showConfirmButton: true,
      //       });
      //       this.Route.navigateByUrl('/Masters/GeneralMaster/GeneralMasterCodeList');
      //     }
      //   }
      // });
    } else {
      const randomNumber = getShortName(this.generalTableForm.value.codeDesc);
      this.generalTableForm.controls["id"].setValue(randomNumber);
      this.generalTableForm.controls["codeId"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "general",
        data: this.generalTableForm.value
      };
      // this.masterService.masterPost('common/create', req).subscribe({
      //   next: (res: any) => {
      //     if (res) {
      //       // Display success message
      //       Swal.fire({
      //         icon: "success",
      //         title: "Successful",
      //         text: res.message,
      //         showConfirmButton: true,
      //       });
      //       this.Route.navigateByUrl('/Masters/GeneralMaster/GeneralMasterCodeList');
      //     }
      //   }
      // });
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