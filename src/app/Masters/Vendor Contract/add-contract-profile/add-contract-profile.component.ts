import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AddContractProfile } from 'src/assets/FormControls/VendorContractControls/add-contract-profile';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contract-profile',
  templateUrl: './add-contract-profile.component.html'
})
export class AddContractProfileComponent implements OnInit {

  breadScrums = [
    {
      title: "Add Contract Profile",
      items: ["Vendor Contract"],
      active: "Add Contract Profile",
    },
  ];
  addContractTableForm: UntypedFormGroup;
  jsonControlArray: any;
  addContractProfileFormControls: AddContractProfile;
  contractBranchCodeDropdown = [
    {
      name:'ContractBranchCode/1',
      value:'01',
    },
    {
      name:'ContractBranchCode/2',
      value:'02',
    },
    {
      name:'ContractBranchCode/3',
      value:'03',
    },
  ]
  contractBranchCodeValue: any;
  contractBranchCodeName: any;
  constructor(private fb: UntypedFormBuilder,private filter: FilterUtils,private Route: Router) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.addContractProfileFormControls = new AddContractProfile();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.addContractProfileFormControls.getAddContractProfileArrayControls();
    // Build the form group using formGroupBuilder function
    this.jsonControlArray.forEach((data) => {
      if (data.name === "ContractBranchCode") {
        this.contractBranchCodeName = data.name;
        this.contractBranchCodeValue = data.additionalData.showNameAndValue;
      }
    });
    this.addContractTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this. GetcontractBranchCode()
  }
  GetcontractBranchCode() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addContractTableForm,
      this.contractBranchCodeDropdown,
      this.contractBranchCodeName,
      this.contractBranchCodeValue
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
  save(){
    console.log(this.addContractTableForm.value)
  }
  cancel() {
    this.Route.navigateByUrl("/Masters/VendorContract/VendorContractList");
  }
}
