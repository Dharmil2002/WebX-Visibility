import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { VendorlastMileControl } from 'src/assets/FormControls/VendorContractControls/VendorlastMileControl';

@Component({
  selector: 'app-vendor-lmdmodal',
  templateUrl: './vendor-lmdmodal.component.html'
})
export class VendorLMDModalComponent implements OnInit {
  companyCode: number;
  TLMDForm: UntypedFormGroup;
  ContractTLMDControls: any;
  data: any;
  jsonControlArray: any;
  capacityName: any;
  capacitystatus: any;
  rateTypeName: any;
  rateTypestatus: any;
  locationName: any;
  locationtatus: any;
  constructor(private objLocationService: LocationService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objContainerService: ContainerService,
    public dialogRef: MatDialogRef<VendorLMDModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode();

  }

  ngOnInit(): void {
    this.getLocation();
    this.getContainerList();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
  }
  cancel() {
    this.dialogRef.close()
  }
  //#region to get location list
  async getLocation() {
    const locationList = await this.objLocationService.getLocationList();
    if (this.objResult.Details) {
      const updatedData = locationList.find((x) => x.value == this.objResult.Details.location);
      this.TLMDForm.controls.location.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, locationList, this.locationName, this.locationtatus);
  }
  //#endregion
  //#region to send data to parent component using dialogRef
  save(event) {
    const data = this.TLMDForm.value;
    this.dialogRef.close(data)
  }
  Close() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to initialize form control
  initializeFormControl() {
    this.ContractTLMDControls = new VendorlastMileControl();
    this.jsonControlArray = this.ContractTLMDControls.getVendorlastMileControl();
    this.TLMDForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    this.jsonControlArray.forEach(element => {
      if (element.name === 'location') {
        this.locationName = element.name,
          this.locationtatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'capacity') {
        this.capacityName = element.name,
          this.capacitystatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'rateType') {
        this.rateTypeName = element.name,
          this.rateTypestatus = element.additionalData.showNameAndValue
      }
    });
    if (this.objResult.Details) {
      this.TLMDForm.controls['additionalKm'].setValue(this.objResult.Details.additionalKm);
      this.TLMDForm.controls['committedKm'].setValue(this.objResult.Details.committedKm);
      this.TLMDForm.controls['timeFrame'].setValue(this.objResult.Details.timeFrame);
      this.TLMDForm.controls['minCharge'].setValue(this.objResult.Details.minCharge);
      this.TLMDForm.controls['maxCharges'].setValue(this.objResult.Details.maxCharges);
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

  //#region to get container list
  async getContainerList() {
    const container = await this.objContainerService.getDetail();
    const containerData = container.filter((item) => item.activeFlag) // Filter based on the isActive property
      .map(e => ({
        name: e.loadCapacity, // Map the name to the specified nameKey
        value: e.containerCode // Map the value to the specified valueKey
      }));
    if (this.objResult.Details) {
      const updatedData = containerData.find((x) => x.name == this.objResult.Details.capacity);
      this.TLMDForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, containerData, this.capacityName, this.capacitystatus);
  }
  //#endregion
  //#region to get rateType list
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { rateTypeDropDown } = res;
      if (this.objResult.Details) {
        const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rateType);
        this.TLMDForm.controls.rateType.setValue(updaterateType);
      }
      this.filter.Filter(this.jsonControlArray, this.TLMDForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
    });
  }
  //#endregion
}