import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import {
  ConsignmentControl,
  FreightControl,
} from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorsForAutoComplete } from "../job-entry-page/job-entry-utility";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { financialYear, formatDate } from "src/app/Utility/date/date-utils";
import { removeFieldsFromArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { xlsxutilityService } from "src/app/core/service/Utility/xlsx Utils/xlsxutility.service";
import { XlsxPreviewPageComponent } from "src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component";
import { MatDialog } from "@angular/material/dialog";
import {
  getVehicleStatusFromApi,
  getcontainerstatusFromApi,
} from "../assign-vehicle-page/assgine-vehicle-utility";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { autocompleteObjectValidator } from "src/app/Utility/Validation/AutoComplateValidation";
import { PrqService } from "../../Utility/module/operation/prq/prq.service";
import { StorageService } from "src/app/core/service/storage.service";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { DocketEntryModel } from "src/app/Models/Docket/docket.model";
import { firstValueFrom } from "rxjs";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import moment from "moment";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import {
  SACInfo,
  VoucherDataRequestModel,
  VoucherInstanceType,
  VoucherRequestModel,
  VoucherType,
  ledgerInfo,
} from "src/app/Models/Finance/Finance";
import { AddressService } from "src/app/Utility/module/masters/Address/address.service";
import {
  ConvertToNumber,
  generateCombinations,
  isValidNumber,
} from "src/app/Utility/commonFunction/common";
import { StoreKeys } from "src/app/config/myconstants";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { DocCalledAsModel } from "src/app/shared/constants/docCalledAs";
import { ClusterMasterService } from "src/app/Utility/module/masters/cluster/cluster.master.service";
import { InvoiceServiceService } from "src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service";
import { CustomerBillStatus } from "src/app/Models/docStatus";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { getApiCompanyDetail } from "src/app/finance/invoice-summary-bill/invoice-utility";
@Component({
  selector: "app-consignment-entry-form",
  templateUrl: "./consignment-entry-form.component.html",
})

/*Please organize the code in order of priority, with the code that is used first placed at the top.*/
export class ConsignmentEntryFormComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  breadscrums = [
    {
      title: "Consignment Entry",
      items: ["Operation"],
      active: "ConsignmentForm",
    },
  ];
  expanded = false;
  backPath: string;
  isSubmit: boolean = false;
  isUpdate: boolean;
  loadIn: boolean;
  isLoad: boolean = false;
  tableLoadIn: boolean = true;
  tableLoad: boolean = true;
  isTableLoad: boolean = true;
  menuItemflag: boolean = true;
  contFlag: boolean;
  marketVendor: boolean;
  ccbp: boolean = true;
  addFlag: boolean = true;
  ewayBill: boolean = false;
  prqFlag: boolean;
  jsonControlArray: any;
  NonFreightjsonControlArray: any;
  jsonInvoiceDetail: any;
  jsonControlArrayConsignor: any;
  jsonControlArrayConsignee: any;
  jsonEwayBill: any;
  jsonControlArrayBasic: any;
  jsonContainerDetail: any;
  packagingTypes: AutoComplete[];
  paymentBases: AutoComplete[];
  movementTypes: AutoComplete[];
  vendorTypes: AutoComplete[];
  deliveryTypes: AutoComplete[];
  rateTypes: AutoComplete[];
  wtUnits: AutoComplete[];
  riskTypes: AutoComplete[];
  issueFrom: AutoComplete[];
  products: AutoComplete[];
  NonFreightAmount = 0;
  linkArray = [];
  NonFreightLoaded = false;
  VoucherRequestModel = new VoucherRequestModel();
  VoucherDataRequestModel = new VoucherDataRequestModel();
  DocCalledAs: DocCalledAsModel;
  InvoiceDetailsList: { count: any; title: string; class: string }[];
  matrials: AutoComplete[];
  rules: any[] = [];
  alpaNumber: boolean;
  sequence: boolean;
  isBrachCode: boolean;
  fyear: boolean;
  length: number = 0;
  mseq: boolean;
  lastDoc: string;
  isManual: boolean;
  checkboxChecked: boolean; // Checkbox is checked by default
  dcrDetail = {};
  conLoc: boolean;
  pageLoad: boolean;
  LoadType: any;
  isBoth: boolean = false;
  /*in constructor inilization of all the services which required in this type script*/
  constructor(
    private fb: UntypedFormBuilder,
    private navService: NavigationService,
    private model: DocketEntryModel,
    private masterService: MasterService,
    private customerService: CustomerService,
    private filter: FilterUtils,
    private vehicleStatusService: VehicleStatusService,
    private route: Router,
    private operationService: OperationService,
    public xlsxUtils: xlsxutilityService,
    private matDialog: MatDialog,
    private generalService: GeneralService,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private prqService: PrqService,
    private consigmentUtility: ConsigmentUtility,
    private storage: StorageService,
    private docketService: DocketService,
    public snackBarUtilityService: SnackBarUtilityService,
    private addressService: AddressService,
    private voucherServicesService: VoucherServicesService,
    private controlPanel: ControlPanelService,
    private dcrService: DCRService,
    private clusterService: ClusterMasterService,
    private invoiceServiceService: InvoiceServiceService,
    private stateService: StateService,
  ) {
    super();
    this.DocCalledAs = controlPanel.DocCalledAs;
    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Entry`,
        items: ["Operation"],
        active: `${this.DocCalledAs.Docket} Entry`,
      },
    ];

    const navigationState =
      this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.isUpdate =
        navigationState.hasOwnProperty("actions") &&
        navigationState.actions[0] === `Edit ${this.DocCalledAs.Docket}`;

      if (this.isUpdate) {
        this.model.docketDetail = navigationState;
        this.breadscrums = [
          {
            title: `${this.DocCalledAs.Docket} Edit`,
            items: ["Operations"],
            active: `${this.DocCalledAs.Docket}`,
          },
        ];
        this.ewayBill = false;
      } else {
        this.model.docketDetail = new DocketDetail({});
        this.model.prqData = navigationState;
        this.prqFlag = true;
        this.ewayBill = false;
        this.breadscrums = [
          {
            title: `${this.DocCalledAs.Docket} Entry`,
            items: ["Operations"],
            active: `${this.DocCalledAs.Docket}`,
          },
        ];
      }
    } else {
      this.model.docketDetail = new DocketDetail({});
    }
    const docketDetailsPromise = this.docketService
      .docketObjectMapping(this.model.docketDetail)
      .then((res) => {
        return res; // Return the result for further chaining
      });
    docketDetailsPromise
      .then((docketDetails) => {
        this.model.ConsignmentFormControls = new ConsignmentControl(
          docketDetails,
          this.generalService,
          this.DocCalledAs
        );
        this.model.FreightFromControl = new FreightControl(
          docketDetails,
          this.generalService,
          this.DocCalledAs,
        );
        return Promise.all([
          this.model.ConsignmentFormControls.applyFieldRules(
            this.storage.companyCode
          ),
          this.model.FreightFromControl.applyFieldRules(
            this.storage.companyCode
          ),
        ]);
      })
      .then(() => {
        this.initializeFormControl();
      })
      .catch((error) => {
        // Handle errors if any of the promises fail
        console.error("An error occurred:", error);
      });
  }

  ngOnInit(): void {
    this.getGeneralmasterData().then(() => {
      this.bindDataFromDropdown();
      // this.InvockedContract()
      this.isTableLoad = false;
    });
    this.backPath = "/dashboard/Index?tab=6";
  }

  /*Here the function which is used for the bind staticDropdown Value*/
  async getGeneralmasterData() {
    const gmData = await this.generalService.getGeneralMasterData([
      "PKGS",
      "PAYTYP",
      "MOVTYP",
      "VENDTYPE",
      "DELTYP",
      "RTTYP",
      "WTUNIT",
      "RISKTYP",
      "PROD",
      "LT"
    ]);

    this.packagingTypes = gmData.filter((x) => x.type == "PKGS");
    this.paymentBases = gmData.filter((x) => x.type == "PAYTYP");
    this.movementTypes = gmData.filter((x) => x.type == "MOVTYP");
    this.vendorTypes = gmData.filter((x) => x.type == "VENDTYPE");
    this.deliveryTypes = gmData.filter((x) => x.type == "DELTYP");
    this.rateTypes = gmData.filter((x) => x.type == "RTTYP");
    this.wtUnits = gmData.filter((x) => x.type == "WTUNIT");
    this.riskTypes = gmData.filter((x) => x.type == "RISKTYP");
    this.LoadType = gmData.filter((x) => x.type == "LT");
    // this.issueFrom = await this.generalService.getGeneralMasterData("ISSFRM");
    this.products = await this.generalService.getDataForAutoComplete(
      "product_detail",
      { companyCode: this.storage.companyCode },
      "ProductName",
      "ProductID"
    );
    this.matrials = gmData.filter((x) => x.type == "PROD");

    // Find the form control with the name 'packaging_type'
    this.setGeneralMasterData(
      this.model.allformControl,
      this.packagingTypes,
      "packaging_type"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.paymentBases,
      "payType"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.movementTypes,
      "movementType"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.products,
      "transMode"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.vendorTypes,
      "vendorType"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.deliveryTypes,
      "delivery_type"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.wtUnits,
      "weight_in"
    );
    this.setGeneralMasterData(
      this.model.allformControl,
      this.riskTypes,
      "risk"
    );
    // this.setGeneralMasterData(this.model.allformControl, this.issueFrom, "issuing_from");
    const rateType = this.rateTypes.filter((x) => x.value != "RTTYP-0007");
    this.setGeneralMasterData(
      this.jsonControlArray,
      rateType,
      "freightRatetype"
    );
    const prodCode = this.products.find((x) => x.name == "Road")?.value || "";
    this.model.consignmentTableForm.controls["transMode"].setValue(prodCode);
    this.filter.Filter(
      this.jsonInvoiceDetail,
      this.model.invoiceTableForm,
      this.matrials,
      "materialName",
      false
    );
  }

  setGeneralMasterData(
    controls: any[],
    data: AutoComplete[],
    controlName: string
  ) {
    const control = controls.find((x) => x.name === controlName);
    if (control) {
      control.value = data;
    }
  }

  /* End*/
  //#region initializeFormControl
  async initializeFormControl() {
    // Create LocationFormControls instance to get form controls for different sections
    // Get form controls for Driver Details section
    this.jsonControlArrayBasic =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "Basic"
      );

    this.jsonControlArrayConsignor =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignor"
      );
    this.jsonControlArrayConsignee =
      this.model.ConsignmentFormControls.getConsignmentControlControls().filter(
        (x) => x.additionalData && x.additionalData.metaData === "consignee"
      );
    this.model.allformControl = [
      ...this.jsonControlArrayBasic,
      ...this.jsonControlArrayConsignor,
      ...this.jsonControlArrayConsignee,
    ];
    this.jsonControlArray =
      this.model.FreightFromControl.getFreightControlControls();
    this.NonFreightjsonControlArray =
      this.model.FreightFromControl.getFreightControlControls();
    this.jsonContainerDetail =
      this.model.ConsignmentFormControls.getContainerDetail();
    this.jsonInvoiceDetail =
      this.model.ConsignmentFormControls.getInvoiceDetail();
    this.jsonEwayBill = this.model.ConsignmentFormControls.getEwayBillDetail();
    /*market vechile form group*/
    this.model.jsonMarketVehicle =
      this.model.ConsignmentFormControls.getMarketVehicle();
    /*End*/
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.model.consignmentTableForm = formGroupBuilder(this.fb, [
      this.model.allformControl,
    ]);
    this.model.FreightTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);

    this.model.containerTableForm = formGroupBuilder(this.fb, [
      this.jsonContainerDetail,
    ]);
    this.model.invoiceTableForm = formGroupBuilder(this.fb, [
      this.jsonInvoiceDetail,
    ]);
    this.model.ewayBillTableForm = formGroupBuilder(this.fb, [
      this.jsonEwayBill,
    ]);
    this.commonDropDownMapping();
    this.model.consignmentTableForm.controls["payType"].setValue("P02");
    this.model.consignmentTableForm.controls["transMode"].setValue("P1");
    this.model.consignmentTableForm.controls["risk"].setValue("O");
    this.model.consignmentTableForm.controls["delivery_type"].setValue("DD");

    const filteredMode = this.model.movementType.find(
      (item) => item.name == this.storage.mode
    ).value;
    this.model.consignmentTableForm.controls["movementType"].setValue(
      filteredMode
    );

    if (this.model.prqData) {
      this.model.consignmentTableForm.controls["prqNo"].setValue({
        name: this.model.prqData.prqNo,
        value: this.model.prqData?.prqNo,
      });
    }
    this.pageLoad = true;
    if (!this.isUpdate) {
      this.getRules();
    }
    this.onRcmChange();
    this.model.FreightTableForm.controls["rcm"].setValue('Y');
    this.model.FreightTableForm.controls["gstAmount"].disable();
    this.model.FreightTableForm.controls["gstChargedAmount"].disable();
  }
  //#endregion
  getContainerType(event) {
    const containerType =
      this.model.containerTableForm.controls["containerType"].value.value;
    const containerCapacity = this.model.containerTypeList.find(
      (x) => x.name.trim() === containerType.trim()
    );
    this.model.containerTableForm.controls["containerCapacity"].setValue(
      containerCapacity.loadCapacity
    );
  }
  //#region functionCallHandler
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion
  async prqDetail() {
    const prqData = this.model.prqData;
    let billingParty = {
      name: this.model.prqData?.billingParty,
      value: this.model.prqData?.billingPartyCode,
    };
    //await this.customerService.getCustomerByCodeOrName(undefined, this.model.prqData?.billingParty);

    let vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.model.prqData.prqNo
    );

    /*below i can condition like this because there are few issue in Master so Managed
    Diffrent variaty of the data i did like this in future also removed this condition this is managed by it self
    issue Found in Vehicle and Vendor Master*/
    let vehType;
    if (vehicleDetail.vendorType == "Market") {
      vehType = this.vendorTypes.find(
        (f) => f.name == vehicleDetail?.vendorType
      );
    } else {
      vehType = this.vendorTypes.find(
        (f) => f.value == vehicleDetail?.vendorTypeCode
      );
    }
    /*End*/
    this.setFormValue(
      this.model.consignmentTableForm,
      "fromCity",
      this.model.prqData,
      true,
      "fromCity",
      "fromCity"
    );
    this.setFormValue(
      this.model.consignmentTableForm,
      "toCity",
      this.model.prqData,
      true,
      "toCity",
      "toCity"
    );
    await this.getLocBasedOnCity();
    this.setFormValue(
      this.model.consignmentTableForm,
      "billingParty",
      billingParty
    );
    this.setFormValue(
      this.model.consignmentTableForm,
      "payType",
      this.model.prqData?.payTypeCode
    );
    this.setFormValue(
      this.model.consignmentTableForm,
      "docketDate",
      this.model.prqData?.pickupDate
    );
    this.setFormValue(this.model.consignmentTableForm, "pAddress", {
      name: this.model.prqData?.pAddressName,
      value: this.model.prqData?.pAddress || "A8888",
    });
    this.setFormValue(this.model.consignmentTableForm, "cnebp", false);
    this.setFormValue(this.model.consignmentTableForm, "cnbp", true);
    this.setFormValue(
      this.model.consignmentTableForm,
      "vendorType",
      vehType.value,
      false,
      "",
      ""
    );

    // Done By Harikesh
    const autoBillingConfigs = [
      { name: "cnbp", checked: true },
      { name: "cnebp", checked: false },
    ];

    autoBillingConfigs.forEach((config) => {
      const autoBillingData = {
        eventArgs: { checked: config.checked },
        field: { name: config.name },
      };
      this.onAutoBillingBased(autoBillingData);
    });

    await this.vendorFieldChanged();

    if (vehType.value == "4") {
      this.setFormValue(
        this.model.consignmentTableForm,
        "vendorName",
        vehicleDetail.vendor
      );
      this.setFormValue(
        this.model.consignmentTableForm,
        "vehicleNo",
        this.model.prqData?.vehicleNo,
        false
      );
    } else {
      let vendors = await getVendorsForAutoComplete(
        this.masterService,
        vehicleDetail.vendor,
        parseInt(vehType.value)
      );
      const vendor = vendors[0];
      this.setFormValue(this.model.consignmentTableForm, "vendorName", vendor);
      this.model.consignmentTableForm.controls["vehicleNo"].setValue({
        name: this.model.prqData?.vEHNO || "",
        value: this.model.prqData?.vEHNO || "",
      });

      //this.setFormValue(this.model.consignmentTableForm, "vendorName", vehicleDetail, true, "vendor", "vendor");
      //this.setFormValue(this.model.consignmentTableForm, "vehicleNo", this.model.prqData?.vehicleNo, true,"vehicleNo","vehicleNo");
    }

    if (this.model.prqData.carrierTypeCode == "3") {
      this.model.containerTableForm.controls["containerType"].setValue({
        name: this.model.prqData?.typeContainer || "",
        value: this.model.prqData?.typeContainerCode || "",
      });
      this.model.containerTableForm.controls["containerCapacity"].setValue(
        this.model.prqData?.size || 0
      );
    }
    const prodCode = this.products.find((x) => x.name == "Road")?.value || "";
    this.setFormValue(this.model.consignmentTableForm, "transMode", prodCode);
  }

  setFormValue(
    formGroup: UntypedFormGroup,
    controlId: string,
    value: any,
    isNameValue: boolean = false,
    valueField: string = "",
    nameField: string = "",
    callback: () => void = () => { }
  ) {
    if (isNameValue) {
      formGroup.controls[controlId].setValue({
        name: value[nameField] ?? "",
        value: value[valueField] ?? "",
      });
    } else {
      formGroup.controls[controlId].setValue(value);
    }
    callback();
  }
  async bindDataFromDropdown() {
    const locDetails = this.storage.getItemObject<any>(StoreKeys.WorkingLoc);
    if (!locDetails || locDetails?.locLevel == 1) {
      Swal.fire({
        icon: "info", // Change the icon to 'info' for an informational message
        title: "Information", // Update the title to reflect the nature of the message
        text:
          "Creating consignment is not allowed in " +
          this.storage.branch +
          " branch.", // Modify the text for clarity and proper spacing
        timer: 2000, // You can adjust the timer duration if needed
        showCancelButton: false, // Keep this as false if you don't need a cancel button
        showConfirmButton: true, // Set to true to show a confirm button
        confirmButtonText: "OK", // You can customize the text of the confirm button
      });
      this.navService.navigateTotab("docket", "dashboard/Index");
      return false;
    }
    const vehicleList = await getVehicleStatusFromApi(
      this.storage.companyCode,
      this.operationService
    );
    /* reasone for diffreacial the both vehicle list and all vehicle is  for all
    vehicle are for the market vehicle autofield details agaist prq */
    this.model.allVehicle = vehicleList;
    this.model.vehicleList = vehicleList;
    const vehFieldMap = this.model.vehicleList.map((x) => {
      return {
        name: x.vehNo,
        value: x.vehNo,
      };
    });
    /* end */
    const resContainerType =
      await this.consigmentUtility.containorConsigmentDetail();
    this.model.containerTypeList = resContainerType;

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.model.consignmentTableForm,
      vehFieldMap,
      this.model.vehicleNo,
      this.model.vehicleNoStatus
    );

    if (this.prqFlag && this.model.prqData.carrierTypeCode == "3") {
      this.model.consignmentTableForm.controls["cd"].setValue(true);
      this.contFlag = true;
      this.containerDetail();
    }
    this.isUpdate && this.autofillDropDown();
    this.prqFlag && (await this.prqDetail());
  }
  async getPrqDetails() {
    const prqNo = await this.prqService.getPrqForBooking(
      this.storage.branch,
      this.model.consignmentTableForm.value.billingParty.value,
      this.model.consignmentTableForm.get("payType")?.value
    );
    this.model.prqNoDetail = prqNo.allPrqDetail;

    const prqDetail = prqNo.allPrqDetail.map((x) => ({
      name: x.prqNo,
      value: x.prqNo,
    }));

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.model.consignmentTableForm,
      prqDetail,
      this.model.prqNo,
      this.model.prqNoStatus
    );
    this.AddressDetails();
  }
  /*get pincode detail*/
  async getDestination() {
    const destinationMapping = await this.locationService.locationFromApi({
      locCode: {
        D$regex: `^${this.model.consignmentTableForm.get("destination")?.value
          }`,
        D$options: "i",
      },
    });
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      destinationMapping,
      this.model.destination,
      this.model.destinationStatus
    );
  }
  /*end */
  /*below code is for the set city value*/
  async setCity() {
    const dest = this.model.consignmentTableForm.get("destination")?.value;
    let cluster = [];
    try {
      cluster = await this.clusterService.getClusterByPincode({
        pincode: { D$in: [dest.pincode] },
        companyCode: this.storage.companyCode,
      });
    } catch (err) {
      console.log(err);
    }
    const city = {
      name: dest.pincode,
      value: dest.city,
      ct: dest.city,
      pincode: dest.pincode, // include pincode here
      st: dest.locStateId,
      clusterName: cluster && cluster.length > 0 ? cluster[0].clusterName : "",
      clusterId: cluster && cluster.length > 0 ? cluster[0].clusterCode : "",
    };
    this.model.consignmentTableForm.get("toCity")?.setValue(city);
    if (this.conLoc) {
      const location = await this.locationService.getLocation({
        companyCode: this.storage.companyCode,
        locCode: dest?.value || "",
      });
      try {
        const city = { CT: { D$in: location.mappedCity.map((x) => x.trim()) } };
        const clusterData = await this.clusterService.getClusterCityMapping(
          city
        );
        this.filter.Filter(
          this.model.allformControl,
          this.model.consignmentTableForm,
          clusterData, // clusterData,
          "toCity",
          true
        );
      } catch (err) {
        this.filter.Filter(
          this.model.allformControl,
          this.model.consignmentTableForm,
          [], // clusterData,
          "toCity",
          true
        );
      }
    }
  }
  /*End*/
  /* below function was the call when */
  async getLocBasedOnCity() {
    const destinationMapping = await this.locationService.locationFromApi({
      locCity: this.model.consignmentTableForm
        .get("toCity")
        ?.value?.value.toUpperCase(),
    });
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      destinationMapping,
      this.model.destination,
      this.model.destinationStatus
    );
    this.AddressDetails();
  }
  cancel() {
    this.navService.navigateTotab("docket", "dashboard/Index");
  }
  //#endregion

  async commonDropDownMapping() {
    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this.model[mapping.target] = data.name; // Set the target property with the value of the name property
          this.model[`${mapping.target}Status`] =
            data.additionalData.showNameAndValue; // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };
    const docketMappings = [
      { name: "fromCity", target: "fromCity" },
      { name: "toCity", target: "toCity" },
      { name: "billingParty", target: "customer" },
      { name: "containerSize", target: "containerSize" },
      { name: "vendorName", target: "vendorName" },
      { name: "vehicleNo", target: "vehicleNo" },
      { name: "prqNo", target: "prqNo" },
      { name: "destination", target: "destination" },
    ];
    const containerMapping = [
      { name: "containerType", target: "containerType" },
    ];
    const consignor = [{ name: "consignorName", target: "consignorName" }];
    const consignee = [{ name: "consigneeName", target: "consigneeName" }];
    mapControlArray(this.jsonControlArrayBasic, docketMappings);
    mapControlArray(this.jsonControlArrayConsignor, consignor);
    mapControlArray(this.jsonControlArrayConsignee, consignee);
    mapControlArray(this.jsonContainerDetail, containerMapping); // Map docket control array
    const destinationMapping = await this.locationService.locationFromApi({
      locCode: this.storage.branch,
    });
    let cluster = [];
    try {
      cluster = await this.clusterService.getClusterByPincode({
        pincode: { D$in: [destinationMapping[0].pincode] },
        companyCode: this.storage.companyCode,
      });
    } catch (err) {
      console.log(err);
    }
    const city = {
      name: destinationMapping[0].pincode,
      value: destinationMapping[0].city,
      ct: destinationMapping[0].city,
      pincode: destinationMapping[0].pincode, // include pincode here
      st: destinationMapping[0]?.locStateId,
      clusterName: cluster && cluster.length > 0 ? cluster[0].clusterName : "",
      clusterId: cluster && cluster.length > 0 ? cluster[0].clusterCode : "",
    };
    //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    this.model.consignmentTableForm.controls["fromCity"].setValue(city);

    // mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    // mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    //mapControlArray(this.contractControlArray, destinationMapping);
  }
  /*below function is fire when vendor Name is select*/
  getVehicleFilter() {
    const vehicleList = this.model.vehicleList
      .filter(
        (x) => x.vendor == this.model.consignmentTableForm.value.vendorName.name
      )
      .map((x) => {
        return { name: x.vehNo, value: x.vehNo };
      });
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.model.consignmentTableForm,
      vehicleList,
      this.model.vehicleNo,
      this.model.vehicleNoStatus
    );

    this.ContainerNumbersSetup();
  }
  /*End*/
  async ContainerNumbersSetup() {
    const consignmentForm = this.model.consignmentTableForm;
    const containerForm = this.model.containerTableForm;
    if (consignmentForm.controls["cd"].value) {
      this.jsonContainerDetail.forEach((detail) => {
        if (detail.name === "containerNumber") {
          detail.type = ["1", "4"].includes(consignmentForm.value.vendorType)
            ? "dropdown"
            : "text";
        }
      });
      const vendorType = consignmentForm.value.vendorType;
      const isVendorType1or4 = vendorType === "1" || vendorType === "4";
      const containerNumberControl = containerForm.get("containerNumber");

      if (isVendorType1or4) {
        const data = await getcontainerstatusFromApi(
          this.operationService,
          parseInt(vendorType)
        );

        if (data.length > 0) {
          this.filter.Filter(
            this.jsonContainerDetail,
            containerForm,
            data,
            "containerNumber",
            false
          );
          containerNumberControl.setValidators([
            Validators.required,
            autocompleteObjectValidator(),
          ]);
        } else {
          containerNumberControl.setValidators([Validators.required]);
        }
      } else {
        containerNumberControl.setValidators([Validators.required]);
      }

      containerNumberControl.updateValueAndValidity();
    }
  }
  OnChnageContainerNumber(event) {
    const ContainerType = event?.eventArgs?.option?.value?.data?.cNTYPNM;
    const containerCapacity = this.model.containerTypeList.find(
      (x) => x.name.trim() === ContainerType.trim()
    );
    this.model.containerTableForm.controls["containerType"].setValue(
      containerCapacity
    );
    this.model.containerTableForm.controls["containerCapacity"].setValue(
      containerCapacity.loadCapacity
    );
  }
  onAutoBillingBased(event) {
    const fieldConsignorName = "consignorName";
    const fieldConsigneeName = "consigneeName";
    const fieldContactNumber = "ccontactNumber";
    const fieldConsignorAddress = "cnoAddress";
    const fieldConsigneeAddress = "cneAddress";
    const fieldConsignorgst = "cnogst";
    const fieldConsigneegst = "cnegst";
    const fieldConsigneeContactNumber = "cncontactNumber";
    const fieldBillingParty = "billingParty";
    const {
      field: { name: fieldName },
      eventArgs: { checked },
    } = event;
    const { contactNo } = this.model.prqData || {};
    const billingPartyValue =
      this.model.consignmentTableForm.controls[fieldBillingParty].value;
    const pAddress = this.model.consignmentTableForm.controls["pAddress"].value;
    const deliveryAddress =
      this.model.consignmentTableForm.controls["deliveryAddress"].value;
    const mobile = billingPartyValue?.otherdetails?.customer_mobile || "";
    const gstvalue = billingPartyValue?.otherdetails?.GSTdetails[0]?.gstNo;
    const updateForm = (
      nameField,
      contactField,
      billingPartyName,
      addressfieldname,
      addressdieldvalue,
      gstfor,
      gstvalue
    ) => {
      this.model.consignmentTableForm.controls[nameField].setValue(
        billingPartyName
      );
      this.model.consignmentTableForm.controls[contactField].setValue(
        contactNo || mobile
      );
      this.model.consignmentTableForm.controls[addressfieldname].setValue(
        addressdieldvalue
      );
      this.model.consignmentTableForm.controls[gstfor].setValue(gstvalue);
    };

    if (checked) {
      switch (fieldName) {
        case "cnbp":
          this.model.consignmentTableForm.controls["cnbp"].enable();
          updateForm(
            fieldConsignorName,
            fieldContactNumber,
            billingPartyValue,
            fieldConsignorAddress,
            pAddress,
            fieldConsignorgst,
            gstvalue
          );
          this.expanded = true;
          this.model.consignmentTableForm.controls["cnebp"].disable();
          break;
        case "cnebp":
          this.model.consignmentTableForm.controls["cnebp"].enable();
          updateForm(
            fieldConsigneeName,
            fieldConsigneeContactNumber,
            billingPartyValue,
            fieldConsigneeAddress,
            deliveryAddress,
            fieldConsigneegst,
            gstvalue
          );
          this.model.consignmentTableForm.controls["cnbp"].disable();
          break;
        default:

        // Handle other cases or throw an error
      }
    } else {
      this.model.consignmentTableForm.controls["cnebp"].enable();
      this.model.consignmentTableForm.controls["cnbp"].enable();
      // done by harikesh
      switch (fieldName) {
        case "cnbp":
          [
            fieldConsignorName,
            fieldContactNumber,
            fieldConsignorAddress,
          ].forEach((field) =>
            this.model.consignmentTableForm.controls[field].setValue("")
          );
          this.expanded = false;
          break;
        case "cnebp":
          [
            fieldConsigneeName,
            fieldConsigneeContactNumber,
            fieldConsigneeAddress,
          ].forEach((field) =>
            this.model.consignmentTableForm.controls[field].setValue("")
          );
          break;
        default:
        // Handle other cases or throw an error
      }
    }
  }
  async checkPrLR() {
    if (this.model.consignmentTableForm.controls["pr_lr_no"].value) {
      // First, we determine if the `pr_lr_no` value can be considered an integer
      const prLrNoValue =
        this.model.consignmentTableForm.controls["pr_lr_no"].value;
      const numericPrLrNo = Number(prLrNoValue); // Convert to number to check if it's an integer
      let query;

      if (Number.isInteger(numericPrLrNo)) {
        // If prLrNoValue is an integer, construct a query to search by that integer value
        query = {
          cID: this.storage.companyCode,
          pRLR: numericPrLrNo,
        };
      } else {
        // If prLrNoValue is not an integer, use the original query with $or condition
        query = {
          cID: this.storage.companyCode,
          pRLR: { D$regex: `${prLrNoValue}`, D$options: "i" }, // Fallback to regex match
        };
      }
      // Now, use the constructed query in your service call
      const res = await this.docketService.checkPrLrNoExistLTL(query);

      if (res) {
        Swal.fire({
          icon: "info",
          title: "PR LR No. is Exists",
          text: `PR LR No. ${this.model.consignmentTableForm.controls["pr_lr_no"].value} already exists.`,
        });
        this.model.consignmentTableForm.controls["pr_lr_no"].setValue("");
      }
    }
  }
  async SetConsignorAndConsigneeAddressDetails(CustomerName, customerType) {
    const billingParty = CustomerName;
    const fromCity =
      this.model.consignmentTableForm.controls["fromCity"]?.value.value || "";
    const toCity =
      this.model.consignmentTableForm.controls["toCity"]?.value.value || "";

    if (customerType === "consignor") {
      const filter = [
        {
          D$match: {
            cityName: fromCity,
            activeFlag: true,
            customer: {
              D$elemMatch: {
                code: billingParty,
              },
            },
          },
        },
      ];
      const picUpres = await this.addressService.getAddress(filter);
      this.filter.Filter(
        this.model.allformControl,
        this.model.consignmentTableForm,
        picUpres,
        "cnoAddress",
        false
      );
    }
    if (customerType === "consignee") {
      const filterAddress = [
        {
          D$match: {
            cityName: toCity,
            activeFlag: true,
            customer: {
              D$elemMatch: {
                code: billingParty,
              },
            },
          },
        },
      ];
      const address = await this.addressService.getAddress(filterAddress);

      this.filter.Filter(
        this.model.allformControl,
        this.model.consignmentTableForm,
        address,
        "cneAddress",
        false
      );
    }
  }
  prqSelection() {
    this.model.prqData = this.model.prqNoDetail.find(
      (x) =>
        x.prqNo == this.model.consignmentTableForm.controls["prqNo"].value.value
    );
    this.prqDetail();
  }

  handleMenuItemClick(data) {
    if (data.data.invoice) {
      this.fillInvoice(data);
    } else {
      this.fillContainer(data);
    }
  }
  /*this function is for the add multiple containor*/
  async addData(event) {
    this.tableLoad = true;
    this.isLoad = true;
    const tableData = this.model.tableData;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.containerNumber ===
          this.model.containerTableForm.value.containerNumber
      );
      if (exist) {
        this.model.containerTableForm.controls["containerNumber"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering Container Number.",
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.isLoad = false;
        return false;
      }
    }
    if (typeof this.model.containerTableForm.value.containerType === "string") {
      this.model.containerTableForm.controls["containerType"].setValue("");
      Swal.fire({
        icon: "info", // Use the "info" icon for informational messages
        title: "Information",
        text: "Please Select Proper value.",
        showConfirmButton: true,
      });
      this.isLoad = false;
      this.tableLoad = false;
      return false;
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      id: tableData.length + 1,
      containerNumber:
        typeof this.model.containerTableForm.value.containerNumber == "object"
          ? this.model.containerTableForm.value.containerNumber.name
          : this.model.containerTableForm.value.containerNumber,
      containerType: this.model.containerTableForm.value.containerType.value,
      containerCapacity: this.model.containerTableForm.value.containerCapacity,
      isEmpty: this.model.containerTableForm.value.isEmpty ? "Y" : "N",
      invoice: false,
      actions: ["Edit", "Remove"],
    };
    this.model.tableData.push(json);
    Object.keys(this.model.containerTableForm.controls).forEach((key) => {
      this.model.containerTableForm.get(key).clearValidators();
      this.model.containerTableForm.get(key).updateValueAndValidity();
    });

    this.model.containerTableForm.controls["containerNumber"].setValue("");
    this.model.containerTableForm.controls["containerType"].setValue("");
    this.model.containerTableForm.controls["containerCapacity"].setValue("");
    this.model.containerTableForm.controls["isEmpty"].setValue(false);
    // Remove all validation

    this.isLoad = false;
    this.tableLoad = false;
    // Add the "required" validation rule
    Object.keys(this.model.containerTableForm.controls).forEach((key) => {
      this.model.containerTableForm.get(key).setValidators(Validators.required);
    });
    this.model.containerTableForm.updateValueAndValidity();
  }
  /*End*/
  /*this function*/
  fillContainer(data: any) {
    if (data.label.label === "Remove") {
      this.model.tableData = this.model.tableData.filter(
        (x) => x.id !== data.data.id
      );
    } else {
      const excludedKeys = ["Download_Icon", "Company_file", "isEmpty"];
      const atLeastOneValuePresent = Object.keys(
        this.model.containerTableForm.controls
      )
        .filter((key) => !excludedKeys.includes(key)) // Filter out excluded keys
        .some((key) => {
          const control = this.model.containerTableForm.get(key);
          return (
            control &&
            control.value !== null &&
            control.value !== undefined &&
            control.value !== ""
          );
        });
      if (atLeastOneValuePresent) {
        Swal.fire({
          title: "Are you sure?",
          text: "Data is already present and being edited. Are you sure you want to discard the changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillContainerDetails(data);
          }
        });
      } else {
        this.fillContainerDetails(data);
      }
    }
  }

  async addInvoiceData(event) {
    if (await this.calculateValidation()) {
      const invoice = this.model.invoiceData;
      if (invoice.length > 0) {
        const exist = invoice.find(
          (x) => x.invoiceNo === this.model.invoiceTableForm.value.invoiceNo
        );
        if (exist) {
          this.model.invoiceTableForm.controls["invoiceNo"].setValue("");
          Swal.fire({
            icon: "info", // Use the "info" icon for informational messages
            title: "Information",
            text: "Please avoid entering duplicate Invoice.",
            showConfirmButton: true,
          });
          return false;
        }
      }
      this.tableLoadIn = true;
      this.loadIn = true;
      const delayDuration = 1000;
      // Create a promise that resolves after the specified delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      // Use async/await to introduce the delay
      await delay(delayDuration);
      const json = {
        id: invoice.length + 1,
        ewayBillNo: this.model.invoiceTableForm.value.ewayBillNo,
        expiryDate: this.model.invoiceTableForm.value.expiryDate ? moment(this.model.invoiceTableForm.value.expiryDate).format("DD MMM YY HH:MM") : "",
        invoiceNo: this.model.invoiceTableForm.value.invoiceNo,
        invoiceAmount: this.model.invoiceTableForm.value.invoiceAmount,
        noofPkts: this.model.invoiceTableForm.value.noofPkts,
        materialName:
          this.model.invoiceTableForm.value.materialName?.name || "",
        actualWeight: this.model.invoiceTableForm.value.actualWeight,
        chargedWeight: this.model.invoiceTableForm.value.chargedWeight,
        invoice: true,
        expiryDateO: this.model.invoiceTableForm.value.expiryDate,
        actions: ["Edit", "Remove"],
      };
      this.model.invoiceData.push(json);
      this.model.invoiceTableForm.reset();
      this.tableLoadIn = false;
      this.loadIn = false;
      this.filter.Filter(
        this.jsonInvoiceDetail,
        this.model.invoiceTableForm,
        this.matrials,
        "materialName",
        false
      );
      this.SetInvoiceData();
    }
  }

  fillInvoice(data: any) {
    if (data.label.label === "Remove") {
      this.model.invoiceData = this.model.invoiceData.filter(
        (x) => x.id !== data.data.id
      );
    } else {
      const atLeastOneValuePresent = Object.keys(
        this.model.invoiceTableForm.controls
      ).some((key) => {
        const control = this.model.invoiceTableForm.get(key);
        return (
          control &&
          control.value !== null &&
          control.value !== undefined &&
          control.value !== ""
        );
      });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: "Are you sure?",
          text: "Data is already present and being edited. Are you sure you want to discard the changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed!",
          cancelButtonText: "No, cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillInvoiceDetails(data);
          }
        });
      } else {
        this.fillInvoiceDetails(data);
      }
    }
    this.SetInvoiceData();
  }
  /*end*/
  async docketValidation() {
    const res = await this.dcrService.validateFromSeries(
      this.model.consignmentTableForm.controls["docketNumber"].value
    );
    this.dcrDetail = res;
    if (res) {
      if (
        res.aLOTO == "L" &&
        res.aSNTO == "E" &&
        res.aSNCD &&
        res.aLOCD == this.storage.branch
      ) {
        await this.validateDcr(res);
      } else if (
        res.aLOTO == "L" &&
        res.aSNTO == "B" &&
        this.storage.userName == res.aSNCD
      ) {
        await this.validateDcr(res);
      } else if (res.aLOTO == "C" && res.aSNTO == "C" && res.aSNCD) {
        const billingParty =
          this.model.consignmentTableForm.controls["billingParty"].value
            ?.value || "";
        if (billingParty) {
          if (res.aSNCD == billingParty) {
            await this.validateDcr(res);
          } else {
            await this.errorMessage();
          }
        } else {
          if (await this.validateDcr(res)) {
            this.model.consignmentTableForm.controls["billingParty"].setValue({
              name: res.aSNNM,
              value: res.aSNCD,
            });
          } else {
            await this.errorMessage();
          }
        }
      } else {
        this.errorMessage();
      }
    } else {
      this.errorMessage();
    }
  }
  /*check Dcr is use or not*/
  async validateDcr(dcr: any): Promise<boolean> {
    let isValid = false;
    const dktNo =
      this.model.consignmentTableForm.controls["docketNumber"].value;
    const doc = await this.dcrService.getDCRDocument({ dOCNO: dktNo });
    if (doc && doc.dOCNO == dktNo) {
      Swal.fire({
        icon: "warning",
        title: `${this.DocCalledAs.Docket} No is ${doc.sTS == 2 ? "declared void" : "already used"
          }`,
        text: `${this.DocCalledAs.Docket} No is ${doc.sTS == 2 ? "declared void" : "already used"
          }`,
        showConfirmButton: true,
        confirmButtonText: "OK",
        timer: 5000,
        timerProgressBar: true,
      });
      this.model.consignmentTableForm.controls["docketNumber"].setValue("");
    } else {
      if (this.mseq) {
        const nextCode = await this.dcrService.getNextDocumentNo(
          this.dcrDetail
        );
        if (nextCode == "" || nextCode != dktNo) {
          Swal.fire({
            icon: "warning",
            title: `${this.DocCalledAs.Docket} No is out of sequence. Next no is sequence is ${nextCode}.`,
            showConfirmButton: true,
            confirmButtonText: "OK",
            timer: 5000,
            timerProgressBar: true,
          });
          this.model.consignmentTableForm.controls["docketNumber"].setValue("");
        } else {
          isValid = true;
          Swal.fire({
            icon: "success",
            title: "Valid",
            text: `${this.DocCalledAs.Docket} No has been allocated. You may now proceed`,
            showConfirmButton: true,
            confirmButtonText: "OK",
            timer: 5000,
            timerProgressBar: true,
          });
        }
      } else {
        isValid = true;
        Swal.fire({
          icon: "success",
          title: "Valid",
          text: `${this.DocCalledAs.Docket} No has been allocated. You may now proceed`,
          showConfirmButton: true,
          confirmButtonText: "OK",
          timer: 5000,
          timerProgressBar: true,
        });
      }
    }

    return isValid;
  }
  /*end*/
  async errorMessage() {
    Swal.fire({
      icon: "error",
      title: `${this.DocCalledAs.Docket} No is not valid`,
      text: `${this.DocCalledAs.Docket} No is not valid`,
      showConfirmButton: true,
      confirmButtonText: "OK",
      timer: 5000,
      timerProgressBar: true,
    });
    this.model.consignmentTableForm.controls["docketNumber"].setValue("");
  }
  /*get Rules*/
  async getRules() {
    const filter = {
      cID: this.storage.companyCode,
      mODULE: "CNOTE",
      aCTIVE: true,
    };
    const res = await this.controlPanel.getModuleRules(filter);
    if (res.length > 0) {
      this.rules = res;
      this.checkDocketRules();
    }
  }
  /*End*/
  OnChangeCheckBox(event) {
    this.checkboxChecked = event.event.checked;
    this.isManual = this.checkboxChecked == true ? false : true;
    this.isUpdate = this.checkboxChecked == true ? false : true;
    this.model.consignmentTableForm.controls['docketNumber'].setValue(event.event.checked ? "Computerized" : "");
    if (this.isManual) {
      this.model.consignmentTableForm.controls['docketNumber'].enable();
    }
    else {
      this.model.consignmentTableForm.controls['docketNumber'].disable();

    }
  }
  checkDocketRules() {
    const STYP = this.rules.find((x) => x.rULEID == "STYP" && x.aCTIVE);
    if (STYP) {
      const isManual = STYP.vAL === "M";
      if (STYP.vAL != "B") {
        this.model.allformControl.find((x) => x.name == "docketNumber").disable =
          !isManual;
        this.model.consignmentTableForm.controls["docketNumber"].setValue(
          isManual ? "" : "Computerized"
        );
        this.isManual = isManual;
        this.model.consignmentTableForm.controls['docketNumber'].enable();
      }
      else {
        this.isBoth = STYP.vAL == "B"
        this.checkboxChecked = true
        this.isManual = false;
        this.model.consignmentTableForm.controls['docketNumber'].setValue("Computerized");
        this.model.consignmentTableForm.controls['docketNumber'].disable();
      }
    }
    const ELOC = this.rules.find((x) => x.rULEID == "ELOC" && x.aCTIVE);
    if (ELOC) {
      if (!ELOC.vAL.includes(this.storage.branch)) {
        // check exception for branch
      }
    }

    this.alpaNumber =
      this.rules.find((x) => x.rULEID == "NTYP" && x.aCTIVE)?.vAL == "AN";
    this.sequence =
      this.rules.find((x) => x.rULEID == "SL" && x.aCTIVE)?.vAL == "S";
    this.isBrachCode =
      this.rules.find((x) => x.rULEID == "BCD" && x.aCTIVE)?.vAL == "Y";
    this.fyear =
      this.rules.find((x) => x.rULEID == "YEAR" && x.aCTIVE)?.vAL == "F";
    this.length = ConvertToNumber(
      this.rules.find((x) => x.rULEID == "LENGTH" && x.aCTIVE)?.vAL
    );
    this.mseq =
      this.rules.find((x) => x.rULEID == "MSEQ" && x.aCTIVE)?.vAL == "Y";
    this.conLoc =
      this.rules.find((x) => x.rULEID == "CONLOC" && x.aCTIVE == true).vAL ==
      "Y";
    if (this.conLoc) {
      this.setFromCity();
      //this.setFormValue(this.model.consignmentTableForm, "fromCity", this.model.prqData, true, "fromCity", "fromCity");
    }
  }
  async setFromCity() {
    const location = await this.locationService.locationFromApi({
      locCode: this.storage.branch,
    });
    const city = {
      CT: { D$in: location[0].extraData.mappedCity.map((x) => x.trim()) },
    };
    const clusterData = await this.clusterService.getClusterCityMapping(city);
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      clusterData,
      this.model.fromCity,
      this.model.fromCityStatus
    );
  }
  vendorFieldChanged() {
    const vendorType =
      this.model.consignmentTableForm.value.vendorType !== undefined
        ? this.model.consignmentTableForm.value.vendorType
        : "4";
    const vendorName = this.model.consignmentTableForm.get("vendorName");
    const vehicleNo = this.model.consignmentTableForm.get("vehicleNo");

    this.jsonControlArrayBasic.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
      if (x.name === "vehicleNo") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
    });
    if (vendorType !== "4") {
      // const vendorDetail = this.model.vendorDetail.filter(
      //   (x) => x.type.toLowerCase() == vendorType.toLowerCase()
      // );
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.model.consignmentTableForm,
        [],
        this.model.vendorName,
        this.model.vendorNameStatus
      );
      const vehFieldMap = this.model.vehicleList
        .filter((x) => x.vendorTypeCode == vendorType)
        .map((x) => {
          return { name: x.vehNo, value: x.vehNo };
        });
      this.filter.Filter(
        this.jsonControlArrayBasic,
        this.model.consignmentTableForm,
        vehFieldMap,
        this.model.vehicleNo,
        this.model.vehicleNoStatus
      );
      vendorName.setValidators([
        Validators.required,
        autocompleteObjectValidator(),
      ]);
      vendorName.updateValueAndValidity();
      vehicleNo.setValidators(autocompleteObjectValidator());
      vehicleNo.updateValueAndValidity();
    } else {
      vehicleNo.clearValidators();
      vendorName.setValidators(Validators.required);
      vendorName.updateValueAndValidity();
      vehicleNo.updateValueAndValidity();
      this.marketVendor = true;
      // if(this.prqFlag&&this.marketVendor){
      //  const vehDetail:vehicleMarket=this.model.allVehicle.find((x)=>x.vehNo==this.model.prqData.vehicleNo);
      //   this.marketVehicleTableForm.controls['vehNo'].setValue("")
      // }
    }
    vendorName.setValue("");
    vehicleNo.setValue("");
  }
  /*Below function is only call those time when user can come to only edit a
   docket not for prq or etc etc*/
  async autofillDropDown() {
    const docketDetails = await this.docketService.docketObjectMapping(
      this.model.docketDetail
    );

    this.model.docketDetail.invoiceDetails =
      await this.docketService.getDocketByDocNO(
        docketDetails.docketNumber,
        "docket_invoices"
      );
    this.model.docketDetail.containerDetail =
      await this.docketService.getDocketByDocNO(
        docketDetails.docketNumber,
        "docket_containers"
      );
    this.model.consignmentTableForm.controls["docketNumber"].setValue(
      docketDetails?.docketNumber || ""
    );
    const { controls } = this.model.consignmentTableForm;

    // Helper function to set form control values.
    const setControlValue = (controlName, value) => {
      controls[controlName].setValue(value);
    };
    if (!docketDetails) {
      return false;
    }
    // Set vendor details.
    const vendor =
      docketDetails.vendorType != "4"
        ? { name: docketDetails.vendorName, value: docketDetails.vendorCode }
        : docketDetails.vendorName;
    setControlValue("vendorType", docketDetails.vendorType.toString());
    // Trigger vendor field change actions.
    this.vendorFieldChanged();
    setControlValue("vendorName", vendor);
    // Set city details.
    setControlValue("fromCity", {
      name: docketDetails.fromCity,
      value: docketDetails.fromCity,
    });
    setControlValue("toCity", {
      name: docketDetails.toCity,
      value: docketDetails.toCity,
    });
    setControlValue("destination", {
      name: docketDetails.destination,
      value: docketDetails.destination,
    });
    // Set vehicle number.
    setControlValue("vehicleNo", {
      name: docketDetails.vehicleNo || "",
      value: docketDetails.vehicleNo || "",
    });
    // Find and set parties.
    const billingPartyObj = {
      name: docketDetails.billingPartyName,
      value: docketDetails.billingParty,
    };
    const consignorNameObj = {
      name: docketDetails.consignorName,
      value: docketDetails.consignorCode,
    };
    const consigneeNameObj = {
      name: docketDetails.consigneeName,
      value: docketDetails.consigneeCode,
    };
    setControlValue("billingParty", billingPartyObj);
    setControlValue("consignorName", consignorNameObj);
    setControlValue("consigneeName", consigneeNameObj);
    // Set various details.
    setControlValue("risk", docketDetails.risk);
    setControlValue("prqNo", {
      name: docketDetails.prqNo,
      value: docketDetails.prqNo,
    });
    setControlValue("payType", docketDetails.payType);
    setControlValue("transMode", docketDetails.transMode);
    setControlValue("packaging_type", docketDetails.packaging_type);
    setControlValue("weight_in", docketDetails.weight_in);
    setControlValue("delivery_type", docketDetails.delivery_type);
    //setControlValue("issuing_from", docketDetails.issuing_from);

    // Set Freight Table Form details.
    this.model.FreightTableForm.controls["freightRatetype"].setValue(
      docketDetails.freightRatetype
    );
    this.model.consignmentTableForm.controls["pAddress"].setValue({
      name: docketDetails.pAddress,
      value: docketDetails.pAddressCode || "A8888",
    });
    this.model.consignmentTableForm.controls["deliveryAddress"].setValue({
      name: docketDetails.deliveryAddress,
      value: docketDetails.deliveryAddressCode || "A8888",
    });
    this.model.consignmentTableForm.controls["cnoAddress"].setValue({
      name: docketDetails.cnoAddress,
      value: docketDetails.cnoAddress,
    });
    this.model.consignmentTableForm.controls["cnogst"].setValue(
      docketDetails.cnogst
    );
    this.model.consignmentTableForm.controls["cneAddress"].setValue({
      name: docketDetails.cneAddress,
      value: docketDetails.cneAddress,
    });
    this.model.consignmentTableForm.controls["cnegst"].setValue(
      docketDetails.cnegst
    );
    // Bind table data after form update.
    this.bindTableData();
    this.model.FreightTableForm.controls["rcm"].setValue(
      docketDetails?.rcm || ""
    );
    this.onRcmChange();
  }
  async AddressDetails() {
    const billingParty =
      this.model.consignmentTableForm.controls["billingParty"]?.value.value ||
      "";
    const fromCity =
      this.model.consignmentTableForm.controls["fromCity"]?.value.value || "";
    const toCity =
      this.model.consignmentTableForm.controls["toCity"]?.value.value || "";
    const filter = [
      {
        D$match: {
          cityName: fromCity,
          activeFlag: true,
          customer: {
            D$elemMatch: {
              code: billingParty,
            },
          },
        },
      },
    ];
    const picUpres = await this.addressService.getAddress(filter);
    const filterAddress = [
      {
        D$match: {
          cityName: toCity,
          activeFlag: true,
          customer: {
            D$elemMatch: {
              code: billingParty,
            },
          },
        },
      },
    ];
    const address = await this.addressService.getAddress(filterAddress);
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      picUpres,
      "pAddress",
      false
    );
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      address,
      "deliveryAddress",
      false
    );
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      picUpres,
      "cnoAddress",
      false
    );
    this.filter.Filter(
      this.model.allformControl,
      this.model.consignmentTableForm,
      address,
      "cneAddress",
      false
    );
  }
  bindTableData() {
    if (this.model.docketDetail.invoiceDetails.length > 0) {
      this.tableLoadIn = true;
      this.loadIn = true;
      const invoiceDetail = this.model.docketDetail.invoiceDetails.map(
        (x, index) => {
          if (
            !x ||
            Object.values(x).every(
              (value) =>
                value === null || value === undefined || value === undefined
            )
          ) {
            return null; // If x is null or all properties of x are null or undefined, return null
          }
          if (!x.iNVNO) {
            return null;
          }
          // You can use 'x' and 'index' here
          x.id = index + 1;
          x.ewayBillNo = `${x.eWBNO}`;
          x.expiryDate = x.eXPDT ? x.eXPDT : new Date();
          x.invoiceNo = x.iNVNO;
          x.invoiceAmount = x.iNVAMT;
          x.noofPkts = x.pKGS;
          x.materialName = x.mTNM;
          x.actualWeight = (parseFloat(x.aCTWT) / 1000).toString();
          x.chargedWeight = (parseFloat(x.cHRWT) / 1000).toString();
          x.invoice = true;
          x.expiryDateO = x.eXPDT;
          x.actions = ["Edit", "Remove"];

          return x;
        }
      );

      this.model.invoiceData = invoiceDetail.filter((x) => x !== null);
      this.tableLoadIn = this.model.invoiceData.length > 0;
      this.loadIn = false;
      const allEmpty = invoiceDetail.every((x) => !x);
      if (!allEmpty) {
        this.model.invoiceData = invoiceDetail;
        this.tableLoadIn = false;
      }
      this.loadIn = false;
    }
    const fieldsToFromRemove = [
      "id",
      "actions",
      "invoice",
      "Download_Icon",
      "id",
    ];
    const containerDetail = removeFieldsFromArray(
      this.model.docketDetail.containerDetail,
      fieldsToFromRemove
    );

    if (containerDetail.length > 0) {
      this.contFlag = true;
      this.tableLoad = true;
      this.isLoad = true;
      this.model.consignmentTableForm.controls["cd"].setValue(true);
      const containerDetail = this.model.docketDetail.containerDetail.map(
        (x, index) => {
          if (x) {
            if (Object.values(x).every((value) => !value)) {
              return null; // If all properties of x are empty, return null
            }
            if (!x.cNID) {
              return null;
            }
            // Modify 'x' if needed
            // For example, you can add the index to the element
            x.id = index + 1;
            x.containerNumber = x.cNID;
            x.containerCapacity = x.cNCPT;
            x.containerType = x.cNTYPN;
            x.isEmpty = x.isEMPT;
            x.invoice = false;
            x.actions = ["Edit", "Remove"];
            return x;
          }
          return x; // Return the original element if no modification is needed
        }
      );
      const allNull = containerDetail.every((x) => x === null);
      if (!allNull) {
        this.containerDetail();
        this.model.tableData = containerDetail;
        this.tableLoad = false;
      }

      this.isLoad = false;
    }
  }
  /*region Save*/
  flagEwayBill() {
    this.ewayBill = false;
    this.breadscrums[0].title = "Consignment Entry";
  }

  containerDetail() {
    const cd = this.model.consignmentTableForm.controls["cd"].value;
    if (cd) {
      this.contFlag = true;
      this.setGeneralMasterData(
        this.jsonControlArray,
        this.rateTypes,
        "freightRatetype"
      );
      this.filter.Filter(
        this.jsonContainerDetail,
        this.model.containerTableForm,
        this.model.containerTypeList,
        this.model.containerType,
        this.model.containerTypeStatus
      );
      this.ContainerNumbersSetup();
    } else {
      const rateType = this.rateTypes.filter((x) => x.value != "RTTYP-0007");
      this.setGeneralMasterData(
        this.jsonControlArray,
        rateType,
        "freightRatetype"
      );
      this.contFlag = false;
    }
  }

  async save() {
    this.isSubmit = true;
    const tabcontrols = this.model.consignmentTableForm;
    tabcontrols.removeControl["test"];
    clearValidatorsAndValidate(tabcontrols);
    const contractcontrols = this.model.consignmentTableForm;
    clearValidatorsAndValidate(contractcontrols);
    /*End*/
    const vendorType = this.model.consignmentTableForm.value.vendorType;
    const vendorName = this.model.consignmentTableForm.value.vendorName;
    const vehNo =
      this.model.consignmentTableForm.value.vehicleNo?.value ||
      this.model.consignmentTableForm.value.vehicleNo;

    const controlNames = ["transMode", "payType", "vendorType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.model.consignmentTableForm.value[controlName])) {
        this.model.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    const fieldsToRemove = ["id", "actions", "invoice"];
    const fieldsToFromRemove = [
      "id",
      "actions",
      "invoice",
      "Download_Icon",
      "id",
    ];
    const invoiceList = removeFieldsFromArray(
      this.model.invoiceData,
      fieldsToRemove
    );
    const containerlist = removeFieldsFromArray(
      this.model.tableData,
      fieldsToRemove
    );
    const invoiceFromData = removeFieldsFromArray(
      [this.model.invoiceTableForm.value],
      fieldsToFromRemove
    );
    const containerFromData = removeFieldsFromArray(
      [this.model.containerTableForm.value],
      fieldsToFromRemove
    );
    let invoiceDetails = {
      invoiceDetails:
        this.model.invoiceData.length > 0 ? invoiceList : invoiceFromData,
    };
    const container = containerFromData.value?.containerNumber || "";
    let containerDetail = {
      containerDetail:
        this.model.tableData.length > 0
          ? containerlist
          : container
            ? containerFromData.value
            : [],
    };

    const controltabNames = [
      "containerCapacity",
      "containerType",
      "freightRatetype",
      "payType",
      "transMode",
      "vendorType",
      "weight_in",
      "delivery_type",
      // "issuing_from",
    ];

    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.model.consignmentTableForm.value[controlName])) {
        this.model.consignmentTableForm.controls[controlName].setValue("");
      }
    });

    const fromPincode =
      this.model.consignmentTableForm.value.fromCity?.pincode || "";
    const toPincode =
      this.model.consignmentTableForm.value.toCity?.pincode || "";
    const fromArea =
      this.model.consignmentTableForm.value.fromCity?.clusterName || "";
    const toArea =
      this.model.consignmentTableForm.value.toCity?.clusterName || "";
    const fromAreaCode =
      this.model.consignmentTableForm.value.fromCity?.clusterId || "";
    const toAreaCode =
      this.model.consignmentTableForm.value.toCity?.clusterId || "";
    const fromCity =
      this.model.consignmentTableForm.value.fromCity?.ct ||
      this.model.consignmentTableForm.value.fromCity?.value ||
      "";
    const toCity =
      this.model.consignmentTableForm.value.toCity?.ct ||
      this.model.consignmentTableForm.value.toCity?.value ||
      "";
    let resetData = [
      {
        name: "fromCity",
        findIn: this.model.consignmentTableForm,
        value: fromCity,
      },
      {
        name: "toCity",
        findIn: this.model.consignmentTableForm,
        value: toCity,
      },
      {
        name: "destination",
        findIn: this.model.consignmentTableForm,
        value:
          this.model.consignmentTableForm.value.destination?.value ||
          this.model.consignmentTableForm.value?.destination ||
          "",
      },
      //{ name: "vendorName", findIn: this.model.consignmentTableForm, value: vendorType === "Market" ? vendorName : vendorName?.name || "" },
      {
        name: "vehicleNo",
        findIn: this.model.consignmentTableForm,
        value: vehNo,
      },
      //{ name: "billingParty", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.billingParty.name || "" },
      //{ name: "consignorName", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.consignorName.name || "" },
      //{ name: "consigneeName", findIn: this.model.consignmentTableForm, value: this.model.consignmentTableForm.value?.consigneeName.name || "" },
      {
        name: "prqNo",
        findIn: this.model.consignmentTableForm,
        value: this.model.consignmentTableForm.value?.prqNo.value || "",
      },
    ];

    resetData.forEach((d) => {
      d.findIn.controls[d.name].setValue(d.value);
    });

    if (!this.isUpdate) {
      let id = {
        isComplete: 1,
      };

      let docketDetails = {
        ...this.model.consignmentTableForm.getRawValue(),
        ...this.model.FreightTableForm.getRawValue(),
        ...invoiceDetails,
        ...containerDetail,
        ...id,
      };
      const bParty = this.model.consignmentTableForm.value.billingParty;
      const cSGE = this.model.consignmentTableForm.value.consigneeName;
      const cSGN = this.model.consignmentTableForm.value.consignorName;
      docketDetails["deliveryAddress"] =
        this.model.consignmentTableForm.controls["deliveryAddress"].value
          ?.name ||
        this.model.consignmentTableForm.controls["deliveryAddress"].value;
      docketDetails["deliveryAddressCode"] =
        this.model.consignmentTableForm.controls["deliveryAddress"].value
          ?.value || "A8888";
      docketDetails["pAddress"] =
        this.model.consignmentTableForm.controls["pAddress"].value?.name ||
        this.model.consignmentTableForm.controls["pAddress"].value;
      docketDetails["pAddressCode"] =
        this.model.consignmentTableForm.controls["pAddress"].value?.value ||
        "A8888";
      docketDetails["cnoAddress"] =
        this.model.consignmentTableForm.controls["cnoAddress"].value?.name ||
        "";
      docketDetails["cnogst"] =
        this.model.consignmentTableForm.controls["cnogst"]?.value;
      docketDetails["cneAddress"] =
        this.model.consignmentTableForm.controls["cneAddress"].value?.name || "";
      docketDetails["cnegst"] =
        this.model.consignmentTableForm.controls["cnegst"]?.value;
      docketDetails["billingParty"] = bParty?.value;
      docketDetails["billingPartyName"] = bParty?.name;
      docketDetails["consignorCode"] = cSGN?.value;
      docketDetails["consignorName"] = cSGN?.name;
      docketDetails["consigneeCode"] = cSGE?.value;
      docketDetails["consigneeName"] = cSGE?.name;
      docketDetails["fromPincode"] = fromPincode;
      docketDetails["toPincode"] = toPincode;
      docketDetails["fromArea"] = fromArea;
      docketDetails["toArea"] = toArea;
      docketDetails["fromAreaCode"] = fromAreaCode;
      docketDetails["toAreaCode"] = toAreaCode;
      docketDetails["vendorCode"] =
        vendorType === "4" ? "8888" : vendorName?.value || "";
      docketDetails["vendorName"] =
        vendorType === "4" ? vendorName : vendorName?.name || "";
      let tHour = parseInt(
        this.model.consignmentTableForm.controls["tran_hour"].value,
        0
      );
      let tDay = parseInt(
        this.model.consignmentTableForm.controls["tran_day"].value,
        0
      );
      docketDetails["tran_hour"] = tDay * 24 + tHour;
      docketDetails["tran_day"] = 0;
      docketDetails["cURR"] = "INR";
      delete docketDetails.tran_day;
      const controlNames = [
        {
          dataArray: "A",
          controls: [
            { controlName: "payType", name: "payTypeName", value: "payType" },
            {
              controlName: "transMode",
              name: "transModeName",
              value: "transMode",
            },
            {
              controlName: "movementType",
              name: "movementTypeNM",
              value: "movementType",
            },
            {
              controlName: "vendorType",
              name: "vendorTypeName",
              value: "vendorType",
            },
            {
              controlName: "packaging_type",
              name: "packaging_type_Name",
              value: "packaging_type",
            },
            { controlName: "risk", name: "riskName", value: "risk" },
            {
              controlName: "delivery_type",
              name: "delivery_type_Name",
              value: "delivery_type",
            },
            // { controlName: 'issuing_from', name: 'issuing_from_Name', value: 'issuing_from' }
          ],
        },
        {
          dataArray: "F",
          controls: [
            {
              controlName: "freightRatetype",
              name: "freightRatetypeName",
              value: "freightRatetype",
            },
          ],
        },
      ];

      controlNames.forEach((g) => {
        const data =
          g.dataArray === "F"
            ? this.jsonControlArray
            : this.model.allformControl;
        const formGrop =
          g.dataArray === "F"
            ? this.model.FreightTableForm
            : this.model.consignmentTableForm;
        g.controls.forEach((c) => {
          let ctrl = formGrop.controls[c.controlName];
          if (ctrl && ctrl.value) {
            docketDetails[c.value] = ctrl.value;
            let cData = data
              .find((f) => f.name == c.controlName)
              .value.find((f) => f.value == ctrl.value);
            if (cData) {
              docketDetails[c.name] = cData.name;
            }
          }
        });
      });

      const Pkg = invoiceDetails
        ? invoiceDetails.invoiceDetails.reduce(
          (a, c) => a + (parseInt(c.noofPkts) || 0),
          0
        )
        : 0;
      const Wt = invoiceDetails
        ? invoiceDetails.invoiceDetails.reduce(
          (a, c) => a + (parseFloat(c.actualWeight) || 0),
          0
        )
        : 0;
      const CWt = invoiceDetails
        ? invoiceDetails.invoiceDetails.reduce(
          (a, c) => a + (parseFloat(c.chargedWeight) || 0),
          0
        )
        : 0;

      docketDetails["pKGS"] = Pkg;
      const WtKg = Wt * 1000; // Convert Wt to kg (tons to kg)
      const CWtKg = CWt * 1000; // Convert CWt to kg (tons to kg)
      docketDetails["aCTWT"] = ConvertToNumber(WtKg || 0, 2);
      docketDetails["cHRWT"] = ConvertToNumber(CWtKg || 0, 2);
      docketDetails["cFTWT"] = 0;
      docketDetails["vOL"] = 0;
      docketDetails["volume_in"] = "FT";
      docketDetails["oSTS"] = 1;
      docketDetails["oSTSN"] = "Booked";
      docketDetails["fSTS"] = 0;
      docketDetails["fSTSN"] = "Pending";
      docketDetails["status"] = `Booked at ${docketDetails["origin"]
        } on ${moment(docketDetails["docketDate"]).format("DD MMM YY HH:mm:ss")}`;
      docketDetails["cONTRACT"] = "";
      docketDetails["eNTDT"] = new Date();
      docketDetails["eNTLOC"] = this.storage.branch;
      docketDetails["eNTBY"] = this.storage.userName;

      let invDet = [];
      let contDet = [];
      invoiceDetails.invoiceDetails.forEach((i) => {
        const actualWeight = parseFloat(i.actualWeight) * 1000;
        const chargedWeight = parseFloat(i.chargedWeight) * 1000;
        invDet.push({
          cID: this.storage.companyCode,
          //dKTNO:  //To be set from service
          iNVNO: i.invoiceNo,
          iNVAMT: i.invoiceAmount,
          cURR: "INR",
          eWBNO: i.ewayBillNo,
          eXPDT: i.expiryDateO,
          pKGS: parseInt(i.noofPkts) || 0,
          mTNM: i.materialName,
          aCTWT: ConvertToNumber(actualWeight || 0, 2),
          cFTWT: 0,
          cHRWT: ConvertToNumber(chargedWeight || 0, 2),
          vOL: {
            uNIT: "FT",
            l: 0.0,
            b: 0.0,
            h: 0.0,
            cU: 0.0,
          },
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName,
        });
      });

      containerDetail.containerDetail.forEach((i) => {
        let container = this.model.containerTypeList.find(
          (f) => f.name.trim() == i.containerType.trim()
        );
        contDet.push({
          cID: this.storage.companyCode,
          //dKTNO:  //To be set from service
          cNID: i.containerNumber,
          cNTYP: container?.value || i.containerType,
          cNTYPN: container?.name || "",
          cNCPT: parseInt(i.containerCapacity),
          isEMPT: i.isEmpty,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName,
        });
      });

      docketDetails["invoiceDetails"] = invDet;
      docketDetails["containerDetail"] = contDet;
      let docketFin = {
        _id: "",
        cID: this.storage.companyCode,
        dKTNO: "",
        pCD: bParty?.value,
        pNM: bParty?.name,
        bLOC: this.storage.branch,
        cURR: "INR",
        fRTAMT: this.model.FreightTableForm.controls["freight_amount"].value,
        oTHAMT: this.model.FreightTableForm.controls["otherAmount"].value,
        gROAMT: this.model.FreightTableForm.controls["grossAmount"].value,
        rCM: this.model.FreightTableForm.controls["rcm"].value,
        gSTAMT: this.model.FreightTableForm.controls["gstAmount"].value,
        gSTCHAMT:
          this.model.FreightTableForm.controls["gstChargedAmount"].value,
        cHG: this.model.NonFreightTableForm?.value
          ? Object.entries(this.model.NonFreightTableForm.value)
            .filter(([cHGNM, cHGVL]) => cHGVL !== null && cHGVL !== undefined)
            .map(([cHGNM, cHGVL]) => ({ cHGNM, cHGVL }))
          : [],

        tOTAMT: this.model.FreightTableForm.controls["totalAmount"].value,
        sTS: 0,
        sTSNM: "Booked",
        sTSTM: new Date(),
        isBILLED: false,
        bILLNO: "",
        eNTDT: new Date(),
        eNTLOC: this.storage.branch,
        eNTBY: this.storage.userName,
        mODDT: "",
        mODLOC: "",
        mODBY: "",
      };
      docketDetails["docketFin"] = docketFin;
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets",
        docType: "CN",
        branch: this.storage.branch,
        finYear: financialYear,
        timeZone: this.storage.timeZone,
        data: docketDetails,
        isManual: this.isManual,
        party: docketDetails["billingPartyName"],
      };
      if (this.prqFlag) {
        const prqData = {
          prqId: this.model.consignmentTableForm.value?.prqNo || "",
          dktNo: this.model.consignmentTableForm.controls["docketNumber"].value,
        };
        const update = {
          sTS: "3",
          sTSNM: "Ready For THC",
        };
        await this.consigmentUtility.updatePrq(prqData, update);
      }
      if (this.isManual) {
        const data = {
          dKTNO: this.model.consignmentTableForm.controls["docketNumber"].value,
        };
        await this.docketService.addDcrDetails(data, this.dcrDetail);
      }
      firstValueFrom(
        this.operationService.operationMongoPost(
          "operation/docket/create",
          reqBody
        )
      )
        .then((res: any) => {
          if (res.success) {
            const dockNo = this.isManual
              ? this.model.consignmentTableForm.controls["docketNumber"].value
              : res.data;
            const PayTypeCode = this.model.consignmentTableForm.value.payType;
            if (PayTypeCode === "P01") {
              this.AccountPosting(reqBody, dockNo);
            } else {
              Swal.fire({
                icon: "success",
                title: "Booked Successfully",
                text: "GCN No: " + dockNo,
                showConfirmButton: true,
                denyButtonText: 'Print',
                showDenyButton: true,
                showCancelButton: true,
                cancelButtonText: 'Close'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.navService.navigateTotab("docket", "dashboard/Index");
                } else if (result.isDenied) {
                  // Handle the action for the deny button here.
                  const templateBody = {
                    templateName: "DKT",
                    PartyField: "",
                    DocNo: dockNo,
                  };
                  const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
                  window.open(url, '', 'width=1000,height=800');
                  this.route.navigateByUrl('Operation/ConsignmentEntry').then(() => {
                    window.location.reload();
                  });
                } else if (result.isDismissed) {
                  // Handle the action for the cancel button here.
                  this.navService.navigateTotab('docket', "dashboard/Index");
                }
              });
            }
          } else {
            throw new Error(res.message);
          }
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Something went wrong! ${err.message}`,
            showConfirmButton: true,
          });
        });
    } else {
      vendorName;
      let docketDetails = {
        ...this.model.consignmentTableForm.value,
        ...this.model.FreightTableForm.value,
        ...invoiceDetails,
        ...containerDetail,
      };
      const jsonControl = [
        ...this.jsonControlArrayBasic,
        ...this.jsonControlArrayConsignor,
        ...this.jsonControlArrayConsignee,
        ...this.jsonControlArray,
      ];
      let invDet = [];
      let contDet = [];
      invoiceDetails.invoiceDetails.forEach((i) => {
        invDet.push({
          _id: `${this.storage.companyCode}-${docketDetails.docketNumber}-${i.invoiceNo}`,
          cID: this.storage.companyCode,
          dKTNO: docketDetails.docketNumber, //To be set from service
          iNVNO: i.invoiceNo,
          iNVAMT: i.invoiceAmount,
          cURR: "INR",
          eWBNO: i.ewayBillNo,
          eXPDT: i.expiryDateO,
          pKGS: parseInt(i.noofPkts) || 0,
          mTNM: i.materialName,
          aCTWT: ConvertToNumber(i.actualWeight || 0, 2),
          cFTWT: 0,
          cHRWT: ConvertToNumber(i.chargedWeight || 0, 2),
          vOL: {
            uNIT: "FT",
            l: 0.0,
            b: 0.0,
            h: 0.0,
            cU: 0.0,
          },
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName,
        });
      });

      containerDetail.containerDetail.forEach((i) => {
        let container = this.model.containerTypeList.find(
          (f) => f.name.trim() == i.containerType.trim()
        );
        contDet.push({
          _id: `${this.storage.companyCode}-${docketDetails.docketNumber}-${i.containerNumber}`,
          cID: this.storage.companyCode,
          dKTNO: docketDetails.docketNumber,
          cNID: i.containerNumber,
          cNTYP: container?.value || i.containerType,
          cNTYPN: container?.name || "",
          cNCPT: parseInt(i.containerCapacity),
          isEMPT: i.isEmpty,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch,
          eNTBY: this.storage.userName,
        });
      });

      const reverseDocketObjectMapping =
        await this.docketService.reverseDocketObjectMapping(
          docketDetails,
          jsonControl
        );

      const filter = { dKTNO: reverseDocketObjectMapping.docNo };
      await Promise.all([
        this.docketService.updateDocket(
          reverseDocketObjectMapping,
          reverseDocketObjectMapping.docNo
        ),
        invDet && invDet.length > 0
          ? this.docketService.updateManyDockets(
            invDet,
            filter,
            "docket_invoices"
          )
          : null,
        contDet && contDet.length > 0
          ? this.docketService.updateManyDockets(
            contDet,
            filter,
            "docket_containers"
          )
          : null,
        this.docketService.addEventData(docketDetails),
        this.docketService.updateOperationData(docketDetails),
      ]);

      Swal.fire({
        icon: "success",
        title: "Docket Update Successfully",
        text: "GCN No: " + this.model.consignmentTableForm.controls["docketNumber"].value,
        confirmButtonText: 'OK',
        showConfirmButton: true,
        denyButtonText: 'Print',
        showDenyButton: true,
        cancelButtonText: 'Close',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.navService.navigateTotab("docket", "dashboard/Index");
        } else if (result.isDenied) {
          // Handle the action for the deny button here.
          const templateBody = {
            templateName: "DKT",
            PartyField: "",
            DocNo: this.model.consignmentTableForm.controls["docketNumber"].value,
          }
          const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
          window.open(url, '', 'width=1000,height=800');
          this.navService.navigateTotab("docket", "dashboard/Index");
        } else if (result.isDismissed) {
          // Handle the action for the cancel button here.
          this.navService.navigateTotab("docket", "dashboard/Index");
        }
      });
    }
  }
  async addDocketNestedtDetail(dkt, invoiceDetails) {
    // Assuming invoiceDetails might be null or an empty array
    const totalPkg = invoiceDetails
      ? invoiceDetails.invoiceDetails.reduce(
        (accumulator, currentValue) =>
          accumulator + (parseInt(currentValue.noofPkts) || 0),
        0
      )
      : 0;
    const totalWt = invoiceDetails
      ? invoiceDetails.invoiceDetails.reduce(
        (accumulator, currentValue) =>
          accumulator + (parseFloat(currentValue.actualWeight) || 0),
        0
      )
      : 0;

    const data = {
      _id: `${this.storage.companyCode}-${dkt}-0`,
      cID: this.storage.companyCode,
      dKTNO: dkt,
      sFX: 0,
      cLOC: this.storage.branch,
      cNO: "",
      nLoc: "",
      tId: "",
      tOTWT: ConvertToNumber(
        parseFloat(totalWt) * 1000,
        2
      ) /*temporary calucation*/,
      tOTPKG: totalPkg,
      vEHNO: "",
      aRRTM: "",
      aRRPKG: "",
      aRRWT: "",
      dTime: "",
      dPKG: "",
      dWT: "",
      sTS: "",
      sTSTM: "",
      eNTLOC: this.storage.branch,
      eNTBY: this.storage.userName,
      eNTDT: new Date(),
      mODDT: "",
      mODLOC: "",
      mODBY: "",
    };
    await this.docketService.addDktDetail(data);
    Swal.fire({
      icon: "success",
      title: "Booked Successfully",
      text: "GCN No: " + dkt,
      confirmButtonText: 'OK',
      showConfirmButton: true,
      denyButtonText: 'Print',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Close'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the desired page after the success message is confirmed.
        this.navService.navigateTotab("docket", "dashboard/Index");
      } else if (result.isDenied) {
        // Handle the action for the deny button here.
        const templateBody = {
          templateName: "DKT",
          PartyField: "",
          DocNo: dkt,
        };
        const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
        window.open(url, '', 'width=1000,height=800');
        this.route.navigateByUrl('Operation/ConsignmentEntry').then(() => {
          window.location.reload();
        });
      } else if (result.isDismissed) {
        // Handle the action for the cancel button here.
        this.navService.navigateTotab('docket', "dashboard/Index");
      }
    });
  }
  /*End Save*/
  public selectedFile(event) {
    let fileList: FileList = event.eventArgs;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then((jsonData) => {
        const validationRules = [
          {
            ItemsName: "containerNumber",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "containerType",
            Validations: [
              { Required: true },
              {
                TakeFromList: this.model.containerTypeList.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
        ];

        let rPromise = firstValueFrom(
          this.xlsxUtils.validateData(jsonData, validationRules)
        );
        rPromise
          .then((response) => {
            this.OpenPreview(response);
            this.model.containerTableForm.controls["Company_file"].setValue("");
          })
          .catch((error) => {
            console.error("Validation error:", error);
            // Handle errors here
          });
      });
    }
  }

  OpenPreview(results) {
    const dialogRef = this.matDialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.model.previewResult = result;
        this.containorCsvDetail();
      }
    });
  }

  calculateFreight() {
    const freightRateType =
      this.model.FreightTableForm.controls["freightRatetype"].value;
    const freightRate =
      this.model.FreightTableForm.controls["freight_rate"]?.value || 0;
    let rateTypeMap = {};
    if (typeof freightRateType === "string") {
      rateTypeMap = {
        "RTTYP-0001": 1.0,
        "RTTYP-0006": this.getInvoiceAggValue("noofPkts"),
        "RTTYP-0005": this.getInvoiceAggValue("chargedWeight") * 1000,
        "RTTYP-0002": this.getInvoiceAggValue("chargedWeight"),
        "RTTYP-0007":
          this.model.tableData.length > 0 ? this.model.tableData.length : 1,
      };
    }
    let TotalNonFreight = 0;
    if (this.model.NonFreightTableForm) {
      TotalNonFreight =
        ConvertToNumber(
          Object.keys(this.model.NonFreightTableForm.controls).reduce(
            (total, key) =>
              total + this.model.NonFreightTableForm.get(key).value,
            0
          ),
          2
        ) || 0;
    }

    const mfactor = rateTypeMap[freightRateType] || 1;
    let total = parseFloat(freightRate) * parseFloat(mfactor);
    this.model.FreightTableForm.controls["freight_amount"]?.setValue(
      ConvertToNumber(total, 2)
    );
    this.model.FreightTableForm.get("grossAmount")?.setValue(
      ConvertToNumber(
        (parseFloat(this.model.FreightTableForm.get("freight_amount")?.value) ||
          0) +
        (parseFloat(this.model.FreightTableForm.get("otherAmount")?.value) ||
          0) +
        TotalNonFreight,
        2
      )
    );
    this.model.FreightTableForm.get("totalAmount")?.setValue(
      ConvertToNumber(
        (parseFloat(this.model.FreightTableForm.get("grossAmount")?.value) ||
          0) +
        (parseFloat(
          this.model.FreightTableForm.get("gstChargedAmount")?.value
        ) || 0)
      )
    );
    if (this.model.FreightTableForm.controls['rcm'].value == "Y") {
      this.model.FreightTableForm.get("totAmt")?.setValue(this.model.FreightTableForm.get("grossAmount")?.value);
    }
    this.calculateRate();
  }
  calculateRate() {
    if (this.model.FreightTableForm.controls['rcm'].value == "N") {
      const gstRate = parseFloat(this.model.FreightTableForm.controls['gstAmount'].value);
      const grossAmt = parseFloat(this.model.FreightTableForm.controls['grossAmount'].value);
      const gstAmt = (grossAmt * gstRate) / 100;
      const totalgst = gstAmt ? parseFloat(gstAmt.toFixed(2)) : gstAmt
      this.model.FreightTableForm.controls["gstChargedAmount"].setValue(totalgst);
      this.model.FreightTableForm.get("totAmt")?.setValue(ConvertToNumber(
        (parseFloat(this.model.FreightTableForm.get("grossAmount")?.value) || 0) +
        (parseFloat(this.model.FreightTableForm.get("gstChargedAmount")?.value) || 0))
      );
    }
  }
  containorCsvDetail() {
    if (this.model.previewResult.length > 0) {
      this.tableLoad = true;
      this.isLoad = true;
      let containerNo = [];

      const containerDetail = this.model.previewResult.map((x, index) => {
        if (x) {
          const detail = containerNo.includes(x.containerNumber);
          const match = this.model.containerTypeList.find(
            (y) => y.name === x.containerType
          );
          if (match) {
            x.containerCapacity = match?.loadCapacity || "";
          }
          if (!("isEmpty" in x)) {
            // If isEmpty property is not present, assign false to it
            x.isEmpty = "N";
          }
          if (detail) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Container Id '${x.containerNumber}' is Already exist`,
            });
            return null; // Returning null to indicate that this element should be removed
          }
          // if (!x.isEmpty) {
          //   Swal.fire({
          //     icon: "error",
          //     title: "Error",
          //     text: `IsEmpty is Required`,
          //   });
          //   return null; // Returning null to indicate that this element should be removed
          // }
          // Modify 'x' if needed
          // For example, you can add the index to the element
          containerNo.push(x.containerNumber);
          x.id = index + 1;
          x.actions = ["Edit", "Remove"];
          return x;
        }
        return x; // Return the original element if no modification is needed
      });
      // Filter out the null values if necessary
      const filteredContainerDetail = containerDetail.filter((x) => x !== null);
      this.model.tableData = filteredContainerDetail;
      this.tableLoad = false;
      this.isLoad = false;
    }
  }
  /*getConsignor*/
  getConsignor() {
    const cust = this.model.consignmentTableForm.value;
    const mobile =
      this.model.consignmentTableForm.controls["consignorName"].value
        ?.otherdetails?.customer_mobile || "";
    this.model.consignmentTableForm.controls["ccontactNumber"].setValue(mobile);
    this.SetConsignorAndConsigneeAddressDetails(
      this.model.consignmentTableForm.controls["consignorName"].value?.value,
      "consignor"
    );
    let cnogst = cust.consignorName.otherdetails.GSTdetails.filter(x => x.gstNo.substring(0, 2) == cust.fromCity.st);
    if (!cnogst || cnogst.length === 0 || cnogst.length > 1) {
      cnogst = cust.consignorName.otherdetails.GSTdetails.filter(x => x.gstCity === cust.fromCity.ct);
    }
    if (!cnogst || cnogst.length === 0) {
      cnogst = cust.consignorName.otherdetails.GSTdetails[0];
    } else if (cnogst.length === 1) {
      cnogst = cnogst[0];
    }
    this.model.consignmentTableForm.controls["cnogst"].setValue(cnogst?.gstNo || "");
  }
  /*End*/
  /*getConsignee*/
  getConsignee() {
    const cust = this.model.consignmentTableForm.value;
    const mobile =
      this.model.consignmentTableForm.controls["consigneeName"].value
        ?.otherdetails?.customer_mobile || "";
    this.model.consignmentTableForm.controls["cncontactNumber"].setValue(
      mobile
    );
    this.SetConsignorAndConsigneeAddressDetails(
      this.model.consignmentTableForm.controls["consigneeName"].value?.value,
      "consignee"
    );
    let cnogst = cust.consignorName.otherdetails.GSTdetails.filter(x => x.gstNo.substring(0, 2) == cust.toCity.st);
    if (!cnogst || cnogst.length === 0 || cnogst.length > 1) {
      cnogst = cust.consignorName.otherdetails.GSTdetails.filter(x => x.gstCity === cust.toCity.ct);
    }
    if (!cnogst || cnogst.length === 0) {
      cnogst = cust.consignorName.otherdetails.GSTdetails[0];
    } else if (cnogst.length === 1) {
      cnogst = cnogst[0];
    }
    this.model.consignmentTableForm.controls["cnegst"].setValue(cnogst?.gstNo || "");
  }
  /*End*/
  //validation for the Actual weight not greater then actual weight
  calculateValidation() {
    const chargedWeight = parseFloat(
      this.model.invoiceTableForm.controls["chargedWeight"]?.value || 0
    );
    const actualWeight = parseFloat(
      this.model.invoiceTableForm.controls["actualWeight"]?.value || 0
    );
    if (actualWeight > chargedWeight) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Actual weight cannot be greater than Charge weight.",
      });
      this.model.invoiceTableForm.controls["actualWeight"]?.setValue("");
      return false;
    }
    return true;
  }
  /*pincode based city*/
  // async getPincodeDetail(event) {
  //   const cityMapping = event.field.name == "fromCity" ? this.model.fromCityStatus : this.model.toCityStatus;
  //   await this.pinCodeService.getCity(
  //     this.model.consignmentTableForm,
  //     this.jsonControlArrayBasic,
  //     event.field.name,
  //     cityMapping
  //   );
  // }
  /*end*/
  /*pincode based city*/
  async getPincodeDetail(event) {
    if (!this.conLoc) {
      const value =
        this.model.consignmentTableForm.controls[event.field.name].value;
      if (typeof value == "string" || typeof value == "number") {
        if (isValidNumber(value)) {
          await this.pinCodeService.getCityPincode(
            this.model.consignmentTableForm,
            this.model.allformControl,
            event.field.name,
            true,
            false
          );
        } else {
          await this.pinCodeService.getCityPincode(
            this.model.consignmentTableForm,
            this.model.allformControl,
            event.field.name,
            true,
            true,
            true
          );
        }
      }
    }
  }
  /*end*/
  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(
      this.model.consignmentTableForm,
      this.model.allformControl,
      event.field.name,
      this.model.customerStatus
    );
  }

  async getVendors(event) {
    if (event.eventArgs.length >= 3) {
      const vendorType =
        this.model.consignmentTableForm.controls["vendorType"].value;
      if (vendorType && vendorType !== "") {
        let vendors = await getVendorsForAutoComplete(
          this.masterService,
          event.eventArgs,
          parseInt(vendorType)
        );
        this.filter.Filter(
          this.jsonControlArrayBasic,
          this.model.consignmentTableForm,
          vendors,
          this.model.vendorName,
          this.model.vendorNameStatus
        );
      }
    }
  }

  /*end*/
  getInvoiceAggValue(fielName) {
    if (this.model.invoiceData.length > 0) {
      return this.model.invoiceData.reduce(
        (acc, amount) => parseFloat(acc) + parseFloat(amount[fielName]),
        0
      );
    } else if (this.model.invoiceTableForm.value) {
      return parseFloat(this.model.invoiceTableForm.controls[fielName].value);
    }
    return 0;
  }
  /*AutoFiill Invoice data*/
  fillInvoiceDetails(data) {
    // Define a mapping of form control names to their respective keys in the incoming data
    const formFields = {
      ewayBillNo: "ewayBillNo",
      expiryDate: "expiryDateO",
      invoiceNo: "invoiceNo",
      invoiceAmount: "invoiceAmount",
      noofPkts: "noofPkts",
      actualWeight: "actualWeight",
      chargedWeight: "chargedWeight",
    };

    // Loop through the defined form fields and set their values from the incoming data
    Object.keys(formFields).forEach((field) => {
      // Set form control value to the data property if available, otherwise set it to an empty string
      this.model.invoiceTableForm.controls[field].setValue(
        data.data?.[formFields[field]] || ""
      );
    });
    this.model.invoiceTableForm.controls["materialName"].setValue({
      name: data.data["materialName"],
      value: data.data["materialName"],
    });
    // Filter the invoiceData to exclude the entry with the provided data ID
    this.model.invoiceData = this.model.invoiceData.filter(
      (x) => x.id !== data.data.id
    );
  }
  /*End*/
  /* AutoFill Containor Details */
  fillContainerDetails(data) {
    const container = this.model.containerTypeList.find(
      (x) => x.name.trim() === data.data?.containerType.trim()
    );
    this.model.containerTableForm.controls["containerNumber"].setValue(
      data.data?.containerNumber || ""
    );
    this.model.containerTableForm.controls["containerCapacity"].setValue(
      data.data?.containerCapacity || ""
    );
    this.model.containerTableForm.controls["containerType"].setValue(container);
    this.model.containerTableForm.controls["isEmpty"].setValue(
      data.data.isEmpty == "Y" ? true : false
    );
    this.model.tableData = this.model.tableData.filter(
      (x) => x.id !== data.data.id
    );
  }
  /* End */
  ngOnDestroy(): void {
    // Destroy form values
    this.model.invoiceTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.ewayBillTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.consignmentTableForm.reset();
    this.model.containerTableForm.reset();
    this.model.FreightTableForm.reset();
    this.model.FreightTableForm.reset();
    // Destroy variable values
    this.model.invoiceData = [];
    this.model.tableData = [];
  }
  //validation for the Actual weight not greater then actual weight

  /*pincode based city*/
  SetInvoiceData() {
    this.InvoiceDetailsList = [
      {
        count: this.model.invoiceData.reduce(
          (acc, invoiceAmount) =>
            parseFloat(acc) + parseFloat(invoiceAmount["invoiceAmount"]),
          0
        ),
        title: "Invoice Amount",
        class: `color-Ocean-danger`,
      },
      {
        count: this.model.invoiceData.reduce(
          (acc, noofPkts) => parseFloat(acc) + parseFloat(noofPkts["noofPkts"]),
          0
        ),
        title: "No of Pkts",
        class: `color-Success-light`,
      },
      {
        count: this.model.invoiceData.reduce(
          (acc, actualWeight) =>
            parseFloat(acc) + parseFloat(actualWeight["actualWeight"]),
          0
        ),
        title: "Actual Weight",
        class: `color-Success-light`,
      },
      {
        count: this.model.invoiceData.reduce(
          (acc, chargedWeight) =>
            parseFloat(acc) + parseFloat(chargedWeight["chargedWeight"]),
          0
        ),
        title: "Charged weight",
        class: `color-Success-light`,
      },
    ];
  }

  // Updated function to handle `isOrigin` condition correctly
  getTermValue(term, isOrigin) {
    const typeMapping = { "Area": "AR", "Pincode": "PIN", "Location": "LOC", "City": "CT", "State": "ST" };
    let fieldKey = isOrigin ? "fromCity" : "toCity";
    if (term == "Location") {
      fieldKey = isOrigin ? "origin" : "destination";
    }
    const type = typeMapping[term];
    let valueKey;

    // Determine the correct key based on term
    switch (term) {
      case "Area":
        valueKey = "clusterName";
        break;
      case "Pincode":
        valueKey = "pincode";
        break;
      case "Location":
        valueKey = "value";
        break;
      case "City":
        valueKey = "ct";
        break;
      case "State":
        valueKey = "st";
        break;
      default:
        return [];
    }
    const controls = this.model.consignmentTableForm.controls;
    let value;
    if (fieldKey == "origin") {
      value = controls[fieldKey].value;
    } else {
      value = controls[fieldKey].value[valueKey];
    }
    if (value) {
      return [
        { "D$eq": [`$${isOrigin ? 'f' : 't'}TYPE`, type] },
        { "D$eq": [`$${isOrigin ? 'fROM' : 'tO'}`, value] }];

    }
    return [];
  }

  //Contract Invoked Section
  InvockedContract() {
    // get current mode
    const loadType = this.storage.mode;
    let SelectedLoadTypeCode;
    if (this.LoadType.find((x) => x.codeDesc == loadType)) {
      SelectedLoadTypeCode = this.LoadType.find((x) => x.codeDesc == loadType).codeId;
    }
    else {
      SelectedLoadTypeCode = "LT-0001";
    }

    const paymentBasesName = this.paymentBases.find(
      (x) => x.value == this.model.consignmentTableForm.value.payType
    ).name;
    const TransMode = this.products.find(
      (x) => x.value == this.model.consignmentTableForm.value.transMode
    ).name;
    let containerCode;
    if (this.model.consignmentTableForm.value.cd) {
      containerCode =
        this.model.containerTableForm.value.containerType?.containerCode;
    } else {
      containerCode = this.model.invoiceData.reduce(
        (a, c) => a + (parseFloat(c.actualWeight) || 0),
        0
      );
    }
    const terms = ["Area", "Pincode", "Location", "City", "State"];
    const allCombinations = generateCombinations(terms);
    let matches = allCombinations
      .map(([fromTerm, toTerm]) => {
        let match = { D$and: [] };
        let fromConditions = this.getTermValue(fromTerm, true); // For origin
        let toConditions = this.getTermValue(toTerm, false); // For destination

        if (fromConditions.length > 0 || toConditions.length > 0) {
          match["D$and"].push(...fromConditions, ...toConditions);
          return match;
        }
        return null;
      })
      .filter((x) => x != null);
    matches.push({
      D$and: [
        { "D$in": ['$fTYPE', [null, ""]] },
        { "D$in": ['$fROM', [null, ""]] }]
    });
    matches.push({
      D$and: [
        { "D$in": ['$tTYPE', [null, ""]] },
        { "D$in": ['$tO', [null, ""]] }]
    });
    let reqBody = {
      companyCode: this.storage.companyCode,
      customerCode: this.model.consignmentTableForm.value.billingParty.value,
      contractDate: this.model.consignmentTableForm.value.docketDate,
      productName: TransMode,
      basis: paymentBasesName,
      from: this.model.consignmentTableForm.value.fromCity.value,
      to: this.model.consignmentTableForm.value.toCity.value,
      capacity: containerCode,
      LoadType: SelectedLoadTypeCode,
      matches: matches,
    };
    firstValueFrom(
      this.operationService.operationMongoPost(
        "operation/docket/ltl/invokecontract",
        reqBody
      )
    )
      .then(async (res: any) => {
        if (res.length == 1) {
          this.NonFreightjsonControlArray =
            await this.GenerateFixedChargesControls(
              res[0]?.NonFreightChargeMatrixDetails
            );
          if (res[0]?.NonFreightChargeMatrixDetailsDetails) {
            let actualWeightInTon;
            if (this.model.consignmentTableForm.value.cd) {
              actualWeightInTon =
                this.model.containerTableForm.value.containerCapacity;
            } else {
              actualWeightInTon = this.model.invoiceData.reduce(
                (a, c) => a + (parseFloat(c.actualWeight) || 0),
                0
              );
            }

            res[0]?.NonFreightChargeMatrixDetailsDetails?.forEach((element) => {
              const calculationRatio = RateTypeCalculation.find(
                (x) => x.codeId == element.rTYPCD
              ).calculationRatio;
              const actualWeight = actualWeightInTon * calculationRatio;
              const value = Math.min(
                Math.max(element.mINV, element.rT * actualWeight),
                element.mAXV
              );
              this.NonFreightjsonControlArray.push(
                this.GenerateVariableChargesControls(element, value)
              );
            });
          }

          if (res[0]?.sERVSELEC) {
            res[0]?.sERVSELEC.forEach((element) => {
              const ServiceResponse = this.GetServiceWiseCalculatedData(
                element,
                res[0]
              );
              if (ServiceResponse) {
                this.NonFreightjsonControlArray.push(
                  this.GenerateControllsWithNameAndValue(ServiceResponse)
                );
              }
            });
          }

          this.NonFreightLoaded = true;

          this.model.NonFreightTableForm = formGroupBuilder(this.fb, [
            this.NonFreightjsonControlArray,
          ]);
          this.model.consignmentTableForm.controls["tran_day"].setValue(
            res[0].FreightChargeMatrixDetails?.tRDYS || 0
          );
          this.model.FreightTableForm.controls["freight_rate"].setValue(
            res[0].FreightChargeMatrixDetails?.rT
          );
          this.model.FreightTableForm.controls["freightRatetype"].setValue(
            res[0].FreightChargeMatrixDetails?.rTYPCD
          );
          this.calculateFreight();

          Swal.fire({
            icon: "success",
            title: "Contract Invoked Successfully",
            text: "ContractId: " + res[0].docNo,
            showConfirmButton: false,
          });
          this.model.consignmentTableForm.controls["contract"].setValue(
            res[0]?.docNo || ""
          );
        } else {
          Swal.fire({
            icon: "info",
            title: "info",
            text: "Contract Invoked Failed",
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! ${err.message}`,
          showConfirmButton: false,
        });
      });
  }
  GetServiceWiseCalculatedData(fieldName, data) {
    switch (fieldName) {
      case "COD/DOD":
        let actualWeightInTon;
        if (this.model.consignmentTableForm.value.cd) {
          actualWeightInTon =
            this.model.containerTableForm.value.containerCapacity;
        } else {
          actualWeightInTon = this.model.invoiceData.reduce(
            (a, c) => a + (parseFloat(c.actualWeight) || 0),
            0
          );
        }
        if (actualWeightInTon) {
          const calculationRatio = RateTypeCalculation.find(
            (x) => x.codeId == data.cODDODRTYP
          ).calculationRatio;
          const actualWeight = actualWeightInTon * calculationRatio;

          const value = Math.min(
            Math.max(data.mIN, data.rT * actualWeight),
            data.mAX
          );
          return {
            functionName: "",
            value: value,
            name: "CODDOD",
            label: "COD/DOD",
            placeholder: "COD/DOD",
          };
        }

      case "Demurrage":
        break;
      case "fuelSurcharge":
        break;
      case "Insurance":
        if (this.model.invoiceData.length > 0) {
          const TotalInvoiceAmount = this.model.invoiceData.reduce(
            (acc, amount) =>
              parseFloat(acc) + parseFloat(amount["invoiceAmount"]),
            0
          );
          const actualWeightInTon = this.model.invoiceData.reduce(
            (acc, noofPkts) =>
              parseFloat(acc) + parseFloat(noofPkts["actualWeight"]),
            0
          );

          const Insurance = data.FreightChargeInsuranceDetails.find(
            (x) =>
              x.iVFROM <= TotalInvoiceAmount && x.iVTO >= TotalInvoiceAmount
          );
          if (Insurance) {
            const calculationRatio = RateTypeCalculation.find(
              (x) => x.codeId == Insurance.rtType
            ).calculationRatio;
            const actualWeight = actualWeightInTon * calculationRatio;
            const TotalInsuranceValue = Insurance.rT * actualWeight;
            const value = Math.min(
              Math.max(Insurance.mIN, TotalInsuranceValue),
              Insurance.mAX
            );

            return {
              functionName: "",
              value: value,
              name: "Insurance",
              label: "Insurance",
              placeholder: "Insurance",
            };
          }
        }
        break;
    }
  }
  GenerateControllsWithNameAndValue(RequestData) {
    return {
      name: RequestData.name.replaceAll(/\s/g, ""),
      label: RequestData.label,
      placeholder: RequestData.placeholder,

      type: "number",
      value: RequestData.value,
      generatecontrol: true,
      disable: false,
      Validations: [
        {
          name: "pattern",
          message:
            "Please Enter only positive numbers with up to two decimal places",
          pattern: "^\\d+(\\.\\d{1,2})?$",
        },
      ],
      functions: {
        onChange: RequestData.functionName
          ? RequestData.functionName
          : undefined,
      },
    };
  }
  GenerateFixedChargesControls(data) {
    return data
      .filter((x) => x.cBT === "Fixed")
      .map((x) => ({
        name: x.sCT.replaceAll(/\s/g, ""),
        label: x.sCT,
        placeholder: x.sCT,
        type: "number",
        value: x.nFC,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        functions: {
          //onChange: "OnChangeFixedAmounts",
        },
      }));
  }
  GenerateVariableChargesControls(data, value) {
    return {
      name: data.sCT.replaceAll(/\s/g, ""),
      label: data.sCT,
      placeholder: data.sCT,
      type: "number",
      value: value,
      generatecontrol: true,
      disable: false,
      Validations: [
        {
          name: "pattern",
          message:
            "Please Enter only positive numbers with up to two decimal places",
          pattern: "^\\d+(\\.\\d{1,2})?$",
        },
      ],
      functions: {
        //onChange: "OnChangeFixedAmounts",
      },
    };
  }
  // Account Posting When  C Note Booked
  async AccountPosting(DocketRequestBody, DocketNo) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        let GSTAmount = 0;
        const TotalAmount =
          this.model.FreightTableForm.controls["totalAmount"].value;

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode =
          VoucherInstanceType.CNoteBooking;
        this.VoucherDataRequestModel.transType =
          VoucherInstanceType[VoucherInstanceType.CNoteBooking];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType =
          VoucherType[VoucherType.JournalVoucher];

        this.VoucherDataRequestModel.transDate =
          this.model.consignmentTableForm.value.docketDate;
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear;

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        (this.VoucherDataRequestModel.partyCode =
          this.model.consignmentTableForm.value?.billingParty?.value),
          (this.VoucherDataRequestModel.partyName =
            this.model.consignmentTableForm.value?.billingParty?.name),
          (this.VoucherDataRequestModel.partyState = "");
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = "";

        this.VoucherDataRequestModel.tdsSectionCode = "";
        this.VoucherDataRequestModel.tdsSectionName = "";
        this.VoucherDataRequestModel.tdsRate = 0;
        this.VoucherDataRequestModel.tdsAmount = 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = "";
        this.VoucherDataRequestModel.tcsSectionName = "";
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = 0;
        this.VoucherDataRequestModel.SGST = 0;
        this.VoucherDataRequestModel.CGST = 0;
        this.VoucherDataRequestModel.UGST = 0;
        this.VoucherDataRequestModel.GSTTotal = GSTAmount;

        this.VoucherDataRequestModel.GrossAmount = TotalAmount;
        this.VoucherDataRequestModel.netPayable = TotalAmount;
        this.VoucherDataRequestModel.roundOff = 0;
        this.VoucherDataRequestModel.voucherCanceled = false;

        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        this.VoucherDataRequestModel.transactionNumber = DocketNo;
        var VoucherlineitemList = this.GetVouchersLedgers(TotalAmount, DocketNo);


        this.VoucherRequestModel.details = VoucherlineitemList;
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {
              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transCode: VoucherInstanceType.CNoteBooking,
                transType:
                  VoucherInstanceType[VoucherInstanceType.CNoteBooking],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                docType: "Voucher",
                partyType: "Customer",
                docNo: DocketNo,
                partyCode:
                  this.model.consignmentTableForm.value?.billingParty?.value,
                partyName:
                  this.model.consignmentTableForm.value?.billingParty?.name,
                entryBy: this.storage.getItem(StoreKeys.UserId),
                entryDate: Date(),
                debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ?? ""
                  };
                }),
                credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ?? ""
                  };
                }),
              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    if (res.success) {
                      // Call Bill Generation
                      this.AutoCustomerInvoicing(DocketRequestBody, DocketNo);
                    }
                    // Swal.fire({
                    //   icon: "success",
                    //   title: "Booked Successfully And Voucher Created",
                    //   text:
                    //     "DocketNo: " +
                    //     DocketNo +
                    //     "  Voucher No: " +
                    //     reqBody.voucherNo,
                    //   showConfirmButton: true,
                    // }).then((result) => {
                    //   if (result.isConfirmed) {
                    //     Swal.hideLoading();
                    //     setTimeout(() => {
                    //       Swal.close();
                    //     }, 2000);
                    //     this.navService.navigateTotab(
                    //       "docket",
                    //       "dashboard/Index"
                    //     );
                    //   }
                    // });
                  },
                  error: (err: any) => {
                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal(
                        "error",
                        "Bad Request"
                      );
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });
            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "Fail To Submit Data..!"
        );
      }
    }, "C-Note Booking Voucher Generating..!");
  }
  //Rcm changed that function will be call
  onRcmChange() {
    if (this.model.FreightTableForm.controls["rcm"].value == "Y") {
      this.model.FreightTableForm.controls["gstAmount"].disable();
      this.model.FreightTableForm.controls["gstChargedAmount"].disable();
      this.model.FreightTableForm.controls["gstAmount"].setValue(0);
      this.model.FreightTableForm.controls["gstChargedAmount"].setValue(0);

      this.calculateFreight();
    } else {
      this.model.FreightTableForm.controls["gstAmount"].enable();
      this.model.FreightTableForm.controls["gstChargedAmount"].enable();
      this.calculateFreight();
    }
  }
  GetVouchersLedgers(TotalAmount, DocketNo) {

    const createVoucher = (accCode, accName, accCategory, debit, credit) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.CNoteBooking,
      transType: VoucherInstanceType[VoucherInstanceType.CNoteBooking],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: "",
      sacName: "",
      debit,
      credit,
      GSTRate: 0,
      GSTAmount: 0,
      Total: TotalAmount,
      TDSApplicable: false,
      narration: `when C note No ${DocketNo} Is Booked`,
    });

    const response = [];
    // Freight Ledger
    response.push(createVoucher(ledgerInfo['AST001001'].LeadgerCode, ledgerInfo['AST001001'].LeadgerName,
      ledgerInfo['AST001001'].LeadgerCategory, TotalAmount, 0));

    let LeadgerDetails;
    switch (this.model.consignmentTableForm.value.transMode) {
      case "P1":
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
      case "P2":
        LeadgerDetails = ledgerInfo['INC001004'];
        break;
      case "P3":
        LeadgerDetails = ledgerInfo['INC001002'];
        break;
      case "P4":
        LeadgerDetails = ledgerInfo['INC001001'];
        break;
      default:
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
    }
    // Income Ledger
    if (LeadgerDetails) {
      response.push(createVoucher(LeadgerDetails.LeadgerCode, LeadgerDetails.LeadgerName, LeadgerDetails.LeadgerCategory, 0, TotalAmount));
    }
    return response;
  }
  //#region Auto Customer Invoicing for Paid  GCN WT-930

  async AutoCustomerInvoicing(RequestData, docketNo) {
    // STEP 1: Get the required data from the form
    const DocketNo = docketNo;
    const customerCode = RequestData?.data?.billingParty;
    const customerName = RequestData?.data?.billingPartyName;
    // STEP 2: Prepare the request body For For Approve GCN And Call the API
    const DocketStatusResult = this.invoiceServiceService.updateShipmentStatus(DocketNo, "FTL");
    if (DocketStatusResult) {
      // STEP 3: Prepare the request body For Customer Bill Generation And Call the API
      const custList = await this.customerService.customerFromFilter({ customerCode: customerCode }, false);
      const CustomerDetails = custList[0];
      const custGroup = await this.customerService.customerGroupFilter(CustomerDetails?.customerGroup);
      const tranDetail = await getApiCompanyDetail(this.masterService);
      const data = RequestData?.data;
      const gstAppliedList = await this.stateService.checkGst(tranDetail?.data[0].gstNo, data?.cnogst);
      const gstTypes = Object.fromEntries(
        Object.entries(gstAppliedList).filter(([key, value]) => value === true)
      )
      let jsonBillingList = [
        {
          _id: "",
          bILLNO: "",
          dKTNO: DocketNo,
          cID: this.storage.companyCode,
          oRGN: data?.origin || "",
          dEST: data?.destination || "",
          dKTDT: data?.docketDate || new Date(),
          cHRGWT: data?.cHRWT || 0.00,
          dKTAMT: data?.freight_amount || 0.00,
          dKTTOT: data?.totalAmount || 0.00,
          sUBTOT: data?.grossAmount || 0.00,
          gSTTOT: data?.gstChargedAmount || 0.00,
          gSTRT: data?.gstAmount || 0.00,
          tOTAMT: data?.totalAmount || 0.00,
          fCHRG: data?.freight_rate || 0.00,
          sGST: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) / 2 : 0,
          sGSTRT: 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data.gstAmount || 0) / 2 : 0,
          cGST: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) / 2 : 0,
          cGSTRT: 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data.gstAmount || 0) / 2 : 0,
          uTGST: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) : 0,
          uTGSTRT: 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data.gstAmount || 0) : 0,
          iGST: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) : 0,
          iGSTRT: 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data.gstAmount || 0) : 0,
          eNTDT: new Date(),
          eNTLOC: this.storage.branch || "",
          eNTBY: this.storage?.userName || "",
        }];
      const billData = {
        "_id": `${this.storage.companyCode}` || "",
        "cID": this.storage.companyCode,
        "companyCode": this.storage.companyCode,
        "dOCTYP": "Transaction",
        "dOCCD": "T",
        "bUSVRT": "FTL",
        "bILLNO": "",
        "bGNDT": new Date(),
        "bDUEDT": new Date(),
        "bLOC": this.storage.branch,
        "pAYBAS": data?.payType,
        "tRNMODE": data?.transMode,
        "bSTS": CustomerBillStatus.Submitted,
        "bSTSNM": CustomerBillStatus[CustomerBillStatus.Submitted],
        "bSTSDT": new Date(),
        "eXMT": data?.rcm == "Y" ? true : false,
        "eXMTRES": "",
        "gEN": {
          "lOC": data?.origin || "",
          "cT": data?.fromCity || "",
          "sT": "",
          "gSTIN": "",
        },
        "sUB": {
          "lOC": this.storage.branch,
          "tO": customerName,
          "tOMOB": CustomerDetails?.customer_mobile || "",
          "dTM": data?.docketDate || new Date(),
          "dOC": ""
        },
        "cOL": {
          "lOC": "",
          "aMT": 0.00,
          "bALAMT": data?.totalAmount || 0.00,
        },
        "cUST": {
          "cD": customerCode,
          "nM": customerName,
          "tEL": CustomerDetails?.customer_mobile || "",
          "aDD": CustomerDetails?.RegisteredAddress || "",
          "eML": CustomerDetails?.Customer_Emails || "",
          "cT": CustomerDetails?.city || "",
          "sT": CustomerDetails?.state || "",
          "gSTIN": CustomerDetails?.GSTdetails ? CustomerDetails?.GSTdetails?.[0]?.gstNo : "",
          "cGCD": custGroup?.groupCode || "",
          "cGNM": custGroup?.groupName || "",
        },
        "gST": {
          "tYP": Object.keys(gstTypes).join() || "",
          "rATE": data?.gstAmount || 0.00,
          "iGST": 'IGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) : 0,
          "uTGST": 'UTGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) : 0,
          "cGST": 'CGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) / 2 : 0,
          "sGST": 'SGST'.includes(Object.keys(gstTypes).join()) ? parseFloat(data?.gstChargedAmount) / 2 : 0,
          "aMT": data?.gstChargedAmount || 0.00,
        },
        "aPR": {
          "loc": this.storage.branch,
          "aDT": new Date(),
          "aBY": this.storage.userName,
        },
        "sUPDOC": "",
        "pRODID": data?.transMode || "",
        "dKTCNT": 1,
        "CURR": "INR",
        "dKTTOT": data?.totalAmount || 0.00,
        "gROSSAMT": data?.totalAmount || 0.00,
        "rOUNOFFAMT": 0.00,
        "aMT": data?.totalAmount || 0.00,
        "custDetails": jsonBillingList,
        "eNTDT": new Date(),
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName,
      }
      const req = {
        companyCode: this.storage.companyCode,
        docType: "BILL",
        branch: this.storage.branch,
        finYear: financialYear,
        party: customerName.toUpperCase(),
        collectionName: "cust_bill_headers",
        data: billData
      };
      const res = await firstValueFrom(this.operationService.operationPost("finance/bill/cust/create", req));
      if (res) {
        if (res.success) {
          const BillNo = res.data.ops[0].docNo;
          this.AccountPostingForAutoBilling(billData, BillNo, DocketNo);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
            showConfirmButton: false,
          });
        }
      }

    }
  }
  // Account Posting When  When Bill Has been Generated/ Finalized	
  async AccountPostingForAutoBilling(billData, BillNo, DocketNo) {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const TotalAmount = billData?.aMT || 0;
        const GstAmount = billData?.gST?.aMT || 0;

        this.VoucherRequestModel.companyCode = this.storage.companyCode;
        this.VoucherRequestModel.docType = "VR";
        this.VoucherRequestModel.branch = this.storage.branch;
        this.VoucherRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.voucherNo = "";
        this.VoucherDataRequestModel.transCode = VoucherInstanceType.BillApproval;
        this.VoucherDataRequestModel.transType = VoucherInstanceType[VoucherInstanceType.BillApproval];
        this.VoucherDataRequestModel.voucherCode = VoucherType.JournalVoucher;
        this.VoucherDataRequestModel.voucherType = VoucherType[VoucherType.JournalVoucher];
        this.VoucherDataRequestModel.transDate = new Date();
        this.VoucherDataRequestModel.docType = "VR";
        this.VoucherDataRequestModel.branch = this.storage.branch;
        this.VoucherDataRequestModel.finYear = financialYear

        this.VoucherDataRequestModel.accLocation = this.storage.branch;
        this.VoucherDataRequestModel.preperedFor = "Customer";
        this.VoucherDataRequestModel.partyCode = billData?.cUST?.cD || "";
        this.VoucherDataRequestModel.partyName = billData?.cUST?.nM || "";
        this.VoucherDataRequestModel.partyState = billData?.cUST?.sT || "";
        this.VoucherDataRequestModel.entryBy = this.storage.userName;
        this.VoucherDataRequestModel.entryDate = new Date();
        this.VoucherDataRequestModel.panNo = ""

        this.VoucherDataRequestModel.tdsSectionCode = "";
        this.VoucherDataRequestModel.tdsSectionName = "";
        this.VoucherDataRequestModel.tdsRate = 0;
        this.VoucherDataRequestModel.tdsAmount = 0;
        this.VoucherDataRequestModel.tdsAtlineitem = false;
        this.VoucherDataRequestModel.tcsSectionCode = "";
        this.VoucherDataRequestModel.tcsSectionName = "";
        this.VoucherDataRequestModel.tcsRate = 0;
        this.VoucherDataRequestModel.tcsAmount = 0;

        this.VoucherDataRequestModel.IGST = billData?.gST?.iGST || 0;
        this.VoucherDataRequestModel.SGST = billData?.gST?.sGST || 0;
        this.VoucherDataRequestModel.CGST = billData?.gST?.cGST || 0;
        this.VoucherDataRequestModel.UGST = billData?.gST?.uTGST || 0;
        this.VoucherDataRequestModel.GSTTotal = GstAmount;

        this.VoucherDataRequestModel.GrossAmount = TotalAmount || 0;
        this.VoucherDataRequestModel.netPayable = TotalAmount;
        this.VoucherDataRequestModel.roundOff = 0;
        this.VoucherDataRequestModel.voucherCanceled = false
        this.VoucherDataRequestModel.transactionNumber = BillNo;
        this.VoucherDataRequestModel.paymentMode = "";
        this.VoucherDataRequestModel.refNo = "";
        this.VoucherDataRequestModel.accountName = "";
        this.VoucherDataRequestModel.accountCode = "";
        this.VoucherDataRequestModel.date = "";
        this.VoucherDataRequestModel.scanSupportingDocument = "";
        var VoucherlineitemList = this.GetVouchersLedgersForAutoBilling(billData, BillNo);

        this.VoucherRequestModel.details = VoucherlineitemList
        this.VoucherRequestModel.data = this.VoucherDataRequestModel;
        this.VoucherRequestModel.debitAgainstDocumentList = [];

        this.voucherServicesService
          .FinancePost("fin/account/voucherentry", this.VoucherRequestModel)
          .subscribe({
            next: (res: any) => {

              let reqBody = {
                companyCode: this.storage.companyCode,
                voucherNo: res?.data?.mainData?.ops[0].vNO,
                transDate: Date(),
                finYear: financialYear,
                branch: this.storage.branch,
                transCode: VoucherInstanceType.BillApproval,
                transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                docType: "Voucher",
                partyType: "Customer",
                docNo: BillNo,
                partyCode: billData?.cUST?.cD || "",
                partyName: billData?.cUST?.nM || "",
                entryBy: this.storage.userName,
                entryDate: Date(),
                debit: VoucherlineitemList.filter(item => item.credit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.debit,
                    "narration": item.narration ?? ""
                  };
                }),
                credit: VoucherlineitemList.filter(item => item.debit == 0).map(function (item) {
                  return {
                    "accCode": item.accCode,
                    "accName": item.accName,
                    "accCategory": item.accCategory,
                    "amount": item.credit,
                    "narration": item.narration ?? ""
                  };
                }),
              };

              this.voucherServicesService
                .FinancePost("fin/account/posting", reqBody)
                .subscribe({
                  next: (res: any) => {
                    Swal.fire({
                      icon: "success",
                      title: "Booked Successfully",
                      text: "DocketNo : " + DocketNo,
                      confirmButtonText: 'OK',
                      showConfirmButton: true,
                      denyButtonText: 'Print',
                      showDenyButton: true,
                      cancelButtonText: 'Close',
                      showCancelButton: true
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // Redirect after the alert is closed with OK button.
                        this.navService.navigateTotab('docket', "dashboard/Index");
                      } else if (result.isDenied) {
                        // Handle the action for the deny button here.
                        const templateBody = {
                          templateName: "DKT",
                          PartyField: "",
                          DocNo: DocketNo,
                        }
                        const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
                        window.open(url, '', 'width=1000,height=800');
                        this.route.navigateByUrl('Operation/ConsignmentEntry').then(() => {
                          window.location.reload();
                        });
                      } else if (result.isDismissed) {
                        // Handle the action for the cancel button here.
                        this.navService.navigateTotab('docket', "dashboard/Index");
                      }
                    });
                  },
                  error: (err: any) => {

                    if (err.status === 400) {
                      this.snackBarUtilityService.ShowCommonSwal("error", "Bad Request");
                    } else {
                      this.snackBarUtilityService.ShowCommonSwal("error", err);
                    }
                  },
                });

            },
            error: (err: any) => {
              this.snackBarUtilityService.ShowCommonSwal("error", err);
            },
          });
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", "Fail To Submit Data..!");
      }


    }, "C-Note Booking Voucher Generating..!");

  }
  GetVouchersLedgersForAutoBilling(billData, BillNo) {
    const TotalAmount = billData?.aMT;
    const GstAmount = billData?.gST?.aMT;
    const GstRate = billData?.gST?.rATE;
    const DocketAmount = parseFloat(billData?.dKTTOT) - parseFloat(billData?.gST?.aMT);

    const createVoucher = (accCode, accName, accCategory, debit, credit, sacInfo = "",) => ({
      companyCode: this.storage.companyCode,
      voucherNo: "",
      transCode: VoucherInstanceType.BillApproval,
      transType: VoucherInstanceType[VoucherInstanceType.BillApproval],
      voucherCode: VoucherType.JournalVoucher,
      voucherType: VoucherType[VoucherType.JournalVoucher],
      transDate: new Date(),
      finYear: financialYear,
      branch: this.storage.branch,
      accCode,
      accName,
      accCategory,
      sacCode: sacInfo ? SACInfo['996511'].sacCode : "",
      sacName: sacInfo ? SACInfo['996511'].sacName : "",
      debit,
      credit,
      GSTRate: sacInfo ? GstRate : 0,
      GSTAmount: sacInfo ? GstAmount : 0,
      Total: debit + credit,
      TDSApplicable: false,
      narration: `When Customer Bill freight is Generated :${BillNo}`,
    });

    const response = [
      createVoucher(ledgerInfo['AST001002'].LeadgerCode, ledgerInfo['AST001002'].LeadgerName, ledgerInfo['AST001002'].LeadgerCategory, TotalAmount, 0),
    ];
    let LeadgerDetails;
    switch (billData?.pRODID) {
      case "P1":
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
      case "P2":
        LeadgerDetails = ledgerInfo['INC001004'];
        break;
      case "P3":
        LeadgerDetails = ledgerInfo['INC001002'];
        break;
      case "P4":
        LeadgerDetails = ledgerInfo['INC001001'];
        break;
      default:
        LeadgerDetails = ledgerInfo['INC001003'];
        break;
    }
    // Income Ledger
    if (LeadgerDetails) {
      response.push(createVoucher(LeadgerDetails.LeadgerCode, LeadgerDetails.LeadgerName, LeadgerDetails.LeadgerCategory, 0, DocketAmount));
    }

    const gstTypeMapping = {
      UGST: { accCode: ledgerInfo['LIA002002'].LeadgerCode, accName: ledgerInfo['LIA002002'].LeadgerName, accCategory: ledgerInfo['LIA002002'].LeadgerCategory, prop: "uGST" },
      cGST: { accCode: ledgerInfo['LIA002003'].LeadgerCode, accName: ledgerInfo['LIA002003'].LeadgerName, accCategory: ledgerInfo['LIA002003'].LeadgerCategory, prop: "cGST" },
      IGST: { accCode: ledgerInfo['LIA002004'].LeadgerCode, accName: ledgerInfo['LIA002004'].LeadgerName, accCategory: ledgerInfo['LIA002004'].LeadgerCategory, prop: "iGST" },
      SGST: { accCode: ledgerInfo['LIA002001'].LeadgerCode, accName: ledgerInfo['LIA002001'].LeadgerName, accCategory: ledgerInfo['LIA002001'].LeadgerCategory, prop: "sGST" },
    };

    const gstType = billData?.gST?.tYP;
    const GSTTypeList = [gstType]
    GSTTypeList.forEach(element => {
      if (gstType && gstTypeMapping[element]) {
        const { accCode, accName, accCategory, prop } = gstTypeMapping[element];
        if (billData?.gST?.[prop] > 0) {
          response.push(createVoucher(accCode, accName, accCategory, 0, billData?.gST?.[prop], '996511'));
        }
      }
    });
    return response;
  }
  //#endregion
}


const RateTypeCalculation = [
  {
    codeId: "RTTYP-0004",
    codeDesc: "% of Freight",
    calculationRatio: 1000,
  },
  {
    codeId: "RTTYP-0005",
    codeDesc: "Per Kg",
    calculationRatio: 1000,
  },
  {
    codeId: "RTTYP-0003",
    codeDesc: "Per Km",
    calculationRatio: 1000,
  },
  {
    codeId: "RTTYP-0006",
    codeDesc: "Per Pkg",
    calculationRatio: 1000,
  },
  {
    codeId: "RTTYP-0001",
    codeDesc: "Flat",
    calculationRatio: 1000,
  },
  {
    codeId: "RTTYP-0002",
    codeDesc: "Per Ton",
    calculationRatio: 1,
  },
  {
    codeId: "RTTYP-0007",
    codeDesc: "Per Container",
    calculationRatio: 1,
  },
  {
    codeId: "RTTYP-0008",
    codeDesc: "Per Litre",
    calculationRatio: 1000,
  },
];
