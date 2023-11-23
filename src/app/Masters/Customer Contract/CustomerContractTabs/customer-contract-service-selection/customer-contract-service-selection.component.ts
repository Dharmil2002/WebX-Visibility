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
  linkArray = [];
  addFlag = true;
  menuItemflag = true;
  data: any;
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
  menuItems = [{ label: "Edit" }, { label: "Remove" }];

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

  staticField = [
    "InvoiceValueFrom",
    "tovalue",
    "rateType",
    "Rate",
    "MinCharge",
    "MaxCharge",
  ];

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

  CODDODRatetypeList: any = [
    {
      value: "100001",
      name: "PerKG",
    },
  ];
  LoadtypedetailFromAPI: any;
  RatetypedetailFromAPI: any;
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
    this.filter.Filter(
      this.jsonControlArrayCODDODForm,
      this.CODDODForm,
      this.CODDODRatetypeList,
      "CODDODRatetype",
      true
    );
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
      id: tableData.length + 1,
      InvoiceValueFrom: this.InsuranceCarrierRiskForm.value.InvoiceValueFrom,
      tovalue: this.InsuranceCarrierRiskForm.value.tovalue,
      rateType: this.InsuranceCarrierRiskForm.value.rateType,
      Rate: this.InsuranceCarrierRiskForm.value.Rate,
      MinCharge: this.InsuranceCarrierRiskForm.value.MinCharge,
      MaxCharge: this.InsuranceCarrierRiskForm.value.MaxCharge,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(json);
    this.InsuranceCarrierRiskForm.reset();
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

  handleMenuItemClick(data) {
    this.fillContainer(data);
  }

  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
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
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
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
    this.ProductsForm.get("loadType").setValue(
      this.LoadtypedetailFromAPI.find(
        (item) => item.name == this.contractData.lTYP
      )
    );
    let rakeList=[]
    if (this.contractData.rTYP) {
      this.contractData.rTYP.forEach((element) => {
        const rType = this.RatetypedetailFromAPI.find(
          (x) => x.name == element
        );
        if (rType) {
          rakeList.push(rType);
        }
      });
    }
    this.ProductsForm.get("rateTypecontrolHandler").setValue(
      rakeList?rakeList:[]
    );
    this.CODDODForm.get("CODDODRatetype").setValue(
      this.CODDODRatetypeList.find(
        (item) => item.name == this.contractData.cODDODRTYP
      )
    );
    this.CODDODForm.get("Rate").setValue(this.contractData.rT);
    this.CODDODForm.get("MinCharge").setValue(this.contractData.mIN);
    this.CODDODForm.get("MaxCharge").setValue(this.contractData.mAX);
    this.CutOfftimeForm.get("Timeofday").setValue(this.contractData.tDT);
    this.CutOfftimeForm.get("AdditionalTransitdays").setValue(this.contractData.dAYS);
    this.DemurrageForm.get("Freestoragedays").setValue(this.contractData.fSDAY);
    this.DemurrageForm.get("Ratetype").setValue(this.contractData.dRTYP)
    this.DemurrageForm.get("Demurragerateperday").setValue(this.contractData.dMRTPD);
    this.DemurrageForm.get("MinCharge").setValue(this.contractData.mIN);
    this.DemurrageForm.get("MaxCharge").setValue(this.contractData.mAX);
    this.VolumtericForm.get("VolumetricUoM").setValue(this.contractData.vUOM);
    this.VolumtericForm.get("Volumtericcalculation").setValue(this.contractData.vCAL);
    this.VolumtericForm.get("Volumetricapplied").setValue(this.contractData.vAPP);
    this.VolumtericForm.get("Conversionratio").setValue(this.contractData.cN);
    this.YieldProtectionForm.get("MinimumweightKg").setValue(this.contractData.mWKG);
    this.YieldProtectionForm.get("MinimumpackagesNo").setValue(this.contractData.mPKGNO);
    this.YieldProtectionForm.get("MinimumFreightvalueINR").setValue(this.contractData.mFREIGHT);
    this.YieldProtectionForm.get("Yieldtype").setValue(this.contractData.yIELDTYP);
    this.YieldProtectionForm.get("MinimumyieldINR").setValue(this.contractData.mYIELD);
    this.YieldProtectionForm.get("CalculateYieldon").setValue(this.contractData.cYIELDON);
    // this.InsuranceCarrierRiskForm.get("InvoiceValueFrom").setValue(this.contractData.iVF);
    // this.InsuranceCarrierRiskForm.get("InvoiceValueFrom").setValue(this.contractData.iVF);
    // this.InsuranceCarrierRiskForm.get("tovalue").setValue(this.contractData.tV);
    // this.InsuranceCarrierRiskForm.get("rateType").setValue(this.contractData.iRTYP);
    // this.InsuranceCarrierRiskForm.get("Rate").setValue(this.contractData.rate);
    // this.InsuranceCarrierRiskForm.get("MinCharge").setValue(this.contractData.mNCHG);
    // this.InsuranceCarrierRiskForm.get("MaxCharge").setValue(this.contractData.mXCHG);
    // Store the values in session storage
    sessionStorage.setItem('ServiceSelectiondata', JSON.stringify(this.ProductsForm.value));

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

    const mydata = ["COD/DOD","cutofftime","Demurrage","Volumetric","YieldProtection","Insurance"];
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
    let contractDetails = this.contractData;
    contractDetails.lTYP = this.ProductsForm.value.loadType.name;
    contractDetails.rTYP = this.ProductsForm.value.rateTypecontrolHandler.map(
      (x) => x.name
    );
    // contractDetails.oRTNM = this.ProductsForm.value.originRateOption.name;
    // contractDetails.oRTVAL = this.ProductsForm.value.originRateOption.value;
    // contractDetails.dRTNM = this.ProductsForm.value.destinationRateOption.name;
    // contractDetails.dRTVAL = this.ProductsForm.value.destinationRateOption.value;
    contractDetails.cODDODRTYP = this.CODDODForm.value.CODDODRatetype.name;
    contractDetails.rT = this.CODDODForm.value.Rate;
    contractDetails.mIN = this.CODDODForm.value.MinCharge;
    contractDetails.mAX = this.CODDODForm.value.MaxCharge;
    contractDetails.tDT = this.CutOfftimeForm.value.Timeofday;
    contractDetails.dAYS = this.CutOfftimeForm.value.AdditionalTransitdays;
    contractDetails.fSDAY = this.DemurrageForm.value.Freestoragedays;
    contractDetails.dRTYP = this.DemurrageForm.value.Ratetype;
    contractDetails.dMRTPD = this.DemurrageForm.value.Demurragerateperday;
    contractDetails.mIN = this.DemurrageForm.value.MinCharge;
    contractDetails.mAX = this.DemurrageForm.value.MaxCharge;
    contractDetails.vUOM = this.VolumtericForm.value.VolumetricUoM;
    contractDetails.vCAL = this.VolumtericForm.value.Volumtericcalculation;
    contractDetails.vAPP = this.VolumtericForm.value.Volumetricapplied;
    contractDetails.cN = this.VolumtericForm.value.Conversionratio;
    contractDetails.mWKG = this.YieldProtectionForm.value.MinimumweightKg;
    contractDetails.mPKGNO = this.YieldProtectionForm.value.MinimumpackagesNo;
    contractDetails.mFREIGHT = this.YieldProtectionForm.value.MinimumFreightvalueINR;
    contractDetails.yIELDTYP = this.YieldProtectionForm.value.Yieldtype;
    contractDetails.mYIELD = this.YieldProtectionForm.value.MinimumyieldINR;
    contractDetails.cYIELDON = this.YieldProtectionForm.value.CalculateYieldon;
    // contractDetails.iVF = this.InsuranceCarrierRiskForm.value.InvoiceValueFrom;
    // contractDetails.tV = this.InsuranceCarrierRiskForm.value.tovalue;
    // contractDetails.iRTYP = this.InsuranceCarrierRiskForm.value.rateType;
    // contractDetails.rate = this.InsuranceCarrierRiskForm.value.Rate;
    // contractDetails.mNCHG = this.InsuranceCarrierRiskForm.value.MinCharge;
    // contractDetails.mXCHG = this.InsuranceCarrierRiskForm.value.MaxCharge;

      const reqBody = {
      companyCode: this.companyCode,
      collectionName: "cust_contract",
      filter: { _id: this.contractData._id },
      update: { ...contractDetails },
    };

     delete contractDetails._id;

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
}
