import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { getShortName } from "src/app/Utility/commonFunction/random/generateRandomNumber";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AddressMaster } from "src/app/core/models/Masters/address-master";
import { AddressControl } from "src/assets/FormControls/address-master";
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
@Component({
  selector: 'app-address-master-add',
  templateUrl: './address-master-add.component.html',
})
export class AddressMasterAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  countryCode: any;
  action: string;
  isUpdate = false;
  addressTabledata: AddressMaster;
  addressTableForm: UntypedFormGroup;
  addressFormControls: AddressControl;
  jsonControlGroupArray: any;
  pincodeList: any;
  pincodeStatus: any;
  cityList: string;
  cityStatus: boolean;

  // savedData: CustomerGroupMaster;
  ngOnInit() {
    this.getPincodeData();
    this.getCityData();
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService,private filter: FilterUtils,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.countryCode = this.data.countryName;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.addressTabledata = this.data;
      this.breadScrums = [
        {
          title: "Address Master",
          items: ["Home"],
          active: "Edit Address Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Address Master",
          items: ["Home"],
          active: "Add Address Master",
        },
      ];
      this.addressTabledata = new AddressMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.addressFormControls = new AddressControl(this.addressTabledata, this.isUpdate);
    this.jsonControlGroupArray = this.addressFormControls.getFormControls();
    this.jsonControlGroupArray.forEach(data => {
      if (data.name === 'pincode') {
          // Set Pincode category-related variables
          this.pincodeList = data.name;
          this.pincodeStatus = data.additionalData.showNameAndValue;
      }
      if (data.name === 'cityName') {
        // Set Pincode category-related variables
        this.cityList = data.name;
        this.cityStatus = data.additionalData.showNameAndValue;
    }
  });
    this.addressTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  getPincodeData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "pincode_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Assuming the API response contains an array named 'pincodeList'
        const pincodeList = res.data;
        let pincode = pincodeList
          .filter(element => element.pincode != null && element.pincode !== '') // Filter out items with null and empty 'name' values
          .map(element => {
            let pincodeValue = element.pincode;
            if (typeof pincodeValue === 'object') {
              // If 'pincodeValue' is an object, extract the specific property representing the 'pincode' value
              pincodeValue = pincodeValue.name; // Replace 'name' with the correct property name representing the 'pincode' value
            }
            return { name: String(pincodeValue), value: String(pincodeValue) }; // Convert the 'pincode' value to a string
          });
          this.filter.Filter(
          this.jsonControlGroupArray,
          this.addressTableForm,
          pincode,
          this.pincodeList,
          this.pincodeStatus
        );
      }
    });
  }
  getCityData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "city_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Assuming the API response contains an array named 'pincodeList'
        const cityList = res.data;
        let city = cityList
          .filter(element => element.cityName != null && element.cityName !== '') // Filter out items with null and empty 'name' values
          .map(element => {
            let cityValue = element.cityName;
            if (typeof cityValue === 'object') {
              // If 'cityValue' is an object, extract the specific property representing the 'pincode' value
              cityValue = cityValue.name; // Replace 'name' with the correct property name representing the 'pincode' value
            }
            return { name: String(cityValue), value: String(cityValue) }; // Convert the 'pincode' value to a string
          });
          // if (this.isUpdate) {
          //   var filter = [];
          //   this.data.cityName.forEach(item => {
          //     filter.push(city.find(element => element.value == item));
          //   });
          // }
          this.filter.Filter(
          this.jsonControlGroupArray,
          this.addressTableForm,
          city,
          this.cityList,
          this.cityStatus
        );
      }
    });
  }
  save() {
    this.addressTableForm.controls["pincode"].setValue(this.addressTableForm.value.pincode);
    this.addressTableForm.controls["cityName"].setValue(this.addressTableForm.value.cityName.name);
    this.addressTableForm.controls["activeFlag"].setValue(this.addressTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.addressTableForm.value.id;
      this.addressTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "address",
        id: id,
        updates: this.addressTableForm.value
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
            this.Route.navigateByUrl('/Masters/AddressMaster/AddressMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.addressTableForm.value.manualCode);
      this.addressTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "address",
        data: this.addressTableForm.value
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
            this.Route.navigateByUrl('/Masters/AddressMaster/AddressMasterList');
          }
        }
      });
    }
  }
}