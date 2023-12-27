import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { EncryptionService } from 'src/app/core/service/encryptionService.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TERCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-lhftrmodal',
  templateUrl: './vendor-lhftrmodal.component.html'
})
export class VendorLHFTRModalComponent implements OnInit {
  companyCode: number;
  TLHFTRForm: UntypedFormGroup;
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
    public dialogRef: MatDialogRef<VendorLHFTRModalComponent>,
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
    this.getRouteList();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
    this.existRouteList = this.objResult.TERList;
  }
  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const collectionName = "vendor_contract_lhft_rt";
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
          text: "Updated Long Haul Full Truck- Route Based",
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
          text: "Created Long Haul Full Truck- Route Based",
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
      rTID: this.TLHFTRForm.value.route.value,
      rTNM: this.TLHFTRForm.value.route.name,
      cPCTID: this.TLHFTRForm.value.capacity.value,
      cPCTNM: this.TLHFTRForm.value.capacity.name,
      rTTID: this.TLHFTRForm.value.rateType.value,
      rTTNM: this.TLHFTRForm.value.rateType.name,
      rT: parseFloat(this.TLHFTRForm.value.rate),
      mIN: parseFloat(this.TLHFTRForm.value.min),
      mAX: parseFloat(this.TLHFTRForm.value.max),
      mODLOC: localStorage.getItem("Branch"),
      mODDT: new Date(),
      mODBY: this.TLHFTRForm.value.upBY,
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
      rTID: this.TLHFTRForm.value.route.value,
      rTNM: this.TLHFTRForm.value.route.name,
      cPCTID: this.TLHFTRForm.value.capacity.value,
      cPCTNM: this.TLHFTRForm.value.capacity.name,
      rTTID: this.TLHFTRForm.value.rateType.value,
      rTTNM: this.TLHFTRForm.value.rateType.name,
      rT: parseFloat(this.TLHFTRForm.value.rate),
      mIN: parseFloat(this.TLHFTRForm.value.min),
      mAX: parseFloat(this.TLHFTRForm.value.max),
      eNTBY: this.TLHFTRForm.value.ENBY,
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

  //#region to initialize form control
  initializeFormControl() {
    this.ContractTLHLControls = new TERCharges(this.data);
    this.jsonControlArray = this.ContractTLHLControls.getTERChargesArrayControls();
    this.TLHFTRForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
      this.TLHFTRForm.controls['rate'].setValue(this.objResult.Details.rT);
      this.TLHFTRForm.controls['min'].setValue(this.objResult.Details.mIN);
      this.TLHFTRForm.controls['max'].setValue(this.objResult.Details.mAX);
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
      this.TLHFTRForm.controls.route.setValue(updatedRoute);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHFTRForm, routeList, this.routeName, this.routestatus);
  }
  //#endregion

  //#region to get rateType list
  async getDropDownData() {
    const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP')
    const containerData = await this.objContainerService.getContainerList();
    const vehicleData = await this.objGeneralService.getGeneralMasterData("VEHSIZE");

    // Merge containerData and vehicleData into a single array
    const mergedData = [...containerData, ...vehicleData];

    if (this.objResult.Details) {
      const updatedData = containerData.find((x) => x.name == this.objResult.Details.cPCTNM);
      this.TLHFTRForm.controls.capacity.setValue(updatedData);

      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rTTNM);
      this.TLHFTRForm.controls.rateType.setValue(updaterateType);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHFTRForm, mergedData, this.capacityName, this.capacitystatus);
    this.filter.Filter(this.jsonControlArray, this.TLHFTRForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
  }
  //#endregion
  //#region to Validate the minimum and maximum charge values in the TLHFTRForm.
  validateMinCharge() {
    // Get the current values of 'min' and 'max' from the TLHFTRForm
    const minValue = parseFloat(this.TLHFTRForm.get('min')?.value);
    const maxValue = parseFloat(this.TLHFTRForm.get('max')?.value);
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

      // Reset the values of 'min' and 'max' in the TLHFTRForm to an empty string
      this.TLHFTRForm.patchValue({
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
      this.existRouteList.forEach(tableEntry => {
        const tablekey = `${tableEntry['rTNM']}-${tableEntry['cPCTNM']}`;
        uniqueEntries.add(tablekey);
      });

      // Get the field values from the form controls
      const routeValue = this.TLHFTRForm.controls['route'].value.name;
      const capacityValue = this.TLHFTRForm.controls['capacity'].value.name;

      // Create a key for the current form input
      const key = `${routeValue}-${capacityValue}`;

      // Check if the input key already exists in the uniqueEntries set
      const isDuplicate = uniqueEntries.has(key);

      // Check if data exists for the given filter criteria
      if (isDuplicate) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: `Route: ${routeValue} with Capacity: ${capacityValue} already exists in Express Route! Please try another combination.`,
          icon: "error",
          title: 'Error',
          showConfirmButton: true,
        });

        // Reset the input field
        this.TLHFTRForm.controls['route'].reset();
        this.TLHFTRForm.controls['capacity'].reset();

        // Refresh the route list
        this.getRouteList();
        this.getDropDownData();
      }
    } catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while checking for duplicate values:`, error);
    }
  }
  //#endregion
}
