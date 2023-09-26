import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
// import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VendorQueryPageControl } from 'src/assets/FormControls/VendorContractControls/VendorQueryPage';

@Component({
  selector: 'app-vendor-query-page',
  templateUrl: './vendor-query-page.component.html'
})
export class VendorQueryPageComponent implements OnInit {
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Vendor Contract",
    },
  ];

  // const vehicleFormControls = new VehicleControls(this.vehicleTabledata, this.isUpdate);
  VendorQueryForm: UntypedFormGroup;
  VendorControls:VendorQueryPageControl;
  jsonControlVendorArray:any
  companyCode = parseInt(localStorage.getItem("companyCode"));
  VendorTypeName: any;
  VendorTypeValue: any;
  // VendorTypeDropdown: { name: string; value: number; }[];
  VendorTypeDropdown:any
  VendorNameName: any;
  VendorNameValue: any;
  // this.VendorTypeDropdown = ;
  constructor(private fb: UntypedFormBuilder , private filter: FilterUtils,) { }

  ngOnInit(): void {
    this.initializeFormControl()
  }


  initializeFormControl() {
    this.VendorControls = new VendorQueryPageControl();
    this.jsonControlVendorArray = this.VendorControls.getVendorQueryPageControl();
    this.jsonControlVendorArray.forEach((data) => {
      if (data.name === "VendorType") {
        this.VendorTypeName = data.name;
        this.VendorTypeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "VendorName") {
        this.VendorNameName = data.name;
        this.VendorNameValue = data.additionalData.showNameAndValue;
      }
    });
    this.VendorQueryForm = formGroupBuilder(this.fb, [this.jsonControlVendorArray]);
    // this.GetVendorType()
  }


}
