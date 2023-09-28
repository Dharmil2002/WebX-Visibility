import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { WaitingChargesControls } from 'src/assets/FormControls/VendorContractControls/add-waiting-charges-control';

@Component({
  selector: 'app-add-waiting-charges',
  templateUrl: './add-waiting-charges.component.html'
})
export class AddWaitingChargesComponent implements OnInit {

  breadScrums = [
    {
      title: "Standard Charges",
      items: ["Vendor Contract"],
      active: "Standard Charges",
    },
  ];
  WaitingChargesTableForm: UntypedFormGroup;
  jsonControlArray: any;
  WaitingChargesControls: WaitingChargesControls;
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
  vehicleTypeDropdown = [
    {
      name:'vehicleType/1',
      value:'01',
    },
    {
      name:'vehicleType/2',
      value:'02',
    },
    {
      name:'vehicleType/3',
      value:'03',
    },
  ]
  vehicleTypeName: any;
  vehicleTypeValue: any;

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private Route: Router
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.WaitingChargesControls = new WaitingChargesControls();
    // Get form controls for job Entry form section
    this.jsonControlArray =
      this.WaitingChargesControls.getWaitingChargesArrayControls();
    // Build the form group using formGroupBuilder function
    this.jsonControlArray.forEach((data) => {
      if (data.name === "rateType") {
        this.rateTypeName = data.name;
        this.rateTypeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "vehicleType") {
        this.vehicleTypeName = data.name;
        this.vehicleTypeValue = data.additionalData.showNameAndValue;
      }

    });
    this.WaitingChargesTableForm = formGroupBuilder(this.fb, [this.jsonControlArray,]);
    this.GetRateType();
    this.GetvehicleType();
  }
  GetRateType() {
    this.filter.Filter(
      this.jsonControlArray,
      this.WaitingChargesTableForm,
      this.rateTypeDropdown,
      this.rateTypeName,
      this.rateTypeValue
      );
    // this.GetVendorName()
  }
  GetvehicleType() {
    this.filter.Filter(
      this.jsonControlArray,
      this.WaitingChargesTableForm,
      this.vehicleTypeDropdown,
      this.vehicleTypeName,
      this.vehicleTypeValue
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
      this.WaitingChargesTableForm.value
    );
  }
  cancel(){
    this.Route.navigateByUrl("/Masters/VendorContract/VendorIndex");
  }

}
