import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
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
  CurrentContractDetails: any;
  timeFrameName: any;
  timeFramestatus: any;
  existingLocation: any;
  submit = 'Save';
  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private objLocationService: LocationService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objContainerService: ContainerService,
    public dialogRef: MatDialogRef<VendorLMDModalComponent>,
    private objGeneralService: GeneralService,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode();
    this.route.queryParams.subscribe((params) => {
      const encryptedData = params['data']; // Retrieve the encrypted data from the URL
      const decryptedData = this.encryptionService.decrypt(encryptedData); // Replace with your decryption method
      this.CurrentContractDetails = JSON.parse(decryptedData)

      // console.log(this.CurrentContractDetails.cNID);      
    });
  }

  ngOnInit(): void {
    this.getLocation();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
    this.existingLocation = this.objResult.TERList;
  }
  cancel() {
    this.dialogRef.close()
  }
  //#region to get location list
  async getLocation() {
    const locationList = await this.objLocationService.getLocationList();
    if (this.objResult.Details) {
      const updatedData = locationList.find((x) => x.value == this.objResult.Details.lOCID);
      this.TLMDForm.controls.location.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, locationList, this.locationName, this.locationtatus);
  }
  //#endregion

  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const collectionName = "vendor_contract_lmd_rt";
      this.checkValueExists();
      if (this.objResult.Details) {
        // Update existing vendor contract
        const updateData = this.extractFormData();
        const id = this.objResult.Details._id;
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
        // Fetch existing data
        const existingData = await this.fetchExistingData(collectionName);
        let newId;
        // Find the contract with the specified cNID
        const existingContract = existingData.filter(x => x.cNID === this.CurrentContractDetails.cNID);

        if (existingContract) {
          // Sort existing data based on _id for consistency
          const sortedData = existingContract.sort((a, b) => a._id.localeCompare(b._id));
          const lastId = sortedData.length > 0 ? parseInt(sortedData[sortedData.length - 1]._id.split('-')[2], 10) : 0;

          // Generate a new _id
          newId = lastId + 1;
        }
        newId = existingContract ? newId : 1
        const newContractData = this.prepareContractData(newId);

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
      lOCID: this.TLMDForm.value.location.value,
      lOCNM: this.TLMDForm.value.location.name,
      cPCTID: this.TLMDForm.value.capacity.value,
      cPCTNM: this.TLMDForm.value.capacity.name,
      rTTID: this.TLMDForm.value.rateType.value,
      rTTNM: this.TLMDForm.value.rateType.name,
      tMFRMID: this.TLMDForm.value.timeFrame.value,
      tMFRMNM: this.TLMDForm.value.timeFrame.name,
      mIN: parseFloat(this.TLMDForm.value.minCharge),
      cMTKM: parseFloat(this.TLMDForm.value.committedKm),
      aDDKM: parseFloat(this.TLMDForm.value.additionalKm),
      mAX: parseFloat(this.TLMDForm.value.maxCharges),
      mODLOC: localStorage.getItem("Branch"),
      mODDT: new Date(),
      mODBY: this.TLMDForm.value.uPBY,
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

  prepareContractData(newVendorCode: string) {
    // Prepare data for creating a new contract
    return {
      _id: this.companyCode + "-" + this.CurrentContractDetails.cNID + "-" + newVendorCode,
      cID: this.companyCode,
      cNID: this.CurrentContractDetails.cNID,
      lOCID: this.TLMDForm.value.location.value,
      lOCNM: this.TLMDForm.value.location.name,
      cPCTID: this.TLMDForm.value.capacity.value,
      cPCTNM: this.TLMDForm.value.capacity.name,
      rTTID: this.TLMDForm.value.rateType.value,
      rTTNM: this.TLMDForm.value.rateType.name,
      tMFRMID: this.TLMDForm.value.timeFrame.value,
      tMFRMNM: this.TLMDForm.value.timeFrame.name,
      mIN: parseFloat(this.TLMDForm.value.minCharge),
      cMTKM: parseFloat(this.TLMDForm.value.committedKm),
      aDDKM: parseFloat(this.TLMDForm.value.additionalKm),
      mAX: parseFloat(this.TLMDForm.value.maxCharges),
      eNTBY: this.TLMDForm.value.eNBY,
      eNTLOC: localStorage.getItem("Branch"),
      eNTDT: new Date(),
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
      if (element.name === 'timeFrame') {
        this.timeFrameName = element.name,
          this.timeFramestatus = element.additionalData.showNameAndValue
      }
    });
    if (this.objResult.Details) {
      this.TLMDForm.controls['additionalKm'].setValue(this.objResult.Details.aDDKM);
      this.TLMDForm.controls['committedKm'].setValue(this.objResult.Details.cMTKM);
      //this.TLMDForm.controls['timeFrame'].setValue(this.objResult.Details.tMFRM);
      this.TLMDForm.controls['minCharge'].setValue(this.objResult.Details.mIN);
      this.TLMDForm.controls['maxCharges'].setValue(this.objResult.Details.mAX);
      this.submit = 'Update';

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
  async getDropDownData() {
    const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP')
    const timeFrameDropDown = await PayBasisdetailFromApi(this.masterService, 'TMFRM')
    const containerData = await this.objContainerService.getContainerList();
    const vehicleData = await this.objGeneralService.getGeneralMasterData("VEHSIZE");

    // Merge containerData and vehicleData into a single array
    const mergedData = [...containerData, ...vehicleData];

    this.filter.Filter(this.jsonControlArray, this.TLMDForm, mergedData, this.capacityName, this.capacitystatus);
    if (this.objResult.Details) {
      const updatedData = mergedData.find((x) => x.name == this.objResult.Details.cPCTNM);
      this.TLMDForm.controls.capacity.setValue(updatedData);
      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rTTNM);
      this.TLMDForm.controls.rateType.setValue(updaterateType);

      const updateTMFRM = timeFrameDropDown.find(item => item.name === this.objResult.Details.tMFRMNM);
      this.TLMDForm.controls.timeFrame.setValue(updateTMFRM);
    }
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
    this.filter.Filter(this.jsonControlArray, this.TLMDForm, timeFrameDropDown, this.timeFrameName, this.timeFramestatus);
  }
  //#endregion
  //#region to Validate the minimum and maximum charge values in the TLMDForm.
  validateMinCharge() {
    // Get the current values of 'min' and 'max' from the TLMDForm
    const minValue = parseFloat(this.TLMDForm.get('minCharge')?.value);
    const maxValue = parseFloat(this.TLMDForm.get('maxCharges')?.value);

    // Check if both 'min' and 'max' have valid numeric values and if 'min' is greater than 'max'
    if (minValue && maxValue && minValue > maxValue) {
      // Display an error message using SweetAlert (Swal)
      Swal.fire({
        title: 'Max charge must be greater than or equal to Min charge.',
        toast: false,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK"
      });

      // Reset the values of 'min' and 'max' in the TLMDForm to an empty string
      this.TLMDForm.patchValue({
        minCharge: '',
        maxCharges: ''
      });
    }
  }
  //#endregion
  //#region to check existing location 
  async checkValueExists() {
    try {
      // Set to store unique combinations of Route and Capacity from existRouteList
      const uniqueEntries = new Set();

      // Extract values from existRouteList using provided keys and create unique key
      this.existingLocation.forEach(tableEntry => {
        const tablekey = `${tableEntry['lOCNM']}-${tableEntry['cPCTNM']}`;
        uniqueEntries.add(tablekey);
      });

      // Get the field values from the form controls
      const routeValue = this.TLMDForm.controls['location'].value.name;
      const capacityValue = this.TLMDForm.controls['capacity'].value.name;

      // Create a key for the current form input
      const key = `${routeValue}-${capacityValue}`;

      // Check if the input key already exists in the uniqueEntries set
      const isDuplicate = uniqueEntries.has(key);

      // Check if data exists for the given filter criteria
      if (isDuplicate) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: `Location: ${routeValue} with Capacity: ${capacityValue} already exists in Last mile delivery! Please try with another!`,
          icon: "error",
          title: 'Error',
          showConfirmButton: true,
        });

        // Reset the input field
        this.TLMDForm.controls['location'].reset();
        this.TLMDForm.controls['capacity'].reset();

        // Refresh the route list
        this.getDropDownData();
        this.getLocation();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while checking for duplicate values:`, error);
    }
  }
  //#endregion
}