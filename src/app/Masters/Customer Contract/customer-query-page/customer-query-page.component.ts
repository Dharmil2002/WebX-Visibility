import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CustomerQueryPageControl } from 'src/assets/FormControls/CustomerContractControls/VendorQueryPage';

@Component({
  selector: 'app-customer-query-page',
  templateUrl: './customer-query-page.component.html',
})
export class CustomerQueryPageComponent implements OnInit {
  breadscrums = [
    {
      title: "Customer Contract",
      items: ["Home"],
      active: "Customer Contract",
    },
  ];

  // const vehicleFormControls = new VehicleControls(this.vehicleTabledata, this.isUpdate);
  CustomerQueryForm: UntypedFormGroup;
  CustomerControls: any
  jsonControlCustomerArray: any
  companyCode = parseInt(localStorage.getItem("companyCode"));
  CustomerTypeName: any;
  CustomerTypeValue: any;
  CustomerPayBasisDropdown = [
    {
      name: 'PAID',
      value: '01',
    },
    {
      name: 'TBB',
      value: '02',
    },
    {
      name: 'TO PAY',
      value: '03',
    },
    {
      name: 'FOC',
      value: '04',
    },
  ]
  CustomerNameDropdown = [
    {
      name: 'CustomerName/1',
      value: '01',
    },
    {
      name: 'CustomerName/2',
      value: '02',
    },
    {
      name: 'CustomerName/3',
      value: '03',
    },
  ]
  CustomerNameName: any;
  CustomerNameValue: any;
  constructor(private fb: UntypedFormBuilder, private filter: FilterUtils, private router: Router) { }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.CustomerControls = new CustomerQueryPageControl();
    this.jsonControlCustomerArray = this.CustomerControls.getCustomerQueryPageControl();
    this.jsonControlCustomerArray.forEach((data) => {
      if (data.name === "CustomerPayBasis") {
        this.CustomerTypeName = data.name;
        this.CustomerTypeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "CustomerName") {
        this.CustomerNameName = data.name;
        this.CustomerNameValue = data.additionalData.showNameAndValue;
      }
    });
    this.CustomerQueryForm = formGroupBuilder(this.fb, [this.jsonControlCustomerArray]);
    this.GetCustomerType()
    this.GetCustomerName()
  }
  GetCustomerType() {
    this.filter.Filter(
      this.jsonControlCustomerArray,
      this.CustomerQueryForm,
      this.CustomerPayBasisDropdown,
      this.CustomerTypeName,
      this.CustomerTypeValue
    );
  }

  GetCustomerName() {
    this.filter.Filter(
      this.jsonControlCustomerArray,
      this.CustomerQueryForm,
      this.CustomerNameDropdown,
      this.CustomerNameName,
      this.CustomerNameValue
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

  SubmitFunction() {
    console.log('this.CustomerQueryForm', this.CustomerQueryForm.value)
    this.router.navigateByUrl('/Masters/CustomerContract/CustomerContractList')
  }

}

