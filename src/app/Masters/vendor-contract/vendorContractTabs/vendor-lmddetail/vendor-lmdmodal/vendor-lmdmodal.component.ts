import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { VendorlastMileControl } from 'src/assets/FormControls/VendorContractControls/VendorlastMileControl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-lmdmodal',
  templateUrl: './vendor-lmdmodal.component.html'
})
export class VendorLMDModalComponent implements OnInit {
  companyCode: number;
  TLMDForm: UntypedFormGroup;
  ContractTLMDControls: VendorlastMileControl;
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
    console.log(this.objResult);
  }
  cancel() {
    this.dialogRef.close()
  }
  //#region to get location list
  async getLocation() {
    const locationList = await this.objLocationService.getLocationList();
    if (this.objResult.Details) {
      const updatedData = locationList.find((x) => x.value == this.objResult.Details.locID);
      this.TLMDForm.controls.location.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, locationList, this.locationName, this.locationtatus);
  }
  //#endregion
 
  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const collectionName = "vendor_contract_lmd_rt";

      if (this.objResult.Details) {
        // Update existing vendor contract
        const updateData = this.extractFormData();
        const id = this.objResult.Details.vclmID;
        const updateRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          filter: { _id: id },
          update: updateData,
        };

        const updateResponse = await this.masterService.masterPut("generic/update", updateRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Transportation- Last mile delivery",
          showConfirmButton: true,
        });
      } else {
        // Create a new vendor contract
        const existingData = await this.fetchExistingData(collectionName);
        const newVendorCode = this.generateNewVendorCode(existingData);
        const newContractData = this.prepareContractData(newVendorCode);

        const createRequest = {
          companyCode: this.companyCode,
          collectionName: collectionName,
          data: newContractData,
        };
        
        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();

        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Created Transportation- Last mile delivery",
          showConfirmButton: true,
        });
      }
      // Close the dialog regardless of success or failure
      this.dialogRef.close();
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }

  extractFormData() {
    // Extract form data for updating an existing contract
    return {
      locID: this.TLMDForm.value.location.value,
      locNM: this.TLMDForm.value.location.name,
      cpctyID: this.TLMDForm.value.capacity.value,
      cpctyNM: this.TLMDForm.value.capacity.name,
      rtID: this.TLMDForm.value.rateType.value,
      rtNM: this.TLMDForm.value.rateType.name,
      tmfrm: this.TLMDForm.value.timeFrame,
      min: parseInt(this.TLMDForm.value.minCharge),
      cmtkm: parseInt(this.TLMDForm.value.committedKm),
      addkm: parseInt(this.TLMDForm.value.additionalKm),
      max: parseInt(this.TLMDForm.value.maxCharges),
      upDT: new Date(),
      upBY: this.TLMDForm.value.upBY,
    };
  }

  async fetchExistingData(collectionName: string) {
    // Fetch existing data for creating a new contract
    const request = {
      companyCode: this.companyCode,
      collectionName: collectionName,
      filter: {},
    };

    const response = await this.masterService.masterPost("generic/get", request).toPromise();
    return response.data;
  }

  generateNewVendorCode(existingData: any[]) {
    // Generate a new vendor code based on existing data
    const lastContract = existingData[existingData.length - 1];
    const lastVendorCode = lastContract ? parseInt(lastContract.vclmID.substring(4), 10) : 0;
    return `Vclm${(lastVendorCode + 1).toString().padStart(5, '0')}`;
  }

  prepareContractData(newVendorCode: string) {
    // Prepare data for creating a new contract
    return {
      _id: newVendorCode,
      vclmID: newVendorCode,
      cID: this.companyCode,
      locID: this.TLMDForm.value.location.value,
      locNM: this.TLMDForm.value.location.name,
      cpctyID: this.TLMDForm.value.capacity.value,
      cpctyNM: this.TLMDForm.value.capacity.name,
      rtID: this.TLMDForm.value.rateType.value,
      rtNM: this.TLMDForm.value.rateType.name,
      tmfrm: this.TLMDForm.value.timeFrame,
      min: parseInt(this.TLMDForm.value.minCharge),
      cmtkm: parseInt(this.TLMDForm.value.committedKm),
      addkm: parseInt(this.TLMDForm.value.additionalKm),
      max: parseInt(this.TLMDForm.value.maxCharges),
      eDT: new Date(),
      eNBY: this.TLMDForm.value.ENBY,
    };
  }
  //#endregion

  Close() {
    this.dialogRef.close()
  }
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
      this.TLMDForm.controls['additionalKm'].setValue(this.objResult.Details.addkm);
      this.TLMDForm.controls['committedKm'].setValue(this.objResult.Details.cmtkm);
      this.TLMDForm.controls['timeFrame'].setValue(this.objResult.Details.tmfrm);
      this.TLMDForm.controls['minCharge'].setValue(this.objResult.Details.min);
      this.TLMDForm.controls['maxCharges'].setValue(this.objResult.Details.max);
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
      const updatedData = containerData.find((x) => x.name == this.objResult.Details.cpctyNM);
      this.TLMDForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, containerData, this.capacityName, this.capacitystatus);
  }
  //#endregion
  //#region to get rateType list
  async getDropDownData() {
    const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP')
    if (this.objResult.Details) {
      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rtNM);
      this.TLMDForm.controls.rateType.setValue(updaterateType);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
  }
  //#endregion
}