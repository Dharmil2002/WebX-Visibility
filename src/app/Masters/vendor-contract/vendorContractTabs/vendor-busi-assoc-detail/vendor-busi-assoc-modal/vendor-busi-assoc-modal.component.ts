import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayBasisdetailFromApi, productdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
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
  rateTypestatus: boolean;
  cityName: any;
  citystatus: any;
  modeName: any;
  modestatus: boolean;
  operationName: any;
  operationstatus: boolean;
  CurrentContractDetails: any;
  existCityList: any;
  payBasisName: any;
  payBasisstatus: boolean;
  locationName: any;
  locationStatus: boolean;
  submit = 'Save';

  constructor(private route: ActivatedRoute, private encryptionService: EncryptionService,
    private objPinCodeService: PinCodeService,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objLocationService: LocationService,
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
    this.existCityList = this.objResult.List;
    // console.log(this.objResult);
  }

  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const collectionName = "vendor_contract_ba";
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
        // console.log(updateRequest);

        const updateResponse = await this.masterService.masterPut("generic/update", updateRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Business Associate",
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
        // console.log(createRequest);

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
      // cT: this.BusiAssocForm.value.city.value,
      mDID: this.BusiAssocForm.value.mode.value,
      mDNM: this.BusiAssocForm.value.mode.name,
      oPID: this.BusiAssocForm.value.operation.value,
      oPNM: this.BusiAssocForm.value.operation.name,
      rTID: this.BusiAssocForm.value.rateType.value,
      rTNM: this.BusiAssocForm.value.rateType.name,
      lOCID: this.BusiAssocForm.value.location.value,
      lOCNM: this.BusiAssocForm.value.location.name,
      mIN: parseFloat(this.BusiAssocForm.value.min),
      rT: parseFloat(this.BusiAssocForm.value.rate),
      mAX: parseFloat(this.BusiAssocForm.value.max),
      mODLOC: localStorage.getItem("Branch"),
      mODDT: new Date(),
      mODBY: this.BusiAssocForm.value.uPBY,
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
      mDID: this.BusiAssocForm.value.mode.value,
      mDNM: this.BusiAssocForm.value.mode.name,
      oPID: this.BusiAssocForm.value.operation.value,
      oPNM: this.BusiAssocForm.value.operation.name,
      rTID: this.BusiAssocForm.value.rateType.value,
      rTNM: this.BusiAssocForm.value.rateType.name,
      pBSID: this.BusiAssocForm.value.PayBasis.value,
      pBSNM: this.BusiAssocForm.value.PayBasis.name,
      lOCID: this.BusiAssocForm.value.location.value,
      lOCNM: this.BusiAssocForm.value.location.name,
      mIN: parseFloat(this.BusiAssocForm.value.min),
      rT: parseFloat(this.BusiAssocForm.value.rate),
      mAX: parseFloat(this.BusiAssocForm.value.max),
      eNTBY: this.BusiAssocForm.value.eNBY,
      eNTLOC: localStorage.getItem("Branch"),
      eNTDT: new Date(),
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
      if (element.name === 'PayBasis') {
        this.payBasisName = element.name,
          this.payBasisstatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'location') {
        this.locationName = element.name,
          this.locationStatus = element.additionalData.showNameAndValue
      }
    });
    if (this.objResult.Details) {
      this.BusiAssocForm.controls['min'].setValue(this.objResult.Details.mIN);
      this.BusiAssocForm.controls['max'].setValue(this.objResult.Details.mAX);
      this.BusiAssocForm.controls['rate'].setValue(this.objResult.Details.rT);
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
    try {
      const [locationList, rateTypeDropDown, operationDropdown, payBasisDropdown, modeDropdown] = await Promise.all([
        this.objLocationService.getLocationList(),
        PayBasisdetailFromApi(this.masterService, 'RTTYP'),
        PayBasisdetailFromApi(this.masterService, 'OPT'),
        PayBasisdetailFromApi(this.masterService, 'PAYTYP'),
        productdetailFromApi(this.masterService)
      ]);

      // Check if Details is present in objResult
      if (this.objResult.Details) {
        // Helper function to update dropdown values based on Details
        const updateDropdownValue = (formControl, dropdownData, detailName) => {
          const updateValue = dropdownData.find(item => item.name === this.objResult.Details[detailName]);
          formControl.setValue(updateValue);
        };

        // Update form controls based on Details
        updateDropdownValue(this.BusiAssocForm.controls.operation, operationDropdown, 'oPNM');
        updateDropdownValue(this.BusiAssocForm.controls.rateType, rateTypeDropDown, 'rTNM');
        updateDropdownValue(this.BusiAssocForm.controls.mode, modeDropdown, 'mDNM');
        updateDropdownValue(this.BusiAssocForm.controls.PayBasis, payBasisDropdown, 'pBSNM');
        updateDropdownValue(this.BusiAssocForm.controls.location, locationList, 'lOCNM');
      }

      // Helper function to filter and update dropdown in the UI
      const filterAndUpdateDropdown = (formControl, dropdownData, controlName, controlStatus) => {
        this.filter.Filter(this.jsonControlArray, formControl, dropdownData, controlName, controlStatus);
      };

      // Filter and update rateType dropdown in the UI
      filterAndUpdateDropdown(this.BusiAssocForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);

      // Filter and update mode dropdown in the UI
      filterAndUpdateDropdown(this.BusiAssocForm, modeDropdown, this.modeName, this.modestatus);

      // Filter and update operation dropdown in the UI
      filterAndUpdateDropdown(this.BusiAssocForm, operationDropdown, this.operationName, this.operationstatus);

      // Filter and update payBasis dropdown in the UI
      filterAndUpdateDropdown(this.BusiAssocForm, payBasisDropdown, this.payBasisName, this.payBasisstatus);

      // Filter and update location dropdown in the UI
      filterAndUpdateDropdown(this.BusiAssocForm, locationList, this.locationName, this.locationStatus);

    } catch (error) {
      // Handle errors that may occur during the operation
      console.error('An error occurred in getDropDownData:', error);
    }
  }
  //#endregion
  //#region to Validate the minimum and maximum charge values in the BusiAssocForm.
  validateMinCharge() {
    // Get the current values of 'min' and 'max' from the BusiAssocForm
    const minValue = parseFloat(this.BusiAssocForm.get('min')?.value);
    const maxValue = parseFloat(this.BusiAssocForm.get('max')?.value);

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
  //#region to check existing location 
  async checkValueExists() {
    try {
      // Set to store unique combinations of Route and Capacity from existRouteList
      const uniqueEntries = new Set();

      // Extract values from existRouteList using provided keys and create unique key
      this.existCityList.forEach(tableEntry => {
        const tablekey = `${tableEntry['lOCNM']}-${tableEntry['pBSNM']}`;
        uniqueEntries.add(tablekey);
      });

      // Get the field value from the form controls
      const locationValue = this.BusiAssocForm.controls['location'].value.name;
      const paybasisValue = this.BusiAssocForm.controls['PayBasis'].value.name;

      // Create a key for the current form input
      const key = `${locationValue}-${paybasisValue}`;

      // Check if the input key already exists in the uniqueEntries set
      const isDuplicate = uniqueEntries.has(key);

      // Check if data exists for the given filter criteria
      if (isDuplicate) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: `Control Location: ${locationValue} with PayBasis: ${paybasisValue} already exists in Business Associate! Please try with another!`,
          icon: "error",
          title: 'Error',
          showConfirmButton: true,
        });

        // Reset the input field
        this.BusiAssocForm.controls['location'].reset();
        this.BusiAssocForm.controls['PayBasis'].reset();
        this.getDropDownData();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching 'city' details:`, error);
    }
  }
  //#endregion
}