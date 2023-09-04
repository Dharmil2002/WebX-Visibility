import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { customerControl } from 'src/assets/FormControls/customer-master';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from '@angular/router';
import { customerModel } from 'src/app/core/models/Masters/customerMaster';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';

@Component({
  selector: 'app-customer-master-add',
  templateUrl: './customer-master-add.component.html',
})
export class CustomerMasterAddComponent implements OnInit {
  customerTableForm: UntypedFormGroup;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  //#region Variable declaration
  error: string
  isUpdate = false;
  action: any;
  groupCodeData: any;
  gCode: any;
  codeStatus: any;
  ownership: any;
  ownershipStatus: any;
  location: any;
  locationStatus: any;
  nonOda: any;
  noOdaStatus: any;
  controlling: any;
  controllingStatus: any;
  pay: any;
  payStatus: any;
  serviceOpt: any;
  serviceOptStatus: any
  serviceOpted: any;
  serviceOptedFor: any;
  payBasis: any;
  ownerShip: any;
  locationData: any;
  customerTable: customerModel;
  customerFormControls: customerControl;
  jsonControlCustomerArray: any;
  jsonControlBillKycArray: any;
  accordionData: any
  breadScrums: { title: string; items: string[]; active: string; }[];
  groupCode: any;
  groupCodedet: any;
  payBasisData: any;
  payBasisDet: any;
  nonOdaDet: any;
  controllingDet: any;
  locationDet: any;
  ownerShipDet: any;
  ownershipData: any;
  locData: any;
  cityLocDet: any;
  pincodeDet: any;
  cityBill: string;
  cityBillStatus: boolean;
  pincodeBill: string;
  pincodeBillStatus: boolean;
  pincodeData: string;
  pincodeDataStatus: boolean;
  cityData: string;
  cityDataStatus: boolean;
  stateData: any;
  stateLoc: any;
  stateLocStatus: any;
  //#endregion

