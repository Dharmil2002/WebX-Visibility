
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { ContractServiceSelectionControl } from "src/assets/FormControls/CustomerContractControls/ServiceSelection-control";

interface CurrentAccessListType {
  productAccess: string[];
  ServicesSelectionAccess: string[];
}
@Component({
  selector: 'app-customer-contract-service-selection',
  templateUrl: './customer-contract-service-selection.component.html',
})
export class CustomerContractServiceSelectionComponent implements OnInit {
  companyCode: number | null

  //#region Form Configration Fields
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

  //#endregion

  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData: any = [];

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

  //#endregion

  //#region Section Wise Configration
  DisplayCODDODSection = false;
  DisplayVolumetricSection = false;
  DisplayDemurragericSection = false;
  DisplayInsuranceSection = true;
  DisplayCutOfftimeSection = false;
  DisplayYieldProtectionSection = false;
  DisplayFuelSurchargeSection = false;
  //#endregion

  //#region Array List
  CurrentAccessList: any
  StateList: any;
  PinCodeList: any
  //#endregion

  protected _onDestroy = new Subject<void>();

  //#endregion
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    public ObjcontractMethods: locationEntitySearch,
    private filter: FilterUtils, private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      ServicesSelectionAccess: ['Volumetric', "ODA", "DACC", "fuelSurcharge", "cutofftime", "COD/DOD", "Demurrage", "DPH", "Insurance", "YieldProtection"],
      productAccess: ['loadType', 'rateType', 'originRateOption', 'destinationRateOption', 'originRateOptionHandler', 'destinationRateOptionHandler']
    } as CurrentAccessListType;
    this.initializeFormControl();
  }

  //#endregion
  initializeFormControl() {
    this.ContractServiceSelectionControls = new ContractServiceSelectionControl();
    this.jsonControlArrayProductsForm = this.ContractServiceSelectionControls.getContractProductSelectionControlControls(this.CurrentAccessList.productAccess);
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);
    this.jsonControlArrayServicesForm = this.ContractServiceSelectionControls.getContractServiceSelectionControlControls(this.CurrentAccessList.ServicesSelectionAccess);
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
  ngOnInit() {
    this.getAllMastersData();
  }

  /*get all Master Details*/
  async getAllMastersData() {
    try {
      const stateReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "state_master",
      };
      const pincodeReqBody = {
        companyCode: this.companyCode,
        filter: {},
        collectionName: "pincode_master",
      };
      this.StateList = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
      this.PinCodeList = await this.masterService.masterPost('generic/get', pincodeReqBody).toPromise();
      this.PinCodeList.data = this.ObjcontractMethods.GetMergedData(this.PinCodeList, this.StateList, 'ST')
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
  }
  //#region All Multi Selection Actions

  //#region toggle SelectAllOriginRateOptions
  setSelectedPincodeData(event) {
  }
  //#endregion
  //#region toggle SelectAllOriginRateOptions
  toggleSelectAllRateOptions(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonControlArrayProductsForm.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArrayProductsForm[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.ProductsForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });

  }
  //#endregion

  //#region Set OriginRateOptions
  SetRateOptions(event) {
    let fieldName = event.field.name;

    const search = this.ProductsForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      const fieldsToSearch = ['PIN', 'CT', 'STNM', 'ZN'];
      data = this.ObjcontractMethods.GetGenericMappedAria(this.PinCodeList.data, search, fieldsToSearch)
      this.filter.Filter(
        this.jsonControlArrayProductsForm,
        this.ProductsForm,
        data,
        fieldName,
        true
      );
    }
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
      console.log("failed", error);
    }
  }
  async addData() {

    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.tableData;

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
    this.InsuranceCarrierRiskForm.reset();
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

