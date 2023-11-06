import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SacService } from 'src/app/Utility/module/masters/sac/sac.service';
import { SACMaster } from 'src/app/core/models/Masters/SAC Master/SAC master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SACControl } from 'src/assets/FormControls/saccontrol';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sac-master',
  templateUrl: './add-sac-master.component.html'
})
export class AddSacMasterComponent implements OnInit {

  breadScrums: { title: string; items: string[]; active: string }[];
  sacTableForm: UntypedFormGroup;
  jsonControlSACArray: any;
  action: string;
  isUpdate = false;
  SACTableData: SACMaster;
  sacFormControls: SACControl
  addressData: any;

  constructor(
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private sacService: SacService
  ) {
    const extrasSACData = this.route.getCurrentNavigation()?.extras?.state;
    if (extrasSACData) {
      this.data = extrasSACData.data;
      this.action = 'edit';
      this.isUpdate = true;
      this.SACTableData = this.data;
      this.breadScrums = [{
        title: "SAC/HSN Master",
        items: ["Home"],
        active: "Edit SAC/HSN",
      }];
    } else {
      this.action = "Add";
      this.isUpdate = false;
      this.breadScrums = [{
        title: "SAC/HSN Master",
        items: ["Home"],
        active: "Add SAC/HSN",
      }];
      this.SACTableData = new SACMaster({});
    }
    this.intializeFormControls();
    this.sacTableForm.controls["TYP"].setValue(this.SACTableData.TYP);
    // Function to listen for changes in the 'TYP' control
    // this.sacTableForm.controls['TYP'].valueChanges.subscribe((selectedValue) => {
    //   if (selectedValue === 'HSN') {
    //     // Disable the 'GST Rate' control
    //     this.sacTableForm.controls['GSTRT'].disable();
    //     // Set the value of 'GST Rate' from SACTableData.TYP
    //     this.sacTableForm.controls['GSTRT'].setValue('');
    //   } else {
    //     // Enable the 'GST Rate' control
    //     this.sacTableForm.controls['GSTRT'].enable();
    //     // Clear the value or set it to an empty string as per requirement
    //     this.sacTableForm.controls['GSTRT'].setValue(this.SACTableData.TYP);
    //   }
    // });
  }

  ngOnInit(): void {
  }

  //#region
  intializeFormControls() {
    // Initialize CityControl and get form controls
    this.sacFormControls = new SACControl(this.SACTableData, this.isUpdate);
    this.jsonControlSACArray = this.sacFormControls.getFormControls();
    // Build the form group
    this.sacTableForm = formGroupBuilder(this.fb, [this.jsonControlSACArray]);
  }
  //#endregion

  //#region
  async save() {
    if (this.isUpdate) {
      this.sacTableForm.removeControl("_id");
      let req = {
        collectionName: "sachsn_master",
        filter: {
          _id: this.data._id,
        },
        update: this.sacTableForm.value
      };
      const res = await this.masterService.masterPut("generic/update", req).toPromise();
      if (res) {
        Swal.fire({
          icon: "success",
          title: "edited successfully",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl('/Masters/SAC-HSNMaster/SAC-HSNView');
      }
    } else {
      const getSeq = await this.sacService.getSacDetail();
      const sid = parseInt(getSeq[0].SID) + 1
      this.sacTableForm.controls["SID"].setValue(sid);
      const sactype = this.sacTableForm.controls['TYP'].value;
      const id = `${sactype}-${sid}`
      this.sacTableForm.controls["_id"].setValue(id);
      let req = {
        collectionName: "sachsn_master",
        data: this.sacTableForm.value
      };
      const res = await this.masterService.masterPost("generic/create", req).toPromise();
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "data added successfully",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl('/Masters/SAC-HSNMaster/SAC-HSNView');
      }
    }
  }
  //#endregion


  //#region
  async checkValueExists(fieldName, errorMessage) {
    try {
      // Get the field value from the form controls
      let fieldValue = this.sacTableForm.controls[fieldName].value;
      // Create a request object with the filter criteria
      const req = {
        collectionName: "sachsn_master",
        filter: { [fieldName]: fieldValue },
      };

      // Send the request to fetch user data
      const list = await this.masterService.masterPost("generic/get", req).toPromise();
      // Check if data exists for the given filter criteria
      if (list.data.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          icon: "error",
          title: 'error',
          text: `${errorMessage} already exists! Please try with another !`,
          showConfirmButton: true,
        });

        // Reset the input field
        this.sacTableForm.controls[fieldName].reset();
      }
    }
    catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${fieldName} details:`, error);
    }
  }
  //#endregion

  //#region 
  async checkCodeExist() {
    await this.checkValueExists("SHCD", "Service Code");
  }
  //#endregion

  //#region 
  async checkNameExist() {
    await this.checkValueExists("SNM", "Serive Name");
  }
  //#endregion



  cancel() {
    this.route.navigateByUrl('/Masters/SAC-HSNMaster/SAC-HSNView');
  }

  //#region
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