  constructor(private Route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder, private filter: FilterUtils,
    private masterService: MasterService) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.customerTable = Route.getCurrentNavigation().extras.state.data;
      this.isUpdate = true;
      this.action = 'edit'
    } else {
      this.action = 'Add'
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Customer Master",
          items: ["Masters"],
          active: "Edit Customer",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Customer Master",
          items: ["Masters"],
          active: "Add Customer",
        },
      ];
      this.customerTable = new customerModel({})
    }
    this.initializeFormControl()
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    const customerFormControls = new customerControl(this.customerTable, this.isUpdate);
    this.jsonControlCustomerArray = customerFormControls.getFormControlsC();
    this.jsonControlBillKycArray = customerFormControls.getFormControlB();
    // Build the accordion data with section names as keys and corresponding form controls as values
    this.accordionData = {
      "Customer Details": this.jsonControlCustomerArray,
      "Bill and KYC Details": this.jsonControlBillKycArray,
    };
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.customerTableForm = formGroupBuilder(this.fb, Object.values(this.accordionData));
  }
  //#endregion

  ngOnInit(): void {
    this.bindDropdown();
    this.getDropDownData();
    this.getLocation();
    this.getAllMastersData();
  }


  bindDropdown() {
    this.jsonControlCustomerArray.forEach(data => {
      if (data.name === 'groupCode') {
        // Set location-related variables
        this.gCode = data.name;
        this.codeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'ownership') {
        // Set category-related variables
        this.ownership = data.name;
        this.ownershipStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'customerLocation') {
        // Set category-related variables
        this.location = data.name;
        this.locationStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'customerControllingLocation') {
        // Set category-related variables
        this.controlling = data.name;
        this.controllingStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'nonOda') {
        // Set category-related variables
        this.nonOda = data.name;
        this.noOdaStatus = data.additionalData.showNameAndValue;
      }
    });
    this.jsonControlBillKycArray.forEach(data => {
      if (data.name === 'payBasis') {
        // Set location-related variables
        this.pay = data.name;
        this.payStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'serviceOpted') {
        // Set category-related variables
        this.serviceOpt = data.name;
        this.serviceOptStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'billPincode') {
        // Set category-related variables
        this.pincodeBill = data.name;
        this.pincodeBillStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'pincode') {
        // Set category-related variables
        this.pincodeData = data.name;
        this.pincodeDataStatus = data.additionalData.showNameAndValue;
      }

    });
  }
  cancel() {
    this.Route.navigateByUrl("/Masters/CustomerMaster/CustomerMasterList");
  }

  //#region Dropdown through Json
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        groupCodeDropdown,
        serviceOptedDropdown,
        payBasisDropdown,
        ownershipDropdown
      } = res;

      this.groupCodeData = groupCodeDropdown;
      this.serviceOptedFor = serviceOptedDropdown;
      this.payBasisData = payBasisDropdown;
      this.ownershipData = ownershipDropdown;

      if (this.isUpdate) {
        this.groupCodedet = this.findDropdownItemByName(this.groupCodeData, this.customerTable.groupCode);
        this.customerTableForm.controls.groupCode.setValue(this.groupCodedet);

        this.customerTableForm.controls["serviceOptedDropdown"].patchValue(this.serviceOptedFor.filter((element) =>
          this.customerTable.serviceOpted.includes(element.name)))

        this.customerTableForm.controls["payBasisDropdown"].patchValue(this.payBasisData.filter((element) =>
          this.customerTable.payBasis.includes(element.name)))

        this.ownerShipDet = this.findDropdownItemByName(this.ownershipData, this.customerTable.ownership);
        this.customerTableForm.controls.ownership.setValue(this.ownerShipDet);
      }
      const filterParams = [
        [this.jsonControlCustomerArray, this.groupCodeData, this.gCode, this.codeStatus],
        [this.jsonControlBillKycArray, this.serviceOptedFor, this.serviceOpt, this.serviceOptStatus],
        [this.jsonControlBillKycArray, this.payBasisData, this.pay, this.payStatus],
        [this.jsonControlCustomerArray, this.ownershipData, this.ownership, this.ownershipStatus]
      ];
      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.customerTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  //#endregion

  //#region Location Dropdown
  getLocation() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "location_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const LocationList = res.data.map(element => ({
          name: element.locName,
          value: element.locCode
        }));
        if (this.isUpdate) {
          this.locData = LocationList.find((x) => x.name == this.customerTable.customerControllingLocation);
          this.customerTableForm.controls.customerControllingLocation.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.customerTable.nonOda);
          this.customerTableForm.controls.nonOda.setValue(this.locData);

          this.locData = LocationList.find((x) => x.name == this.customerTable.customerLocation);
          this.customerTableForm.controls.customerLocation.setValue(this.locData);
        }
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.customerTableForm,
          LocationList,
          this.controlling,
          this.controllingStatus
        );
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.customerTableForm,
          LocationList,
          this.nonOda,
          this.noOdaStatus
        );
        this.filter.Filter(
          this.jsonControlCustomerArray,
          this.customerTableForm,
          LocationList,
          this.location,
          this.locationStatus
        );

      }
    });
  }
  //#endregion

  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }

  //#region Save Data function
  save() {
    const formValue = this.customerTableForm.value;
    const controlNames = [
      "groupCode",
      "ownership",
      // "billCity",
      "billPincode",
      //"city",
      // "state",
      "pincode"
    ];
    controlNames.forEach(controlName => {
      const controlValue = formValue[controlName]?.name;
      this.customerTableForm.controls[controlName].setValue(controlValue);
    });
    const controllingDropdown = this.customerTableForm.value.controllingDropdown.map((item: any) => item.name);
    this.customerTableForm.controls["customerControllingLocation"].setValue(controllingDropdown);

    const locationDropdown = this.customerTableForm.value.locationDropdown.map((item: any) => item.name);
    this.customerTableForm.controls["customerLocation"].setValue(locationDropdown);

    const nonOdaDropdown = this.customerTableForm.value.nonOdaDropdown.map((item: any) => item.name);
    this.customerTableForm.controls["nonOda"].setValue(nonOdaDropdown);

    const payBasisDropdown = this.customerTableForm.value.payBasisDropdown.map((item: any) => item.name);
    this.customerTableForm.controls["payBasis"].setValue(payBasisDropdown);

    const serviceOptedDropdown = this.customerTableForm.value.serviceOptedDropdown.map((item: any) => item.name);
    this.customerTableForm.controls["serviceOpted"].setValue(serviceOptedDropdown);
    this.customerTableForm.controls["activeFlag"].setValue(this.customerTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.customerTableForm.value.id;
      // Remove the "id" field from the form controls
      this.customerTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "customer_detail",
        id: id,
        updates: this.customerTableForm.value
      };
      //API FOR UPDATE
      this.masterService.masterPut('common/update', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/CustomerMaster/CustomerMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.customerTableForm.value.groupCode);
      this.customerTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "customer_detail",
        data: this.customerTableForm.value
      };
      console.log(req);
      // this.masterService.masterPost('common/create', req).subscribe({
      //   next: (res: any) => {
      //     if (res) {
      //       // Display success message
      //       Swal.fire({
      //         icon: "success",
      //         title: "Successful",
      //         text: res.message,
      //         showConfirmButton: true,
      //       });
      //       this.Route.navigateByUrl('/Masters/CustomerMaster/CustomerMasterList');
      //     }
      //   }
      // });
    }
  }
  //#endregion

  dataExist() {
    let req = {
      companyCode: this.companyCode,
      type: "masters",
      collection: "customer_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Convert user-input stateAlias to lowercase
        const customerCodeExists = res.data.some((state) => state.customerCode === this.customerTableForm.value.customerCode
        );
        if (customerCodeExists) {
          // Show the popup indicating that the state already exists
          Swal.fire({
            title: 'Data exists! Please try with another',
            toast: true,
            icon: "error",
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "OK"
          });
          this.customerTableForm.controls["customerCode"].reset();

        }
      },
      error: (err: any) => {
        // Handle error if required
        console.error(err);
      }
    });

  }
  //#region Function Call Handler
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field;                   // the actual formControl instance
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

  // Get all dropdown data
  async getAllMastersData() {
    try {
      // Prepare the requests for different collections
      let pincodeReq = {
        "companyCode": parseInt(localStorage.getItem("companyCode")),
        "type": "masters",
        "collection": "pincode_detail"
      };

      const pincodeRes = await this.masterService.masterPost('common/getall', pincodeReq).toPromise();

      const mergedData = {
        pincodeData: pincodeRes?.data,
      };
      this.pincodeDet = mergedData.pincodeData;
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  }
  getPincodeData() {
    const pincodeValue = this.customerTableForm.controls['pincode'].value;
    if (!isNaN(pincodeValue)) { // Check if pincodeValue is a valid number
      const pincodeList = this.pincodeDet.map((x) => ({ name: parseInt(x.pincode), value: parseInt(x.pincode) }));
      const exactPincodeMatch = pincodeList.find(element => element.name === pincodeValue.value);
      if (!exactPincodeMatch) {
        if (pincodeValue.toString().length > 2) {
          const filteredPincodeDet = pincodeList.filter(element => element.name.toString().includes(pincodeValue));
          if (filteredPincodeDet.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
            return; // Exit the function
          } else {
            this.filter.Filter(
              this.jsonControlBillKycArray,
              this.customerTableForm,
              filteredPincodeDet,
              this.pincodeData,
              this.pincodeDataStatus
            );
          }
        }
      }
    }
  }
  //#endregion

  //#region Pincode Dropdown
  getBillingPincodeData() {
    const pincodeValue = this.customerTableForm.controls['billPincode'].value;

    if (!isNaN(pincodeValue)) { // Check if pincodeValue is a valid number
      const pincodeList = this.pincodeDet.map((x) => ({ name: parseInt(x.pincode), value: parseInt(x.pincode) }));

      const exactPincodeMatch = pincodeList.find(element => element.name === pincodeValue.value);

      if (!exactPincodeMatch) {
        if (pincodeValue.toString().length > 2) {
          const filteredPincodeDet = pincodeList.filter(element => element.name.toString().includes(pincodeValue));
          if (filteredPincodeDet.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
            return; // Exit the function
          } else {
            this.filter.Filter(
              this.jsonControlBillKycArray,
              this.customerTableForm,
              filteredPincodeDet,
              this.pincodeBill,
              this.pincodeBillStatus
            );
          }
        }
      }
    }
  }
  //#endregion
  setStateCityData() {
    const fetchData = this.pincodeDet.find(item => item.pincode == this.customerTableForm.controls.pincode.value.value)
    this.customerTableForm.controls.state.setValue(fetchData.state)
    this.customerTableForm.controls.city.setValue(fetchData.city)
  }
  setCityData() {
    const fetchData = this.pincodeDet.find(item => item.pincode == this.customerTableForm.controls.billPincode.value.value)
    this.customerTableForm.controls.billCity.setValue(fetchData.city)
  }
}