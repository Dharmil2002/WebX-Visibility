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
    window.history.back();
  }
  //#region Pincode Dropdown
  getPincodeData() {
    const pincodeValue = this.addressTableForm.controls['pincode'].value;
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "pincode_detail"
    };
    if (pincodeValue.length > 2) {
      this.masterService.masterPost('common/getall', req).subscribe({
        next: (res: any) => {
          // Assuming the API response contains an array named 'pincodeList'
          this.pincodeDet = res.data;
          const pincodeList = res.data.map(element => ({
            name: element.pincode,
            value: element.pincode
          })).filter(item => item.name.includes(pincodeValue));

          if (pincodeList.length === 0) {
            // Show a popup indicating no data found for the given pincode
            Swal.fire({
              icon: "info",
              title: "No Data Found",
              text: `No data found for pincode ${pincodeValue}`,
              showConfirmButton: true,
            });
            return; // Exit the function
          }

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
  }
  //#endregion

  //#region Save Data
  save() {
    this.addressTableForm.controls["pincode"].setValue(this.addressTableForm.value.pincode.name);
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
      this.addressTableForm.controls["id"].setValue(this.newAddressCode);
      this.addressTableForm.controls["addressCode"].setValue(this.newAddressCode);
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

  setStateCityData() {
    const fetchData = this.pincodeDet.find(item => item.pincode == this.addressTableForm.controls.pincode.value.value)
    this.addressTableForm.controls.stateName.setValue(fetchData.state)
    this.addressTableForm.controls.cityName.setValue(fetchData.city)
  }
  checkCodeExists() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "address_detail"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
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