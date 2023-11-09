import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { VendorAssociateControls } from 'src/assets/FormControls/VendorContractControls/VendorAssociateControls';

@Component({
  selector: 'app-vendor-busi-assoc-modal',
  templateUrl: './vendor-busi-assoc-modal.component.html'
})
export class VendorBusiAssocModalComponent implements OnInit {

  companyCode: number;
  BusiAssocForm: UntypedFormGroup;
  ContractBusiAssocControls: any;
  jsonControlArray: any;
  rateTypeName: any;
  rateTypestatus: any;
  cityName: any;
  citystatus: any;
  modeName: any;
  modestatus: any;
  operationName: any;
  operationstatus: any;
  constructor(private objLocationService: LocationService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<VendorBusiAssocModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode();

  }
  ngOnInit(): void {
    this.getLocation();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
  }
  //#region to get location list
  async getLocation() {
    const locationList = await this.objLocationService.getLocationList();
    if (this.objResult.Details) {
      const updatedData = locationList.find((x) => x.name == this.objResult.Details.city);
      this.BusiAssocForm.controls.city.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, locationList, this.cityName, this.citystatus);
  }
  //#endregion
  //#region to send data to parent component using dialogRef
  save(event) {
    const data = this.BusiAssocForm.value;
    this.dialogRef.close(data)
  }
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to initialize form control
  initializeFormControl() {
    this.ContractBusiAssocControls = new VendorAssociateControls();
    this.jsonControlArray = this.ContractBusiAssocControls.getVendorAssociateControls();
    this.BusiAssocForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    this.jsonControlArray.forEach(element => {
      if (element.name === 'city') {
        this.cityName = element.name,
          this.citystatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'mode') {
        this.modeName = element.name,
          this.modestatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'rateType') {
        this.rateTypeName = element.name,
          this.rateTypestatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'operation') {
        this.operationName = element.name,
          this.operationstatus = element.additionalData.showNameAndValue
      }
    });
    if (this.objResult.Details) {
      this.BusiAssocForm.controls['min'].setValue(this.objResult.Details.min);
      this.BusiAssocForm.controls['max'].setValue(this.objResult.Details.max);
      this.BusiAssocForm.controls['rate'].setValue(this.objResult.Details.rate);
    }
  }
  //#endregion
  //#region to handle functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion

  //#region to get rateType list
  getDropDownData() {
    // Make an asynchronous request to get dropdown data
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      // Destructure the response object
      const { rateTypeDropDown, operationDropdown, modeDropdown } = res;
  
      // Check if Details is present in objResult
      if (this.objResult.Details) {
        // Update operation dropdown based on Details.operation
        const updateOperation = operationDropdown.find(item => item.name === this.objResult.Details.operation);
        this.BusiAssocForm.controls.operation.setValue(updateOperation);
  
        // Update rateType dropdown based on Details.rateType
        const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rateType);
        this.BusiAssocForm.controls.rateType.setValue(updaterateType);
  
        // Update mode dropdown based on Details.mode
        const updatemode = modeDropdown.find(item => item.name === this.objResult.Details.mode);
        this.BusiAssocForm.controls.mode.setValue(updatemode);
      }
  
      // Filter and update rateType dropdown in the UI
      this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
  
      // Filter and update mode dropdown in the UI
      this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, modeDropdown, this.modeName, this.modestatus);
  
      // Filter and update operation dropdown in the UI
      this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, operationDropdown, this.operationName, this.operationstatus);
    },
    // Handle errors that may occur during the API request
    error => {
      console.error('An error occurred while fetching dropdown data:', error);
      // Handle the error as needed
    });
  }  
  //#endregion
}