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
  constructor(private Route: Router, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder, private filter: FilterUtils,
     private masterService: MasterService) {
    //super();
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
    });
  }
  cancel() {
    window.history.back();
    this.Route.navigateByUrl("/Masters/CustomerMaster/CustomerMasterList");
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const {
        groupCodeDropdown,
        serviceOptedDropdown,
        payBasisDropdown,
        ownershipDropdown,
        locationDropdown
      } = res;
      
      this.groupCodeData = groupCodeDropdown;
      this.serviceOptedFor = serviceOptedDropdown;
      this.payBasisData = payBasisDropdown;
      this.ownershipData = ownershipDropdown;
      this.locationData = locationDropdown;
      
      if (this.isUpdate) {
        this.groupCodedet = this.findDropdownItemByName(this.groupCodeData, this.customerTable.groupCode);
        this.customerTableForm.controls.groupCode.setValue(this.groupCodedet);
        
        this.serviceOpted = this.findDropdownItemByName(this.serviceOptedFor, this.customerTable.serviceOptedFor);
        this.customerTableForm.controls.serviceOpted.setValue(this.serviceOpted);
        
        this.payBasisDet = this.findDropdownItemByName(this.payBasisData, this.customerTable.payBasis);
        this.customerTableForm.controls.payBasis.setValue(this.payBasisDet);
        
        this.nonOdaDet = this.findDropdownItemByName(this.locationData, this.customerTable.nonOda);
        this.customerTableForm.controls.nonOda.setValue(this.nonOdaDet);
        
        this.controllingDet = this.findDropdownItemByName(this.locationData, this.customerTable.customerControllingLocation);
        this.customerTableForm.controls.customerControllingLocation.setValue(this.controllingDet);
        
        this.locationDet = this.findDropdownItemByName(this.locationData, this.customerTable.customerLocation);
        this.customerTableForm.controls.customerLocation.setValue(this.locationDet);
        
        this.ownerShipDet = this.findDropdownItemByName(this.ownershipData, this.customerTable.ownership);
        this.customerTableForm.controls.ownership.setValue(this.ownerShipDet);
      }
      const filterParams = [
        [this.jsonControlCustomerArray, this.groupCodeData, this.gCode, this.codeStatus],
        [this.jsonControlBillKycArray, this.serviceOptedFor, this.serviceOpt, this.serviceOptStatus],
        [this.jsonControlBillKycArray, this.payBasisData, this.pay, this.payStatus],
        [this.jsonControlCustomerArray, this.locationData, this.location, this.locationStatus],
        [this.jsonControlCustomerArray, this.locationData, this.controlling, this.controllingStatus],
        [this.jsonControlCustomerArray, this.locationData, this.nonOda, this.noOdaStatus],
        [this.jsonControlCustomerArray, this.ownershipData, this.ownership, this.ownershipStatus]
      ];
      filterParams.forEach(([jsonControlArray, dropdownData, formControl, statusControl]) => {
        this.filter.Filter(jsonControlArray, this.customerTableForm, dropdownData, formControl, statusControl);
      });
    });
  }
  findDropdownItemByName(dropdownData, name) {
    return dropdownData.find(item => item.name === name);
  }
  save() {
    const formValue = this.customerTableForm.value;
      const controlNames = [
        "groupCode",
        "customerLocation",
        "ownership",
        "customerControllingLocation",
        "nonOda",
        "serviceOpted",
        "payBasis",
        "activeFlag"
      ];
      controlNames.forEach(controlName => {
        const controlValue = formValue[controlName]?.value;
        this.customerTableForm.controls[controlName].setValue(controlValue);
      });
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
            data: this.customerTableForm.value
        };
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
        this.customerTableForm.controls["customerCode"].setValue(randomNumber);
        this.customerTableForm.controls["id"].setValue(randomNumber);
        let req = {
            companyCode: this.companyCode,
            type: "masters",
            collection: "customer_detail",
            data: this.customerTableForm.value
        };
        this.masterService.masterPost('common/create', req).subscribe({
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
    }
}
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
}