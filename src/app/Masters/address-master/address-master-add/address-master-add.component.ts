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
  addressTabledata: AddressMaster;
  addressTableForm: UntypedFormGroup;
  addressFormControls: AddressControl;
  //#region Variable Declaration
  jsonControlGroupArray: any;
  pincodeList: any;
  countryCode: any;
  pincodeStatus: any;
  cityList: any;
  cityStatus: any;
  stateList: any;
  stateStatus: any;
  LocLeval: any;
  cityData: any;
  stateData: any;
  pincodeData: any;
  isUpdate = false;
  action: string;
  //#endregion

  ngOnInit() {
    this.getPincodeData();
    this.getCityData();
    this.getStateData();
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
    private masterService: MasterService, private filter: FilterUtils,
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
    } else {
      this.addressTabledata = new AddressMaster({});
    }
    this.breadScrums = [
      {
        title: "Address Master",
        items: ["Home"],
        active: this.action === 'edit' ? "Edit Address Master" : "Add Address Master",
      },
    ];
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
      if (data.name === 'stateName') {
        // Set Pincode category-related variables
        this.stateList = data.name;
        this.stateStatus = data.additionalData.showNameAndValue;
      }
    });
    this.addressTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  //#region Pincode Dropdown
  getPincodeData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "pincode_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Assuming the API response contains an array named 'pincodeList'
        const pincodeList = res.data.map(element => ({
          name: element.pincode,
          value: element.pincode
        }));
        if (this.isUpdate) {
          this.pincodeData = pincodeList.find((x) => x.name == this.data.pincode);
          this.addressTableForm.controls.pincode.setValue(this.pincodeData);
        }
        this.filter.Filter(
          this.jsonControlGroupArray,
          this.addressTableForm,
          pincodeList,
          this.pincodeList,
          this.pincodeStatus
        );
      }
    });
  }
  //#endregion

  //#region City Dropdown
  getCityData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "city_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const cityList = res.data.map(element => ({
          name: element.cityName,
          value: element.id
        }));
        if (this.isUpdate) {
          this.cityData = cityList.find((x) => x.name == this.data.cityName);
          this.addressTableForm.controls.cityName.setValue(this.cityData);
        }
        this.filter.Filter(
          this.jsonControlGroupArray,
          this.addressTableForm,
          cityList,
          this.cityList,
          this.cityStatus
        );
      }
    });
  }
  //#endregion

  //#region State Dropdown
  getStateData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "state_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const stateList = res.data.map(element => ({
          name: element.stateName,
          value: element.stateCode
        }));
        if (this.isUpdate) {
          this.stateData = stateList.find((x) => x.name == this.data.stateName);
          this.addressTableForm.controls.stateName.setValue(this.stateData);
        }
        this.filter.Filter(
          this.jsonControlGroupArray,
          this.addressTableForm,
          stateList,
          this.stateList,
          this.stateStatus
        );
      }
    });
  }
  //#endregion

  //#region Save Data
  save() {
    this.addressTableForm.controls["pincode"].setValue(this.addressTableForm.value.pincode.name);
    this.addressTableForm.controls["cityName"].setValue(this.addressTableForm.value.cityName.name);
    this.addressTableForm.controls["stateName"].setValue(this.addressTableForm.value.stateName.name);
    this.addressTableForm.controls["activeFlag"].setValue(this.addressTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.addressTableForm.value.id;
      this.addressTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "address_detail",
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
        collection: "address_detail",
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
  //#endregion
}