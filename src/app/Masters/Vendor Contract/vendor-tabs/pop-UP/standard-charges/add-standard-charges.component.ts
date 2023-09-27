import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { StandardCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-standard-charges',
  templateUrl: './add-standard-charges.component.html'
})
export class AddStandardChargesComponent implements OnInit {

  breadScrums = [
    {
      title: "Standard Charges",
      items: ["Vendor Contract"],
      active: "Standard Charges",
    },
  ];
  standardChargesTableForm: UntypedFormGroup;
  jsonControlArray: any;
  standardChargesFormControls: StandardCharges;
  chargeNameValue: any;
  chargeNameName: any;
  rateTypeValue: any;
  rateTypeName: any;

  chargeNameDropdown = [
    {
      name:'chargeName/1',
      value:'01',
    },
    {
      name:'chargeName/2',
      value:'02',
    },
    {
      name:'chargeName/3',
      value:'03',
    },
  ]
  rateTypeDropdown = [
    {
      name:'rateType/1',
      value:'01',
    },
    {
      name:'rateType/2',
      value:'02',
    },
    {
      name:'rateType/3',
      value:'03',
    },
  ]
  vehicleCapacityDropdown = [
    {
      name:'vehicleCapacity/1',
      value:'01',
    },
    {
      name:'vehicleCapacity/2',
      value:'02',
    },
    {
      name:'vehicleCapacity/3',
      value:'03',
    },
  ]
  vehicleCapacityName: any;
  vehicleCapacityValue: any;



  constructor(private fb: UntypedFormBuilder,private filter: FilterUtils,private Route: Router ,public dialogRef: MatDialogRef<AddStandardChargesComponent>) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.standardChargesFormControls = new StandardCharges();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.standardChargesFormControls.getStandardChargesArrayControls();
    // Build the form group using formGroupBuilder function
    this.jsonControlArray.forEach((data) => {
      if (data.name === "chargeName") {
        this.chargeNameName = data.name;
        this.chargeNameValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "rateType") {
        this.rateTypeName = data.name;
        this.rateTypeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "vehicleCapacity") {
        this.vehicleCapacityName = data.name;
        this.vehicleCapacityValue = data.additionalData.showNameAndValue;
      }
    });
    this.standardChargesTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.GetchargeName()
    this.GetRateType()
    this.GetVehicleCapacity()
  }
  GetchargeName() {
    this.filter.Filter(
      this.jsonControlArray,
      this.standardChargesTableForm,
      this.chargeNameDropdown,
      this.chargeNameName,
      this.chargeNameValue
      );
    // this.GetVendorName()
  }
  GetRateType() {
    this.filter.Filter(
      this.jsonControlArray,
      this.standardChargesTableForm,
      this.rateTypeDropdown,
      this.rateTypeName,
      this.rateTypeValue
      );
    // this.GetVendorName()
  }
  GetVehicleCapacity() {
    this.filter.Filter(
      this.jsonControlArray,
      this.standardChargesTableForm,
      this.vehicleCapacityDropdown,
      this.vehicleCapacityName,
      this.vehicleCapacityValue
      );
    // this.GetVendorName()
  }

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  // save(){
  //   console.log(this.standardChargesTableForm.value)
  // }
  // cancel() {
  //   this.Route.navigateByUrl("/Masters/VendorContract/VendorIndex");
  // }
  SubmitFunction(){
    console.log('this.standardChargesTableForm' ,this.standardChargesTableForm.value)
    this.Route.navigateByUrl('/Masters/VendorContract/VendorIndex')
  }

  CancleEntry(){
    this.dialogRef.close()
  }
}
