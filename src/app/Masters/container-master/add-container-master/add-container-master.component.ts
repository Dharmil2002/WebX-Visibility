import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ContainerControl } from 'src/assets/FormControls/container-master';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from 'sweetalert2';
import { convertNumericalStringsToInteger } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
@Component({
  selector: 'app-add-container-master',
  templateUrl: './add-container-master.component.html',
})
export class AddContainerMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  containerTabledata: any;
  containerTableForm: UntypedFormGroup;
  containerFormControls: ContainerControl;
  //#region Variable Declaration
  jsonControlArray: any;
  pincodeStatus: any;
  pincodeList: any;
  action: string;
  isUpdate = false;
  newContainerCode: string;
  data: any;
  containerData: any;
  //#endregion

  ngOnInit() {
  }
  constructor(private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService, private filter: FilterUtils,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.containerTabledata = this.data;
      this.breadScrums = [
        {
          title: "Container Master",
          items: ["Home"],
          active: "Edit Container Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Container Master",
          items: ["Home"],
          active: "Add Container Master",
        },
      ];
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.containerFormControls = new ContainerControl(this.containerTabledata, this.isUpdate);
    this.jsonControlArray = this.containerFormControls.getContainerFormControls();
    this.containerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
  }

  //#region Save Function
  save() {
    // Clear any errors in the form controls
    Object.values(this.containerTableForm.controls).forEach(control => control.setErrors(null));

    if (this.isUpdate) {
      let id = this.containerTableForm.value._id;
      this.containerTableForm.removeControl("_id");
      let req = {
        companyCode: this.companyCode,
        collectionName: "container_detail",
        filter: { _id: id },
        update: convertNumericalStringsToInteger(this.containerTableForm.value)
      };
      this.masterService.masterPut('generic/update', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
          }
        }
      });
    } else {
      const lastCode = this.containerData[this.containerData.length - 1];
      const lastContainerCode = lastCode ? parseInt(lastCode.containerCode.substring(3)) : 0;
      // Function to generate a new Container code
      function generateContainerCode(initialCode: number = 0) {
        const nextContainerCode = initialCode + 1;
        const containerNumber = nextContainerCode.toString().padStart(4, '0');
        const containerCode = `CON${containerNumber}`;
        return containerCode;
      }
      this.newContainerCode = generateContainerCode(lastContainerCode);
      this.containerTableForm.controls["_id"].setValue(this.newContainerCode);
      this.containerTableForm.controls["containerCode"].setValue(this.newContainerCode);
      let req = {
        companyCode: this.companyCode,
        collectionName: "container_detail",
        data: convertNumericalStringsToInteger(this.containerTableForm.value)
      };
      this.masterService.masterPost('generic/create', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
          }
        }
      });
    }
  }
  //#endregion

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
  checkContainerExists() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      "collectionName": "container_detail",
      "filter": {}
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          this.containerData = res.data;
          const count = res.data.filter(item => item.containerName == this.containerTableForm.controls.containerName.value)
          if (count.length > 0) {
            Swal.fire({
              title: 'Container Name already exists! Please try with another',
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK"
            });
            this.containerTableForm.controls['containerName'].reset();
          }
        }
      }
    })
  }
}
