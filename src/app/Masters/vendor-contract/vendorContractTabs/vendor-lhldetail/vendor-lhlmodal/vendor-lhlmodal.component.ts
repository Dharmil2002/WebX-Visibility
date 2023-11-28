import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TERCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-lhlmodal',
  templateUrl: './vendor-lhlmodal.component.html'
})
export class VendorLHLModalComponent implements OnInit {
  companyCode: number;
  TLHLForm: UntypedFormGroup;
  ContractTLHLControls: TERCharges;
  data: any;
  jsonControlArray: any;
  routeName: any;
  routestatus: any;
  capacityName: any;
  capacitystatus: any;
  rateTypeName: any;
  rateTypestatus: any;
  CurrentContractDetails: any;
  existRouteList: any;
  submit = 'Save';

  constructor(private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objRouteLocationService: RouteLocationService,
    private objContainerService: ContainerService,
    public dialogRef: MatDialogRef<VendorLHLModalComponent>,
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
    this.getRouteList();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
    this.existRouteList = this.objResult.TERList;
  }
  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const vendorContractCollection = "vendor_contract_lhl_rt";

      if (this.objResult.Details) {
        // Update existing vendor contract
        const updateData = this.extractFormData();
        const id = this.objResult.Details._id;
        const updateRequest = {
          companyCode: this.companyCode,
          collectionName: vendorContractCollection,
          filter: { _id: id },
          update: updateData,
        };

        const updateResponse = await this.masterService.masterPut("generic/update", updateRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Transportation- Long Haul lane based",
          showConfirmButton: true,
        });
      } else {
        // Create a new vendor contract
        const existingData = await this.fetchExistingData(vendorContractCollection);
        let index = existingData.find(x => x.cNID === this.CurrentContractDetails.cNID);

        // Check if index is found, then set to the count, otherwise set to 0
        index = index ? existingData.filter(x => x.cNID === this.CurrentContractDetails.cNID).length : 0;
        const newContractData = this.prepareContractData(index);

        const createRequest = {
          companyCode: this.companyCode,
          collectionName: vendorContractCollection,
          data: newContractData,
        };

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();

        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Created Transportation- Long Haul lane based",
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
      rTID: this.TLHLForm.value.route.value,
      rTNM: this.TLHLForm.value.route.name,
      cPCTID: this.TLHLForm.value.capacity.value,
      cPCTNM: this.TLHLForm.value.capacity.name,
      rTTID: this.TLHLForm.value.rateType.value,
      rTTNM: this.TLHLForm.value.rateType.name,
      rT: parseFloat(this.TLHLForm.value.rate),
      mIN: parseFloat(this.TLHLForm.value.min),
      mAX: parseFloat(this.TLHLForm.value.max),
      mODLOC: localStorage.getItem("Branch"),
      mODDT: new Date(),
      mODBY: this.TLHLForm.value.ENBY,
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
      branch: localStorage.getItem("CurrentBranchCode"),
      cNID: this.CurrentContractDetails.cNID,
      rTID: this.TLHLForm.value.route.value,
      rTNM: this.TLHLForm.value.route.name,
      cPCTID: this.TLHLForm.value.capacity.value,
      cPCTNM: this.TLHLForm.value.capacity.name,
      rTTID: this.TLHLForm.value.rateType.value,
      rTTNM: this.TLHLForm.value.rateType.name,
      rT: parseFloat(this.TLHLForm.value.rate),
      mIN: parseFloat(this.TLHLForm.value.min),
      mAX: parseFloat(this.TLHLForm.value.max),
      eNTBY: this.TLHLForm.value.ENBY,
      eNTLOC: localStorage.getItem("Branch"),
      eNTDT: new Date(),
    };
  }

  //#endregion

  cancel() {
    this.dialogRef.close()
  }
  Close() {
    this.dialogRef.close()
  }
  //#region to initialize form control
  initializeFormControl() {
    this.ContractTLHLControls = new TERCharges(this.data);
    this.jsonControlArray = this.ContractTLHLControls.getTERChargesArrayControls();
    this.TLHLForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.jsonControlArray.forEach(element => {
      if (element.name === 'route') {
        this.routeName = element.name,
          this.routestatus = element.additionalData.showNameAndValue
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
      this.TLHLForm.controls['rate'].setValue(this.objResult.Details.rT);
      this.TLHLForm.controls['min'].setValue(this.objResult.Details.mIN);
      this.TLHLForm.controls['max'].setValue(this.objResult.Details.mAX);
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
  //#region to get route list
  async getRouteList() {
    const routeList = await this.objRouteLocationService.getRouteLocationDetail()
    if (this.objResult.Details) {
      const updatedRoute = routeList.find((x) => x.name == this.objResult.Details.rTNM);
      this.TLHLForm.controls.route.setValue(updatedRoute);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, routeList, this.routeName, this.routestatus);
  }
  //#endregion

  //#region to get rateType list
  async getDropDownData() {
    const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP')
    const containerData = await this.objContainerService.getContainerList();
    const vehicleData = await PayBasisdetailFromApi(this.masterService, 'VehicleCapacity')
    const containerDataWithPrefix = vehicleData.map((item) => ({
      name: `Veh- ${item.name}`,
      value: item.value,
    }));
    // Merge containerData and vehicleData into a single array
    const mergedData = [...containerData, ...containerDataWithPrefix];

    if (this.objResult.Details) {
      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rTTNM);
      this.TLHLForm.controls.rateType.setValue(updaterateType);
      const updatedData = mergedData.find((x) => x.name == this.objResult.Details.cPCTNM);
      this.TLHLForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, mergedData, this.capacityName, this.capacitystatus);
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
  }
  //#endregion
  //#region to Validate the minimum and maximum charge values in the TLHLForm.
  validateMinCharge() {
    // Get the current values of 'min' and 'max' from the TLHLForm
    const minValue = parseFloat(this.TLHLForm.get('min')?.value);
    const maxValue = parseFloat(this.TLHLForm.get('max')?.value);

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

      // Reset the values of 'min' and 'max' in the TLHLForm to an empty string
      this.TLHLForm.patchValue({
        min: '',
        max: ''
      });
    }
  }
  //#endregion
  //#region to check existing location 
  async checkValueExists() {
    try {
      // Get the field value from the form controls
      const fieldValue = this.TLHLForm.controls['route'].value.name;

      // Find the route in existing routes
      const existingRoute = this.existRouteList.find(x => x.rTNM === fieldValue);

      // Check if data exists for the given filter criteria
      if (existingRoute) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: `Route: ${fieldValue} already exists in Long Haul lane based! Please try with another!`,
          icon: "error",
          title: 'Error',
          showConfirmButton: true,
        });

        // Reset the input field
        this.TLHLForm.controls['route'].reset();
        this.getRouteList();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching 'route' details:`, error);
    }
  }
  //#endregion
  //#region to Validate the minimum  charge values on rate in the TLHLForm.
  validateMinChargeOnRate() {
    // Get the current values of 'min' and 'max' from the TLHLForm
    const minValue = parseFloat(this.TLHLForm.get('min')?.value);
    const maxValue = parseFloat(this.TLHLForm.get('rate')?.value);

    // Check if both 'min' and 'max' have valid numeric values and if 'min' is greater than 'max'
    if (minValue && maxValue && minValue >= maxValue) {
      // Display an error message using SweetAlert (Swal)
      Swal.fire({
        title: 'Min charge must be less Rate.',
        toast: false,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK"
      });

      // Reset the values of 'min' and 'max' in the TLHLForm to an empty string
      this.TLHLForm.patchValue({
        min: '',
      });
    }
    this.validateMinCharge();
  }
  //#endregion
  //#region to Validate the maximum  charge values on rate in the TLHLForm.
  validateMAXChargeOnRate() {
    // Get the current values of 'min' and 'max' from the TLHLForm
    const minValue = parseFloat(this.TLHLForm.get('max')?.value);
    const maxValue = parseFloat(this.TLHLForm.get('rate')?.value);

    // Check if both 'min' and 'max' have valid numeric values and if 'min' is greater than 'max'
    if (minValue && maxValue && maxValue >= minValue) {
      // Display an error message using SweetAlert (Swal)
      Swal.fire({
        title: 'Max charge must be greater than Rate.',
        toast: false,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "OK"
      });

      // Reset the values of 'min' and 'max' in the TLHLForm to an empty string
      this.TLHLForm.patchValue({
        max: '',
      });
    }
    this.validateMinCharge();
  }
  //#endregion

}