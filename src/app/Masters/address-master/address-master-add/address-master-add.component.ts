import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from "@angular/router";
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
  pincodeStatus: any;
  pincodeData: any;
  isUpdate = false;
  action: string;
  pincodeDet: any;
  addressData: any;
  newAddressCode: string;
  data: any;
  pincodeDataFetched = false;
  //#endregion

  ngOnInit() {
    this.getPincodeData();
  }
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
  constructor(private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService, private filter: FilterUtils,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
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
        // Set Pincode related variables
        this.pincodeList = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.addressTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    this.Route.navigateByUrl('/Masters/AddressMaster/AddressMasterList');
  }
  //#region Pincode Dropdown
  async getPincodeData() {
    // Check if data has already been fetched
    if (this.isUpdate && this.pincodeDataFetched) {
      return;
    }
    const pincodeReq = {
      "companyCode": this.companyCode,
      "collectionName": "pincode_master",
      "filter": {}
    };

    try {
      // Fetch pincode data
      const pincodeRes = await this.masterService.masterPost('generic/get', pincodeReq).toPromise();
      this.pincodeDet = pincodeRes?.data || [];

      const pincodeList = this.pincodeDet.map((x) => ({
        name: x.PIN.toString(),
        value: x.PIN.toString(),
      }));

      // Update the form control if it's an update operation
      if (this.isUpdate) {
        const updatePin = pincodeList.find((x) => x.value == this.data.pincode);
        this.addressTableForm.controls['pincode'].setValue(updatePin);
      }

      const pincodeValue = this.addressTableForm.controls['pincode'].value;

      // Check if pincodeValue is a valid number
      if (!isNaN(pincodeValue) && pincodeValue.toString().length >= 3) {
        const exactPincodeMatch = pincodeList.find(
          (element) => element.name === pincodeValue
        );

        if (!exactPincodeMatch) {
          const filteredPincodeDet = pincodeList.filter((element) =>
            element.name.includes(pincodeValue.toString())
          );

          if (filteredPincodeDet.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
          } else {
            this.filter.Filter(
              this.jsonControlGroupArray,
              this.addressTableForm,
              filteredPincodeDet,
              this.pincodeList,
              this.pincodeStatus
            );
          }
        }
      }
      this.pincodeDataFetched = true;
    } catch (error) {
      console.error('Error fetching pincode data:', error);
    }
  }
  //#endregion

  //#region Save Data
  save() {
    this.addressTableForm.controls["pincode"].setValue(this.addressTableForm.value.pincode.name);
    // Clear any errors in the form controls
    Object.values(this.addressTableForm.controls).forEach(control => control.setErrors(null));

    if (this.isUpdate) {
      let id = this.addressTableForm.value._id;
      this.addressTableForm.removeControl("_id");
      let req = {
        companyCode: this.companyCode,
        collectionName: "address_detail",
        filter: { _id: id },
        update: this.addressTableForm.value
      };
      this.masterService.masterPut('generic/update', req).subscribe({
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
      const lastCode = this.addressData[this.addressData.length - 1];
      const lastAddressCode = lastCode ? parseInt(lastCode.addressCode.substring(1)) : 0;
      // Function to generate a new address code
      function generateAddressCode(initialCode: number = 0) {
        const nextAddressCode = initialCode + 1;
        const addressNumber = nextAddressCode.toString().padStart(4, '0');
        const addressCode = `A${addressNumber}`;
        return addressCode;
      }
      this.newAddressCode = generateAddressCode(lastAddressCode);
      this.addressTableForm.controls["_id"].setValue(this.newAddressCode);
      this.addressTableForm.controls["addressCode"].setValue(this.newAddressCode);
      let req = {
        companyCode: this.companyCode,
        collectionName: "address_detail",
        data: this.addressTableForm.value
      };
      this.masterService.masterPost('generic/create', req).subscribe({
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

  //#region set city and sate data
  async setStateCityData() {
    const fetchData = this.pincodeDet.find(item =>
      item.PIN
      == this.addressTableForm.controls['pincode'].value.name)
    const pincodeReq = {
      "companyCode": this.companyCode,
      "collectionName": "state_master",
      "filter": { ST: fetchData.ST }
    };

    // Fetch pincode data
    const state = await this.masterService.masterPost('generic/get', pincodeReq).toPromise();
    this.addressTableForm.controls.stateName.setValue(state.data[0].STNM)
    this.addressTableForm.controls.cityName.setValue(fetchData.CT)
  }
  //#endregion

  checkCodeExists() {
    let req = {
      "companyCode": this.companyCode,
      "collectionName": "address_detail",
      "filter": {}
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          this.addressData = res.data;
          const count = res.data.filter(item => item.manualCode == this.addressTableForm.controls.manualCode.value)
          if (count.length > 0) {
            Swal.fire({
              title: 'Manual Code already exists! Please try with another',
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK"
            });
            this.addressTableForm.controls['manualCode'].reset();
          }
        }
      }
    })
  }
}