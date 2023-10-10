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

  CutOfftimeForm: UntypedFormGroup;
  jsonControlArrayCutOfftimeForm: any;

  YieldProtectionForm: UntypedFormGroup;
  jsonControlArrayYieldProtectionForm: any;

  FuelSurchargeForm: UntypedFormGroup;
  jsonControlArrayFuelSurchargeForm: any;

  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  ServiceclassName = "col-xl-2 col-lg-3 col-md-12 col-sm-12";
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  //#endregion
  isLoad: boolean = false;
  //#region columnHeader
  columnHeader = {
    InvoiceValueFrom: {
      Title: "Invoice Value From",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    tovalue: {
      Title: "To value",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    Rate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MinCharge: {
      Title: "Min Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    MaxCharge: {
      Title: "Max Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };

  staticField =
    [
      'InvoiceValueFrom',
      'tovalue',
      'rateType',
      'Rate',
      'MinCharge',
      'MaxCharge'
    ]
  /*End*/
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData: any = [];


  DisplayCODDODSection = false;
  DisplayVolumetricSection = false;
  DisplayDemurragericSection = false;
  DisplayInsuranceSection = false;
  DisplayCutOfftimeSection = false;
  DisplayYieldProtectionSection = false;
  DisplayFuelSurchargeSection = false;

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

    this.jsonControlArrayCutOfftimeForm = this.ContractServiceSelectionControls.getContractCutOfftimeControlControls();
    this.CutOfftimeForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayCutOfftimeForm,
    ]);

    this.jsonControlArrayYieldProtectionForm = this.ContractServiceSelectionControls.getContractYieldProtectionSelectionControlControls();
    this.YieldProtectionForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayYieldProtectionForm,
    ]);

    this.jsonControlArrayFuelSurchargeForm = this.ContractServiceSelectionControls.getContractFuelSurchargeSelectionControlControls();
    this.FuelSurchargeForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayFuelSurchargeForm,
    ]);

  }
  //#endregion

  OnChangeServiceSelections(event) {
    const fieldName = typeof event === "string" ? event : event.field.name;
    const checked = typeof event === "string" ? event : event.eventArgs.checked;

    switch (fieldName) {
      case "Volumetric":
        this.DisplayVolumetricSection = checked;
        break;
      case "ODA":
        this.DisplayCODDODSection = checked;
        break;
      case "Demurrage":
        this.DisplayDemurragericSection = checked;
        break;
      case "Insurance":
        this.DisplayInsuranceSection = checked;
        break;
      case "cutofftime":
        this.DisplayCutOfftimeSection = checked;
        break;
      case "YieldProtection":
        this.DisplayYieldProtectionSection = checked;
        break;
      case "fuelSurcharge":
        this.DisplayFuelSurchargeSection = checked;
        break;
      default:
        break;
    }
  }
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
    // if (typeof (this.InsuranceCarrierRiskForm.value.tovalue) === 'string') {
    //   this.InsuranceCarrierRiskForm.controls['tovalue'].setValue('');
    //   Swal.fire({
    //     icon: "info", // Use the "info" icon for informational messages
    //     title: "Information",
    //     text: "Please Select Proper value.",
    //     showConfirmButton: true,
    //   });
    //   this.isLoad = false;
    //   this.tableLoad = false;
    //   return false
    // }
    console.log(this.InsuranceCarrierRiskForm)
    debugger
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      InvoiceValueFrom: this.InsuranceCarrierRiskForm.value.InvoiceValueFrom,
      tovalue: this.InsuranceCarrierRiskForm.value.tovalue,
      rateType: this.InsuranceCarrierRiskForm.value.rateType,
      Rate: this.InsuranceCarrierRiskForm.value.Rate,
      MinCharge: this.InsuranceCarrierRiskForm.value.MinCharge,
      MaxCharge: this.InsuranceCarrierRiskForm.value.MaxCharge,
      actions: ['Edit', 'Remove']
    }
    this.tableData.push(json);
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach(key => {
      this.InsuranceCarrierRiskForm.get(key).clearValidators();
      this.InsuranceCarrierRiskForm.get(key).updateValueAndValidity();
    });

    this.InsuranceCarrierRiskForm.controls['InvoiceValueFrom'].setValue('');
    this.InsuranceCarrierRiskForm.controls['tovalue'].setValue('');
    this.InsuranceCarrierRiskForm.controls['rateType'].setValue('');
    this.InsuranceCarrierRiskForm.controls['Rate'].setValue('');
    this.InsuranceCarrierRiskForm.controls['MinCharge'].setValue('');
    this.InsuranceCarrierRiskForm.controls['MaxCharge'].setValue('');
    // Remove all validation  

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach(key => {
      this.InsuranceCarrierRiskForm.get(key).setValidators(Validators.required);
    });
    // this.consignmentTableForm.updateValueAndValidity();
  }


  handleMenuItemClick(data) {
    this.fillContainer(data);
  }

  fillContainer(data: any) {
    if (data.label.label === 'Remove') {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      this.InsuranceCarrierRiskForm.controls['InvoiceValueFrom'].setValue(data.data?.InvoiceValueFrom || "");
      this.InsuranceCarrierRiskForm.controls['tovalue'].setValue(data.data?.tovalue || "");
      this.InsuranceCarrierRiskForm.controls['rateType'].setValue(data.data?.rateType || "");
      this.InsuranceCarrierRiskForm.controls['Rate'].setValue(data.data?.Rate || "");
      this.InsuranceCarrierRiskForm.controls['MinCharge'].setValue(data.data?.MinCharge || "");
      this.InsuranceCarrierRiskForm.controls['MaxCharge'].setValue(data.data?.MaxCharge || "");
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }

}

