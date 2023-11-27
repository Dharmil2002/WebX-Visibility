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
  implements OnInit {
  companyCode: number | null;
  @Input() contractData: any;
  //#region Form Configration Fields
  ContractServiceSelectionControls: ContractServiceSelectionControl;
  EventButton = {
    functionName: "SaveServiceSelection",
    name: "Save",
    iconName: "save",
  };
  InsuranceEventButton = {
    functionName: "addInsuranceData",
    name: "Add New",
    iconName: "add",
  };
  FuelSurchargeEventButton = {
    functionName: "FuelSurchargeAddData",
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

  InsurancecolumnHeader = {
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
    IMinCharge: {
      Title: "Min Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    IMaxCharge: {
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
    FuelType: {
      Title: "Fule Type",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    FRateType: {
      Title: "Rate Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    FRate: {
      Title: "Rate",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    FMinCharge: {
      Title: "Mix Charge",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    FMaxCharge: {
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
  staticField = ["InvoiceValueFrom","tovalue","rateType","Rate","IMinCharge","IMaxCharge"];
  FstaticField = ["FuelType","FRateType","FRate","FMinCharge","FMaxCharge"];

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

  isUpdate = false;
  UpdateData: any
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

  async addInsuranceData() {
    this.tableLoad = this.isLoad = true;
    const tableData = this.tableData;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    const formValue = this.InsuranceCarrierRiskForm.value;
    const json = {
      id: tableData.length + 1,
      InvoiceValueFrom: formValue.InvoiceValueFrom,
      tovalue: formValue.tovalue,
      rateType: formValue.rateType.name,
      Rate: formValue.Rate,
      IMinCharge: formValue.IMinCharge,
      IMaxCharge: formValue.IMaxCharge,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    const requestBody = {
      _id: `${this.companyCode}-${this.contractData.cONID}-${tableData.length}`,
      cID: this.companyCode,
      cONID: this.contractData.cONID,
      iVFROM: formValue.InvoiceValueFrom,
      iVTO: formValue.tovalue,
      rtType: formValue.rateType.name,
      rT: formValue.Rate,
      mIN: formValue.IMinCharge,
      mAX: formValue.IMaxCharge,
    };
    if (this.isUpdate) {
      delete requestBody._id;
      delete requestBody.cID;
      delete requestBody.cONID;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_insurance",
      filter: this.isUpdate ? { cONID: this.UpdateData.cONID } : undefined,
      update: this.isUpdate ? requestBody : undefined,
      data: !this.isUpdate ? requestBody : undefined,
    };
    const method = this.isUpdate ? "generic/update" : "generic/create";
    const res = this.isUpdate
      ? await this.masterService.masterPut(method, req).toPromise()
      : await this.masterService.masterPost(method, req).toPromise();
    if (res.success) {
      this.isUpdate = false;
      this.SetDefaultInsuranceCarrierRiskSelectionData();
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
    // Clear form validators and reset values
    this.InsuranceCarrierRiskForm.reset();
    // Add the "required" validation rule
    Object.keys(this.InsuranceCarrierRiskForm.controls).forEach((key) => {
      this.InsuranceCarrierRiskForm.get(key).setValidators(Validators.required);
    });
    this.isLoad = this.tableLoad = false;
  }

  async FuelSurchargeAddData() {
    this.FtableLoad = this.isFLoad = true;
    const FtableData = this.FtableData;
    const formValue = this.FuelSurchargeForm.value;
    const json = {
      id: FtableData.length + 1,
      FuelType: formValue.FuelType.name,
      FRateType: formValue.FRateType.name,
      FRate: formValue.FRate,
      FMinCharge: formValue.FMinCharge,
      FMaxCharge: formValue.FMaxCharge,
      actions: ["Edit", "Remove"],
    };
    this.FtableData.push(json);
    const requestBody = {
      _id: `${this.companyCode}-${this.contractData.cONID}-${FtableData.length}`,
      cID: this.companyCode,
      cONID: this.contractData.cONID,
      fTYPE: formValue.FuelType.name,
      fRTYPE: formValue.FRateType.name,
      frT: formValue.FRate,
      fmIN: formValue.FMinCharge,
      fmAX: formValue.FMaxCharge,
    };
    if (this.isUpdate) {
      delete requestBody._id;
      delete requestBody.cID;
      delete requestBody.cONID;
    }
    const req = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_fuelsurcharge",
      filter: this.isUpdate ? { cONID: this.UpdateData.cONID } : undefined,
      update: this.isUpdate ? requestBody : undefined,
      data: !this.isUpdate ? requestBody : undefined,
    };
    const method = this.isUpdate ? "generic/update" : "generic/create";
    const res = this.isUpdate
      ? await this.masterService.masterPut(method, req).toPromise()
      : await this.masterService.masterPost(method, req).toPromise();
    if (res.success) {
      this.isUpdate = false;
      this.SetDefaultFuelSurchargeData();
      this.BindDataFromAPI()
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
    // Clear form validators and reset values
    const controls=["FuelType", "FRateType", "FRate", "FMinCharge", "FMaxCharge"]
    controls.forEach(element => {
      this.FuelSurchargeForm.controls[element].setValue("");
    });
   // this.FuelSurchargeForm.reset();
    // Add the "required" validation rule
    Object.keys(this.FuelSurchargeForm.controls).forEach((key) => {
      this.FuelSurchargeForm.get(key).setValidators(Validators.required);
    });
    this.isFLoad = this.FtableLoad = false;
  }

  handleMenuItemClick(data) {
    this.fillServiceSelectionData(data);
  }
  FhandleMenuItemClick(data) {
    this.FfillServiceSelectionData(data);
  }

  async fillServiceSelectionData(data: any) {
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
      this.InsuranceCarrierRiskForm.controls["IMinCharge"].setValue(
        data.data?.IMinCharge || ""
      );
      this.InsuranceCarrierRiskForm.controls["IMaxCharge"].setValue(
        data.data?.IMaxCharge || ""
      );
      this.UpdateData = this.tableData.find((x) => x.id == data.data.id)
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      this.isUpdate = true;
    }
  }
  async FfillServiceSelectionData(data: any) {
    if (data.label.label === "Remove") {
      this.FtableData = this.FtableData.filter((x) => x.id !== data.data.id);
      await this.removedata(data.data.id);
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
      this.UpdateData = this.FtableData.find((x) => x.id == data.data.id)
      this.tableData = this.FtableData.filter((x) => x.id !== data.data.id);
      this.isUpdate = true;
    }

  }
  ngOnChanges(changes: SimpleChanges) {}

  SetDefaultProductsData() {
    //#region  Set Default Products

    if (this.contractData?.lTYP != null) {
      this.ProductsForm.get("loadType").setValue(
        this.LoadtypedetailFromAPI.find(
          (item) => item.name == this.contractData.lTYP
        )
      );
    }

    if (this.contractData?.rTYP != null) {
      const rakeList = [];
      this.contractData.rTYP.forEach((element) => {
        const rType = this.RatetypedetailFromAPI.find((x) => x.name == element);
        if (rType) {
          rakeList.push(rType);
        }
      });
      this.ProductsForm.get("rateTypecontrolHandler").setValue(
        rakeList ? rakeList : []
      );
    }

    //#endregion

    //#region  Set Default Service Selection

    this.contractData?.sERVSELEC.forEach((item) => {
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
    //#endregion

    //#region  Set Default serviceHandlers
    const serviceHandlers = {
      Volumetric: () => {
        // Your logic for Volumetric

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

      },
      "COD/DOD": () => {
        // Your logic for COD/DOD
        this.CODDODForm.get("CODDODRatetype").setValue(
          this.CODDODRatetypeFromAPI.find(
            (item) => item.name == this.contractData.cODDODRTYP
          )
        );
        this.CODDODForm.get("Rate").setValue(this.contractData.rT);
        this.CODDODForm.get("MinCharge").setValue(this.contractData.mIN);
        this.CODDODForm.get("MaxCharge").setValue(this.contractData.mAX);
      },
      Demurrage: () => {
        // Your logic for Demurrage

        this.DemurrageForm.get("Freestoragedays").setValue(this.contractData.fSDAY);
        this.DemurrageForm.get("DRatetype").setValue(
          this.DemurrageRatetypeFromAPI.find(
            (item) => item.name == this.contractData.dRTYP
          )
        );
        this.DemurrageForm.get("Demurragerateperday").setValue(
          this.contractData.dMRTPD
        );
        this.DemurrageForm.get("DMinCharge").setValue(this.contractData.dMIN);
        this.DemurrageForm.get("DMaxCharge").setValue(this.contractData.dMAX);
      },
      Insurance: () => {
        // Your logic for Insurance
        this.SetDefaultInsuranceCarrierRiskSelectionData();

      },
      cutofftime: () => {
        // Your logic for cutofftime
        this.CutOfftimeForm.get("Timeofday").setValue(this.contractData.tDT);
        this.CutOfftimeForm.get("AdditionalTransitdays").setValue(
          this.contractData.dAYS
        );
      },
      YieldProtection: () => {
        // Your logic for YieldProtection
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
      },
      fuelSurcharge: () => {
       this.SetDefaultFuelSurchargeData();
      },
    };

    // Iterate over selected services and call the corresponding handler
    this.contractData.sERVSELEC.forEach((service) => {
      if (serviceHandlers.hasOwnProperty(service)) {
        serviceHandlers[service]();
      } else {
        // Default case
      }
    });
    //#endregion
  }

  SaveServiceSelection(event) {
    let hasError = false;  // Initialize the flag
    let contractDetails = {};
    const formValues = this.ServicesForm.value;

    // Use a Set for faster lookups
    const selectedServicesSet = new Set(
      Object.entries(formValues)
        .filter(([key, value]) => value === true)
        .map(([key]) => key)
    );

    // console.log(Array.from(selectedServicesSet)); // Convert Set back to an array if needed

    // Handle different cases using a mapping
    const serviceHandlers = {
      Volumetric: () => {
        // Your logic for Volumetric
        if (this.VolumtericForm.valid) {
          contractDetails["vUOM"] = this.VolumtericForm.value.VolumetricUoM.name;
          contractDetails["vCAL"] = this.VolumtericForm.value.Volumtericcalculation.name;
          contractDetails["vAPP"] = this.VolumtericForm.value.Volumetricapplied.name;
          contractDetails["cN"] = this.VolumtericForm.value.Conversionratio;
        }
        else {
          this.CommanSwalWithReturn("Please Fill Volumteric Forms Details Or UnChecked Service Selection", 'error')
          return
        }
      },
      "COD/DOD": () => {
        // Your logic for COD/DOD
        if (this.CODDODForm.valid) {
          contractDetails["cODDODRTYP"] = this.CODDODForm.value.CODDODRatetype.name;
          contractDetails["rT"] = this.CODDODForm.value.Rate;
          contractDetails["mIN"] = this.CODDODForm.value.MinCharge;
          contractDetails["mAX"] = this.CODDODForm.value.MaxCharge;
        } else {
          this.CommanSwalWithReturn("Please Fill COD/DOD Forms Details Or UnChecked Service Selection", 'error')
          hasError = true
        }
      },
      Demurrage: () => {
        // Your logic for Demurrage
        if (this.DemurrageForm.valid) {
          contractDetails["fSDAY"] = this.DemurrageForm.value.Freestoragedays;
          contractDetails["dRTYP"] = this.DemurrageForm.value.DRatetype.name;
          contractDetails["dMRTPD"] = this.DemurrageForm.value.Demurragerateperday;
          contractDetails["dMIN"] = this.DemurrageForm.value.DMinCharge;
          contractDetails["dMAX"] = this.DemurrageForm.value.DMaxCharge;
        }
        else {
          this.CommanSwalWithReturn("Please Fill Demurrage Forms Details Or UnChecked Service Selection", 'error')
          hasError = true
        }
      },
      Insurance: () => {
        // Your logic for Insurance
      },
      cutofftime: () => {
        // Your logic for cutofftime
        if (this.CutOfftimeForm.valid) {
          contractDetails["tDT"] = this.CutOfftimeForm.value.Timeofday;
          contractDetails["dAYS"] = this.CutOfftimeForm.value.AdditionalTransitdays;
        } else {
          this.CommanSwalWithReturn("Please Fill Cut Off Time Forms Details Or UnChecked Service Selection", 'error')
          hasError = true
        }
      },
      YieldProtection: () => {
        // Your logic for YieldProtection
        if (this.YieldProtectionForm.valid) {
          contractDetails["mWKG"] = this.YieldProtectionForm.value.MinimumweightKg;
          contractDetails["mPKGNO"] =
            this.YieldProtectionForm.value.MinimumpackagesNo;
          contractDetails["mFREIGHT"] =
            this.YieldProtectionForm.value.MinimumFreightvalueINR;
          contractDetails["yIELDTYP"] = this.YieldProtectionForm?.value?.Yieldtype?.name;
          contractDetails["mYIELD"] = this.YieldProtectionForm.value.MinimumyieldINR;
          contractDetails["cYIELDON"] = this.YieldProtectionForm.value?.CalculateYieldon?.name;
        } else {
          this.CommanSwalWithReturn("Please Fill Yield Protection Forms Details Or UnChecked Service Selection", 'error')
          hasError = true
        }
      },
      fuelSurcharge: () => {
        // Your logic for fuelSurcharge
      },
    };

    // Iterate over selected services and call the corresponding handler
    selectedServicesSet.forEach((service) => {
      if (serviceHandlers.hasOwnProperty(service)) {
        serviceHandlers[service]();
      } else {
        // Default case
      }
    });
    if (hasError) {
      return;  // Stop the execution if an error occurred
    }
    contractDetails["sERVSELEC"] = Array.from(selectedServicesSet);
    contractDetails["lTYP"] = this.ProductsForm.value.loadType.name;
    contractDetails["rTYP"] =
      this.ProductsForm.value.rateTypecontrolHandler.map((x) => x.name);
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract",
      filter: { _id: this.contractData._id },
      update: { ...contractDetails },
    };

    this.masterService.masterPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
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
            item.id = item._id,
              item.InvoiceValueFrom = item.iVFROM,
              item.tovalue = item.iVTO,
              item.rateType = item.rtType,
              item.Rate = item.rT,
              item.IMinCharge = item.mIN,
              item.IMaxCharge = item.mAX,
              item.actions = ["Edit", "Remove"];
          });
          this.tableLoad = false;
        }
      },
    });
  }

  SetDefaultFuelSurchargeData() {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_fuelsurcharge",
      filter: { cONID: this.contractData.cONID },
    };
    this.masterService.masterPost("generic/get", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.FtableData = res.data
          this.FtableData.forEach((item) => {
            item.id = item._id,
              item.FuelType = item.fTYPE,
              item.FRateType = item.fRTYPE,
              item.FRate = item.frT,
              item.FMinCharge = item.fmIN,
              item.FMaxCharge = item.fmAX;
              item.actions = ["Edit", "Remove"];
          });
          this.FtableLoad = false;
        }
      },
    });
    // const reqBody = {
    //   companyCode: this.companyCode,
    //   collectionName: "cust_contract_fuelsurcharge",
    //   filter: { cONID: this.contractData.cONID },
    // };
    // //delete InsuranceCarrierRiskSelectiondetails._id;
    // this.masterService.masterPost("generic/get", reqBody).subscribe({
    //   next: (res: any) => {
    //     if (res) {
    //       this.FtableData = res.data;
    //       this.FtableData.forEach((item) => {
    //         item.id = item._id,
    //           item.actions = ["Edit", "Remove"];
    //       });
    //       this.FtableLoad = false;
    //     }
    //   },
    // });

  }

  async removedata(id) {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_insurance",
      filter: { _id: id },
    }
    const res = await this.masterService.masterMongoRemove("generic/remove", reqBody).toPromise();
    return res;

  }

  async Fremovedata(id) {
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract_fuelsurcharge",
      filter: { _id: id },
    }
    const res = await this.masterService.masterMongoRemove("generic/remove", reqBody).toPromise();
    return res;

  }
  CommanSwalWithReturn(title, icon) {
    Swal.fire({
      title: title,
      toast: false,
      icon: icon,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: "OK"
    });
    //return
  }

  validateCodDodRates() {
    // Get the current values of 'min' and 'max' from the TERForm
    const MinCharge = Number(this.CODDODForm.get('MinCharge')?.value) ?? 0;
    const MaxCharge = Number(this.CODDODForm.get('MaxCharge')?.value) ?? 0;
    const DMinCharge = Number(this.DemurrageForm.get('DMinCharge')?.value) ?? 0;
    const DMaxCharge = Number(this.DemurrageForm.get('DMaxCharge')?.value) ?? 0;
    const FMinCharge = Number(this.FuelSurchargeForm.get('FMinCharge')?.value) ?? 0;
    const FMaxCharge = Number(this.FuelSurchargeForm.get('FMaxCharge')?.value) ?? 0;
    const IMinCharge = Number(this.InsuranceCarrierRiskForm.get('IMinCharge')?.value) ?? 0;
    const IMaxCharge = Number(this.InsuranceCarrierRiskForm.get('IMaxCharge')?.value) ?? 0;

    // Check if both 'min' and 'max' have valid numeric values and if 'min' is greater than 'max'
    if (MinCharge && MaxCharge && MinCharge > MaxCharge) {
      // Display an error message using SweetAlert (Swal)
      this.CommanSwalWithReturn('Max charge must be greater than or equal to Min charge.', 'error')

      // Reset the values of 'min' and 'max' in the TERForm to an empty string
      this.CODDODForm.patchValue({
        MinCharge: '',
        MaxCharge: ''
      });
      return;
    }
    if (DMinCharge && DMaxCharge && DMinCharge > DMaxCharge) {
      // Display an error message using SweetAlert (Swal)
      this.CommanSwalWithReturn('Max charge must be greater than or equal to Min charge.', 'error')

      // Reset the values of 'min' and 'max' in the TERForm to an empty string
      this.DemurrageForm.patchValue({
        DMinCharge: '',
        DMaxCharge: ''
      });
      return;
    }
    if (FMinCharge && FMaxCharge && FMinCharge > FMaxCharge) {
      // Display an error message using SweetAlert (Swal)
      this.CommanSwalWithReturn('Max charge must be greater than or equal to Min charge.', 'error')

      // Reset the values of 'min' and 'max' in the TERForm to an empty string
      this.FuelSurchargeForm.patchValue({
        FMinCharge: '',
        FMaxCharge: ''
      });
      return;
    }
    if (IMinCharge && IMaxCharge && IMinCharge > IMaxCharge) {
      // Display an error message using SweetAlert (Swal)
      this.CommanSwalWithReturn('Max charge must be greater than or equal to Min charge.', 'error')

      // Reset the values of 'min' and 'max' in the TERForm to an empty string
      this.InsuranceCarrierRiskForm.patchValue({
        IMinCharge: '',
        IMaxCharge: ''
      });
      return;
    }
  }
  checkInvoice(){
    const invoiceNo = this.InsuranceCarrierRiskForm.value.InvoiceValueFrom;
    const exists = this.tableData.some((x) => x.InvoiceValueFrom.includes(invoiceNo));
     if(exists){
      this.InsuranceCarrierRiskForm.controls['InvoiceValueFrom'].setValue("");
      Swal.fire({
        icon: "error",
        title: "Already Exist",
        text: "Invoice Value From Is Already Exist",
        showConfirmButton: true,
      });
     }

  }
}
