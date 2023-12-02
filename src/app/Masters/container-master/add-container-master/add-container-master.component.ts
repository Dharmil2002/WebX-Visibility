import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ContainerControl } from 'src/assets/FormControls/container-master';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from 'sweetalert2';
import { convertNumericalStringsToInteger } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-add-container-master',
  templateUrl: './add-container-master.component.html',
})
export class AddContainerMasterComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: true; toggle: boolean; }[];
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
  backPath: string;
  containerData: any;
  containerType: any;
  containerTypeStatus: any;
  containerTypeId: any;
  submit = 'Save';
  //#endregion

  ngOnInit() {
    this.getContainerTypeData();
    this.backPath = "/Masters/ContainerMaster/ContainerMasterList";
  }
  constructor(
    private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService, private filter: FilterUtils,
    private containerService: ContainerService,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;

      this.action = 'edit'
      this.submit = 'Modify';
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.containerTabledata = this.data;
      this.containerTypeId = this.data.containerType;
      this.breadScrums = [
        {
          title: "Modify Container",
          items: ["Home"],
          active: "Modify Container",
          generatecontrol: true,
          toggle: this.data.activeFlag
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Add Container",
          items: ["Home"],
          active: "Add Container",
          generatecontrol: true,
          toggle: false
        },
      ];
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.containerFormControls = new ContainerControl(this.containerTabledata, this.isUpdate);
    this.jsonControlArray = this.containerFormControls.getContainerFormControls();
    this.jsonControlArray.forEach((data) => {
      if (data.name === "containerType") {
        // Set containerType-related variables
        this.containerType = data.name;
        this.containerTypeStatus = data.additionalData.showNameAndValue;
      }
    })
    this.containerTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
  }

  //#region Save Function
  async save() {

    this.containerTableForm.controls.containerType.setValue(this.containerTableForm.value.containerType.name);
    this.containerTableForm.controls.containerName.setValue(this.containerTableForm.value.containerType);
    // Remove all form errors
    const controls = this.containerTableForm;
    clearValidatorsAndValidate(controls);
    if (this.isUpdate) {
      this.containerTableForm.removeControl("_id");
      let req = {
        companyCode: this.companyCode,
        collectionName: "container_detail",
        filter: {
          _id: this.data._id,
        },
        update: this.containerTableForm.value
      };
      const res = await firstValueFrom(this.masterService.masterPut('generic/update', req));
      if (res) {
        Swal.fire({
          icon: "success",
          title: "edited successfully",
          text: res.message,
          showConfirmButton: true,
        });
        this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
      }
    } else {
      const getSeq = await this.containerService.getDetail();
      const containerCode = getSeq[getSeq.length - 1].containerCode;
      // Extract the last two digits from the containerCode
      const lastTwoDigits = containerCode.slice(-2);
      // Increment the last two digits by 1
      const incrementedDigits = (parseInt(lastTwoDigits) + 1).toString().padStart(2, '0');
      // Replace the last two digits in the containerCode with the incremented value
      const updatedContainerCode = containerCode.slice(0, -2) + incrementedDigits;
      this.containerTableForm.controls["containerCode"].setValue(updatedContainerCode);
      const id = `${updatedContainerCode}`
      this.containerTableForm.controls["_id"].setValue(id);
      let req = {
        companyCode: this.companyCode,
        collectionName: "container_detail",
        data: this.containerTableForm.value
      };
      const res = await firstValueFrom (this.masterService.masterPost("generic/create", req));
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "data added successfully",
          text: res.message,
          showConfirmButton: true,
        });
        this.Route.navigateByUrl('/Masters/ContainerMaster/ContainerMasterList');
      }
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

  //#region to get Container Type List
  getContainerTypeData() {
    firstValueFrom(this.masterService.getJsonFileDetails("containerTypeUrl")).then((res) => {
      const containerTypeList = res;
      if (this.isUpdate) {
        const updatedContainerType = containerTypeList.find((x) => x.value == this.containerTypeId);
        this.containerTableForm.controls['containerType'].setValue(updatedContainerType);
      }

      // calling filter function and passing required data
      this.filter.Filter(
        this.jsonControlArray,
        this.containerTableForm,
        containerTypeList,
        this.containerType,
        this.containerTypeStatus
      );
    }).catch((error) => {
      // handle error here
      console.error("Error fetching container type data:", error);
    });
  }
  //#endregion

  //#region to check Container Type Exists or not
  checkIfContainerTypeExists() {
    // Prepare the request object with necessary parameters
    let req = {
      companyCode: this.companyCode,
      "collectionName": "container_detail",
      "filter": {}
    }

    // Make an HTTP request to fetch container details
    firstValueFrom(this.masterService.masterPost('generic/get', req))
    .then((res: any) => {
      // Check if a response was received
      if (res) {
        // Find if the selected container type exists in the fetched data
        const existingContainer = res.data.find(item => item.containerType === this.containerTableForm.controls.containerType.value.name);

        // If the container type exists, display an info message
        if (existingContainer) {
          Swal.fire({
            icon: "info",
            title: "Container Type Exists",
            text: `Container Type : ${existingContainer.containerType} is already exist!`,
            showConfirmButton: true,
          });

          // Reset the container type form control
          this.containerTableForm.controls['containerType'].setValue({ name: "", value: "" });
        }
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching container type data:", error);
    });

  }
  //#endregion
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.containerTableForm.controls['activeFlag'].setValue(event);
  }
}
