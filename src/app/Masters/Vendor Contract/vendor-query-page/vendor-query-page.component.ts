import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
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
  VendorControls:any
  jsonControlVendorArray:any
  companyCode = parseInt(localStorage.getItem("companyCode"));
  VendorTypeName: any;
  VendorTypeValue: any;
  VendorTypeDropdown = [
    {
      name:'VendorType/1',
      value:'01',
    },
    {
      name:'VendorType/2',
      value:'02',
    },
    {
      name:'VendorType/3',
      value:'03',
    },
  ]
  VendorNameDropdown = [
    {
      name:'VendorName/1',
      value:'01',
    },
    {
      name:'VendorName/2',
      value:'02',
    },
    {
      name:'VendorName/3',
      value:'03',
    },
  ]
  VendorNameName: any;
  VendorNameValue: any;
  constructor(private fb: UntypedFormBuilder , private filter: FilterUtils, private router: Router) { }

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
    this.GetVendorType()
    this.GetVendorName()
  }
  GetVendorType() {
    this.filter.Filter(
      this.jsonControlVendorArray,
      this.VendorQueryForm,
      this.VendorTypeDropdown,
      this.VendorTypeName,
      this.VendorTypeValue
      );
  }

  GetVendorName(){
    this.filter.Filter(
      this.jsonControlVendorArray,
      this.VendorQueryForm,
      this.VendorNameDropdown,
      this.VendorNameName,
      this.VendorNameValue
      );
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

  SubmitFunction(){
    console.log('this.VendorQueryForm' ,this.VendorQueryForm.value)
    this.router.navigateByUrl('/Masters/VendorContract/VendorContractList')
  }
  
}
