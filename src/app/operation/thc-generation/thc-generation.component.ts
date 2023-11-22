import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { thcControl } from "src/assets/FormControls/thc-generation";
import { calculateTotal, vendorTypeList } from "./thc-utlity";
import { Router } from "@angular/router";
import { calculateTotalField } from "../unbilled-prq/unbilled-utlity";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getLocationApiDetail } from "src/app/finance/invoice-summary-bill/invoice-utility";
import { ConsigmentUtility } from "../../Utility/module/operation/docket/consigment-utlity.module";
import { showConfirmationDialogThc } from "../thc-summary/thc-update-utlity";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { MatDialog } from "@angular/material/dialog";
import { ThcUpdateComponent } from "src/app/dashboard/tabs/thc-update/thc-update.component";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { formatDate } from "src/app/Utility/date/date-utils";
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
import { VehicleService } from "src/app/Utility/module/masters/vehicle-master/vehicle-master-service";
import { MarkerVehicleService } from "src/app/Utility/module/operation/market-vehicle/marker-vehicle.service";
import { ThcService } from "src/app/Utility/module/operation/thc/thc.service";
import { StorageService } from "src/app/core/service/storage.service";
import { ShipmentEditComponent } from "../shipment-edit/shipment-edit.component";

@Component({
  selector: "app-thc-generation",
  templateUrl: "./thc-generation.component.html",
})
export class ThcGenerationComponent implements OnInit {
  //FormGrop
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
      Style: "max-width:100px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    docketNumber: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "min-width:160px",
    },
    totWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    noOfPkg: {
      Title: "No of Packets ",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    pod: {
      Title: "Pod",
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
    "billingParty",
    "noOfPkg",
    "docketNumber",
    "fromCity",
    "toCity",
    "totWeight"
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
    private storage: StorageService
  ) {
    /* here the code which is used to bind data for add thc edit thc add thc based on
     docket or prq based on that we can declare condition*/

    this.orgBranch = storage.branch;
    this.branchCode = storage.branch;

    let navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;

    if (navigationState) {

      this.viewType = navigationState.viewType?.toLowerCase() || '';

      switch (this.viewType) {
        case 'update':
        case 'view':
          this.disbleCheckbox = true;
          this.thcDetail = navigationState.data;
          this.staticField.push('pod', 'receiveBy', 'arrivalTime', 'remarks');
          if (this.viewType === 'view') {
            this.isView = true;
            this.isSubmit = true;
            delete this.columnHeader.actionsItems;
          }
          else {
            this.isSubmit = true;
            this.isUpdate = true;
          }
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
      this.menuItems[0].label = "Edit"
      this.getShipmentDetail();
    }
  }

  async getShipmentDetail() {

    if (!this.isUpdate && !this.isView) {
      const shipmentList = await this.thcService.getShipment(false);
      const branchWise = shipmentList.filter((x) => x.origin === this.orgBranch);
      let nestedDetail = await this.thcService.getNestedDockDetail(branchWise, this.isUpdate)
      this.allShipment = nestedDetail;
      if (this.addThc) {

        this.tableData = nestedDetail
        //  branchWise.map((x) => {
        //   const actualWeights = [x].map((item) => {
        //     return item ? calculateTotalField(item.invoiceDetails, "actualWeight") : 0;
        //   });
        //   const noofPkts = [x].map((item) => {
        //     return item ? calculateTotalField(item.invoiceDetails, "noofPkts") : 0;
        //   });
        //   // Sum all the calculated actualWeights
        //   const totalActualWeight = actualWeights.reduce(
        //     (acc, weight) => acc + weight,
        //     0
        //   );
        //   // Sum all the calculated actualWeights
        //   const totalnoofPkts = noofPkts.reduce(
        //     (acc, noofPkts) => acc + noofPkts,
        //     0
        //   );

        //   x.actualWeight = totalActualWeight;
        //   x.noofPkts = totalnoofPkts
        //   return x; // Make sure to return x to update the original object in the 'tableData' array.
        // });
        // //this.tableData= this.allShipment 
        this.tableLoad = false;
      }
    }
  }

  ngOnInit(): void {
    this.IntializeFormControl();
    this.getDropDownDetail();
    this.backPath = "/dashboard/Index?tab=6";
  }

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

    if (this.addThc) {
      this.jsonControlDocketArray = this.filterFormControls(thcFormControls, "shipment_detail");
    }

    this.jsonControlArray = [
      ...this.jsonControlBasicArray,
      ...this.jsonControlVehLoadArray,
      ...this.jsonControlDriverArray,
    ];

    if (this.addThc) {
      this.jsonControlArray.push(...this.jsonControlDocketArray);
    }

    this.setupControlProperties("vehicleName", "vehicleStatus", "vehicle");
    this.setupControlProperties("vendorName", "vendorNameStatus", "vendorName");
    this.setupControlProperties("prqName", "prqNoStatus", "prqNo");
    this.setupControlProperties("advanceName", "advanceStatus", "advPdAt");
    this.setupControlProperties("balanceName", "balanceStatus", "balAmtAt");
    //this.setupControlProperties("unloadName", "unloadStatus", "closingBranch");
    this.setupControlProperties("fromCity", "fromCityStatus", "fromCity");
    this.setupControlProperties("toCity", "toCityStatus", "toCity");

    this.thcTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.marketVehicleTableForm = formGroupBuilder(this.fb, [this.jsonMarketVehicle]);
  }

  filterFormControls(formControls, metaData) {
    return formControls.filter((x) => x.additionalData && x.additionalData.metaData === metaData);
  }

  setupControlProperties(controlName, statusName, fieldName) {
    this[controlName] = this.jsonControlArray.find((data) => data.name === fieldName)?.name;
    this[statusName] = this.jsonControlArray.find((data) => data.name === fieldName)?.additionalData.showNameAndValue;
  }

  async functionCallHandler($event) {
    const field = $event.field; //what is use of this variable
    const functionName = $event.functionName;

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async getDropDownDetail() {

    const locationList = await getLocationApiDetail(this.masterService);

    this.prqlist = await this.thcService.prqDetail(true, { prqBranch: this.storage.branch });
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

  async bindPrqData() {
    debugger
    if (this.thcTableForm.controls["prqNo"].value.value) {
      const vehicleDetail = await this.vehicleStatusService.vehiclList(this.prqDetail?.prqNo);

      const fromToCityParts = (this.prqDetail?.fromToCity || '').split('-');

      const validTransModes = ['truck', 'trailer'];
      const transMode = validTransModes.includes(this.prqDetail?.transMode) ? 'Road' : '';
      const jsonData = {
        vehicle: { name: this.prqDetail?.vehicleNo, value: this.prqDetail?.vehicleNo },
        vendorType: vehicleDetail?.vendorType || "",
        vendorName: { name: vehicleDetail?.vendor || '', value: vehicleDetail?.vendor || '' },
        transMode: transMode,
        route: this.prqDetail?.fromToCity || '',
        fromCity: { name: fromToCityParts[0], value: fromToCityParts[0] },
        toCity: { name: fromToCityParts[1], value: fromToCityParts[1] },
        capacity: this.prqDetail?.vehicleSize || this.prqDetail?.containerSize || '',
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

      if (vehicleDetail?.vendorType == "Market") {
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
        }
      }
    }
    if (!this.isView) {
      this.vendorFieldChanged();
    }

  }
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
      const prqData = await this.thcService.prqDetail(false);
      this.prqDetail = prqData.find((x) => {
        const prqNoWithoutSpaces = x.prqNo.replace(/\s/g, '');
        const prqNoWithoutSpacesAndNonAlphanumeric = prqNoWithoutSpaces.replace(/[^a-zA-Z0-9]/g, '');

        return prqNoWithoutSpacesAndNonAlphanumeric === prq;
      });
      const prqDataDetails = this.prqDetail;
      this.bindPrqData();
    }
    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    // Set the delay duration in milliseconds (e.g., 2000 milliseconds for 2 seconds)
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    // Now, update the tableData and set tableLoad to false
    this.tableLoad = false;
    const shipment = this.prqFlag ? this.allShipment.filter((x) => x.prqNo === prqNo) : this.allShipment
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
    // Assuming event is an array of objects
    // Sum all the calculated actualWeights
    const totalActualWeight = event.reduce((acc, weight) => acc + weight.totWeight, 0);
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
          const { shipment, remarks, podUpload, arrivalTime,receivedBy } = result;
          this.tableData.forEach((x) => {
            if (x.docketNumber === shipment) {
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
            if (x.docketNumber === shipment) {
              x.totWeight = actualWeight || 0;
              x.noOfPkg = noofPkts || 0;
              x.isSelected = false
            }
          });
        }

      });
    }
  }
  async createThc() {
    
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

    const docket = selectedDkt.map(({ docketNumber, remarks, pod, arrivalTime,receiveBy }) => ({ docketNumber, remarks, pod, arrivalTime,receiveBy }));
    const formControlNames = [
      "prqNo",
      "advPdAt",
      "balAmtAt",
      "fromCity",
      "toCity",
      "vehicle",
      "vendorName",
      "vendorType"
    ];

    formControlNames.forEach(controlName => {
      const controlValue = this.thcTableForm.get(controlName).value?.value || this.thcTableForm.get(controlName).value;
      this.thcTableForm.get(controlName).setValue(controlValue);
    });

    const vendorType = this.thcTableForm.get('vendorType').value;
    const isMarket = vendorType === 'Market';
    this.thcTableForm.get('vendorCode').setValue(isMarket ? "8888" : this.thcTableForm.get('vendorName').value?.value || "");

    if (isMarket) {
      const vehicleData = {
        vID: this.thcTableForm.value.vehicle,
        vndNM: this.thcTableForm.value.vendorName,
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
      for (const element of docket) {
        await this.docketService.updateDocket(element.docketNumber, { "status": "2" });
      }
      debugger
      const podDetails = typeof (docket) == "object" ? docket : ""
      this.thcTableForm.removeControl("docket");
      this.thcTableForm.get("podDetail").setValue(podDetails);
      this.thcTableForm.get("status").setValue("2");
      const res = await showConfirmationDialogThc(this.thcTableForm.value, this.operationService);

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
      this.thcTableForm.get("docket").setValue(docket.map(x => x.docketNumber));

      if (this.prqFlag) {
        const prqData = { prqNo: this.thcTableForm.get("prqNo").value };
        await this.consigmentUtility.updatePrq(prqData, "7");
      }

      for (const element of docket) {
        await this.docketService.updateDocket(element.docketNumber, { "status": "1" });
      }

      const thcTableFormValue = this.thcTableForm.value;

      // if (isMarket || !this.prqFlag) {
      //   const vendorName = this.thcTableForm.get('vendorName').value || "";
      //   const vehicleNoValue = this.thcTableForm.get('vehicle').value || "";
      //   const _id = `${vendorName.substring(0, 3)}-${vehicleNoValue}`;
      //   this.marketVehicleTableForm.get('vehNo').setValue(vehicleNoValue);
      //   this.marketVehicleTableForm.get('vendor').setValue(vendorName);
      //   this.marketVehicleTableForm.get('_id').setValue(_id);
      //   //await this.vehicleService.addMarketVehicle(this.marketVehicleTableForm.value);
      // }

      const resThc = await this.thcService.thcGeneration(thcTableFormValue);
      this.docketService.updateSelectedData(this.selectedData, resThc.data.ops[0].tripId)
      if (resThc) {
        Swal.fire({
          icon: "success",
          title: "THC Generated Successfully",
          text: `THC Number is ${resThc.data.ops[0].tripId}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack("THC");
          }
        });
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
    const vendorType = vendorTypeList.find((x) => x.value.toLowerCase() == vehDetail.vendorType.toLowerCase());
    this.thcTableForm.controls['vendorType'].setValue(vendorType?.value);
    if (vehDetail.value) {
      const filteredShipments = this.allShipment.filter((x) => x.vehicleNo == vehDetail.value && (x.orgTotWeight != "0" || x.orgNoOfPkg != "0"));
      this.tableData = filteredShipments.map((x) => {
        x.actions = ["Edit"]
        return x; // Make sure to return x to update the original object in the 'tableData' array.
      });
    }
    // this.thcTableForm.controls['vehicle'].setValue();

  }
  /*End*/
  vendorFieldChanged() {
    const vendorType = this.thcTableForm.value.vendorType;
    this.jsonControlArray.forEach((x) => {
      if (x.name === "vendorName") {
        x.type = vendorType === "Market" ? "text" : "dropdown";
      }
      if (x.name === "vehicle") {
        x.type = vendorType === "Market" ? "text" : "dropdown";
      }
    });
    if (vendorType !== 'Market') {
      const vendorDetail = this.vendorDetail.filter((x) => x.type.toLowerCase() == vendorType.toLowerCase());
      this.filter.Filter(
        this.jsonControlArray,
        this.thcTableForm,
        vendorDetail,
        this.vendorName,
        this.vendorNameStatus
      );

    }
    else {

      this.marketVendor = true
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
      console.log(this.allShipment)

      debugger
      const filteredShipments = this.allShipment.filter((x) =>
        (x.fromCity.toLowerCase() === fromCity.toLowerCase() &&
          x.toCity.toLowerCase() === toCity.toLowerCase()) && (x.orgTotWeight != "0" || x.orgNoOfPkg != "0" || x.vehicleNo == this.thcTableForm.controls['vehicle'].value.value)
      );
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

    const thcDetail = await this.thcService.getThcDetails(this.thcDetail.tripId);
    const thcNestedDetails = thcDetail.data;
    let propertiesToSet = [
      "route",
      "tripDate",
      "vendorType",
      "tripId",
      "capacity",
      "loadedKg",
      "weightUtilization",
      "driverName",
      "driverMno",
      "driverLno",
      "driverLexd",
      "contAmt",
      "advAmt",
      "balAmt",
      "advPdAt",
      "balAmtAt",
      "status",
      "vendorType",
      "panNo",
      "transMode"
    ];
    if (this.prqFlag) {
      propertiesToSet = propertiesToSet.filter((x) => x !== "tripId");
    }
    propertiesToSet.forEach((property) => {
      this.thcTableForm.controls[property].setValue(
        thcNestedDetails.thcDetails?.[property] || ""
      );

    });

    if (thcNestedDetails.thcDetails.prqNo) {
      const prqNo = {
        name: thcNestedDetails.thcDetails?.prqNo || "",
        value: thcNestedDetails.thcDetails?.prqNo || "",
      };
      this.thcTableForm.controls['prqNo'].setValue(prqNo);
    }
    const location = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.advPdAt);
    const balAmtAt = this.locationData.find((x) => x.value === thcNestedDetails.thcDetails?.balAmtAt);
    //  const closingBranch = this.locationData.find((x) => x.value === this.thcDetail?.closingBranch);
    this.thcTableForm.controls["advPdAt"].setValue(location);
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    //this.thcTableForm.controls["closingBranch"].setValue(closingBranch);    
    this.thcTableForm.controls["fromCity"].setValue({ name: thcNestedDetails?.thcDetails.fromCity || "", value: thcNestedDetails?.thcDetails.fromCity || "" });
    this.thcTableForm.controls["toCity"].setValue({ name: thcNestedDetails?.thcDetails.toCity || "", value: thcNestedDetails?.thcDetails.toCity || "" });
    this.thcTableForm.controls["vehicle"].setValue({ name: thcNestedDetails?.thcDetails.vehicle, value: thcNestedDetails?.thcDetails.vehicle });
    this.thcTableForm.controls["vendorName"].setValue({ name: thcNestedDetails?.thcDetails.vendorName, value: thcNestedDetails?.thcDetails.vendorName });
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

}
