import { removeFields } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, take, takeUntil } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { locationEntitySearch } from "src/app/Utility/locationEntitySearch";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { ContractServiceSelectionControl } from "src/assets/FormControls/CustomerContractControls/ServiceSelection-control";
import Swal from "sweetalert2";
import { PayBasisdetailFromApi } from "../../CustomerContractAPIUtitlity";

interface CurrentAccessListType {
  productAccess: string[];
  ServicesSelectionAccess: string[];
}
@Component({
  selector: "app-customer-contract-service-selection",
  templateUrl: "./customer-contract-service-selection.component.html",
})
export class CustomerContractServiceSelectionComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  companyCode: number | null;
  @Input() contractData: any;
  //#region Form Configration Fields
  ContractServiceSelectionControls: ContractServiceSelectionControl;
  EventButton = {
    functionName: "SaveProduct",
    name: "Save",
    iconName: "save",
  };
  ADDEventButton = {
    functionName: "addData",
    name: "Add New",
    iconName: "add",
  };
  FADDEventButton = {
    functionName: "FaddData",
    name: "Add New",
    iconName: "add",
  };
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
  isFLoad: boolean = false;
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  data: any;
  loadIn: boolean;
  tableLoad: boolean = true;
  FtableLoad: boolean = true;
  isTableLoad: boolean = true;
  tableData = [];

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
  FdynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  FmenuItems = [{ label: "Edit" }, { label: "Remove" }];

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
    },
  };
  FcolumnHeader = {
    fTYPE: {
      Title: "Fule Type",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    fRTYPE: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    frT: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    fmIN: {
      Title: "Mix Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    fmAX: {
      Title: "Max Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  staticField = [
    "InvoiceValueFrom",
    "tovalue",
    "rateType",
    "Rate",
    "MinCharge",
    "MaxCharge",
  ];
  FstaticField = ["fTYPE", "fRTYPE", "frT", "fmIN", "fmAX"];

  //#endregion

  //#region Section Wise Configration
  DisplayCODDODSection = false;
  DisplayVolumetricSection = false;
  DisplayDemurragericSection = false;
  DisplayInsuranceSection = false;
  DisplayCutOfftimeSection = false;
  DisplayYieldProtectionSection = false;
  DisplayFuelSurchargeSection = false;
  //#endregion

  //#region Array List
  CurrentAccessList: any;
  StateList: any;
  PinCodeList: any;
  //#endregion

  protected _onDestroy = new Subject<void>();

  //#endregion

  LoadtypedetailFromAPI: any;
  RatetypedetailFromAPI: any;
  VolumetricUoMFromAPI: any;
  FtableData: any = [];
  InsuranceCarrierRiskSelectionData: any;
  VolumetricappliedFromAPI: any;
  CalculateYieldonFromAPI: any;
  CODDODRatetypeFromAPI: any;
  DemurrageRatetypeFromAPI: any;
  YieldTypeFromAPI: any;
  FuelSurchargeSelectionFromAPI: any;
  VolumtericcalculationFromAPI: any;
  FuelSurchargeFromAPI: any;
  InsuranceFromAPI: any;
  constructor(
    private fb: UntypedFormBuilder,
    private Route: Router,
    private masterService: MasterService,
    private changeDetectorRef: ChangeDetectorRef,
    public ObjcontractMethods: locationEntitySearch,
    private filter: FilterUtils,
    private sessionService: SessionService
  ) {
    super();
    this.companyCode = this.sessionService.getCompanyCode();
    this.CurrentAccessList = {
      ServicesSelectionAccess: [
        "Volumetric",
        "ODA",
        "DACC",
        "fuelSurcharge",
        "cutofftime",
        "COD/DOD",
        "Demurrage",
        "DPH",
        "Insurance",
        "YieldProtection",
      ],
      productAccess: ["loadType", "rateTypeDetails", "rateTypecontrolHandler"], //'originRateOption', 'destinationRateOption'
    } as CurrentAccessListType;
    this.initializeFormControl();
    this.BindDataFromAPI();
  }

  //#endregion
  initializeFormControl() {
    this.ContractServiceSelectionControls =
      new ContractServiceSelectionControl();
    this.jsonControlArrayProductsForm =
      this.ContractServiceSelectionControls.getContractProductSelectionControlControls(
        this.CurrentAccessList.productAccess
      );
    this.ProductsForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayProductsForm,
    ]);
    this.jsonControlArrayServicesForm =
      this.ContractServiceSelectionControls.getContractServiceSelectionControlControls(
        this.CurrentAccessList.ServicesSelectionAccess
      );
    this.ServicesForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayServicesForm,
    ]);
    this.jsonControlArrayCODDODForm =
      this.ContractServiceSelectionControls.getContractCODDODSelectionControlControls();
    this.CODDODForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayCODDODForm,
    ]);

    this.jsonControlArrayVolumtericForm =
      this.ContractServiceSelectionControls.getContractVolumtericSelectionControlControls();
    this.VolumtericForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayVolumtericForm,
    ]);

    this.jsonControlArrayDemurrageForm =
      this.ContractServiceSelectionControls.getContractDemurrageSelectionControlControls();
    this.DemurrageForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayDemurrageForm,
    ]);
    this.jsonControlArrayInsuranceCarrierRiskForm =
      this.ContractServiceSelectionControls.getContractInsuranceCarrierRiskSelectionControlControls();
    this.InsuranceCarrierRiskForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayInsuranceCarrierRiskForm,
    ]);

    this.jsonControlArrayCutOfftimeForm =
      this.ContractServiceSelectionControls.getContractCutOfftimeControlControls();
    this.CutOfftimeForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayCutOfftimeForm,
    ]);

    this.jsonControlArrayYieldProtectionForm =
      this.ContractServiceSelectionControls.getContractYieldProtectionSelectionControlControls();
    this.YieldProtectionForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayYieldProtectionForm,
    ]);

    this.jsonControlArrayFuelSurchargeForm =
      this.ContractServiceSelectionControls.getContractFuelSurchargeSelectionControlControls();
    this.FuelSurchargeForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayFuelSurchargeForm,
    ]);
  }
  //#region
  toggleSelectAll(argData: any) {
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
  //#endregion
  ngOnInit() {
    this.getAllMastersData();
  }
  async BindDataFromAPI() {
    this.LoadtypedetailFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "LT"
    );
    this.filter.Filter(
      this.jsonControlArrayProductsForm,
      this.ProductsForm,
      this.LoadtypedetailFromAPI,
      "loadType",
      false
    );
    this.RatetypedetailFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayProductsForm,
      this.ProductsForm,
      this.RatetypedetailFromAPI,
      "rateTypeDetails",
      false
    );
    this.VolumetricUoMFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "VolumetricUoM"
    );
    this.filter.Filter(
      this.jsonControlArrayVolumtericForm,
      this.VolumtericForm,
      this.VolumetricUoMFromAPI,
      "VolumetricUoM",
      false
    );
    this.VolumetricappliedFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "VA"
    );
    this.filter.Filter(
      this.jsonControlArrayVolumtericForm,
      this.VolumtericForm,
      this.VolumetricappliedFromAPI,
      "Volumetricapplied",
      false
    );
    this.VolumtericcalculationFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "VMC"
    );
    this.filter.Filter(
      this.jsonControlArrayVolumtericForm,
      this.VolumtericForm,
      this.VolumtericcalculationFromAPI,
      "Volumtericcalculation",
      false
    );
    this.CalculateYieldonFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "CYO"
    );
    this.filter.Filter(
      this.jsonControlArrayYieldProtectionForm,
      this.YieldProtectionForm,
      this.CalculateYieldonFromAPI,
      "CalculateYieldon",
      false
    );
    this.CODDODRatetypeFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayCODDODForm,
      this.CODDODForm,
      this.CODDODRatetypeFromAPI,
      "CODDODRatetype",
      false
    );
    this.DemurrageRatetypeFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayDemurrageForm,
      this.DemurrageForm,
      this.DemurrageRatetypeFromAPI,
      "DRatetype",
      false
    );
    this.YieldTypeFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "YTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayYieldProtectionForm,
      this.YieldProtectionForm,
      this.YieldTypeFromAPI,
      "Yieldtype",
      false
    );
    this.FuelSurchargeSelectionFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "FTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayFuelSurchargeForm,
      this.FuelSurchargeForm,
      this.FuelSurchargeSelectionFromAPI,
      "FuelType",
      false
    );
    this.FuelSurchargeFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayFuelSurchargeForm,
      this.FuelSurchargeForm,
      this.FuelSurchargeFromAPI,
      "FRateType",
      false
    );
    this.InsuranceFromAPI = await PayBasisdetailFromApi(
      this.masterService,
      "RTTYP"
    );
    this.filter.Filter(
      this.jsonControlArrayInsuranceCarrierRiskForm,
      this.InsuranceCarrierRiskForm,
      this.InsuranceFromAPI,
      "rateType",
      false
    );
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
      this.StateList = await this.masterService
        .masterPost("generic/get", stateReqBody)
        .toPromise();
      this.PinCodeList = await this.masterService
        .masterPost("generic/get", pincodeReqBody)
        .toPromise();
      this.PinCodeList.data = this.ObjcontractMethods.GetMergedData(
        this.PinCodeList,
        this.StateList,
        "ST"
      );
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    }
    this.SetDefaultProductsData();
  }

  //#region Set OriginRateOptions
  SetRateOptions(event) {
    let fieldName = event.field.name;

    const search = this.ProductsForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      const fieldsToSearch = ["PIN", "CT", "STNM", "ZN"];
      data = this.ObjcontractMethods.GetGenericMappedAria(
        this.PinCodeList.data,
        search,
        fieldsToSearch
      );
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
      case "COD/DOD":
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
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id:tableData.length+1,
      InvoiceValueFrom: this.InsuranceCarrierRiskForm.value.InvoiceValueFrom,
      tovalue: this.InsuranceCarrierRiskForm.value.tovalue,
      rateType: this.InsuranceCarrierRiskForm.value.rateType.name,
      Rate: this.InsuranceCarrierRiskForm.value.Rate,
      MinCharge: this.InsuranceCarrierRiskForm.value.MinCharge,
      MaxCharge: this.InsuranceCarrierRiskForm.value.MaxCharge,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    const requestBody = {
      _id:this.companyCode + "-" + this.contractData.cONID+"-"+tableData.length,
      cID: this.companyCode,
      cONID: this.contractData.cONID,
      iVFROM: this.InsuranceCarrierRiskForm.value.InvoiceValueFrom,
      iVTO: this.InsuranceCarrierRiskForm.value.tovalue,
      rtType:this.InsuranceCarrierRiskForm.value.rateType.name,
      rT: this.InsuranceCarrierRiskForm.value.Rate,
      mIN: this.InsuranceCarrierRiskForm.value.MinCharge,
      mAX: this.InsuranceCarrierRiskForm.value.MaxCharge,
    };
    await this.InsuranceCarrierRiskSelectionSave(requestBody);
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach((key) => {
      this.InsuranceCarrierRiskForm.get(key).clearValidators();
      this.InsuranceCarrierRiskForm.get(key).updateValueAndValidity();
    });
    this.InsuranceCarrierRiskForm.controls["InvoiceValueFrom"].setValue("");
    this.InsuranceCarrierRiskForm.controls["tovalue"].setValue("");
    this.InsuranceCarrierRiskForm.controls["rateType"].setValue("");
    this.InsuranceCarrierRiskForm.controls["Rate"].setValue("");
    this.InsuranceCarrierRiskForm.controls["MinCharge"].setValue("");
    this.InsuranceCarrierRiskForm.controls["MaxCharge"].setValue("");
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach((key) => {
      this.InsuranceCarrierRiskForm.get(key).setValidators(Validators.required);
    });
    // this.consignmentTableForm.updateValueAndValidity();
  }

  async FaddData() {
    debugger
    this.FtableLoad = true;
    this.isFLoad = true;
    const json = {
      _id:this.companyCode + "-" + this.contractData.cONID+"-"+this.FtableData.length+1,
      id:this.companyCode + "-" + this.contractData.cONID+"-"+this.FtableData.length+1,
      cID: this.companyCode,
      cONID: this.contractData.cONID,
      fTYPE: this.FuelSurchargeForm.value.FuelType.name,
      fRTYPE: this.FuelSurchargeForm.value.FRateType.name,
      frT: this.FuelSurchargeForm.value.FRate,
      fmIN: this.FuelSurchargeForm.value.FMinCharge,
      fmAX: this.FuelSurchargeForm.value.FMaxCharge,
      actions: ["Edit", "Remove"]
    };
    this.FtableData.push(json);

    await this.FuelSurchargeDataSave(json);
    Object.keys(this.FuelSurchargeForm.controls).forEach((key) => {
      this.FuelSurchargeForm.get(key).clearValidators();
      this.FuelSurchargeForm.get(key).updateValueAndValidity();
    });

    this.FuelSurchargeForm.controls["FuelType"].setValue("");
    this.FuelSurchargeForm.controls["FRateType"].setValue("");
    this.FuelSurchargeForm.controls["FRate"].setValue("");
    this.FuelSurchargeForm.controls["FMinCharge"].setValue("");
    this.FuelSurchargeForm.controls["FMaxCharge"].setValue("");
    // Remove all validation
    // Add the "required" validation rule
    Object.keys(this.FuelSurchargeForm.controls).forEach((key) => {
      this.FuelSurchargeForm.get(key).setValidators(Validators.required);
    });
    // this.consignmentTableForm.updateValueAndValidity();

    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    this.isFLoad = false;
    this.FtableLoad = false;
  }
  handleMenuItemClick(data) {
    this.fillContainer(data);
  }
  FhandleMenuItemClick(data) {
    this.FfillContainer(data);
  }

  async fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      await this.removedata(data.data.id);
    } else {
      this.InsuranceCarrierRiskForm.controls["InvoiceValueFrom"].setValue(
        data.data?.InvoiceValueFrom || ""
      );
      this.InsuranceCarrierRiskForm.controls["tovalue"].setValue(
        data.data?.tovalue || ""
      );
      this.InsuranceCarrierRiskForm.controls["rateType"].setValue(
        data.data?.rateType || ""
      );
      this.InsuranceCarrierRiskForm.controls["Rate"].setValue(
        data.data?.Rate || ""
      );
      this.InsuranceCarrierRiskForm.controls["MinCharge"].setValue(
        data.data?.MinCharge || ""
      );
      this.InsuranceCarrierRiskForm.controls["MaxCharge"].setValue(
        data.data?.MaxCharge || ""
      );
      await this.removedata(data.data.id);
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }
  }
  async FfillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.FtableData = this.FtableData.filter((x) => x.id !== data.data.id);
      await this.Fremovedata(data.data.id);
    } else {
      this.FuelSurchargeForm.controls["FuelType"].setValue(
        data.data?.FuelType || ""
      );

      this.FuelSurchargeForm.controls["FRateType"].setValue(
        data.data?.FRateType || ""
      );
      this.FuelSurchargeForm.controls["FRate"].setValue(data.data?.FRate || "");
      this.FuelSurchargeForm.controls["FMinCharge"].setValue(
        data.data?.FMinCharge || ""
      );
      this.FuelSurchargeForm.controls["FMaxCharge"].setValue(
        data.data?.FMaxCharge || ""
      );
      await this.Fremovedata(data.data.id);
      this.FtableData = this.FtableData.filter((x) => x.id !== data.data.id);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // let data = {
    //   "Customer": changes.contractData?.currentValue?.cUSTID + ":" + changes.contractData?.currentValue?.cUSTNM ?? '',
    //   "ContractID": changes.contractData?.currentValue?.cONID ?? '',
    //   "PayBasis": changes.contractData?.currentValue?.pBAS ?? '',
    //   "ContractStartDate": changes.contractData?.currentValue?.cSTARTDT ?? '',
    //   "Expirydate": changes.contractData?.currentValue?.cENDDT ?? '',
    //   "cSCAN": changes.contractData?.currentValue?.cSCAN ?? '',
    //   "cPOSCAN": changes.contractData?.currentValue?.cPOSCAN ?? '',
    //   "AccountManager": changes.contractData?.currentValue?.aCMGR ?? '',
    //   "CustomerPONo": changes.contractData?.currentValue?.cPONO ?? '',
    //   "POValiditydate": changes.contractData?.currentValue?.cPODt ?? '',
    // }
  }

  SetDefaultProductsData() {
    this.SetDefaultInsuranceCarrierRiskSelectionData();
    this.SetDefaultFuelSurchargeData();
    this.ProductsForm.get("loadType").setValue(
      this.LoadtypedetailFromAPI.find(
        (item) => item.name == this.contractData.lTYP
      )
    );
    let rakeList = [];
    if (this.contractData.rTYP) {
      this.contractData.rTYP.forEach((element) => {
        const rType = this.RatetypedetailFromAPI.find((x) => x.name == element);
        if (rType) {
          rakeList.push(rType);
        }
      });
    }
    this.ProductsForm.get("rateTypecontrolHandler").setValue(
      rakeList ? rakeList : []
    );
    this.CODDODForm.get("CODDODRatetype").setValue(
      this.CODDODRatetypeFromAPI.find(
        (item) => item.name == this.contractData.cODDODRTYP
      )
    );
    this.CODDODForm.get("Rate").setValue(this.contractData.rT);
    this.CODDODForm.get("MinCharge").setValue(this.contractData.mIN);
    this.CODDODForm.get("MaxCharge").setValue(this.contractData.mAX);
    this.CutOfftimeForm.get("Timeofday").setValue(this.contractData.tDT);
    this.CutOfftimeForm.get("AdditionalTransitdays").setValue(
      this.contractData.dAYS
    );
    this.DemurrageForm.get("Freestoragedays").setValue(this.contractData.fSDAY);
    this.DemurrageForm.get("DRatetype").setValue(
      this.DemurrageRatetypeFromAPI.find(
        (item) => item.name == this.contractData.dRTYP
      )
    );
    this.DemurrageForm.get("Demurragerateperday").setValue(
      this.contractData.dMRTPD
    );
    this.DemurrageForm.get("DMinCharge").setValue(this.contractData.mIN);
    this.DemurrageForm.get("DMaxCharge").setValue(this.contractData.mAX);
    this.VolumtericForm.get("VolumetricUoM").setValue(
      this.VolumetricUoMFromAPI.find(
        (item) => item.name == this.contractData.vUOM
      )
    );
    this.VolumtericForm.get("Volumetricapplied").setValue(this.VolumetricappliedFromAPI.find(
        (item) => item.name == this.contractData.vAPP
      )
    );
    this.VolumtericForm.get("Volumtericcalculation").setValue(this.VolumtericcalculationFromAPI.find(
      (item) => item.name == this.contractData.vCAL
    )
    );
    this.VolumtericForm.get("Conversionratio").setValue(this.contractData.cN);
    this.YieldProtectionForm.get("MinimumweightKg").setValue(
      this.contractData.mWKG
    );
    this.YieldProtectionForm.get("MinimumpackagesNo").setValue(
      this.contractData.mPKGNO
    );
    this.YieldProtectionForm.get("MinimumFreightvalueINR").setValue(
      this.contractData.mFREIGHT
    );
    this.YieldProtectionForm.get("Yieldtype").setValue(
      this.YieldTypeFromAPI.find(
        (item) => item.name == this.contractData.yIELDTYP
      )
    );
    this.YieldProtectionForm.get("MinimumyieldINR").setValue(
      this.contractData.mYIELD
    );
    this.YieldProtectionForm.get("CalculateYieldon").setValue(
      this.CalculateYieldonFromAPI.find(
        (item) => item.name == this.contractData.cYIELDON
      )
    );
    // Store the values in session storage
    sessionStorage.setItem(
      "ServiceSelectiondata",
      JSON.stringify(this.ProductsForm.value)
    );

    // const originRateOption = {
    //   name: this.contractData.oRTNM,
    //   value: this.contractData.oRTVAL,
    // }
    // const destinationRateOption = {
    //   name: this.contractData.dRTNM,
    //   value: this.contractData.dRTVAL,
    // }
    // this.ProductsForm.get("originRateOption").setValue(originRateOption)
    // this.ProductsForm.get("destinationRateOption").setValue(destinationRateOption)

    const mydata = [
      "COD/DOD",
      "cutofftime",
      "Demurrage",
      "Volumetric",
      "YieldProtection",
      "Insurance",
      "fuelSurcharge",
    ];
    mydata.forEach((item) => {
      const event = {
        field: {
          name: item,
        },
        eventArgs: {
          checked: true,
        },
      };
      this.ServicesForm.get(event.field.name).setValue(event.eventArgs.checked);
      this.OnChangeServiceSelections(event);
    });
  }

  SaveProduct(event) {
    let contractDetails = {};
    contractDetails["lTYP"] = this.ProductsForm.value.loadType.name;
    contractDetails["rTYP"] =
      this.ProductsForm.value.rateTypecontrolHandler.map((x) => x.name);
    // contractDetails["oRTNM"] = this.ProductsForm.value.originRateOption.name;
    // contractDetails["oRTVAL"] = this.ProductsForm.value.originRateOption.value;
    // contractDetails["dRTNM"] = this.ProductsForm.value.destinationRateOption.name;
    // contractDetails["dRTVAL"] = this.ProductsForm.value.destinationRateOption.value;
    contractDetails["cODDODRTYP"] = this.CODDODForm.value.CODDODRatetype.name;
    contractDetails["rT"] = this.CODDODForm.value.Rate;
    contractDetails["mIN"] = this.CODDODForm.value.MinCharge;
    contractDetails["mAX"] = this.CODDODForm.value.MaxCharge;
    contractDetails["tDT"] = this.CutOfftimeForm.value.Timeofday;
    contractDetails["dAYS"] = this.CutOfftimeForm.value.AdditionalTransitdays;
    contractDetails["fSDAY"] = this.DemurrageForm.value.Freestoragedays;
    contractDetails["dRTYP"] = this.DemurrageForm.value.DRatetype.name;
    contractDetails["dMRTPD"] = this.DemurrageForm.value.Demurragerateperday;
    contractDetails["mIN"] = this.DemurrageForm.value.DMinCharge;
    contractDetails["mAX"] = this.DemurrageForm.value.DMaxCharge;
    contractDetails["vUOM"] = this.VolumtericForm.value.VolumetricUoM.name;
    contractDetails["vCAL"] = this.VolumtericForm.value.Volumtericcalculation.name;
    contractDetails["vAPP"] = this.VolumtericForm.value.Volumetricapplied.name;
    contractDetails["cN"] = this.VolumtericForm.value.Conversionratio;
    contractDetails["mWKG"] = this.YieldProtectionForm.value.MinimumweightKg;
    contractDetails["mPKGNO"] =
      this.YieldProtectionForm.value.MinimumpackagesNo;
    contractDetails["mFREIGHT"] =
      this.YieldProtectionForm.value.MinimumFreightvalueINR;
    contractDetails["yIELDTYP"] = this.YieldProtectionForm.value.Yieldtype.name;
    contractDetails["mYIELD"] = this.YieldProtectionForm.value.MinimumyieldINR;
    contractDetails["cYIELDON"] = this.YieldProtectionForm.value.CalculateYieldon.name;

    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract",
      filter: { _id: this.contractData._id },
      update: { ...contractDetails },
    };

    this.masterService.masterPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
         // this.InsuranceCarrierRiskSelectionSave();
          //this.FuelSurchargeDataSave();
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: res.message,
            showConfirmButton: true,
          });
          this.Route.navigateByUrl(
            "/Masters/CustomerContract/CustomerContractList"
          );
        }
      },
    });
  }

  async InsuranceCarrierRiskSelectionSave(requestBody) {
    const tableData = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_insurance",
      data: requestBody,
    };
   await this.masterService.masterPost("generic/create", tableData).toPromise();
   return true
  }

  SetDefaultInsuranceCarrierRiskSelectionData() {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_insurance",
      filter: { cONID: this.contractData.cONID },
    };
    this.masterService.masterPost("generic/get", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.tableData = res.data;
          this.tableData.forEach((item) => {
            item.id=item._id,
            item.InvoiceValueFrom=item.iVFROM,
            item.tovalue=item.iVTO,
            item.rateType=item.rtType,
            item.Rate=item.rT,
            item.MinCharge=item.mIN,
            item.MaxCharge=item.mAX,
            item.actions = ["Edit", "Remove"];

          });
          this.tableLoad = false;
        }
      },
    });
  }

  async FuelSurchargeDataSave(requestBody) {
    debugger
    const removeFields = ['actions', '_id'];
    const data = [requestBody].find((x) => !removeFields.includes(x));
    const FtableData = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_fuelsurcharge",
      data: data,
    };
    //delete requestBody.id
    //delete requestBody.actions
   await this.masterService.masterPost("generic/create", FtableData).toPromise();
   return true
  }

  SetDefaultFuelSurchargeData() {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_fuelsurcharge",
      filter: { cONID: this.contractData.cONID },
    };
    //delete InsuranceCarrierRiskSelectiondetails._id;
    this.masterService.masterPost("generic/get", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.FtableData = res.data;
          this.FtableData.forEach((item) => {
            item.id=item._id,
            item.actions = ["Edit", "Remove"];
          });
          this.FtableLoad = false;
        }
      },
    });
  }

  async removedata(id){
    const reqBody={
      companyCode:this.companyCode,
      collectionName:"cust_contract_insurance",
      filter:{_id:id},
    }
    const res= await this.masterService.masterMongoRemove("generic/remove",reqBody).toPromise();
    return res;

  }

  async Fremovedata(id){
    const reqBody={
      companyCode:this.companyCode,
      collectionName:"cust_contract_fuelsurcharge",
      filter:{_id:id},
    }
    const res= await this.masterService.masterMongoRemove("generic/remove",reqBody).toPromise();
    return res;

  }
}
