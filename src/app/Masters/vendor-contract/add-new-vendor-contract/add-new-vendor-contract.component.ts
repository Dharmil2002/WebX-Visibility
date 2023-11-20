import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorService } from 'src/app/Utility/module/masters/vendor-master/vendor.service';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/add-contract-profile';
import { productdetailFromApi } from '../../Customer Contract/CustomerContractAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { getContractList } from '../vendorContractApiUtility';
import { financialYear } from 'src/app/Utility/date/date-utils';

@Component({
  selector: 'app-add-new-vendor-contract',
  templateUrl: './add-new-vendor-contract.component.html'
})
export class AddNewVendorContractComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  VendorBasicInformationControls: AddContractProfile;
  jsonControlArray: any;
  vendorContractForm: UntypedFormGroup;
  vendorName: any;
  vendorStatus: any;
  breadscrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any; }[];
  constructor(private fb: UntypedFormBuilder,
    private route: Router,
    private objVendorService: VendorService,
    private filter: FilterUtils,
    private masterService: MasterService,
  ) {
    this.breadscrums = [
      {
        title: 'Add New Vendor Contract',
        items: ['Home'],
        active: 'AddNewVendorContract',
        generatecontrol: true,
        toggle: false
      },
    ];
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.getVendorList();
  }
  //#region to initialize form control
  initializeFormControl() {
    // Create the 'VendorBasicInformationControls' using 'AddContractProfile' with 'data'
    const vendorBasicInformationControls = new AddContractProfile('');

    // Get the array of form controls from 'VendorBasicInformationControls'
    this.jsonControlArray = vendorBasicInformationControls.getAddnewVendorContractControls();

    // Create the 'ProductsForm' using 'formGroupBuilder' with 'jsonControlArray'
    this.vendorContractForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    // Find the 'vendor' control in the form control array and set related properties
    const vendorControl = this.jsonControlArray.find(control => control.name === 'VNID');

    // Store the name of the 'vendor' control
    this.vendorName = vendorControl.name;

    // Store the showNameAndValue property
    this.vendorStatus = vendorControl.additionalData.showNameAndValue;
  }
  //#endregion 
  //#region functionCallHandler
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
  //#endregion
  //#region of cancel function
  cancel() {
    this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
  }
  //#endregion
  //#region to save new Vendor contract
  async save() {
    try {
      // Clear validators and validate the form
      clearValidatorsAndValidate(this.vendorContractForm);

      const existingVendorContracts = await getContractList(this.masterService);

      if (existingVendorContracts) {
        // Generate a new vendor code
        const lastContract = existingVendorContracts[existingVendorContracts.length - 1];
        const lastVendorCode = lastContract ? parseInt(lastContract.cNID.substring(2), 10) : 0;

        const newVendorCode = `VT${(lastVendorCode + 1).toString().padStart(5, '0')}`;

        const data = {
          "_id": newVendorCode,
          "cNID": newVendorCode,
          'cID': this.companyCode,
          "fnYr": parseInt(financialYear),
          "vNID": this.vendorContractForm.value.VNID.value,
          "vNNM": this.vendorContractForm.value.VNID.name,
          "pDTID": this.vendorContractForm.value.PDTID.value,
          "pDTNM": this.vendorContractForm.value.PDTID.name,
          "cNSDT": this.vendorContractForm.value.CNSDT,
          "eNDDT": this.vendorContractForm.value.ENDDT,
          "aCTV": this.vendorContractForm.value.ACTV,
          "eDT": new Date(),
          "eNBY": this.vendorContractForm.value.ENBY
        }
        // Prepare request for creating a new vendor contract
        const createVendorContractRequest = {
          companyCode: this.companyCode,
          collectionName: "vendor_contract",
          data: data,
        };

        // Create a new vendor contract
        const createResponse = await this.masterService.masterPost("generic/create", createVendorContractRequest).toPromise();

        if (createResponse) {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Success",
            text: 'Contract Created Successfully',
            showConfirmButton: true,
          });

          // Navigate to the vendor contract list page
          this.route.navigateByUrl('/Masters/VendorContract/VendorContractList');
        }
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }
  //#endregion
  //#region to get vendor List
  async getVendorList() {
    // Fetch the vendor list using the 'objVendorService' service
    const vendorList = await this.objVendorService.getVendorDetail('');

    // Filter the vendor list based on the 'isActive' property
    const vendor = vendorList
      .filter((item) => item.isActive && item.vendorType.toUpperCase() === 'ATTACHED') // Filter based on the isActive property
      .map(e => ({
        name: e.vendorName, // Map the name to the specified nameKey
        value: e.vendorCode // Map the value to the specified valueKey
      }));

    // Call the 'Filter' function with the filtered 'vendor' array and other parameters
    this.filter.Filter(this.jsonControlArray, this.vendorContractForm, vendor, this.vendorName, this.vendorStatus);
    const productdetail = await productdetailFromApi(this.masterService)
    this.filter.Filter(
      this.jsonControlArray,
      this.vendorContractForm,
      productdetail,
      "PDTID",
      false
    );
  }
  //#endregion
  //#region to set active flag value
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.vendorContractForm.controls['ACTV'].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#endregion
  //#region to check existing vendor 
  async checkValueExists() {
    try {
      // Get the field value from the form controls
      const fieldValue = this.vendorContractForm.controls['VNID'].value.value;

      // Send the request to fetch user data
      const userlist = await getContractList(this.masterService, 'vNID', fieldValue);
      // Check if data exists for the given filter criteria
      if (userlist.length > 0) {
        // Show an error message using Swal (SweetAlert)
        Swal.fire({
          text: ` This Vendor already exists! Please try with another !`,
          icon: "error",
          title: 'error',
          showConfirmButton: true,
        });
        // Reset the input field
        this.vendorContractForm.controls['VNID'].reset();
        this.getVendorList();
      }
    }
    catch (error) {
      // Handle errors that may occur during the operation
      console.error(`An error occurred while fetching ${'VNID'} details:`, error);
    }
  }
  //#endregion
}