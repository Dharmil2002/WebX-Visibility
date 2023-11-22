import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { SessionService } from 'src/app/core/service/session.service';
import { VendorAssociateControls } from 'src/assets/FormControls/VendorContractControls/VendorAssociateControls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-busi-assoc-modal',
  templateUrl: './vendor-busi-assoc-modal.component.html'
})
export class VendorBusiAssocModalComponent implements OnInit {

  companyCode: number;
  BusiAssocForm: UntypedFormGroup;
  ContractBusiAssocControls: VendorAssociateControls;
  jsonControlArray: any;
  rateTypeName: any;
  rateTypestatus: any;
  cityName: any;
  citystatus: any;
  modeName: any;
  modestatus: any;
  operationName: any;
  operationstatus: any;
  CurrentContractDetails: any;

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,
    private objPinCodeService: PinCodeService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<VendorBusiAssocModalComponent>,
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
    this.getDropDownData();
    this.initializeFormControl();

    // console.log(this.objResult);
  }
 
  //#region to get location list
  async getLocation() {
    await this.objPinCodeService.getCity(
      this.BusiAssocForm, this.jsonControlArray, this.cityName, this.citystatus
    );
  }
  //#endregion

  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const collectionName = "vendor_contract_ba";

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
        console.log(updateRequest);

        const updateResponse = await this.masterService.masterPut("generic/update", updateRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Business Associate",
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
        console.log(createRequest);

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();

        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Created Business Associate",
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
      cT: this.BusiAssocForm.value.city.value,
      mDID: this.BusiAssocForm.value.mode.value,
      mDNM: this.BusiAssocForm.value.mode.name,
      oPID: this.BusiAssocForm.value.operation.value,
      oPNM: this.BusiAssocForm.value.operation.name,
      rTID: this.BusiAssocForm.value.rateType.value,
      rTNM: this.BusiAssocForm.value.rateType.name,
      mIN: parseInt(this.BusiAssocForm.value.min),
      rT: parseInt(this.BusiAssocForm.value.rate),
      mAX: parseInt(this.BusiAssocForm.value.max),
      uPDT: new Date(),
      uPBY: this.BusiAssocForm.value.upBY,
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
    const lastVendorCode = lastContract ? parseInt(lastContract.vcbaID.substring(4), 10) : 0;
    return `Vcba${(lastVendorCode + 1).toString().padStart(5, '0')}`;
  }

  prepareContractData(newVendorCode: string) {
    // Prepare data for creating a new contract
    return {
      _id: this.companyCode + "-" + newVendorCode,
      vcbaID: newVendorCode,
      cID: this.companyCode,
      cNID:this.CurrentContractDetails.cNID,
      cT: this.BusiAssocForm.value.city.value,
      mDID: this.BusiAssocForm.value.mode.value,
      mDNM: this.BusiAssocForm.value.mode.name,
      oPID: this.BusiAssocForm.value.operation.value,
      oPNM: this.BusiAssocForm.value.operation.name,
      rTID: this.BusiAssocForm.value.rateType.value,
      rTNM: this.BusiAssocForm.value.rateType.name,
      mIN: parseInt(this.BusiAssocForm.value.min),
      rT: parseInt(this.BusiAssocForm.value.rate),
      mAX: parseInt(this.BusiAssocForm.value.max),
      eDT: new Date(),
      eNBY: this.BusiAssocForm.value.ENBY,
    };
  }
  //#endregion
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
  //#endregion
  //#region to initialize form control
  async initializeFormControl() {
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
      this.BusiAssocForm.controls['min'].setValue(this.objResult.Details.mIN);
      this.BusiAssocForm.controls['max'].setValue(this.objResult.Details.mAX);
      this.BusiAssocForm.controls['rate'].setValue(this.objResult.Details.rT);
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
    const operationDropdown = await PayBasisdetailFromApi(this.masterService, 'OPT')
    const modeDropdown = await productdetailFromApi(this.masterService)
    // Check if Details is present in objResult
    if (this.objResult.Details) {
      const pincodeBody = {
        "companyCode": this.companyCode,
        "collectionName": "pincode_master",
        "filter": {}
      }

      const pincodeResponse = await this.masterService.masterPost("generic/get", pincodeBody).toPromise();
      const pincodeData = pincodeResponse.data
        .map((element) => ({
          name: element.CT,
          value: element.CT,
        }));
      const updatedData = pincodeData.find((x) => x.name == this.objResult.Details.cT);
      this.BusiAssocForm.controls.city.setValue(updatedData);
      // Update operation dropdown based on Details.operation
      const updateOperation = operationDropdown.find(item => item.name === this.objResult.Details.oPNM);
      this.BusiAssocForm.controls.operation.setValue(updateOperation);

      // Update rateType dropdown based on Details.rateType
      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rTNM);
      this.BusiAssocForm.controls.rateType.setValue(updaterateType);

      // Update mode dropdown based on Details.mode
      const updatemode = modeDropdown.find(item => item.name === this.objResult.Details.mDNM);
      this.BusiAssocForm.controls.mode.setValue(updatemode);
    }


    // Filter and update rateType dropdown in the UI
    this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);

    // Filter and update mode dropdown in the UI
    this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, modeDropdown, this.modeName, this.modestatus);

    // Filter and update operation dropdown in the UI
    this.filter.Filter(this.jsonControlArray, this.BusiAssocForm, operationDropdown, this.operationName, this.operationstatus);
    // Filter and update operation dropdown in the UI

  }
  //#endregion
  //#region to Validate the minimum and maximum charge values in the BusiAssocForm.
  validateMinCharge() {
    // Get the current values of 'min' and 'max' from the BusiAssocForm
    const minValue = this.BusiAssocForm.get('min')?.value;
    const maxValue = this.BusiAssocForm.get('max')?.value;

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

      // Reset the values of 'min' and 'max' in the BusiAssocForm to an empty string
      this.BusiAssocForm.patchValue({
        min: '',
        max: ''
      });
    }
  }
  //#endregion
}