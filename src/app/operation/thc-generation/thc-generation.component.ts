import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
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
import { AddFleetMasterComponent } from "src/app/Masters/fleet-master/add-fleet-master/add-fleet-master.component";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ShipmentEditComponent } from "../shipment-edit/shipment-edit.component";
import { ARr, CAp, DPt, LOad, MfdetailsList, MfheaderDetails, THCGenerationModel, ThcmovementDetails, UNload, UTi, thcsummaryData } from '../../Models/THC/THCModel';
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { PrqService } from "src/app/Utility/module/operation/prq/prq.service";
import moment from "moment";
import { filter } from 'rxjs/operators';

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

  // End Code Of Harikesh
  //FormGrop
  thcDetailGlobal: any;
  companyCode = localStorage.getItem("companyCode");
  thcTableForm: UntypedFormGroup;
  marketVehicleTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tableData: any;
  tableLoad: boolean;
  backPath: string;
  thcLoad: boolean = true;
  isSubmit: boolean = false;
  disbleCheckbox: boolean;

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
  selectedData: any;
  menuItems = [{ label: "Update" }];
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
  jsonMarketVehicle: any;
  viewType: string = '';
  vendorTypes: AutoComplete[];
  products: AutoComplete[];
  directPrq: boolean;
  DocketsContainersWise: boolean = false;
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
    private prqService: PrqService
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
          delete this.columnHeader.actionsItems;
          break;
        case 'update':
          this.thcDetail = navigationState.data;
          this.staticField.push('cNO', 'receiveBy', 'arrivalTime', 'remarks');
          this.isSubmit = true;
          this.isUpdate = true;
          this.isArrivedInfo = true
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

    this.jsonMarketVehicle = loadingControlForm.getMarketVehicle();
    const thcFormControls = loadingControlForm.getThcFormControls();

    this.jsonControlBasicArray = this.filterFormControls(thcFormControls, "Basic");
    this.jsonControlVehLoadArray = this.filterFormControls(thcFormControls, "vehLoad");
    this.jsonControlDriverArray = this.filterFormControls(thcFormControls, "driver");
    if (this.isArrivedInfo) {
      this.jsonControlArrivalArray = this.filterFormControls(thcFormControls, "ArrivalInfo");
    }


    if (this.addThc) {
      this.jsonControlDocketArray = this.filterFormControls(thcFormControls, "shipment_detail");
    }

    this.jsonControlArray = [
      ...this.jsonControlBasicArray,
      ...this.jsonControlVehLoadArray,
      ...this.jsonControlDriverArray,
      ...(this.isArrivedInfo ? this.jsonControlArrivalArray : []),
    ];


    if (this.addThc) {
      this.jsonControlArray.push(...this.jsonControlDocketArray);
    }
    this.setupControlProperties("vehicleName", "vehicleStatus", "vehicle");
    this.setupControlProperties("vendorName", "vendorNameStatus", "vendorName");
    this.setupControlProperties("prqName", "prqNoStatus", "prqNo");
    this.setupControlProperties("advanceName", "advanceStatus", "advPdAt");
    this.setupControlProperties("balanceName", "balanceStatus", "balAmtAt");
    this.setupControlProperties("fromCity", "fromCityStatus", "fromCity");
    this.setupControlProperties("toCity", "toCityStatus", "toCity");
    this.thcTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.marketVehicleTableForm = formGroupBuilder(this.fb, [this.jsonMarketVehicle]);
    this.getGeneralMasterData();
    this.getDropDownDetail();
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
  setupControlProperties(controlName, statusName, fieldName) {
    this[controlName] = this.jsonControlArray.find((data) => data.name === fieldName)?.name;
    this[statusName] = this.jsonControlArray.find((data) => data.name === fieldName)?.additionalData.showNameAndValue;
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
    this.vendorTypes = await this.generalService.getGeneralMasterData("VENDTYPE");
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
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

    this.prqlist = await this.thcService.prqDetail(true, { bRCD: this.storage.branch, sTS: 3 });
    this.locationData = locationList.map((x) => ({
      value: x.locCode,
      name: x.locName,
    }));

    const filterFields = [
      { name: this.prqName, data: this.prqlist, status: this.prqNoStatus },
      { name: this.advanceName, data: this.locationData, status: this.advanceStatus },
      { name: this.balanceName, data: this.locationData, status: this.balanceStatus },
      //  { name: this.unloadName, data: this.locationData, status: this.unloadStatus },
    ];

    filterFields.forEach(({ name, data, status }) => {
      this.filter.Filter(this.jsonControlArray, this.thcTableForm, data, name, status);
    });
    const vendorDetail = await getVendorDetails(this.masterService);
    this.vendorDetail = vendorDetail;
    if (this.isUpdate || this.isView) {
      this.autoFillThc();
    } else {

      const vehiclesNo = await getVehicleStatusFromApi(this.companyCode, this.operationService);
      this.vehicleList = vehiclesNo.map(({ vehNo, driver, dMobNo, vMobNo, vendor, vendorType, capacity }) => ({
        name: vehNo,
        value: vehNo,
        driver,
        dMobNo,
        vMobNo,
        vendor,
        vendorType,
        capacity,
      }));

      const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode });
      const city = {
        name: destinationMapping[0].city,
        value: destinationMapping[0].city,
      };

      this.thcTableForm.controls['fromCity'].setValue(city);

      const filterFieldsForVehicle = [
        { name: this.vehicleName, data: this.vehicleList, status: this.vehicleStatus },
        { name: this.vendorName, data: vendorDetail, status: this.vehicleStatus },
      ];

      filterFieldsForVehicle.forEach(({ name, data, status }) => {
        this.filter.Filter(this.jsonControlArray, this.thcTableForm, data, name, status);
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
      const transMode = validTransModes.includes(this.prqDetail?.carrierType) ? 'P1' : '';
      const jsonData = {
        vehicle: { name: this.prqDetail?.vEHNO, value: this.prqDetail?.vEHNO },
        vendorType: `${this.prqDetail?.vENDTY}` || "",
        vendorName: { name: this.prqDetail?.vNDNM || '', value: this.prqDetail?.vNDCD || '' },
        transMode: transMode,
        route: this.prqDetail?.fromToCity || '',
        fromCity: { name: fromToCityParts[0], value: fromToCityParts[0] },
        toCity: { name: fromToCityParts[1], value: fromToCityParts[1] },
        capacity: this.prqDetail?.size || 0,
        driverName: vehicleDetail?.driver || '',
        driverMno: vehicleDetail?.dMobNo || '',
        driverLno: vehicleDetail?.lcNo || '',
        driverLexd: vehicleDetail?.lcExpireDate || '',
        panNo: vehicleDetail?.driverPan || '',
        insuranceExpiryDate: new Date(),
        fitnessValidityDate: new Date(),
      };
      // Loop through the jsonData object and set the values in the form controls
      for (const controlName in jsonData) {
        if (jsonData.hasOwnProperty(controlName)) {
          this.thcTableForm.controls[controlName].setValue(jsonData[controlName]);
        }
      }
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
            vehNo: this.prqDetail?.vehicleNo || '',
            vendor: vehData.vndNM || '',
            vMobileNo: vehData.vndPH || '',
            driver: vehData.drvNM || '',
            driverPan: vehData.pANNO || '',
            lcNo: vehData.dLNO || '',
            lcExpireDate: vehData.dLEXP || new Date(),
            dmobileNo: vehData.drvPH || '',
            insuranceExpiryDate: vehData.iNCEXP || new Date(),
            fitnessValidityDate: vehData.fITDT || new Date(),
          };

          for (const controlName in vehJson) {
            if (vehJson.hasOwnProperty(controlName)) {
              const control = this.marketVehicleTableForm.get(controlName);
              if (control) {
                control.setValue(vehJson[controlName]);
              }
              // const thcControl = this.thcTableForm.get(controlName);
              // if (thcControl) {
              //   thcControl.setValue(jsonData[controlName]);
              // }
            }
          }
          this.thcTableForm.controls['vendorName'].setValue({ name: this.prqDetail?.vNDNM, value: this.prqDetail?.vNDNM })
        }
      }
    }

    if (!this.isView && !this.isUpdate) {
      this.vendorFieldChanged();
    }

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
          insuranceExpiryDate: new Date(),
          fitnessValidityDate: new Date(),
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

    const shipment = await this.thcService.getShipmentFiltered(this.orgBranch, prqNo);

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
  }
  async createThc() {

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
    if (selectedDkt.length === 0 && !this.isUpdate) {
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

    const docket = selectedDkt.map(({ docNo, cNO, remarks, pod, arrivalTime, receiveBy, aCTWT, pKGS }) => ({ docNo, cNO, remarks, pod, arrivalTime, receiveBy, aCTWT, pKGS }));
    const formControlNames = [
      "prqNo",
      "advPdAt",
      "balAmtAt",
      "fromCity",
      "toCity",
      "vehicle",
      "vendorType"
    ];

    formControlNames.forEach(controlName => {
      const controlValue = this.thcTableForm.get(controlName).value?.value || this.thcTableForm.get(controlName).value;
      this.thcTableForm.get(controlName).setValue(controlValue);
    });

    const vendorType = this.thcTableForm.get('vendorType').value;
    const isMarket = vendorType === "4";
    this.thcTableForm.get('vendorCode').setValue(isMarket ? "8888" : this.thcTableForm.get('vendorName').value?.value || "");

    if (isMarket) {
      const vehicleData = {
        vID: this.thcTableForm.value.vehicle,
        vndNM: this.thcTableForm.value.vendorName?.name || "",
        vndPH: this.marketVehicleTableForm.value.vMobileNo,
        pANNO: this.marketVehicleTableForm.value.driverPan,
        wTCAP: this.marketVehicleTableForm.value.vehicleSize,
        drvNM: this.marketVehicleTableForm.value.driver,
        drvPH: this.marketVehicleTableForm.value.dmobileNo,
        dLNO: this.marketVehicleTableForm.value.lcNo,
        dLEXP: this.marketVehicleTableForm.value.lcExpireDate,
        iNCEXP: this.marketVehicleTableForm.value.insuranceExpiryDate || new Date(),
        fITDT: this.marketVehicleTableForm.value.fitnessValidityDate || new Date()
      };

      this.thcTableForm.get('insuranceExpiryDate').setValue(this.marketVehicleTableForm.value?.insuranceExpiryDate || new Date());
      this.thcTableForm.get('fitnessValidityDate').setValue(this.marketVehicleTableForm.value?.fitnessValidityDate || new Date());

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
        "oPSSTNM": "Delivered",
        "aRR": newARR,
      };

      const res = await showConfirmationDialogThc(requestBody, this.thcTableForm.get("tripId").value, this.operationService, podDetails, this.thcTableForm.get("vehicle").value);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `THC Number is ${this.thcTableForm.get("tripId").value}`,
          showConfirmButton: true,
        });
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

        this.docketService.updateSelectedData(this.selectedData, resThc.data?.mainData?.ops[0].docNo)
        if (resThc) {
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
  }
  // Helper function to check for blank fields
  hasBlankFields() {
    const fieldMap = {
      remarks: 'Remarks',
      pod: 'POD Upload',
      arrivalTime: 'Arrival Time',
    };

    return Object.keys(fieldMap).some(fieldName => this.tableData.some(item => !item[fieldName]));
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
    const form = this.thcTableForm;
    const control1 = "contAmt";
    const control2 = "advAmt";
    const resultControl = "balAmt";
    const advAmt = parseInt(this.thcTableForm.value.advAmt)
    const contAmt = parseInt(this.thcTableForm.value.contAmt)
    if (advAmt > contAmt) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Advance amount cannot be greater than contract amount'
      });
      this.thcTableForm.controls['contAmt'].setValue(0);
      this.thcTableForm.controls['balAmt'].setValue(0);
      return false
    }
    else {
      calculateTotal(form, control1, control2, resultControl);
    }
  }
  /*here get vehicle detail function if it is not market*/
  async getVehicleDetail() {
    const controlNames = ['driverName', 'driverMno', 'panNo', 'driverLexd', 'driverLno', 'capacity'];
    controlNames.forEach(controlName => {
      this.thcTableForm.controls[controlName].setValue('');
    });
    const vehDetail: Vehicle = this.thcTableForm.controls['vehicle'].value
    const vendorName = this.vendorDetail.find((x) => x.name.toUpperCase() === vehDetail.vendor.toUpperCase())
    this.thcTableForm.controls['vendorName'].setValue(vendorName);
    const vendorDetail: VendorDetail[] = await this.vendorService.getVendorDetail({ vendorName: vendorName.name.toUpperCase() });
    const driverDetail: DriverMaster[] = await this.driverService.getDriverDetail({ vehicleNo: vehDetail.value });
    this.thcTableForm.controls['driverName'].setValue(driverDetail[0].driverName);
    this.thcTableForm.controls['driverMno'].setValue(driverDetail[0].telno);
    this.thcTableForm.controls['panNo'].setValue(vendorDetail[0].panNo);
    this.thcTableForm.controls['driverLexd'].setValue(driverDetail[0].valdityDt);
    this.thcTableForm.controls['driverLno'].setValue(driverDetail[0].licenseNo);
    this.thcTableForm.controls['capacity'].setValue(vehDetail.capacity);
    // if (vehDetail.value) {
    //   const filteredShipments = this.allShipment.filter((x) => x.vehicleNo == vehDetail.value && (x.orgTotWeight != "0" || x.orgNoOfPkg != "0"));
    //   this.tableData = filteredShipments.map((x) => {
    //     x.actions = ["Edit"]
    //     return x; // Make sure to return x to update the original object in the 'tableData' array.
    //   });
    // }
    // this.thcTableForm.controls['vehicle'].setValue();

  }
  /*End*/
  vendorFieldChanged() {
    const vendorType = this.thcTableForm.value.vendorType;
    this.jsonControlArray.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
      if (x.name === "vehicle") {
        x.type = vendorType === "4" ? "text" : "dropdown";
      }
    });
    if (!this.prqFlag && !this.directPrq) {
      this.thcTableForm.controls['vendorName'].setValue("");
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

    }
    else {
      if (!this.prqFlag) {
        this.marketVendor = true;
      }
    }
  }
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
      this.allShipment = await this.thcService.getShipmentFiltered(this.orgBranch, "", fromCity.toUpperCase(), toCity.toUpperCase(), this.DocketsContainersWise);
      const filteredShipments = this.allShipment; //this.allShipment.filter((x) => ((x.fCT.toLowerCase() === fromCity.toLowerCase() && x.tCT.toLowerCase() === toCity.toLowerCase()))//|| (x.vEHNO == this.thcTableForm.controls['vehicle'].value.value));
      const addEditAction = (shipments) => {
        return shipments.map((shipment) => {
          return { ...shipment, actions: ["Edit"] };
        });
      };
      this.tableData = addEditAction(filteredShipments);
    }
  }
  /*below function call when user will try to view or
   edit Thc the function are create for autofill the value*/
  async autoFillThc() {
    const thcDetail = await this.thcService.getThcDetails(this.thcDetail.docNo);
    const thcMovemnetDetails = await this.thcService.getThcMovemnetDetails(this.thcDetail.docNo);
    const thcNestedDetails = thcDetail.data;
    this.thcDetailGlobal = thcNestedDetails;
    let propertiesToSet = [

      { Key: 'route', Name: 'rUTNM' },
      { Key: 'tripDate', Name: 'eNTDT' },
      { Key: 'tripId', Name: 'docNo' },
      { Key: 'capacity', Name: 'cAP.wT' },
      { Key: 'weightUtilization', Name: 'uTI.wT' },
      { Key: 'driverName', Name: 'dRV.nM' },
      { Key: 'driverMno', Name: 'dRV.mNO' },
      { Key: 'driverLno', Name: 'dRV.lNO' },
      { Key: 'driverLexd', Name: 'dRV.lEDT' },
      { Key: 'advPdAt', Name: 'aDPAYAT' },
      { Key: 'balAmtAt', Name: 'bLPAYAT' },
      { Key: 'status', Name: 'oPSST' },
      { Key: 'panNo', Name: 'vND.pAN' },
      { Key: 'transMode', Name: 'tMODE' }
    ];

    propertiesToSet.forEach((property) => {
      // Split the nested property by dots and access the nested values
      const nestedValues = property.Name.split('.').reduce((obj, key) => obj[key], thcNestedDetails.thcDetails);

      // Set the value in the form control
      this.thcTableForm.controls[property.Key].setValue(
        nestedValues || ""
      );
    });

    this.thcTableForm.controls.loadedKg.setValue(thcMovemnetDetails.data?.[0]?.lOAD?.wT || "");

    if (thcNestedDetails.thcDetails.pRQNO) {
      const prqNo = {
        name: thcNestedDetails.thcDetails?.pRQNO || "",
        value: thcNestedDetails.thcDetails?.pRQNO || "",
      };
      this.thcTableForm.controls['prqNo'].setValue(prqNo);
    }
    const location = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.aDPAYAT);
    const balAmtAt = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.bLPAYAT);
    //  const closingBranch = this.locationData.find((x) => x.value === this.thcDetail?.closingBranch);
    this.thcTableForm.controls["advPdAt"].setValue(location);
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    this.thcTableForm.controls["tripDate"].disable();
    this.thcTableForm.controls["contAmt"].setValue(thcNestedDetails?.thcDetails.cONTAMT || 0);
    this.thcTableForm.controls["advAmt"].setValue(thcNestedDetails?.thcDetails.aDVAMT || 0);
    this.thcTableForm.controls["balAmt"].setValue(thcNestedDetails?.thcDetails.bALAMT || 0);
    //this.thcTableForm.controls["closingBranch"].setValue(closingBranch);    
    this.thcTableForm.controls["fromCity"].setValue({ name: thcNestedDetails?.thcDetails.fCT || "", value: thcNestedDetails?.thcDetails.fCT || "" });
    this.thcTableForm.controls["toCity"].setValue({ name: thcNestedDetails?.thcDetails.tCT || "", value: thcNestedDetails?.thcDetails.tCT || "" });
    this.thcTableForm.controls["vehicle"].setValue({ name: thcNestedDetails?.thcDetails.vEHNO, value: thcNestedDetails?.thcDetails.vEHNO });
    this.thcTableForm.controls["vendorName"].setValue({ name: thcNestedDetails?.thcDetails.vND?.nM, value: thcNestedDetails?.thcDetails.vND?.nM });
    this.thcTableForm.controls["driverLexd"].disable();
    this.thcTableForm.controls["vendorType"].setValue(`${thcNestedDetails?.thcDetails.vND?.tY}`);
    this.thcTableForm.controls["containerwise"].setValue(thcNestedDetails.shipment?.[0].cNO ? true : false);
    if (this.addThc) {
      this.thcTableForm.controls['billingParty'].setValue(this.thcDetail?.billingParty);
      this.thcTableForm.controls['docketNumber'].setValue(this.thcDetail?.docketNumber);
    }
    if (this.isView || this.isUpdate) {
      this.tableData = thcNestedDetails.shipment.map((x) => {
        x.isSelected = true;
        if (this.isView) {

        }
        else {
          x.actions = ["Update"];
        }

        return x; // Make sure to return x to update the original object in the 'tableData' array.
      });
    }
    // this.getShipmentDetails();
  }
  /*End*/
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
    this.thcTableForm.controls['vehicle'].setValue(vehicle);
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
    this.thcTableForm.controls['capacity'].setValue(this.marketVehicleTableForm.value.vehicleSize);
  }
  /*End*/
  autoFillDriverDetails() {
    this.thcTableForm.controls['driverName'].setValue(this.marketVehicleTableForm.value?.driver || "");
    this.thcTableForm.controls['driverMno'].setValue(this.marketVehicleTableForm.value?.dmobileNo || "");
    this.thcTableForm.controls['driverLno'].setValue(this.marketVehicleTableForm.value?.lcNo || "");
    this.thcTableForm.controls['driverLexd'].setValue(this.marketVehicleTableForm.value?.lcExpireDate || "");
    this.thcTableForm.controls['panNo'].setValue(this.marketVehicleTableForm.value?.driverPan || "");
  }
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
    this.thcsummaryData.closingBranch = this.thcTableForm.controls['closingBranch'].value || "";
    this.thcsummaryData.fromCity = this.thcTableForm.controls['fromCity'].value || "";
    this.thcsummaryData.toCity = this.thcTableForm.controls['toCity'].value || "";
    this.thcsummaryData.routecode = "9888";
    this.thcsummaryData.route = this.thcTableForm.controls['route'].value || "";
    this.thcsummaryData.vehicle = this.thcTableForm.controls['vehicle'].value || "";
    this.thcsummaryData.Vendor_type = VendorDetails.value || "";
    this.thcsummaryData.Vendor_typetName = VendorDetails.name || "";
    this.thcsummaryData.Vendor_Code = this.thcTableForm.controls['vendorCode'].value || "";
    this.thcsummaryData.Vendor_Name = this.thcTableForm.controls['vendorName'].value?.name || this.thcTableForm.controls['vendorName'].value;
    this.thcsummaryData.Vendor_pAN = this.thcTableForm.controls['panNo'].value || "";
    this.thcsummaryData.status = 1
    this.thcsummaryData.statusName = "Intransit";
    this.thcsummaryData.financialStatus = 0;
    this.thcsummaryData.financialStatusName = "";
    this.thcsummaryData.contAmt = this.thcTableForm.controls['contAmt'].value || 0;
    this.thcsummaryData.advAmt = this.thcTableForm.controls['advAmt'].value || 0;
    this.thcsummaryData.aDVPENAMT = this.thcsummaryData.advAmt;
    this.thcsummaryData.balAmt = this.thcTableForm.controls['balAmt'].value || 0;
    this.thcsummaryData.advPdAt = this.thcTableForm.controls['advPdAt'].value || this.storage.branch;
    this.thcsummaryData.balAmtAt = this.thcTableForm.controls['balAmtAt'].value || this.storage.branch;
    this.thcsummaryData.vouchersList = [];
    this.thcsummaryData.iSBILLED = false;
    this.thcsummaryData.bILLNO = "";
    this.thcsummaryData.Driver_name = this.thcTableForm.controls['driverName'].value || "";
    this.thcsummaryData.Driver_mobile = this.thcTableForm.controls['driverMno'].value || "";
    this.thcsummaryData.Driver_lc = this.thcTableForm.controls['driverLno'].value || "";
    this.thcsummaryData.Driver_exd = this.thcTableForm.controls['driverLexd'].value || undefined;
    this.thcsummaryData.Capacity_ActualWeight = this.thcTableForm.controls['capacity'].value || 0;
    this.thcsummaryData.Capacity_volume = 0;
    this.thcsummaryData.Capacity_volumetricWeight = 0;
    this.thcsummaryData.Utilization_ActualWeight = this.thcTableForm.controls['weightUtilization'].value;
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
    //this.thcsummaryData.mODDT = undefined;
    //this.thcsummaryData.mODLOC = undefined;
    //this.thcsummaryData.mODBY = undefined;

    //New Added By Harikesh
    this.thcsummaryData.tMODE = this.thcTableForm.controls['transMode']?.value || "";
    this.thcsummaryData.tMODENM = this.products.find(item => item.value == this.thcTableForm.controls['transMode']?.value)?.name || "";
    this.thcsummaryData.pRQNO = this.thcTableForm.controls['prqNo'].value || "";
    //#endregion

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
    this.CAp.wT = this.thcTableForm.controls['capacity'].value || 0;
    this.CAp.vOL = 0;
    this.CAp.vWT = 0;
    //#endregion

    //#region UTi
    this.UTi.wT = this.thcTableForm.controls['weightUtilization'].value || 0;
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
      mfdetailsList.cNID = res.cNO;
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


    this.tHCGenerationModel.data = this.thcsummaryData;
    this.tHCGenerationModel.mfdetailsList = this.mfdetailsList;
    this.tHCGenerationModel.mfheaderDetails = this.mfheaderDetails;
    this.tHCGenerationModel.thcmovementDetails = this.thcmovementDetails;
    console.log(this.tHCGenerationModel)
    return this.tHCGenerationModel;

  }
}
