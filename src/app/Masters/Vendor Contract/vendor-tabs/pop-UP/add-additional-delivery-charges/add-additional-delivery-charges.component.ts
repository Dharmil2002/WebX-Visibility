import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { AdditionalDeliveryCharges } from 'src/assets/FormControls/VendorContractControls/add-additional-delivery-charges-control';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-add-additional-delivery-charges',
  templateUrl: './add-additional-delivery-charges.component.html'
})
export class AddAdditionalDeliveryChargesComponent implements OnInit {

  breadScrums = [
    {
      title: "Standard Charges",
      items: ["Vendor Contract"],
      active: "Standard Charges",
    },
  ];
  AdditionalDeliveryChargesTableForm: UntypedFormGroup;
  jsonControlArray: any;
  AdditionalDeliveryChargesControls: AdditionalDeliveryCharges;
  rateTypeValue: any;
  rateTypeName: any;
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

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private Route: Router,
    public dialogRef: MatDialogRef<AddAdditionalDeliveryChargesComponent>
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.AdditionalDeliveryChargesControls = new AdditionalDeliveryCharges();
    // Get form controls for job Entry form section
    this.jsonControlArray =
      this.AdditionalDeliveryChargesControls. getAdditionalDeliveryChargesArrayControls();
    // Build the form group using formGroupBuilder function
    this.jsonControlArray.forEach((data) => {
      if (data.name === "rateType") {
        this.rateTypeName = data.name;
        this.rateTypeValue = data.additionalData.showNameAndValue;
      }

    });
    this.AdditionalDeliveryChargesTableForm = formGroupBuilder(this.fb, [this.jsonControlArray,]);
    this.GetRateType();
  }
  GetRateType() {
    this.filter.Filter(
      this.jsonControlArray,
      this.AdditionalDeliveryChargesTableForm,
      this.rateTypeDropdown,
      this.rateTypeName,
      this.rateTypeValue
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
  SubmitFunction() {
    console.log(
      "this.standardChargesTableForm",
      this.AdditionalDeliveryChargesTableForm.value
    );
  }
  cancel(){
    this.dialogRef.close()
  }

}
