import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { thcControl } from "src/assets/FormControls/thc-generation";
import { calculateTotal, vendorTypeList } from "./thc-utlity";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getLocationApiDetail } from "src/app/finance/invoice-summary-bill/invoice-utility";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { showConfirmationDialogThc } from "../thc-summary/thc-update-utlity";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { MatDialog } from "@angular/material/dialog";
import { ThcUpdateComponent } from "src/app/dashboard/tabs/thc-update/thc-update.component";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { financialYear, formatDate } from "src/app/Utility/date/date-utils";
import { getVehicleStatusFromApi } from "../assign-vehicle-page/assgine-vehicle-utility";
import { Vehicle } from "src/app/core/models/operations/vehicle-status/vehicle-status";
import { VendorService } from "src/app/Utility/module/masters/vendor-master/vendor.service";
import { VendorDetail } from "src/app/core/models/Masters/vendor-master/vendor-master";
import { DriverMaster } from "src/app/Models/driver-master/driver-master";
import { DriverService } from "src/app/Utility/module/masters/driver-master/drivers.service";
import { ShipmentDetail } from "src/app/Models/Shipment/shipment";
import { getVendorDetails } from "../job-entry-page/job-entry-utility";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ShipmentEditComponent } from "../shipment-edit/shipment-edit.component";
import { ARr, CAp, DPt, LOad, MfdetailsList, MfheaderDetails, THCGenerationModel, ThcmovementDetails, UNload, UTi, iNV, rR,rakeDetails, thcsummaryData } from '../../Models/THC/THCModel';
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { PrqService } from "src/app/Utility/module/operation/prq/prq.service";
import moment from "moment";
import { DocketFiltersComponent } from "./filters/docket-filters/docket-filters.component";
import { RakeEntryModel } from "src/app/Models/rake-entry/rake-entry";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { InvoiceServiceService } from "src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service";
import { InvoiceModel } from "src/app/Models/dyanamic-form/dyanmic.form.model";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { ImageHandling } from "src/app/Utility/Form Utilities/imageHandling";
import { ImagePreviewComponent } from "src/app/shared-components/image-preview/image-preview.component";
import { clearValidatorsAndUpdate, getValueOrDefault } from "src/app/Utility/commonFunction/setFormValue/setFormValue";
import { HawkeyeUtilityService } from "src/app/Utility/module/hawkeye/hawkeye-utility.service";
@Component({
  selector: "app-thc-generation",
  templateUrl: "./thc-generation.component.html",
})
export class ThcGenerationComponent implements OnInit {
  // Added By Harikesh
  tHCGenerationModel = new THCGenerationModel();
  thcsummaryData = new thcsummaryData();
  thcmovementDetails = new ThcmovementDetails();
  LOad = new LOad();
  CAp = new CAp();
  UTi = new UTi();
  DPt = new DPt();
  ARr = new ARr();
  UNload = new UNload();
  mfheaderDetails = new MfheaderDetails();
  mfdetailsList: MfdetailsList[] = [];
  rakeData: rR[] = [];
  invoiceData: iNV[] = [];
  isRail: boolean = false;
  rrLoad: boolean = true;
  rrInvoice: boolean = true;
  // End Code Of Harikesh
  //FormGrop
  thcDetailGlobal: any;
  companyCode = localStorage.getItem("companyCode");
  thcTableForm: UntypedFormGroup;
  VehicleTableForm: UntypedFormGroup;
  rakeDetailsTableForm: UntypedFormGroup;
  chargeForm: UntypedFormGroup;
  rakeForm: UntypedFormGroup;
  rakeInvoice: UntypedFormGroup;
  jsonControlArray: any;
  imageData: any = {};
  tableData: any;
  tableLoad: boolean;
  backPath: string;
  thcLoad: boolean = true;
  isSubmit: boolean = false;
  disbleCheckbox: boolean;
  market = [
    "brokerName",
    "brokerMobile",
    "tdsUpload"
  ]
  linkArray = [];
  // Declaring breadcrumbs
  breadscrums = [
    {
      title: "THC Generation",
      items: ["THC"],
      active: "THC Generation",
    },
  ];
  vehicleName: any;
  vehicleStatus: any;
  //add dyamic controls for generic table
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:8%",
    },
    bPARTYNM: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    docNo: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "min-width:20%",
    },
    cNO: {
      Title: "Container Id",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    fCT: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    tCT: {
      Title: "To City",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    aCTWT: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:8%",
    },
    pKGS: {
      Title: "No of Packets ",
      class: "matcolumncenter",
      Style: "max-width:10%",
    },
    pod: {
      Title: "Pod",
      type: 'view',
      functionName: 'view',
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    receiveBy: {
      Title: "Receive By",
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    arrivalTime: {
      Title: "Arrival Time",
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    remarks: {
      Title: "Remarks",
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    },
  };
  //#endregion
  staticField = [
    "bPARTYNM",
    "pKGS",
    // "cNO",
    "docNo",
    "fCT",
    "tCT",
    "aCTWT"
  ];

  EventButton = {
    functionName: "filterDockets",
    name: "Filter",
    iconName: "filter_alt",
  };
  EventButtonRake = {
    functionName: "addRakeData",
    name: "Add Data",
    iconName: "filter_alt",
  };
  EventButtonInvoice = {
    functionName: "addRakeInvoice",
    name: "Add Data",
    iconName: "filter_alt",
  };
  addAndEditPath: string;
  uploadedFiles: File[];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  //here declare varible for the KPi
  boxData: { count: number; title: string; class: string }[];
  allShipment: any;
  prqDetail: any;
  marketVendor: boolean;
  prqFlag: boolean;
  prqName: string;
  prqNoStatus: boolean;
  orgBranch: string;
  advanceName: any;
  advanceStatus: any;
  balanceName: any;
  balanceStatus: any;
  isUpdate: boolean;
  isArrivedInfo: boolean = false;
  thcDetail: any;
  locationData: any;
  prqlist: any;
  isView: any;
  branchCode: string;
  selectedData: [] = [];
  menuItems = [{ label: "Update" }];
  rakeMenuItems = [{ label: "EditRake" }, { label: "RemoveRake" }];
  rakeInvoiceItems = [{ label: "EditInvoice" }, { label: "RemoveInvoice" }];
  menuItemflag: boolean = true;
  jsonControlBasicArray: any;
  jsonControlVehLoadArray: any;
  jsonControlDriverArray: any;
  jsonControlArrivalArray: any;
  docketDetail: ShipmentDetail;
  //  unloadName: any;
  // unloadStatus: any;
  addThc: boolean;
  jsonControlDocketArray: any;
  vendorName: any;
  vendorNameStatus: any;
  vendorDetail: any;
  fromCity: any;
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  vehicleList: Vehicle[];
  jsonVehicleControl: any;
  viewType: string = '';
  vendorTypes: AutoComplete[];
  products: AutoComplete[];
  directPrq: boolean;
  DocketsContainersWise: boolean = false;
  DocketsIsEmpty: boolean = false;
  currentLocation: any;
  rakeDetails: any;
  tableRakeData: any = [];
  DocketFilterData = {
    fCT: "",
    tCT: "",
    cCT: "",
    sDT: moment().add(-15, 'days').startOf('day').toDate(),
    eDT: moment().endOf('day').toDate()
  }
  rakeFormData: FormControls[];
  rakeInvoiceData: FormControls[];
  tableRakeInvoice: any = [];
  chargeJsonControl: any;
  isCharge: boolean;
  allBasicJsonArray: any;
  vehicleSize: AutoComplete[];
  isLoadRail: boolean;
  isLoadInvoice: boolean;
  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private route: Router,
    private filter: FilterUtils,
    private operationService: OperationService,
    private masterService: MasterService,
    private docketService: DocketService,
    private vehicleStatusService: VehicleStatusService,
    private vendorService: VendorService,
    private driverService: DriverService,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private consigmentUtility: ConsigmentUtility,
    private markerVehicleService: MarkerVehicleService,
    private thcService: ThcService,
    private storage: StorageService,
    private generalService: GeneralService,
    private prqService: PrqService,
    private objImageHandling: ImageHandling,
    private definition: RakeEntryModel,
    private hawkeyeUtilityService: HawkeyeUtilityService
  ) {
    /* here the code which is used to bind data for add thc edit thc add thc based on
     docket or prq based on that we can declare condition*/

    this.orgBranch = storage.branch;
    this.branchCode = storage.branch;

    let navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;

    if (navigationState) {

      this.viewType = navigationState.viewType?.toLowerCase() || '';
      switch (this.viewType) {
        case 'view':
          this.disbleCheckbox = true;
          this.thcDetail = navigationState.data;
          this.staticField.push('cNO', 'receiveBy', 'arrivalTime', 'remarks');
          this.isView = true;
          this.isSubmit = true;
        	this.EventButtonRake=null
	        this.EventButtonInvoice=null
          delete this.columnHeader.actionsItems;
          break;
        case 'update':
          this.thcDetail = navigationState.data;
          this.staticField.push('cNO', 'receiveBy', 'arrivalTime', 'remarks');
          this.isSubmit = true;
          this.isUpdate = true;
          this.isArrivedInfo = true
          this.EventButtonRake=null
	        this.EventButtonInvoice=null
          break;
        case 'addthc':
          this.addThc = true;
          this.docketDetail = navigationState.data;
          break;
        default:
          delete this.columnHeader.pod;
          delete this.columnHeader.receiveBy;
          delete this.columnHeader.actionsItems;
          delete this.columnHeader.arrivalTime;
          delete this.columnHeader.remarks;
          if (navigationState) {
            this.prqDetail = navigationState;
            this.prqFlag = true;
          }
          break;
      }

      this.getShipmentDetail();
    }
    else {
      delete this.columnHeader.pod;
      delete this.columnHeader.receiveBy;
      delete this.columnHeader.arrivalTime;
      delete this.columnHeader.remarks;
      delete this.columnHeader.actionsItems;
      this.menuItems[0].label = "Edit"
      this.getShipmentDetail();
    }
  }

  ngOnInit(): void {
    this.IntializeFormControl();
    this.backPath = "/dashboard/Index?tab=6";
  }
  /*here the function which is use for the intialize a form for thc*/
  IntializeFormControl() {
    const loadingControlForm = new thcControl(
      this.isUpdate || false,
      this.isView || false,
      this.prqFlag || false
    );

    this.jsonVehicleControl = loadingControlForm.getVehicleDetails();
    const thcFormControls = loadingControlForm.getThcFormControls();
    const rakeDetails = loadingControlForm.getRakeDetailsControls();
    this.jsonControlBasicArray = this.filterFormControls(thcFormControls, "Basic");
    this.jsonControlVehLoadArray = this.filterFormControls(thcFormControls, "vehLoad");
    this.jsonControlDriverArray = this.filterFormControls(thcFormControls, "driver");
    this.rakeDetails = rakeDetails.filter(x => x.additionalData.metaData == "rakeArray");
    this.rakeFormData = rakeDetails.filter(x => x.additionalData.metaData == "rakeForm");
    this.rakeInvoiceData = rakeDetails.filter(x => x.additionalData.metaData == "rakeInvoice");
    if (this.isArrivedInfo) {
      this.jsonControlArrivalArray = this.filterFormControls(thcFormControls, "ArrivalInfo");
    }
    if (this.addThc) {
      this.jsonControlDocketArray = this.filterFormControls(thcFormControls, "shipment_detail");
    }
    this.chargeJsonControl = loadingControlForm.getChargesControls();

    this.jsonControlArray = [
      ...this.jsonControlBasicArray,
      ...this.jsonControlVehLoadArray,
      ...this.jsonControlDriverArray,
      ...(this.isArrivedInfo ? this.jsonControlArrivalArray : []),
    ];


    if (this.addThc) {
      this.jsonControlArray.push(...this.jsonControlDocketArray);
    }
    this.setupControlProperties("vehicleName", "vehicleStatus", "vehicle", this.jsonVehicleControl);
    this.setupControlProperties("vendorName", "vendorNameStatus", "vendorName");
    this.setupControlProperties("prqName", "prqNoStatus", "prqNo");
    this.setupControlProperties("advanceName", "advanceStatus", "advPdAt", this.chargeJsonControl);
    this.setupControlProperties("balanceName", "balanceStatus", "balAmtAt", this.chargeJsonControl);
    this.setupControlProperties("fromCity", "fromCityStatus", "fromCity");
    this.setupControlProperties("toCity", "toCityStatus", "toCity");
    this.allBasicJsonArray = this.jsonControlBasicArray;
    this.chargeForm = formGroupBuilder(this.fb, [this.chargeJsonControl]);
    this.thcTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.rakeForm = formGroupBuilder(this.fb, [this.rakeFormData]);
    this.rakeInvoice = formGroupBuilder(this.fb, [this.rakeInvoiceData]);
    this.rakeDetailsTableForm = formGroupBuilder(this.fb, [this.rakeDetails]);
    this.VehicleTableForm = formGroupBuilder(this.fb, [this.jsonVehicleControl]);
    this.jsonControlBasicArray = this.allBasicJsonArray.filter((x) => !this.market.includes(x.name));
    
    this.getGeneralMasterData();
    this.getDropDownDetail();

    //this.DocketFilterData.cCT = this.thcTableForm.controls['fromCity'].value?.value || ''
  }
  /*End*/
  /*count ETA*/
  changeEta() {
    const tripDate = new Date(this.thcTableForm.controls['tripDate'].value);
    this.allBasicJsonArray.forEach((x) => {
      if (x.name == "etaDate") {
        x.additionalData.minDate = tripDate;
      }
    })
  }
  /*End*/
  onchangecontainerwise(event) {
    this.DocketsContainersWise = event?.eventArgs?.checked;
    if (this.DocketsContainersWise) {
      this.staticField.push('cNO');
    }
    this.getLocBasedOnCity()
  }
  /*here the function of the filterFormControls which is retive the additionData*/
  filterFormControls(formControls, metaData) {
    return formControls.filter((x) => x.additionalData && x.additionalData.metaData === metaData);
  }
  /*End*/

  /*here  the function which is mapping a dropdown flag*/
  setupControlProperties(controlName, statusName, fieldName, jsonControl = this.jsonControlArray) {
    this[controlName] = jsonControl.find((data) => data.name === fieldName)?.name;
    this[statusName] = jsonControl.find((data) => data.name === fieldName)?.additionalData.showNameAndValue;
  }
  /*End*/

  /*here the function which is getting a docket from the Api for the create THC*/
  async getShipmentDetail() {

    // if (!this.isUpdate && !this.isView) {
    //   let prqNo = this.prqDetail?.prqNo || "";
    //   debugger
    //   const shipmentList = await this.thcService.getShipmentFiltered(this.orgBranch, prqNo);
    //   this.allShipment = shipmentList;
    //   if (this.addThc) {
    //     this.tableData = shipmentList
    //     this.tableLoad = false;
    //   }
    // }
  }
  /*End*/

  /*here the code which is write for the bind the dropdown using the thc generation*/
  async getGeneralMasterData() {
    this.vehicleSize = await this.generalService.getGeneralMasterData("VEHSIZE");
    this.vendorTypes = await this.generalService.getGeneralMasterData("VENDTYPE");
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.jsonVehicleControl, this.vehicleSize, "vehSize");
    setGeneralMasterData(this.jsonControlArray, this.products, "transMode");
    setGeneralMasterData(this.jsonControlArray, this.vendorTypes, "vendorType");
  }
  /*End*/

  /*below is the function form handler which is used when any event fire on any form*/
  async functionCallHandler($event) {

    const field = $event.field; //what is use of this variable
    const functionName = $event.functionName;

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  /*End*/

  async getDropDownDetail() {
    const locationList = await getLocationApiDetail(this.masterService);
    if (!locationList)
      return;

    this.prqlist = await this.thcService.prqDetail(true, { bRCD: this.storage.branch, sTS: 3 });
    this.locationData = locationList.map((x) => ({
      value: x.locCode,
      name: x.locName,
    }));
    const location=this.locationData.find(x=>x.value==this.branchCode);
    this.chargeForm.controls['advPdAt'].setValue(location)
    const filterFields = [
      { name: this.prqName, data: this.prqlist, status: this.prqNoStatus },
      //  { name: this.unloadName, data: this.locationData, status: this.unloadStatus },
    ];

    filterFields.forEach(({ name, data, status }) => {
      this.filter.Filter(this.jsonControlArray, this.thcTableForm, data, name, status);
    });
    const chargeFilter = [
      { name: this.advanceName, data: this.locationData, status: this.advanceStatus },
      { name: this.balanceName, data: this.locationData, status: this.balanceStatus },
    ]
    chargeFilter.forEach(({ name, data, status }) => {
      this.filter.Filter(this.chargeJsonControl, this.chargeForm, data, name, status);
    });
    const vendorDetail = await getVendorDetails(this.masterService);
    this.vendorDetail = vendorDetail;
    let locRes = await this.locationService.locationFromApi({ locCode: this.branchCode });
    this.currentLocation = locRes[0];

    if (this.isUpdate || this.isView) {
      this.autoFillThc();
    } else {

      const vehiclesNo = await getVehicleStatusFromApi(this.companyCode, this.operationService);
      this.vehicleList = vehiclesNo.map(({ vehNo, driver, dMobNo, vMobNo, vendor, vendorType, capacity, lcNo, lcExpireDate }) => ({
        name: vehNo,
        value: vehNo,
        driver,
        dMobNo,
        vMobNo,
        vendor,
        vendorType,
        capacity,
        lcNo,
        lcExpireDate
      }));

      const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode });
      const city = {
        name: destinationMapping[0].city,
        value: destinationMapping[0].city,
      };

      this.thcTableForm.controls['fromCity'].setValue(city);

      const filterFieldsForVehicle = [
        { name: this.vehicleName, data: this.vehicleList, status: this.vehicleStatus, formGroup: this.VehicleTableForm, jsonControl: this.jsonVehicleControl },
        { name: this.vendorName, data: vendorDetail, status: this.vehicleStatus, formGroup: this.thcTableForm, jsonControl: this.jsonControlArray },
      ];

      filterFieldsForVehicle.forEach(({ name, data, status, formGroup, jsonControl }) => {
        this.filter.Filter(jsonControl, formGroup, data, name, status);
      });
      if (this.prqFlag) {
        this.bindDataPrq();
      }
      if (this.addThc) {
        this.autoFillDocketDetail();
      }
    }

    this.thcLoad = false;
  }

  bindDataPrq() {
    const prq = {
      name: this.prqDetail?.prqNo || "",
      value: this.prqDetail?.prqNo || "",
    };
    this.thcTableForm.controls["prqNo"].setValue(prq);

    this.bindPrqData();
    this.getShipmentDetails();
  }
  /*here the function for the bind prq data*/
  async bindPrqData() {
    
    if (this.thcTableForm.controls["prqNo"].value.value) {
      const vehicleDetail = await this.vehicleStatusService.vehiclList(this.prqDetail?.prqNo);
      const fromToCityParts = (this.prqDetail?.fromToCity || '').split('-');
      const validTransModes = ['Truck', 'Trailor', 'Container'];
      const transMode = validTransModes.includes(this.prqDetail?.carrierType) ? 'Road' : '';
      const tranModeCode = this.products.find((x) => x.name == transMode).value;
      const jsonData = {
        vendorType: `${this.prqDetail?.vENDTY}` || "",
        transMode: tranModeCode,
        route: this.prqDetail?.fromToCity || '',
        fromCity: { name: fromToCityParts[0], value: fromToCityParts[0] },
        toCity: { name: fromToCityParts[1], value: fromToCityParts[1] },
        capacity: this.prqDetail?.size || 0,
        driverName: vehicleDetail?.driver || '',
        driverMno: vehicleDetail?.dMobNo || '',
        driverLno: vehicleDetail?.lcNo || '',
        driverLexd: vehicleDetail?.lcExpireDate || '',
        panNo: ''
      };
      // Loop through the jsonData object and set the values in the form controls
      for (const controlName in jsonData) {
        if (jsonData.hasOwnProperty(controlName)) {
          this.thcTableForm.controls[controlName].setValue(jsonData[controlName]);
        }
      }
      this.VehicleTableForm.controls['vehicle'].setValue({ name: this.prqDetail?.vEHNO, value: this.prqDetail?.vEHNO })
      this.VehicleTableForm.controls['vehSize'].setValue(`${this.prqDetail?.size}`);
      const vendor=this.vendorDetail.find(x=>x.value==this.prqDetail?.vNDCD);
      this.thcTableForm.controls['vendorName'].setValue(vendor)
      this.thcTableForm.controls['panNo'].setValue(vendor?.panNo || "");
      this.thcTableForm.controls['venMobNo'].setValue(vendor?.mob || "");
      // /*here i set in both name value is vNDNM the blow condition only applye when the vendor type is market
      // after this autofill it is going to the vendotype changes function then after it set vendorname as textbox and vendor code set as 8888 in submit time
      // */
      // if(this.prqDetail?.vENDTY=="4"){
      //   this.thcTableForm.controls['vendorName'].setValue({name:this.prqDetail?.vNDNM,value:this.prqDetail?.vNDNM})
      // }
      // /*End*/
      if (this.prqDetail?.vENDTY == "4") {
        let vehData = await this.markerVehicleService.GetVehicleData(this.prqDetail?.vehicleNo || "");
        if (vehData) {
          const vehJson = {
            vehicleSize: vehData.wTCAP || '',
            //vehNo: this.prqDetail?.vehicleNo || '',
            //vendor: vehData.vndNM || '',
            //vMobileNo: vehData.vndPH || '',
            // driver: vehData.drvNM || '',
            //driverPan: vehData?.pANNO || '',
            engineNo: vehData?.eNGNO || '',
            chassisNo: vehData?.cHNO || '',
            lcNo: vehData.dLNO || '',
            lcExpireDate: vehData.dLEXP || new Date(),
            //dmobileNo: vehData.drvPH || '',
            inExdt: vehData.iNCEXP || new Date(),
            fitdt: vehData.fITDT || new Date(),
          };

          for (const controlName in vehJson) {
            if (vehJson.hasOwnProperty(controlName)) {
              const control = this.VehicleTableForm.get(controlName);
              if (control) {
                control.setValue(vehJson[controlName]);
              }
              // const thcControl = this.thcTableForm.get(controlName);
              // if (thcControl) {
              //   thcControl.setValue(jsonData[controlName]);
              // }
            }
          }
          this.thcTableForm.controls['vendorName'].setValue(this.prqDetail?.vNDNM)
          this.thcTableForm.controls['venMobNo'].setValue(vehData?.vndPH)
          this.thcTableForm.controls['panNo'].setValue(vehData?.pANNO)
        }
      }

    }

    if (!this.isView && !this.isUpdate) {
      this.vendorFieldChanged();
    }
   this.transModeChanged();
  }
  /*End*/
  async prqNoChangedEvent(event) {
    if (!this.isSubmit) {
      const CheckPRQExist = this.prqlist.some(item => item.name === event?.eventArgs?.name);

      if (!CheckPRQExist) {

        const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode });
        const city = {
          name: destinationMapping[0].city,
          value: destinationMapping[0].city,
        };

        this.thcTableForm.controls['fromCity'].setValue(city);

        const jsonData = {
          vehicle: { name: "", value: "" },
          vendorType: "",
          vendorName: { name: '', value: '' },
          transMode: "",
          route: '',
          fromCity: city,
          toCity: { name: "", value: "" },
          capacity: '',
          driverName: '',
          driverMno: '',
          driverLno: '',
          driverLexd: '',
          panNo: '',
        };

        // Loop through the jsonData object and set the values in the form controls
        Object.keys(jsonData).forEach(controlName => {
          this.thcTableForm.controls[controlName].setValue(jsonData[controlName]);
        });
      }
    }
  }

  async getShipmentDetails() {

    const prq = this.thcTableForm.controls["prqNo"].value?.value || "";
    this.tableLoad = true;
    if (!this.prqFlag && prq) {
      this.directPrq = true
      const filter = {
        docNo: prq
      }
      let prqData = await this.thcService.prqDetail(false, filter);
      let prqList = [];
      // Map and transform the PRQ data
      prqData.map((element, index) => {
        let pqrData = this.prqService.preparePrqDetailObject(element, index);
        prqList.push(pqrData)
        // You need to return the modified element
      });
      this.prqDetail = prqList[0];
      this.bindPrqData();
    }

    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    // Set the delay duration in milliseconds (e.g., 2000 milliseconds for 2 seconds)

    const shipment = await this.thcService.getShipmentFiltered(prqNo, this.prqDetail.fromCity);

    // Now, update the tableData and set tableLoad to false
    this.tableLoad = false;
    this.tableData = shipment.map((x) => {
      if (!prq) {
        x.actions = ["Update"];
      }
      else {
        delete this.columnHeader.actionsItems;
      }
      return x; // Make sure to return x to update the original object in the 'tableData' array.
    });
    const includedDocketNumbers = [];
    if (this.isUpdate || this.isView) {
      const thcDetail = this.thcDetail;
      this.tableData.forEach((item) => {
        if (thcDetail.docket.includes(item.docketNumber)) {
          item.isSelected = true;
          includedDocketNumbers.push(item);
        }

      });
      this.tableData = includedDocketNumbers;
    }
    // this.thcTableForm.controls["vendorName"].setValue(
    //   shipment ? shipment[0].vendorName : ""
    // );
    // Sum all the calculated actualWeights
  }

  selectCheckBox(event) {
    if (this.DocketsContainersWise) {
      if (event.length > 1) {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'You can select only one Container Wise Docket',
          showConfirmButton: true,
        });
        return false;
      }
    }
    // Assuming event is an array of objects
    // Sum all the calculated actualWeights
    const totalActualWeight = event.reduce((acc, weight) => acc + weight.aCTWT, 0);
    let capacityTons = parseFloat(this.thcTableForm.controls["capacity"].value); // Get the capacity value in tons
    let loadedTons = totalActualWeight ? totalActualWeight / 1000 : 0;
    let percentage = loadedTons ? (loadedTons * 100) / capacityTons : 0;
    this.thcTableForm.controls["loadedKg"].setValue(parseFloat(totalActualWeight));
    this.thcTableForm.controls["weightUtilization"].setValue(parseFloat(percentage.toFixed(2)));
    this.selectedData = event;
  }
  /*Below function call when we click on any option of the menu Item*/
  async handleMenuItemClick(data) {
    if (data.label.label === "Update") {
      const dialogref = this.dialog.open(ThcUpdateComponent, {
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          const { shipment, remarks, podUpload, arrivalTime, receivedBy } = result;
          this.tableData.forEach((x) => {
            if (x.docNo === shipment) {
              x.remarks = remarks || "";
              x.pod = podUpload || "";
              x.arrivalTime = arrivalTime ? formatDate(arrivalTime, 'HH:mm') : "";
              x.receiveBy = receivedBy;
            }
          });
        }

      });
    }
    if (data.label.label === "Edit") {
      const dialogref = this.dialog.open(ShipmentEditComponent, {
        data: data.data
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          const { shipment, actualWeight, noofPkts } = result;
          this.tableData.forEach((x) => {
            if (x.docNo === shipment) {
              x.aCTWT = actualWeight || 0;
              x.pKGS = noofPkts || 0;
              x.isSelected = false
            }
          });
        }

      });
    }
    if (data.label.label === "EditRake" || data.label.label === "RemoveRake") {
      this.fillRakeDetails(data);
    }
    if (data.label.label === "EditInvoice" || data.label.label === "RemoveInvoice") {
      this.fillInvoiceDetails(data);
    }
  }
  /*End*/

  // Helper function to check for blank fields
  hasBlankFields() {
    const fieldMap = {
      remarks: 'Remarks',
      pod: 'POD Upload',
      arrivalTime: 'Arrival Time',
    };

    return Object.keys(fieldMap).some(fieldName => this.tableData.filter(f => f.dCT == this.currentLocation.locCity.toUpperCase()).some(item => !item[fieldName]));
  }
  // Helper function to get the names of blank fields
  getBlankFields() {
    const fieldMap = {
      remarks: 'Remarks',
      pod: 'POD Upload',
      arrivalTime: 'Arrival Time',
    };

    const blankFields = Object.keys(fieldMap).filter(fieldName => this.selectedData.some(item => !item[fieldName]));
    return blankFields.map(fieldName => fieldMap[fieldName]).join(', ');
  }

  goBack(tabIndex: string): void {
    this.route.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }

  onCalculateTotal() {
    // Assuming you have a form named 'thcTableForm'
    const form = this.chargeForm;
    const control1 = "totAmt";
    const control2 = "advAmt";
    const resultControl = "balAmt";
    const advAmt = ConvertToNumber(this.chargeForm.value.advAmt, 2)
    const contAmt = ConvertToNumber(this.chargeForm.value.totAmt, 2)
    if (advAmt > contAmt) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Advance amount cannot be greater than contract amount'
      });
      this.chargeForm.controls['advAmt'].setValue(0);
      this.chargeForm.controls['balAmt'].setValue(contAmt);
      return false
    }
    else {
      calculateTotal(form, control1, control2, resultControl);
    }
  }
  /*below function is call when vendor name would be select*/
  async vendorBasedVehicle() {
    const vendorName = this.thcTableForm.controls['vendorName'].value;
    this.thcTableForm.controls['vendorType'].setValue(`${vendorName.type}`);
    this.thcTableForm.controls['panNo'].setValue(vendorName?.panNo || "");
    this.thcTableForm.controls['venMobNo'].setValue(vendorName?.mob || "");
    const vehicle = await this.vehicleStatusService.getVehicleData({
      vendor: vendorName.name,
      status: 'Available',
      currentLocation: this.storage.branch
    });
    this.vehicleList = vehicle.map(({ vehNo, driver, dMobNo, vMobNo, vendor, vendorType, capacity, lcNo, lcExpireDate }) => ({
      name: vehNo,
      value: vehNo,
      driver,
      dMobNo,
      vMobNo,
      vendor,
      vendorType,
      capacity,
      lcNo,
      lcExpireDate
    }));
    this.filter.Filter(
      this.jsonVehicleControl,
      this.VehicleTableForm,
      this.vehicleList,
      this.vehicleName,
      this.vehicleStatus
    )
  }
  /*end*/
  /*here get vehicle detail function if it is not market*/
  async getVehicleDetail() {
    const controlNames = ['driverName', 'driverMno', 'panNo', 'driverLexd', 'driverLno', 'capacity'];
    controlNames.forEach(controlName => {
      this.thcTableForm.controls[controlName].setValue('');
    });
    const vehDetail: Vehicle = this.VehicleTableForm.controls['vehicle'].value
    const vendType = this.vendorTypes.find((x) => x.name.toUpperCase() === vehDetail.vendorType.toUpperCase());
    this.thcTableForm.controls['vendorType'].setValue(vendType.value);
    if (vendType.value == "4") {
      this.vendorFieldChanged();
      this.VehicleTableForm.controls['driver'].setValue(vehDetail.driver);
      this.VehicleTableForm.controls['dmobileNo'].setValue(vehDetail.dMobNo);
      this.VehicleTableForm.controls['lcExpireDate'].setValue(vehDetail.lcExpireDate);
      this.VehicleTableForm.controls['lcNo'].setValue(vehDetail.lcNo);
      this.VehicleTableForm.controls['vehicleSize'].setValue(vehDetail.capacity);
      this.thcTableForm.controls['vendorName'].setValue(vehDetail.vendor);
      this.thcTableForm.controls['driverName'].setValue(vehDetail.driver);
      this.thcTableForm.controls['driverMno'].setValue(vehDetail.dMobNo);
      this.thcTableForm.controls['driverLexd'].setValue(vehDetail.lcExpireDate);
      this.thcTableForm.controls['driverLno'].setValue(vehDetail.lcNo);
    }
    else {
      const vendorName = this.vendorDetail.find((x) => x.name.toUpperCase() === vehDetail.vendor.toUpperCase())
      this.thcTableForm.controls['vendorName'].setValue(vendorName);

      const vendorDetail: VendorDetail[] = await this.vendorService.getVendorDetail({ vendorName: vendorName.name.toUpperCase() });
      const driverDetail: DriverMaster[] = await this.driverService.getDriverDetail({ vehicleNo: vehDetail.value });

      this.thcTableForm.controls['panNo'].setValue(vendorDetail[0].panNo);
      if (driverDetail && driverDetail.length > 0) {
        this.thcTableForm.controls['driverName'].setValue(driverDetail[0].driverName);
        this.thcTableForm.controls['driverMno'].setValue(driverDetail[0].telno);
        this.thcTableForm.controls['driverLexd'].setValue(driverDetail[0].valdityDt);
        this.thcTableForm.controls['driverLno'].setValue(driverDetail[0].licenseNo);
      }
      else {
        this.thcTableForm.controls['driverName'].setValue(vehDetail.driver);
        this.thcTableForm.controls['driverMno'].setValue(vehDetail.dMobNo);
        this.thcTableForm.controls['driverLexd'].setValue(vehDetail.lcExpireDate);
        this.thcTableForm.controls['driverLno'].setValue(vehDetail.lcNo);
      }

    }
    this.thcTableForm.controls['capacity'].setValue(vehDetail.capacity);
    //if (vehDetail.value) {
    //   const filteredShipments = this.allShipment.filter((x) => x.vehicleNo == vehDetail.value && (x.orgTotWeight != "0" || x.orgNoOfPkg != "0"));
    //   this.tableData = filteredShipments.map((x) => {
    //     x.actions = ["Edit"]
    //     return x; // Make sure to return x to update the original object in the 'tableData' array.
    //   });
    //}
    // this.thcTableForm.controls['vehicle'].setValue();
  }
  /*End*/
  async filterDockets() {
    const dialogRef = this.dialog.open(DocketFiltersComponent, {
      data: { DefaultData: this.DocketFilterData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.DocketFilterData.fCT = result.FromCity?.value || '';
        this.DocketFilterData.tCT = result.ToCity?.value || '';
        this.DocketFilterData.cCT = result.StockCity?.value || '';
        this.DocketFilterData.sDT = moment(result.StartDate).startOf('day').toDate();
        this.DocketFilterData.eDT = moment(result.EndDate).endOf('day').toDate();
        this.getDocketsForTHC();
      }
    });
  }
  /*Below function is for getting docket details using thc*/
  async getDocketsForTHC() {
    const pRQNO = this.thcTableForm.controls['prqNo'].value;
    const fromCity = this.thcTableForm.controls['fromCity'].value?.value || ''
    const toCity = this.thcTableForm.controls['toCity'].value?.value || ''

    this.tableData = [];

    //this.allShipment = await this.thcService.getShipmentFiltered(pRQNO, fromCity.toUpperCase(), null, null, this.DocketFilterData.sDT, this.DocketFilterData.eDT, this.DocketsContainersWise);
    this.allShipment = await this.thcService.getShipmentFiltered(pRQNO, this.DocketFilterData.fCT, this.DocketFilterData.tCT, this.DocketFilterData.cCT, this.DocketFilterData.sDT, this.DocketFilterData.eDT, this.DocketsContainersWise);
    const filteredShipments = this.allShipment;
    const addEditAction = (shipments) => {
      return shipments.map((shipment) => {
        return {
          ...shipment,
          actions: (shipment.dCT == this.currentLocation.locCity.toUpperCase() ? ["Edit"] : [])
        };
      });
    };
    this.tableData = addEditAction(filteredShipments);
  }
  /*End*/
  /*below function is called when any event is occure in vendor type*/
  vendorFieldChanged() {
    this.marketVendor = false;
    const vendorType = this.thcTableForm.getRawValue().vendorType;
    this.jsonControlArray.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
    });
    this.jsonVehicleControl.forEach((x) => {
      if (x.name === "vehicle") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
    })
    if (!this.prqFlag && !this.directPrq) {
      this.thcTableForm.controls['vendorName'].setValue("");
      this.thcTableForm.controls['panNo'].setValue("");
      this.thcTableForm.controls['venMobNo'].setValue("");
    }
    if (vendorType !== '4') {
      const vendorDetail = this.vendorDetail.filter((x) => x.type == parseInt(vendorType));
      this.filter.Filter(
        this.jsonControlArray,
        this.thcTableForm,
        vendorDetail,
        this.vendorName,
        this.vendorNameStatus
      );
      this.jsonControlBasicArray = this.allBasicJsonArray.filter((x) => !this.market.includes(x.name));
    }
    else {
      this.jsonControlBasicArray = this.allBasicJsonArray
    
      /// this.thcTableForm.controls['vendorType'].setValue("");
      if (!this.prqFlag) {
        this.thcTableForm.controls['vendorName'].setValue("");
        this.thcTableForm.controls['panNo'].setValue("");
        this.thcTableForm.controls['venMobNo'].setValue("");
        this.thcTableForm.controls['brokerName'].setValue("");
        this.thcTableForm.controls['brokerMobile'].setValue("");
        this.marketVendor = true;
      }
    }
    const fields = ['driverName', 'driverMno', 'driverLno', 'driverLexd'];
    this.jsonControlArray.forEach(x => {
      if (fields.includes(x.name)) {
        x.disable = false;
      }
    });
  }
  /*End*/
  /*get pincode detail*/
  async getPincodeDetail(event) {
    const cityMapping = event.field.name == 'fromCity' ? this.fromCityStatus : this.toCityStatus;
    this.pinCodeService.getCity(this.thcTableForm, this.jsonControlBasicArray, event.field.name, cityMapping);
  }
  /*end */
  /* below function was the call when */
  async getLocBasedOnCity() {

    const fromCity = this.thcTableForm.controls['fromCity'].value?.value || ''
    const toCity = this.thcTableForm.controls['toCity'].value?.value || ''
    const fromTo = `${fromCity}-${toCity}`
    this.thcTableForm.controls['route'].setValue(fromTo)
    if (toCity) {
      //   this.allShipment = await this.thcService.getShipmentFiltered(this.orgBranch, "", fromCity.toUpperCase(), toCity.toUpperCase(), this.DocketsContainersWise);
      //   const filteredShipments = this.allShipment; //this.allShipment.filter((x) => ((x.fCT.toLowerCase() === fromCity.toLowerCase() && x.tCT.toLowerCase() === toCity.toLowerCase()))//|| (x.vEHNO == this.thcTableForm.controls['vehicle'].value.value));
      //   const addEditAction = (shipments) => {
      //     return shipments.map((shipment) => {
      //       return { ...shipment, actions: ["Edit"] };
      //     });
      //   };
      //   this.tableData = addEditAction(filteredShipments);
      this.getDocketsForTHC();
    }
  }

  /*below function call when user will try to view or
   edit Thc the function are create for autofill the value*/
  async autoFillThc() {
    // Refactored calls using the new function
clearValidatorsAndUpdate(this.thcTableForm, this.jsonControlDriverArray);
clearValidatorsAndUpdate(this.thcTableForm, this.jsonControlBasicArray);
clearValidatorsAndUpdate(this.rakeForm, this.rakeFormData);
clearValidatorsAndUpdate(this.rakeDetailsTableForm, this.rakeDetails);
clearValidatorsAndUpdate(this.rakeInvoice, this.rakeInvoiceData);
clearValidatorsAndUpdate(this.VehicleTableForm, this.jsonVehicleControl);
    const thcDetail = await this.thcService.getThcDetails(this.thcDetail.docNo);
    const thcMovemnetDetails = await this.thcService.getThcMovemnetDetails(this.thcDetail.docNo);
    const thcNestedDetails = thcDetail.data;
  
    this.thcDetailGlobal = thcNestedDetails;
 
    let propertiesToSet = [

      { Key: 'route', Name: 'rUTNM' },
      { Key: 'tripDate', Name: 'eNTDT' },
      {Key:'etaDate',Name:'eTADT'},
      { Key: 'tripId', Name: 'docNo' },
      { Key: 'capacity', Name: 'cAP.wT' },
      { Key: 'weightUtilization', Name: 'uTI.wT' },
      { Key: 'driverName', Name: 'dRV.nM' },
      { Key: 'driverMno', Name: 'dRV.mNO' },
      { Key: 'driverLno', Name: 'dRV.lNO' },
      { Key: 'driverLexd', Name: 'dRV.lEDT' },
      { Key: 'status', Name: 'oPSST' },
      { Key: 'panNo', Name: 'vND.pAN' },
      { Key: 'transMode', Name: 'tMODE' },
    ];
    propertiesToSet.forEach((property) => {
      // Split the nested property by dots and access the nested values
      const nestedValues = property.Name.split('.').reduce((obj, key) => obj[key], thcNestedDetails.thcDetails);

      // Set the value in the form control
      this.thcTableForm.controls[property.Key].setValue(
        nestedValues || ""
      );
    });
    const chargeDropdown = [
      { Key: 'advPdAt', Name: 'aDPAYAT' },
      { Key: 'balAmtAt', Name: 'bLPAYAT' },
    ]
    chargeDropdown.forEach((property) => {
      const nestedValues = property.Name.split('.').reduce((obj, key) => obj[key], thcNestedDetails.thcDetails);
      this.chargeForm.controls[property.Key].setValue(nestedValues || "");

    })
    this.thcTableForm.controls.loadedKg.setValue(thcMovemnetDetails.data?.[0]?.lOAD?.wT || "");

    if (thcNestedDetails.thcDetails?.iSEMPTY) {
      this.DocketsIsEmpty = true;
      this.thcTableForm.controls['IsEmpty'].setValue(true);
      this.thcTableForm.updateValueAndValidity();
    }

    if (thcNestedDetails.thcDetails.pRQNO) {
      const prqNo = {
        name: thcNestedDetails.thcDetails?.pRQNO || "",
        value: thcNestedDetails.thcDetails?.pRQNO || "",
      };
      this.thcTableForm.controls['prqNo'].setValue(prqNo);
    }

    //  const closingBranch = this.locationData.find((x) => x.value === this.thcDetail?.closingBranch);
  
    this.thcTableForm.controls["tripDate"].disable();
    this.thcTableForm.controls["etaDate"].disable();
    //this.thcTableForm.controls["closingBranch"].setValue(closingBranch);
    this.thcTableForm.controls["fromCity"].setValue({ name: thcNestedDetails?.thcDetails.fCT || "", value: thcNestedDetails?.thcDetails.fCT || "" });
    this.thcTableForm.controls["toCity"].setValue({ name: thcNestedDetails?.thcDetails.tCT || "", value: thcNestedDetails?.thcDetails.tCT || "" });
    this.VehicleTableForm.controls["vehicle"].setValue({ name: thcNestedDetails?.thcDetails.vEHNO, value: thcNestedDetails?.thcDetails.vEHNO });
    this.thcTableForm.controls["vendorName"].setValue({ name: thcNestedDetails?.thcDetails.vND?.nM, value: thcNestedDetails?.thcDetails.vND?.nM });
    this.thcTableForm.controls["venMobNo"].setValue(thcNestedDetails?.thcDetails.vND?.mNO);
    this.VehicleTableForm.controls["engineNo"].setValue(thcNestedDetails?.thcDetails.eNGNO)
    this.VehicleTableForm.controls["chasisNo"].setValue(thcNestedDetails?.thcDetails.cHASNO),
    this.VehicleTableForm.controls["vehSize"].setValue(`${thcNestedDetails?.thcDetails.vEHSIZE}`);
   if(thcNestedDetails?.thcDetails.vIA){
    const via =thcNestedDetails?.thcDetails.vIA.join(",");
    this.thcTableForm.controls["via"].setValue(via);
   }
    this.VehicleTableForm.controls["inExdt"].setValue(thcNestedDetails?.thcDetails.iNSEXDT)
    this.VehicleTableForm.controls["fitdt"].setValue(thcNestedDetails?.thcDetails.fITDT)
    this.thcTableForm.controls["driverLexd"].disable(thcNestedDetails?.thcDetails.eNGNO);
    this.thcTableForm.controls["vendorType"].setValue(`${thcNestedDetails?.thcDetails.vND?.tY}`);
    const hasShipment = thcNestedDetails.shipment?.length > 0;
    const hasCNO = !!thcNestedDetails.shipment?.[0]?.cNO;
    this.thcTableForm.controls["containerwise"].setValue(hasShipment && hasCNO);
    if (this.addThc) {
      this.thcTableForm.controls['billingParty'].setValue(this.thcDetail?.billingParty);
      this.thcTableForm.controls['docketNumber'].setValue(this.thcDetail?.docketNumber);
    }
    if(thcNestedDetails?.thcDetails.vND?.tY==4){
      this.jsonControlBasicArray = this.allBasicJsonArray
      this.thcTableForm.controls['brokerName'].setValue(thcNestedDetails?.thcDetails.bRKNM||"");
      this.thcTableForm.controls['brokerMobile'].setValue(thcNestedDetails?.thcDetails.bRKMOB||"");
      this.thcTableForm.controls['tdsUpload'].setValue(thcNestedDetails?.thcDetails.tDSDOC||"");

    }
    if (this.isView || this.isUpdate) {
      this.thcTableForm.controls["containerwise"].disable();
      this.thcTableForm.controls["IsEmpty"].disable();
      this.tableData = thcNestedDetails.shipment.map((x) => {
        x.isSelected = true;
        x.actions = [];

        if (x.tCT == this.currentLocation.locCity.toUpperCase()) {
          x.actions = ["Update"];
        }
        else if (this.isView) {

        }
        return x; // Make sure to return x to update the original object in the 'tableData' array.
      });
    }
    if(thcDetail.data.thcDetails.tMODENM=="Rail"){
      this.isRail=true;
      this.rakeForm.controls['rakeNumber'].setValue(thcDetail.data.thcDetails.rAKE.nO||"");
      this.rakeForm.controls['rakeDate'].setValue(thcDetail.data.thcDetails.rAKE.dT);
      this.rakeForm.controls['fnrNo'].setValue(thcDetail.data.thcDetails.rAKE.fNRNO);
      this.rakeForm.controls['noOfContrainer'].setValue(thcDetail.data.thcDetails.rAKE?.cONT||"");
      if(thcDetail.data.thcDetails.rAKE.iNV){
          const invoiceData=thcDetail.data.thcDetails.rAKE.iNV.map(element => {
              return{
                invNum:element.nO,
                invDate: formatDate(element.dT, "dd-MM-yy HH:mm"),
                orrInvDt:element.dT,
                invAmt:element.aMT,
                actions:[]
              }
          });
          this.tableRakeInvoice=invoiceData;
          this.rrInvoice=false
      }
      if(thcDetail.data.thcDetails.rAKE.rR){
        const invoiceData=thcDetail.data.thcDetails.rAKE.rR.map(element => {
            return{
              rrNo:element.nO,
              rrDate: formatDate(element.dT, "dd-MM-yy HH:mm"),
              orrDate: element.dT,
              actions:[]
            }
        });
        this.tableRakeData=invoiceData;
        this.rrLoad=false
      
    }
   }

this.getAutoFillCharges(thcNestedDetails?.thcDetails.cHG,thcNestedDetails)
    // this.getShipmentDetails();
  }
  /*End*/
  
  async getCityDetail(event) {
    const formdata = this.thcTableForm.value
    const { additionalData, type, name } = event.field;
    const cityMapping = additionalData.showNameAndValue;

    if (type === 'multiselect') {
      const selectedValues = this.thcTableForm.controls[name].value;

      if (selectedValues.length >= 3 && !this.isUpdate && !this.isView) {
        const viaControlHandler = this.thcTableForm.controls['viaControlHandler'].value;
        const regexPattern = `^${selectedValues}`;
        const cityDetails = await this.pinCodeService.getCityDetails({
          CT: { 'D$regex': regexPattern, 'D$options': 'i' }
        });

        let updatedCities = cityDetails;
        if (viaControlHandler) {
          const viaControlHandlerValues = viaControlHandler.map(x => x.value);
          updatedCities = updatedCities.filter(city => !viaControlHandlerValues.includes(city.value));
          updatedCities.push(...this.thcTableForm.value.viaControlHandler);
        }

        this.thcTableForm.controls['viaControlHandler'].setValue(viaControlHandler);
        this.filter.Filter(this.jsonControlArray, this.thcTableForm, updatedCities, name, cityMapping);
      }
    } else {
      this.pinCodeService.getCity(this.thcTableForm, this.jsonControlArray, name, cityMapping);
    }
  }
  /*below function file upload*/
  async GetFileList(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "tdsUpload", this.thcTableForm, this.imageData, "THC Generation", 'Operation', this.jsonControlArray, allowedFormats);
  }
  /*End*/
  //#region to preview image
  openImageDialog(control) {
    
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    if(this.isUpdate||this.isView){
      file=this.thcTableForm.controls[control.imageName].value;
    }
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
  /*below function for the autofill the value when user try to
  add multiple thc against one docket
  */
  async autoFillDocketDetail() {

    const route = `${this.docketDetail?.fromCity || ""}-${this.docketDetail?.toCity || ""}`
    const prq = { name: this.docketDetail?.prqNo || "", value: this.docketDetail?.prqNo || "" }
    const vehicle = { name: this.docketDetail?.vehicleNo || "", value: this.docketDetail?.vehicleNo || "" }
    const vendor = this.vendorDetail.find((x) => x.name.toLowerCase() === this.docketDetail.vendorName.toLowerCase())
    const fromCity = { name: this.docketDetail.fromCity, value: this.docketDetail.fromCity }
    const toCity = { name: this.docketDetail.toCity, value: this.docketDetail.toCity }
    this.thcTableForm.controls['route'].setValue(route);
    this.thcTableForm.controls['prqNo'].setValue(prq);
    this.VehicleTableForm.controls['vehicle'].setValue(vehicle);
    this.thcTableForm.controls['vendorType'].setValue(this.docketDetail.vendorType);
    this.thcTableForm.controls['vendorName'].setValue(vendor);
    this.thcTableForm.controls['fromCity'].setValue(fromCity);
    this.thcTableForm.controls['toCity'].setValue(toCity);
    const driverDetail: DriverMaster[] = await this.driverService.getDriverDetail({ vehicleNo: vehicle.value });
    this.thcTableForm.controls['driverName'].setValue(driverDetail[0].driverName);
    this.thcTableForm.controls['driverMno'].setValue(driverDetail[0].telno);
    this.thcTableForm.controls['driverLno'].setValue(driverDetail[0].licenseNo);
    this.thcTableForm.controls['driverLexd'].setValue(driverDetail[0].valdityDt);
    this.thcTableForm.controls['billingParty'].setValue(this.docketDetail?.billingParty);
    this.thcTableForm.controls['docketNumber'].setValue(this.docketDetail?.docketNumber);
    this.thcTableForm.controls['pendingActWeight'].setValue(this.docketDetail?.actualWeight);
    this.thcTableForm.controls['pendingPackages'].setValue(this.docketDetail?.totalPkg);
    const vehicleDetail: Vehicle = this.vehicleList.find((x) => x.value == vehicle.value);
    this.thcTableForm.controls['capacity'].setValue(vehicleDetail.capacity);

  }
  /*End*/
  /* if vehicle type is market vehicle in that form when we select vehicleSize then below function is call */
  getSize() {
    this.thcTableForm.controls['capacity'].setValue(this.VehicleTableForm.value.vehSize);
  }
  /*End*/
  /*autofield router*/
  onSelectViaLocation() {
    const formControls = this.thcTableForm.controls;
    const fromCity = formControls['fromCity'].value?.value || '';
    const toCity = formControls['toCity'].value?.value || '';
    // Assuming viaControlHandler is an array of controls that might exist
    const via = this.thcTableForm.value.viaControlHandler?.map(x => x.value).join("-") || "";
    // Use template literals consistently for clarity
    // Correct the template literal placeholder for 'via'
    const fromTo = `${fromCity}${via ? `-${via}` : ''}-${toCity}`;
    this.thcTableForm.controls['route'].setValue(fromTo);
  }
  /*end*/

  /*below function called when the tranMode Dropdown has any event occur*/
  transModeChanged() {
    
    const transMode = this.thcTableForm.getRawValue().transMode;
    const transModeDetail = this.products.find((x) => x.value == transMode);
    const roadControl = ['vehicle']
    if (transModeDetail.name == "Rail") {
      this.isRail = true
      // vehicle.clearValidators(); // Remove all validators from this control
      // vehicle.updateValueAndValidity(); // Update the validation status
      // this.jsonControlArray.forEach((x) => {

      //   if (x.name === "vehicle") {
      //     x.disable =true
      //   }
      // })
      this.jsonControlBasicArray = this.allBasicJsonArray.filter((x) => !roadControl.includes(x.name));
      this.jsonControlVehLoadArray.forEach(element => {
        this.thcTableForm.controls[element.name].clearValidators();
        this.thcTableForm.controls[element.name].updateValueAndValidity();

      });
      this.jsonControlDriverArray.forEach(element => {
        this.thcTableForm.controls[element.name].clearValidators();
        this.thcTableForm.controls[element.name].updateValueAndValidity();

      });
    }
    else {
      this.jsonControlBasicArray = this.allBasicJsonArray.filter((x) => !this.market.includes(x.name));
      this.jsonControlVehLoadArray.forEach(element => {
        this.thcTableForm.controls[element.name].setValidators([Validators.required]);
        this.thcTableForm.controls[element.name].updateValueAndValidity();

      });
      this.jsonControlDriverArray.forEach(element => {
        this.thcTableForm.controls[element.name].setValidators([Validators.required]);
        this.thcTableForm.controls[element.name].updateValueAndValidity();

      });
      this.isRail = false
    }
    this.getCharges(transModeDetail.name);
    this.vendorFieldChanged();
  }
  /*End*/
  /*below code is for the autoFill the driver details while Add market vehicle*/
  // autoFillDriverDetails() {
  //   this.thcTableForm.controls['driverName'].setValue(this.VehicleTableForm.value?.driver || "");
  //   this.thcTableForm.controls['driverMno'].setValue(this.VehicleTableForm.value?.dmobileNo || "");
  //   this.thcTableForm.controls['driverLno'].setValue(this.VehicleTableForm.value?.lcNo || "");
  //   this.thcTableForm.controls['driverLexd'].setValue(this.VehicleTableForm.value?.lcExpireDate || "");
  //   this.thcTableForm.controls['panNo'].setValue(this.VehicleTableForm.value?.driverPan || "");
  // }
  /*End*/
  /*below function is call when is empty toggle are turn off or On*/
  onchangeIsEmptyFlag(event) {
    this.DocketsIsEmpty = event?.eventArgs?.checked;
    if (this.DocketsIsEmpty) {
      this.thcTableForm.controls["loadedKg"].setValue(0.00);
      this.thcTableForm.controls["weightUtilization"].setValue(0.00);
    }

  }
  /*End*/
  /*below code is for the */
  GenerateTHCgenerationRequestBody() {
    
    const VendorDetails = this.vendorTypes.find((x) => x.value.toLowerCase() == this.thcTableForm.controls['vendorType'].value.toLowerCase());
    const transitHours = Math.max(...this.tableData.filter(item => item.isSelected == true).map(o => o.transitHours));
    const deptDate = this.thcTableForm.controls['tripDate'].value || new Date();
    const schArrDate = moment(deptDate).add(transitHours, 'hours').toDate();
    // this.thcTableForm.get('vendorCode').setValue(isMarket ? "8888" : this.thcTableForm.get('vendorName').value?.value || "");
    //#region MainModel
    this.tHCGenerationModel.ContainerWise = this.DocketsContainersWise;
    this.tHCGenerationModel.companyCode = this.storage.companyCode;
    this.tHCGenerationModel.branch = this.storage.branch;
    this.tHCGenerationModel.docType = "TH";
    this.tHCGenerationModel.finYear = financialYear;
    //#endregion
    //#region THC Summary
    this.thcsummaryData.companyCode = this.storage.companyCode;
    this.thcsummaryData.branch = this.storage.branch;
    this.thcsummaryData.tHCDT = deptDate;
    this.thcsummaryData.closingBranch = getValueOrDefault(this.thcTableForm, "closingBranch") || "";
    this.thcsummaryData.fromCity = getValueOrDefault(this.thcTableForm, "fromCity") || "";
    this.thcsummaryData.toCity = getValueOrDefault(this.thcTableForm, "toCity") || "";
    this.thcsummaryData.via = this.thcTableForm.controls['viaControlHandler'].value ? this.thcTableForm.controls['viaControlHandler'].value.map((x) => x.value) : "";
    this.thcsummaryData.routecode = "9888";
    this.thcsummaryData.route = getValueOrDefault(this.thcTableForm, "route") || "";
    this.thcsummaryData.vehicle = getValueOrDefault(this.VehicleTableForm, "vehicle") || "";
    this.thcsummaryData.Vendor_type = VendorDetails.value || "";
    this.thcsummaryData.Vendor_typetName = VendorDetails.name || "";
    this.thcsummaryData.Vendor_Code = getValueOrDefault(this.thcTableForm, "vendorCode") || "";
    this.thcsummaryData.Vendor_Name = this.thcTableForm.controls['vendorName'].value?.name || this.thcTableForm.controls['vendorName'].value;
    this.thcsummaryData.Vendor_pAN = getValueOrDefault(this.thcTableForm, "panNo") || "";
    this.thcsummaryData.status = 1
    this.thcsummaryData.statusName = "Intransit";
    this.thcsummaryData.financialStatus = 0;
    this.thcsummaryData.financialStatusName = "";
    this.thcsummaryData.contAmt = getValueOrDefault(this.chargeForm, "contAmt") || "";
    this.thcsummaryData.advAmt = getValueOrDefault(this.chargeForm, "advAmt") || "";
    this.thcsummaryData.aDVPENAMT = this.thcsummaryData.advAmt;
    this.thcsummaryData.balAmt = getValueOrDefault(this.chargeForm, "balAmt") || "";
    this.thcsummaryData.advPdAt = getValueOrDefault(this.chargeForm, "advPdAt", this.storage.branch);
    this.thcsummaryData.balAmtAt = getValueOrDefault(this.chargeForm, "balAmtAt", this.storage.branch);
    this.thcsummaryData.vouchersList = [];
    this.thcsummaryData.iSBILLED = false;
    this.thcsummaryData.bILLNO = "";
    this.thcsummaryData.Driver_name = getValueOrDefault(this.thcTableForm, "driverName");
    this.thcsummaryData.Driver_mobile = getValueOrDefault(this.thcTableForm, "driverMno");
    this.thcsummaryData.Driver_lc = getValueOrDefault(this.thcTableForm, "driverLno");
    this.thcsummaryData.Driver_exd = getValueOrDefault(this.thcTableForm, "driverLexd", null);
    this.thcsummaryData.Capacity_ActualWeight = getValueOrDefault(this.thcTableForm, "capacity", null);
    this.thcsummaryData.Capacity_volume = 0;
    this.thcsummaryData.Capacity_volumetricWeight = 0;
    this.thcsummaryData.Utilization_ActualWeight = getValueOrDefault(this.thcTableForm, "weightUtilization");
    this.thcsummaryData.Utilization_volume = 0;
    this.thcsummaryData.Utilization_volumetricWeight = 0;
    this.thcsummaryData.departed_sCHDT = deptDate;
    this.thcsummaryData.departed_eXPDT = deptDate;
    this.thcsummaryData.departed_aCTDT = deptDate;
    //this.thcsummaryData.departed_gPSDT = undefined;
    this.thcsummaryData.departed_oDOMT = 0;
    this.thcsummaryData.arrived_sCHDT = schArrDate;
    this.thcsummaryData.arrived_eXPDT = schArrDate;
    //this.thcsummaryData.arrived_aCTDT = undefined;
    //this.thcsummaryData.arrived_gPSDT = undefined;
    //this.thcsummaryData.arrived_oDOMT = undefined;
    this.thcsummaryData.sCHDIST = 0;
    this.thcsummaryData.aCTDIST = 0;
    this.thcsummaryData.gPSDIST = 0;
    this.thcsummaryData.cNL = false;
    //this.thcsummaryData.cNDT = undefined;
    //this.thcsummaryData.cNBY = undefined;
    //this.thcsummaryData.cNRES = undefined;
    this.thcsummaryData.eNTDT = new Date();
    this.thcsummaryData.eNTLOC = this.storage.branch;
    this.thcsummaryData.eNTBY = this.storage.userName;
    this.thcsummaryData.venMobNo = getValueOrDefault(this.thcTableForm, "venMobNo");
    this.thcsummaryData.brokerName = getValueOrDefault(this.thcTableForm, "brokerName");
    this.thcsummaryData.brokerMobile = getValueOrDefault(this.thcTableForm, "brokerMobile");
    const tdsUpload = this.imageData?.tdsUpload || ""
    this.thcsummaryData.tdsUpload = tdsUpload;
    this.thcsummaryData.etaDate = getValueOrDefault(this.thcTableForm, "etaDate", null);
    this.thcsummaryData.engineNo = getValueOrDefault(this.VehicleTableForm, "engineNo");
    this.thcsummaryData.chasisNo = getValueOrDefault(this.VehicleTableForm, "chasisNo");
    this.thcsummaryData.inExdt = getValueOrDefault(this.VehicleTableForm, "inExdt", null);
    this.thcsummaryData.fitdt = getValueOrDefault(this.VehicleTableForm, "fitdt", null);
    let charges = []
    this.chargeJsonControl.filter((x) => x.hasOwnProperty("id")).forEach(element => {
      let json = {
        cHGID: element.name,
        cHGNM: element.placeholder,
        aMT: (element?.additionalData.metaData === "-") ? -Math.abs(this.chargeForm.controls[element.name].value || 0) : (this.chargeForm.controls[element.name].value || 0),
        oPS:element?.additionalData.metaData||"",
      }
      charges.push(json);
    });
    this.thcsummaryData.cHG = charges
    this.thcsummaryData.totAmt = ConvertToNumber(getValueOrDefault(this.chargeForm, "totAmt", "0.00"));

    //New Added By Harikesh
    this.thcsummaryData.tMODE = this.thcTableForm.controls['transMode']?.value || "";
    this.thcsummaryData.tMODENM = this.products.find(item => item.value == this.thcTableForm.controls['transMode']?.value)?.name || "";
    this.thcsummaryData.pRQNO = this.thcTableForm.controls['prqNo'].value || "";
    this.thcsummaryData.iSEMPTY = this.DocketsIsEmpty;
    //#endregion
    const isRake = this.thcsummaryData.tMODENM == "Rail";
    this.thcsummaryData.vehSize = !isRake ? getValueOrDefault(this.VehicleTableForm, "vehSize") : "";
    const vehSize = !isRake ? this.vehicleSize.find((x) => x.value == this.VehicleTableForm.controls['vehSize'].value) : { name: "", value: "" };
    this.thcsummaryData.vehSizeName = !isRake ? vehSize.name : "";
    //#region Load
    this.LOad.dKTS = this.tableData.filter(item => item.isSelected == true).length;
    this.LOad.pKGS = this.tableData.filter(item => item.isSelected == true).reduce((acc, item) => acc + item.pKGS, 0);
    this.LOad.wT = this.tableData.filter(item => item.isSelected == true).reduce((acc, item) => acc + item.aCTWT, 0);
    this.LOad.vOL = 0;
    this.LOad.vWT = 0;
    this.LOad.sEALNO = "";
    this.LOad.rMK = "";
    //#endregion

    //#region CAp
    this.CAp.wT = !isRake ? this.thcTableForm.controls['capacity'].value || 0 : 0;
    this.CAp.vOL = 0;
    this.CAp.vWT = 0;
    //#endregion

    //#region UTi
    this.UTi.wT = !isRake ? this.thcTableForm.controls['weightUtilization'].value || 0 : 0;
    this.UTi.vOL = 0;
    this.UTi.vWT = 0;
    //#endregion

    //#region DPt
    this.DPt.sCHDT = deptDate;
    this.DPt.eXPDT = deptDate;
    this.DPt.aCTDT = deptDate;
    //this.DPt.gPSDT = undefined;
    this.DPt.oDOMT = 0;
    //#endregion

    //#region ARr
    this.ARr.sCHDT = schArrDate;
    this.ARr.eXPDT = schArrDate;
    //this.ARr.aCTDT = undefined;
    //this.ARr.gPSDT = undefined;
    //this.ARr.oDOMT = 0;
    //#endregion

    //#region UNload
    this.UNload.dKTS = 0;
    this.UNload.pKGS = 0;
    this.UNload.wT = 0;
    this.UNload.vOL = 0;
    this.UNload.vWT = 0;
    this.UNload.sEALNO = "";
    this.UNload.rMK = "";
    this.UNload.sEALRES = "";
    //#endregion

    //#region THC Movement Details
    this.thcmovementDetails.cID = this.storage.companyCode
    this.thcmovementDetails.fLOC = this.thcTableForm.controls['branch'].value || "";
    this.thcmovementDetails.tLOC = this.thcTableForm.controls['closingBranch'].value || "";
    this.thcmovementDetails.lOAD = this.LOad
    this.thcmovementDetails.cAP = this.CAp;
    this.thcmovementDetails.uTI = this.UTi;
    this.thcmovementDetails.dPT = this.DPt;
    this.thcmovementDetails.aRR = this.ARr;
    this.thcmovementDetails.uNLOAD = this.UNload;
    this.thcmovementDetails.sCHDIST = 0;
    this.thcmovementDetails.aCTDIST = 0;
    this.thcmovementDetails.gPSDIST = 0;
    this.thcmovementDetails.eNTDT = new Date()
    this.thcmovementDetails.eNTLOC = this.storage.branch;
    this.thcmovementDetails.eNTBY = this.storage.userName;
    //this.thcmovementDetails.mODDT = undefined;
    //this.thcmovementDetails.mODLOC = undefined;
    //this.thcmovementDetails.mODBY = undefined;
    //#endregion

    //#region THC Movement Details
    this.mfheaderDetails.cID = this.storage.companyCode
    this.mfheaderDetails.mDT = deptDate;
    this.mfheaderDetails.oRGN = this.thcTableForm.controls['branch'].value || "";
    this.mfheaderDetails.dEST = this.thcTableForm.controls['closingBranch'].value || "";
    this.mfheaderDetails.dKTS = this.tableData.filter(item => item.isSelected == true).length;
    this.mfheaderDetails.pKGS = this.tableData.filter(item => item.isSelected == true).reduce((acc, item) => acc + item.pKGS, 0);
    this.mfheaderDetails.wT = this.tableData.filter(item => item.isSelected == true).reduce((acc, item) => acc + item.aCTWT, 0);
    this.mfheaderDetails.vOL = 0;
    this.mfheaderDetails.tHC = "";
    this.mfheaderDetails.iSARR = false;
    //this.mfheaderDetails.aRRDT = undefined;
    this.mfheaderDetails.eNTDT = new Date()
    this.mfheaderDetails.eNTLOC = this.storage.branch;
    this.mfheaderDetails.eNTBY = this.storage.userName;
    //this.mfheaderDetails.mODDT = undefined;
    //this.mfheaderDetails.mODLOC = undefined;
    //this.mfheaderDetails.mODBY = undefined;

    //#endregion

    this.tableData.filter(item => item.isSelected == true).forEach((res) => {
      const mfdetailsList = new MfdetailsList();
      //#region mfdetailsList
      mfdetailsList.cID = this.storage.companyCode
      mfdetailsList.dKTNO = res.docNo;
      mfdetailsList.sFX = res.sFX;
      mfdetailsList.cNO = res.cNO;
      mfdetailsList.oRGN = this.thcTableForm.controls['branch'].value || "";
      mfdetailsList.dEST = this.thcTableForm.controls['closingBranch'].value || "";
      mfdetailsList.pKGS = res.pKGS;
      mfdetailsList.wT = res.aCTWT;
      mfdetailsList.vOL = 0;
      mfdetailsList.lDPKG = res.pKGS;
      mfdetailsList.lDWT = res.aCTWT;
      mfdetailsList.lDVOL = 0;
      mfdetailsList.aRRPKG = 0;
      mfdetailsList.aRRPWT = 0;
      mfdetailsList.aRRVOL = 0;
      mfdetailsList.aRRLOC = "";
      mfdetailsList.iSARR = false;
      //mfdetailsList.aRRDT = undefined;
      mfdetailsList.eNTDT = new Date()
      mfdetailsList.eNTLOC = this.storage.branch;
      mfdetailsList.eNTBY = this.storage.userName;
      //mfdetailsList.mODDT = undefined;
      //mfdetailsList.mODLOC = undefined;
      //mfdetailsList.mODBY = undefined;
      //#endregion
      this.mfdetailsList.push(mfdetailsList);
    });
    const rakeDetailData=new rakeDetails();
    if (this.tableRakeData.length > 0) {
      this.tableRakeData.forEach(element => {
        this.rakeData.push({ nO: element.rrNo, dT: element.orrDate });
      });
      rakeDetailData.rR = this.rakeData;
    }
    if (this.tableRakeInvoice.length > 0) {
      this.tableRakeInvoice.forEach(element => {
        this.invoiceData.push({ nO: element.invNum, dT: element.orrInvDt, aMT: element.invAmt });
      });
      rakeDetailData.iNV = this.invoiceData;
    }
    if (isRake) {
      rakeDetailData.nO = getValueOrDefault(this.rakeForm, "rakeNumber");
      rakeDetailData.dT = getValueOrDefault(this.rakeForm, "rakeDate", null);
      rakeDetailData.fNRNO = getValueOrDefault(this.rakeForm, "fnrNo", null);
      rakeDetailData.cONT = getValueOrDefault(this.rakeForm, "noOfContrainer", null);
    }
    this.thcsummaryData.rakeDetailsList=rakeDetailData;
    this.tHCGenerationModel.data = this.thcsummaryData;
    this.tHCGenerationModel.mfdetailsList = this.mfdetailsList;
    this.tHCGenerationModel.mfheaderDetails = this.mfheaderDetails;
    this.tHCGenerationModel.thcmovementDetails = this.thcmovementDetails;

    return this.tHCGenerationModel;

  }

  /*below code is for the Push RR Data into Table*/
  async addRakeData() {
    this.rrLoad = true;
    this.isLoadRail=true;
    const tableData = this.tableRakeData;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.rrNo === this.rakeDetailsTableForm.value.rrNo
      );
      if (exist) {
        this.rakeDetailsTableForm.controls["rrNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering RR NO.",
          showConfirmButton: true,
        });
       ;
        this.rrLoad = false;
        this.isLoadRail=false
        return false;
      }
    
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      rrNo: this.rakeDetailsTableForm.controls['rrNo'].value,
      rrDate: formatDate(this.rakeDetailsTableForm.controls['rrDate'].value, "dd-MM-yy HH:mm"),
      orrDate: this.rakeDetailsTableForm.controls['rrDate'].value,
      actions: ["EditRake", "RemoveRake"]
    };
    this.tableRakeData.push(json);
    this.rrLoad = false;
    this.isLoadRail=false
    const fieldsToClear = [
      'rrNo',
      'rrDate'
    ];
    fieldsToClear.forEach(field => {
      this.rakeDetailsTableForm.controls[field].setValue("");
    });

  }
  /*End*/
  /*Below function is for Edit and remove RR Data*/
  fillRakeDetails(data) {
    this.rrLoad = true;
    if (data.label.label === "RemoveRake") {
      this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);
    } else {
      this.rakeDetailsTableForm.controls['rrNo'].setValue(data.data['rrNo']);
      this.rakeDetailsTableForm.controls['rrDate'].setValue(
        data.data?.orrDate || new Date()
      );

      this.tableRakeData = this.tableRakeData.filter(x => x.rrNo !== data.data.rrNo);;
      this.rrLoad = false;
    }
  }
  /*End*/
  /*below code is for the add Rake Invoice*/
  async addRakeInvoice() {
    this.rrInvoice = true;
    this.isLoadInvoice=true;
    const tableData = this.tableRakeInvoice;
    if (tableData.length > 0) {
      const exist = tableData.find(
        (x) =>
          x.invNo === this.rakeInvoice.value.invNo
      );
      if (exist) {
        this.rakeInvoice.controls["invNo"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid duplicate entering Invoice No.",
          showConfirmButton: true,
        });
        this.rrInvoice = false;
        this.isLoadInvoice=false;
        return false;
      }
    }
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json = {
      invNum: this.rakeInvoice.controls['invNo'].value,
      invDate: formatDate(this.rakeInvoice.controls['invDt'].value, "dd-MM-yy HH:mm"),
      orrInvDt: this.rakeInvoice.controls['invDt'].value,
      invAmt: this.rakeInvoice.controls['invAmt'].value,
      actions: ["EditInvoice", "RemoveInvoice"]
    };
    this.tableRakeInvoice.push(json);
    this.rrInvoice = false;
    this.isLoadInvoice=false;
    const fieldsToClear = [
      'invNo',
      'invDt',
      'invAmt'
    ];
    fieldsToClear.forEach(field => {
      this.rakeInvoice.controls[field].setValue("");
    });
  }
  /*End*/
  /*below code is for the Edit and remove for the rake details*/
  fillInvoiceDetails(data) {
    this.rrInvoice = true;
    if (data.label.label === "RemoveInvoice") {
      this.tableRakeInvoice = this.tableRakeInvoice.filter(x => x.invNum !== data.data.invNum);
      this.rrInvoice = false;
    } else {
      this.rakeInvoice.controls['invNo'].setValue(data.data['invNum']);
      this.rakeInvoice.controls['invDt'].setValue(
        data.data?.orrInvDt || new Date()
      );
      this.rakeInvoice.controls['invAmt'].setValue(
        data.data?.invAmt || new Date()
      );
      this.tableRakeInvoice = this.tableRakeInvoice.filter(x => x.invNum !== data.data.invNum);;
      this.rrInvoice = false;
    }
  }
  /*End*/
  /*below code is for getting a Chages from Charge Master*/
  async getCharges(prod) {
    this.chargeJsonControl = this.chargeJsonControl.filter((x) => !x.hasOwnProperty('id'));
    const result = await this.thcService.getCharges({ "cHACAT": { "D$in": ['V', 'B'] }, "pRNM": prod },);
    if (result && result.length > 0) {
      const invoiceList = [];

      result.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
            id: index + 1,
            name: element.cHACD || '',
            label: `${element.sELCHA}(${element.aDD_DEDU})`,
            placeholder:element.sELCHA || '',
            type: 'text',
            value: '0.00',
            filterOptions: '',
            displaywith: '',
            generatecontrol: true,
            disable: false,
            Validations: [],
            additionalData: {
              showNameAndValue: false,
              metaData: element.aDD_DEDU
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const chargeControl = [...invoiceList, ...this.chargeJsonControl]
      this.chargeJsonControl = chargeControl;
      chargeControl.sort((a, b) => {
        if (a.name == "contAmt") return -1;
        if (b.name == "contAmt") return 1;
        return 0;
      });
      this.chargeForm = formGroupBuilder(this.fb, [chargeControl]);
      const chargeFilter = [
        { name: this.advanceName, data: this.locationData, status: this.advanceStatus },
        { name: this.balanceName, data: this.locationData, status: this.balanceStatus },
      ]
      chargeFilter.forEach(({ name, data, status }) => {
        this.filter.Filter(this.chargeJsonControl,this.chargeForm,data,name,status);
      });
      const location=this.locationData.find(x=>x.value==this.branchCode);
      this.chargeForm.controls['advPdAt'].setValue(location)
      this.isCharge = true;
    }
  }
  /*End*/
    /*below code is for getting a Chages from Charge Master*/
    async getAutoFillCharges(charges,thcNestedDetails) {

      if (charges && charges.length > 0) {
        const invoiceList = [];
  
        charges.forEach((element, index) => {
          if (element) {
            const invoice: InvoiceModel = {
              id: index + 1,
              name: element.cHGID || '',
              label: `${element.cHGNM}(${element.oPS})`,
              placeholder: element.cHGNM || '',
              type: 'text',
              value:`${Math.abs(element.aMT)}`,
              filterOptions: '',
              displaywith: '',
              generatecontrol: true,
              disable: true,
              Validations: [],
              additionalData: {
                showNameAndValue: false,
              },
              functions: {
                onChange: 'calucatedCharges',
              },
            };
  
            invoiceList.push(invoice);
          }
        });
        const chargeControl = [...invoiceList, ...this.chargeJsonControl]
        this.chargeJsonControl = chargeControl;
        chargeControl.sort((a, b) => {
          if (a.name == "contAmt") return -1;
          if (b.name == "contAmt") return 1;
          return 0;
        });
        this.chargeForm = formGroupBuilder(this.fb, [chargeControl]);
        this.isCharge = true;
        const location = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.aDPAYAT);
        const balAmtAt = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.bLPAYAT);
        this.chargeForm.controls["advPdAt"].setValue(location);
        this.chargeForm.controls["balAmtAt"].setValue(balAmtAt);
        this.chargeForm.controls["contAmt"].setValue(thcNestedDetails?.thcDetails.cONTAMT || 0);
        this.chargeForm.controls["advAmt"].setValue(thcNestedDetails?.thcDetails.aDVAMT || 0);
        this.chargeForm.controls["balAmt"].setValue(thcNestedDetails?.thcDetails.bALAMT || 0);
        this.chargeForm.controls["totAmt"].setValue(thcNestedDetails?.thcDetails.tOTAMT || 0);
      }
    }
    /*End*/
    
  /*Calucate Charges*/
  calucatedCharges() {
    let total = 0;
    const vendorAdvance = this.thcTableForm.controls['vendorName'].value?.vendorAdvance||0;
    const dyanmicCal = this.chargeJsonControl.filter((x) => x.hasOwnProperty("id"));
    const chargeMapping = dyanmicCal.map((x) => { return { name: x.name, operation: x.additionalData.metaData } });
    total = chargeMapping.reduce((acc, curr) => {
      const value = ConvertToNumber(this.chargeForm.controls[curr.name].value, 2);
      if (curr.operation === "+") {
        return acc + value;
      } else if (curr.operation === "-") {
        return acc - value;
      } else {
        return acc; // In case of an unknown operation
      }
    }, 0);
    const totalAmt = ConvertToNumber(total, 2) + ConvertToNumber(this.chargeForm.controls["contAmt"].value, 2);
    this.chargeForm.controls["balAmt"].setValue(totalAmt);
    this.chargeForm.controls['totAmt'].setValue(totalAmt);
    let percentageValue = (totalAmt * vendorAdvance) / 100;
    // Now set this calculated percentageValue to advAmt
    this.chargeForm.controls['advAmt'].setValue(percentageValue);
  }
  /*Below function is Called when the We click on Create THC*/
  async createThc() {
    const vendorTypevalue = this.thcTableForm.get('vendorType').value;
    const contAmt = parseInt(this.chargeForm.get('contAmt').value);
    if(this)
    if ((vendorTypevalue == 2 || vendorTypevalue == 4) && contAmt <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'error',
        text: 'Contract amount must be greater than zero for Attached and Market vendor types.',
        showConfirmButton: true,
      });
      return false;
    }
    if (this.DocketsContainersWise) {

      if (this.tableData.filter(x => x.isSelected).length > 1) {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'You can select only one Container Wise Docket',
          showConfirmButton: true,
        });
        return false;
      }
    }
    const selectedDkt = this.isUpdate ? this.tableData : this.selectedData ? this.selectedData : [];
    if ((selectedDkt.length === 0 && !this.isUpdate) && !this.DocketsIsEmpty) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'You must select any one of Shipment',
        showConfirmButton: true,
      });
      return false;
    }
    this.isSubmit = true;
    if (this.isUpdate && this.hasBlankFields()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incomplete Update: Please fill in all required fields before updating.',
      });
      return;
    }

    const docket = selectedDkt;
    const formControlNames = [
      "prqNo",
      "fromCity",
      "toCity",
      "vendorType"
    ];

    formControlNames.forEach(controlName => {
      const controlValue = this.thcTableForm.get(controlName).value?.value || this.thcTableForm.get(controlName).value;
      this.thcTableForm.get(controlName).setValue(controlValue);
    });
    const controlValue = this.VehicleTableForm.get('vehicle').value?.value || this.VehicleTableForm.get('vehicle').value;
    this.VehicleTableForm.get('vehicle').setValue(controlValue);
    /*below code is for the set advance and blance payment location set*/
    const chargeControl = ["advPdAt", "balAmtAt"]
    chargeControl.forEach(controlName => {
      const controlValue = this.chargeForm.get(controlName).value?.value || this.chargeForm.get(controlName).value;
      this.chargeForm.get(controlName).setValue(controlValue);
    });
    /*End*/
    const vendorType = this.thcTableForm.get('vendorType').value;
    const isMarket = vendorType === "4";
    this.thcTableForm.get('vendorCode').setValue(isMarket ? "8888" : this.thcTableForm.get('vendorName').value?.value || "");

    if (isMarket) {
      const vehicleData = {
        vID: this.VehicleTableForm.value.vehicle,
        vndNM: this.thcTableForm.value.vendorName?.name || this.thcTableForm.value?.vendorName || "",
        vndPH: this.thcTableForm.value.vMobileNo,
        pANNO: this.thcTableForm.value.panNo,
        wTCAP: this.VehicleTableForm.value.vehSize,
        drvNM: this.VehicleTableForm.value.driverName,
        drvPH: this.VehicleTableForm.value.driverMno,
        dLNO: this.VehicleTableForm.value.driverLno,
        dLEXP: this.VehicleTableForm.value.driverLexd,
        iNCEXP: this.VehicleTableForm.value.inExdt || new Date(),
        fITDT: this.VehicleTableForm.value.fitdt || new Date(),
        vSPNM: this.thcTableForm.value?.brokerName || "",
        vSPPH: this.thcTableForm.value?.brokerMobile || "",
      };
      await this.markerVehicleService.SaveVehicleData(vehicleData);
    }

    const destinationMapping = await this.locationService.locationFromApi({ locCity: this.thcTableForm.controls['toCity'].value });
    this.thcTableForm.controls['closingBranch'].setValue(destinationMapping[0]?.value || "");
    if (this.isUpdate) {
      const podDetails = typeof (docket) == "object" ? docket : ""
      this.thcTableForm.removeControl("docket");
      this.thcTableForm.get("podDetail").setValue(podDetails);
      const newARR = {
        ...this.thcDetailGlobal.thcDetails.aRR,
        "aCTDT": this.thcTableForm.get("ArrivalDate").value,
        "sEALNO": this.thcTableForm.get("ArrivalSealNo").value,
        "kM": this.thcTableForm.get("Arrivalendkm").value,
        "aCRBY": this.thcTableForm.get("Arrivalremarks").value,
        "aRBY": this.thcTableForm.get("ArrivalBy").value,
      };

      const requestBody = {
        "oPSST": 2,
        "oPSSTNM": "Arrived",
        "aRR": newARR,
      };

      const data = this.thcTableForm.getRawValue();
      const res = await showConfirmationDialogThc(
        requestBody,
        this.thcTableForm.get("tripId").value,
        this.operationService,
        podDetails,
        this.VehicleTableForm.get("vehicle").value,
        this.currentLocation,
        this.DocketsContainersWise,
        data.prqNo
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `THC Number is ${this.thcTableForm.get("tripId").value}`,
          showConfirmButton: true,
        });
        const reqArrivalDeparture={
          action:"TripArrivalDepartureUpdateFTL",
          reqBody:{
            cid:this.companyCode,
            EventType:'A',
            loc:localStorage.getItem("Branch") || "",
            tripId:this.thcTableForm.get("tripId").value
          }
        }
        this.hawkeyeUtilityService.pushToCTCommon(reqArrivalDeparture);
        this.goBack("THC");
      }
    } else {
      //this.thcTableForm.get("docket").setValue(docket.map(x => x.docketNumber));

      if (this.prqFlag || this.directPrq) {
        if (this.thcTableForm.get("prqNo").value) {
          const prqData = { prqNo: this.thcTableForm.get("prqNo").value };
          const update = {
            sTS: 7,
            sTSNM: 'THC Generated'
          }
          await this.consigmentUtility.updatePrq(prqData, update);
        }
      }

      // for (const element of docket) {
      //   await this.docketService.updateDocket(element.docketNumber, { "status": "1" });
      // }

      const tHCGenerationRequst = await this.GenerateTHCgenerationRequestBody();
      if (tHCGenerationRequst) {
        const resThc = await this.thcService.newsthcGeneration(tHCGenerationRequst);
        // this.docketService.updateSelectedData(this.selectedData, resThc.data?.mainData?.ops[0].docNo)
        if (resThc) {
          if(!isMarket && resThc.data?.mainData?.ops[0]?.docNo!=""){
            await Swal.fire({
              icon: "question",
              title: "Tracking",
              text: `Do you want vehicle tracking?`,
              confirmButtonText: "Yes, track it!",
              showConfirmButton: true,
              showCancelButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                
                const req={
                  action:"PushTripFTL",
                  reqBody:{
                    companyCode: this.companyCode,
                    branch:localStorage.getItem("Branch") || "",
                    tripId:resThc.data?.mainData?.ops[0]?.docNo,
                    vehicleNo:resThc.data?.mainData?.ops[0]?.vEHNO
                  }
                };
                this.hawkeyeUtilityService.pushToCTCommon(req);
                this.goBack('THC');
      
                // const dialogref = this.dialog.open(THCTrackingComponent, {
                //   width: "100vw",
                //   height: "100vw",
                //   maxWidth: "232vw",
                //   data: vehicleDet[0],
                // });
                // dialogref.afterClosed().subscribe((result) => {
                //   if(result && result!=""){
                //     if(result?.gpsDeviceEnabled ==true && result?.gpsDeviceId!=""){
                //       const req={
                //         companyCode: this.companyCode,
                //         branch:localStorage.getItem("Branch") || "",
                //         tripId:"TH/DELB/2425/000046",
                //         vehicleNo:result.vehicleNo
                //       }
                //       this.departureService.pushTripToCT(req);
                //       this.goBack('Departures');
                //     }
                //     else{
                //       this.goBack('Departures');
                //     }
                //   }
                // });
              }
              else
              {
                this.goBack('THC');
              }
            });
          }
          Swal.fire({
            icon: "success",
            title: "THC Generated Successfully",
            text: `THC Number is ${resThc.data?.mainData?.ops[0].docNo}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.goBack("THC");
            }
          });
        }
      }
    }
    /*End*/
  }
  /*End*/
}
