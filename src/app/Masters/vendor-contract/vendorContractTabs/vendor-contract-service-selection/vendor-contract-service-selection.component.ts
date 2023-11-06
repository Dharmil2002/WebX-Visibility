import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { locationEntitySearch } from 'src/app/Utility/locationEntitySearch';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
 import { ContractTypeData } from '../../vendor-contract-list/VendorStaticData';
interface CurrentAccessListType {
  productAccess: string[];
  ServicesSelectionAccess: string[];
}
@Component({
  selector: 'app-vendor-contract-service-selection',
  templateUrl: './vendor-contract-service-selection.component.html'
})
export class VendorContractServiceSelectionComponent implements OnInit {

  //#region Form Configration Fields
 
  companyCode: any;
  CurrentAccessList: CurrentAccessListType;
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
  protected _onDestroy = new Subject<void>();

  //#region Table Configration Fields
  isLoad: boolean = false;
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  loadIn: boolean;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData = ContractTypeData

  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ["checkBoxRequired"],
  };
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    type: {
      Title: "Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    typeName: {
      Title: "Type",
      class: "matcolumnleft",
      //Style: "max-width:300px",
    },
    mode: {
      Title: "Mode",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },

  };
  staticField = [
    "type",
    "typeName",
    "mode"
  ];
  selectedContractType: any;

  //#endregion

 
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private changeDetectorRef: ChangeDetectorRef,
    public ObjcontractMethods: locationEntitySearch,
    private filter: FilterUtils, private sessionService: SessionService) {
    this.companyCode = this.sessionService.getCompanyCode()
    this.CurrentAccessList = {
      ServicesSelectionAccess: ['Volumetric', "ODA", "DACC", "fuelSurcharge", "cutofftime", "COD/DOD", "Demurrage", "DPH", "Insurance", "YieldProtection"],
      productAccess: ['loadType', 'rateType', 'originRateOption', 'destinationRateOption', 'originRateOptionHandler', 'destinationRateOptionHandler']
    } as CurrentAccessListType;
  }

  //#region to initialize form controls
  
  ngOnInit() {
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

    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      // InvoiceValueFrom: this.InsuranceCarrierRiskForm.value.InvoiceValueFrom,
      // tovalue: this.InsuranceCarrierRiskForm.value.tovalue,
      // rateType: this.InsuranceCarrierRiskForm.value.rateType,
      // Rate: this.InsuranceCarrierRiskForm.value.Rate,
      // MinCharge: this.InsuranceCarrierRiskForm.value.MinCharge,
      // MaxCharge: this.InsuranceCarrierRiskForm.value.MaxCharge,
      actions: ['Edit', 'Remove']
    }
    //this.tableData.push(json);
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
      //this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
    else {
      this.InsuranceCarrierRiskForm.controls['InvoiceValueFrom'].setValue(data.data?.InvoiceValueFrom || "");
      this.InsuranceCarrierRiskForm.controls['tovalue'].setValue(data.data?.tovalue || "");
      this.InsuranceCarrierRiskForm.controls['rateType'].setValue(data.data?.rateType || "");
      this.InsuranceCarrierRiskForm.controls['Rate'].setValue(data.data?.Rate || "");
      this.InsuranceCarrierRiskForm.controls['MinCharge'].setValue(data.data?.MinCharge || "");
      this.InsuranceCarrierRiskForm.controls['MaxCharge'].setValue(data.data?.MaxCharge || "");
      // this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  selectCheckBox(event) {
    console.log(event);
    event.forEach((item) => {
      this.selectedContractType = item.typeName;
    });
    console.log(this.selectedContractType);

  }
}