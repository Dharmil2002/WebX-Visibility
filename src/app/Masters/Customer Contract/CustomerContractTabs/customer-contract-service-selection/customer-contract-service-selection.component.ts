import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { ContractServiceSelectionControl } from "src/assets/FormControls/CustomerContractControls/ServiceSelection-control";
import Swal from "sweetalert2";
@Component({
  selector: 'app-customer-contract-service-selection',
  templateUrl: './customer-contract-service-selection.component.html',
})
export class CustomerContractServiceSelectionComponent implements OnInit {

  ContractServiceSelectionControls: ContractServiceSelectionControl;

  ProductsForm: UntypedFormGroup;
  jsonControlArrayProductsForm: any;

  ServicesForm: UntypedFormGroup;
  jsonControlArrayServicesForm: any;

  CODDODForm: UntypedFormGroup;
  jsonControlArrayCODDODForm: any;

  VolumtericForm: UntypedFormGroup;
  jsonControlArrayVolumtericForm: any;

  DemurrageForm: UntypedFormGroup;
  jsonControlArrayDemurrageForm: any;

  InsuranceCarrierRiskForm: UntypedFormGroup;
  jsonControlArrayInsuranceCarrierRiskForm: any;

  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  ServiceclassName = "col-xl-2 col-lg-3 col-md-12 col-sm-12";
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];

  //#endregion
  isLoad: boolean = false;

  linkArray = [
  ];
  loadIn: boolean;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData: any = [];
  constructor(private fb: UntypedFormBuilder) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
  }
  initializeFormControl() {
    this.ContractServiceSelectionControls = new ContractServiceSelectionControl();
    this.jsonControlArrayProductsForm = this.ContractServiceSelectionControls.getContractProductSelectionControlControls();
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);
    this.jsonControlArrayServicesForm = this.ContractServiceSelectionControls.getContractServiceSelectionControlControls();
    this.ServicesForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayServicesForm,
    ]);
    this.jsonControlArrayCODDODForm = this.ContractServiceSelectionControls.getContractCODDODSelectionControlControls();
    this.CODDODForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayCODDODForm,
    ]);

    this.jsonControlArrayVolumtericForm = this.ContractServiceSelectionControls.getContractVolumtericSelectionControlControls();
    this.VolumtericForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayVolumtericForm,
    ]);

    this.jsonControlArrayDemurrageForm = this.ContractServiceSelectionControls.getContractDemurrageSelectionControlControls();
    this.DemurrageForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayDemurrageForm,
    ]);
    this.jsonControlArrayInsuranceCarrierRiskForm = this.ContractServiceSelectionControls.getContractInsuranceCarrierRiskSelectionControlControls();
    this.InsuranceCarrierRiskForm = formGroupBuilder(this.fb, [this.jsonControlArrayInsuranceCarrierRiskForm]);

  }
  //#endregion

  //#region functionCallHandler
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  async addData() {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find((x) => x.containerNumber === this.InsuranceCarrierRiskForm.value.containerNumber);
      if (exist) {
        this.InsuranceCarrierRiskForm.controls['containerNumber'].setValue('');
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering Container Number.",
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false

      }

    }
    if (typeof (this.InsuranceCarrierRiskForm.value.containerType) === 'string') {
      this.InsuranceCarrierRiskForm.controls['containerType'].setValue('');
      Swal.fire({
        icon: "info", // Use the "info" icon for informational messages
        title: "Information",
        text: "Please Select Proper value.",
        showConfirmButton: true,
      });
      this.isLoad = false;
      this.tableLoad = false;
      return false
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      containerNumber: this.InsuranceCarrierRiskForm.value.containerNumber,
      containerType: this.InsuranceCarrierRiskForm.value.containerType.value,
      containerCapacity: this.InsuranceCarrierRiskForm.value.containerCapacity,
      invoice: false,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach(key => {
      this.InsuranceCarrierRiskForm.get(key).clearValidators();
      this.InsuranceCarrierRiskForm.get(key).updateValueAndValidity();
    });

    this.InsuranceCarrierRiskForm.controls['containerNumber'].setValue('');
    this.InsuranceCarrierRiskForm.controls['containerType'].setValue('');
    this.InsuranceCarrierRiskForm.controls['containerCapacity'].setValue('');
    // Remove all validation  

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach(key => {
      this.InsuranceCarrierRiskForm.get(key).setValidators(Validators.required);
    });
    // this.consignmentTableForm.updateValueAndValidity();
  }




}

