import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { ContainerMasterService } from 'src/app/Utility/module/operation/container-master/container-master-service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ContainerStatusControls } from 'src/assets/FormControls/container-status-controls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-container-status',
  templateUrl: './add-container-status.component.html'
})
export class AddContainerStatusComponent implements OnInit {
  breadScrums = [
    {
      title: "Add Container Status",
      items: ["Home"],
      active: "Container Status",
    },
  ];
  containerStatusTableForm: UntypedFormGroup;
  backPath: string;
  jsonControlContainerArray: any;
  constructor(
    private fb: UntypedFormBuilder,
    private storage: StorageService,
    private filter: FilterUtils,
    private route:Router,
    private containerMasterService: ContainerMasterService
  ) {

  }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    const containerFormControls = new ContainerStatusControls();
    this.jsonControlContainerArray = containerFormControls.getFormControls();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.containerStatusTableForm = formGroupBuilder(this.fb, [this.jsonControlContainerArray]);
  }

  functionCallHandler($event) {

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
    }
  }
  async getContainerNo() {
    const containerNo = this.containerStatusTableForm.get('cNID').value;
    const containerData = await this.containerMasterService.getContainerDetail({ "cNNO": { 'D$regex': `^${containerNo}`, 'D$options': 'i' },aCT:true }, true);
    this.filter.Filter(
      this.jsonControlContainerArray,
      this.containerStatusTableForm,
      containerData,
      'cNID',
      false
    );
  }
  async filterContainerDetails() {
    const { cNID, cNTYPNM, vNTYP, vNTYPNM } = this.containerStatusTableForm.controls;
    const containerNoValue = cNID.value;
    // Reset form values
    [cNTYPNM, vNTYP, vNTYPNM].forEach(control => control.setValue(''));

    try {
      const exists = await this.containerMasterService.getContainerStatus({ "cNID": containerNoValue.value });
      if (exists?.data && Object.keys(exists.data).length > 0) {
        const errorMessage = `Container with ID ${containerNoValue.value} is already exists.`;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
        });
        cNID.setValue('');
        return;
      }
      // Update form values if container data is available
      if (containerNoValue) {
        cNTYPNM.setValue(containerNoValue?.containerData.cNTYPNM||'');
        vNTYP.setValue(1);
        vNTYPNM.setValue(containerNoValue?.containerData.vNTYP||'');
      }
    } catch (error) {
       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error while fetching container details',
       })
      // Handle the error appropriately here
    }
  }
  cancel() {
    this.route.navigateByUrl('Masters/Container/Status/list');
  }
  async save() {
    try {
      const containerData = this.containerStatusTableForm.value;
      containerData['_id'] = `${this.storage.companyCode}-${containerData.cNID.value}`;
      containerData['cID'] = this.storage.companyCode;
      containerData['cNID']=containerData.cNID.value;
      containerData['cONTFORCD']="";
      containerData['cONTFORNM']="";
      containerData['isEMPT']="N";
      const res = await this.containerMasterService.addContainerStatus(containerData);
      if (res) {
        const successMessage = `Container with ID ${containerData.cNID} is now available.`;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: successMessage,
        });
        this.route.navigateByUrl('Masters/Container/Status/list');
      }
    } catch (err) {
      const errorMessage = `Error while adding container status.`;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  }
}
