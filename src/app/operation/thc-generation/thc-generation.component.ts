import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { thcControl } from "src/assets/FormControls/thc-generation";
import {
  calculateTotal,
  getShipment,
  prqDetail,
  thcGeneration,
  vendorTypeList,
} from "./thc-utlity";
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

@Component({
  selector: "app-thc-generation",
  templateUrl: "./thc-generation.component.html",
})
export class ThcGenerationComponent implements OnInit {
  //FormGrop
  companyCode = localStorage.getItem("companyCode");
  thcTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tableData: any;
  tableLoad: boolean;
  backPath: string;
  thcLoad: boolean = true;
  disbleCheckbox:boolean;
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
    actualWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    noofPkts: {
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
    "noofPkts",
    "docketNumber",
    "fromCity",
    "toCity",
    "actualWeight"
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
  orgBranch: string = localStorage.getItem("Branch");
  advanceName: any;
  advanceStatus: any;
  balanceName: any;
  balanceStatus: any;
  isUpdate: boolean;
  thcDetail: any;
  locationData: any;
  prqlist: any;
  isView: any;
  branchCode = localStorage.getItem("Branch");
  selectedData: any;
  menuItems = [{ label: "Update" }];
  menuItemflag: boolean = true;
  jsonControlBasicArray: any;
  jsonControlVehLoadArray: any;
  jsonControlDriverArray: any;
  docketDetail: ShipmentDetail;
  unloadName: any;
  unloadStatus: any;
  addThc: boolean;
  jsonControlDocketArray: any;
  vendorName: any;
  vendorNameStatus: any;
  vendorDetail: any;
  @ViewChild(AddFleetMasterComponent) addFleetMaster: AddFleetMasterComponent;
  fromCity: any;
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  vehicleList: Vehicle[];
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private operationService: OperationService,
    private masterService: MasterService,
    private route: Router,
    private docketService: DocketService,
    private vehicleStatusService: VehicleStatusService,
    public dialog: MatDialog,
    private vendorService: VendorService,
    private driverService: DriverService,
    private pinCodeService: PinCodeService,
    private locationService: LocationService,
    private consigmentUtility: ConsigmentUtility
  ) 
  {
    /* here the code which is used to bind data for add thc edit thc add thc based on
     docket or prq based on that we can declare condition*/

    let navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.isUpdate = navigationState.hasOwnProperty("isUpdate") ? true : false;
      this.isView = navigationState.hasOwnProperty("isView") ? true : false;
       /* if user going  to update Thc below condition is true */
      if (this.isUpdate) {
        this.disbleCheckbox=true;
        /*Bind the Thc detail and in Update thc time below some field was added in table for docket and upload Pod*/
        this.thcDetail = navigationState.data;
        const field =
          ["pod", "receiveBy", "arrivalTime", "remarks"]
        this.staticField.push(...field)
      } else if (this.isView) {
        this.disbleCheckbox=true;
        /*Bind the Thc detail and in View thc time below some field was added in table for docket and upload Pod*/
        const field =
          ["pod", "receiveBy", "arrivalTime", "remarks"]
        this.staticField.push(...field)
        delete this.columnHeader.actionsItems;
        this.thcDetail = navigationState.data;
      }
      else if (navigationState.hasOwnProperty('addThc')) {
        
       /*when user try to create multiple Thc based one docket  that time below code is use
       @addThc boolean which is use to help to verfied that the sholud be a create thc based on docket
       @docketDetail object which is used to help to bind the data from docket to thc
       */
        this.addThc = true;
        this.docketDetail = navigationState.data;
      }
      else {
        delete this.columnHeader.pod;
        delete this.columnHeader.receiveBy;
        delete this.columnHeader.actionsItems;
        delete this.columnHeader.arrivalTime;
        delete this.columnHeader.remarks;
        this.prqDetail = navigationState;
        this.prqFlag = true;
      }

    }
    else {
      delete this.columnHeader.pod;
      delete this.columnHeader.receiveBy;
      delete this.columnHeader.actionsItems;
      delete this.columnHeader.arrivalTime;
      delete this.columnHeader.remarks;
    }
    this.getShipmentDetail();
  }

  async getShipmentDetail() {
    const shipmentList = await getShipment(this.operationService, false);
    const branchWise = shipmentList.filter((x) => x.origin === this.orgBranch && x.status=='0');
    this.allShipment = shipmentList;
    if (this.addThc) {
      this.tableData = branchWise.map((x) => {
        const actualWeights = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "actualWeight")
            : 0;
        });
        const noofPkts = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "noofPkts")
            : 0;
        });
        // Sum all the calculated actualWeights
        const totalActualWeight = actualWeights.reduce(
          (acc, weight) => acc + weight,
          0
        );
        // Sum all the calculated actualWeights
        const totalnoofPkts = noofPkts.reduce(
          (acc, noofPkts) => acc + noofPkts,
          0
        );

        x.actualWeight = totalActualWeight;
        x.noofPkts = totalnoofPkts
        return x; // Make sure to return x to update the original object in the 'tableData' array.
      });
      this.tableLoad = false;
    }
  }

  ngOnInit(): void {
    this.IntializeFormControl();
    this.getDropDownDetail();
    this.backPath = "/dashboard/Index?tab=6";
  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new thcControl(
      this.isUpdate || false,
      this.isView || false,
      this.prqFlag||false
    );

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlBasicArray = loadingControlFormControls
      .getThcFormControls()
      .filter((x) => x.additionalData && x.additionalData.metaData === "Basic");
    this.jsonControlVehLoadArray = loadingControlFormControls
      .getThcFormControls()
      .filter(
        (x) => x.additionalData && x.additionalData.metaData === "vehLoad"
      );
    this.jsonControlDriverArray = loadingControlFormControls
      .getThcFormControls()
      .filter(
        (x) => x.additionalData && x.additionalData.metaData === "driver"
      );
    if (this.addThc) {
      this.jsonControlDocketArray = loadingControlFormControls
        .getThcFormControls()
        .filter(
          (x) => x.additionalData && x.additionalData.metaData === "shipment_detail"
        );
    }
    this.jsonControlArray = [...this.jsonControlBasicArray, ...this.jsonControlVehLoadArray, ...this.jsonControlDriverArray]
    this.addThc ? this.jsonControlArray.push(...this.jsonControlDocketArray) : ""
    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.vehicleName = this.jsonControlArray.find(
      (data) => data.name === "vehicle"
    )?.name;
    this.vehicleStatus = this.jsonControlArray.find(
      (data) => data.name === "vehicle"
    )?.additionalData.showNameAndValue;
    this.vendorName = this.jsonControlArray.find(
      (data) => data.name === "vendorName"
    )?.name;
    this.vendorNameStatus = this.jsonControlArray.find(
      (data) => data.name === "vendorName"
    )?.additionalData.showNameAndValue;
    this.prqName = this.jsonControlArray.find(
      (data) => data.name === "prqNo"
    )?.name;
    this.prqNoStatus = this.jsonControlArray.find(
      (data) => data.name === "prqNo"
    )?.additionalData.showNameAndValue;
    this.advanceName = this.jsonControlArray.find(
      (data) => data.name === "advPdAt"
    )?.name;
    this.advanceStatus = this.jsonControlArray.find(
      (data) => data.name === "advPdAt"
    )?.additionalData.showNameAndValue;
    this.balanceName = this.jsonControlArray.find(
      (data) => data.name === "balAmtAt"
    )?.name;
    this.balanceStatus = this.jsonControlArray.find(
      (data) => data.name === "balAmtAt"
    )?.additionalData.showNameAndValue;
    this.unloadName = this.jsonControlArray.find(
      (data) => data.name === "closingBranch"
    )?.name;
    this.unloadStatus = this.jsonControlArray.find(
      (data) => data.name === "closingBranch"
    )?.additionalData.showNameAndValue;
    this.fromCity = this.jsonControlArray.find(
      (data) => data.name === "fromCity"
    )?.name;
    this.fromCityStatus = this.jsonControlArray.find(
      (data) => data.name === "fromCity"
    )?.additionalData.showNameAndValue;
    this.toCity = this.jsonControlArray.find(
      (data) => data.name === "toCity"
    )?.name;
    this.toCityStatus = this.jsonControlArray.find(
      (data) => data.name === "toCity"
    )?.additionalData.showNameAndValue;
    // Build the form group using the form controls obtained
    this.thcTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  functionCallHandler($event) {
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
  async getDropDownDetail() {
    //const vehicleList = await getShipment(this.operationService, true);
    const locationList = await getLocationApiDetail(this.masterService);
    this.prqlist = await prqDetail(this.operationService, true);
    this.locationData = locationList.map((x) => {
      return { value: x.locCode, name: x.locName };
    });

    this.filter.Filter(
      this.jsonControlArray,
      this.thcTableForm,
      this.prqlist,
      this.prqName,
      this.prqNoStatus
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.thcTableForm,
      this.locationData,
      this.advanceName,
      this.advanceStatus
    );

    this.filter.Filter(
      this.jsonControlArray,
      this.thcTableForm,
      this.locationData,
      this.balanceName,
      this.balanceStatus
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.thcTableForm,
      this.locationData,
      this.unloadName,
      this.unloadStatus
    );
    if (this.prqFlag) {
      this.bindDataPrq();
    }
    if (this.isUpdate || this.isView) {
      this.autoFillThc();
    }
    /*below autoFillDocketDetail call when your try to create Multiple THC using one Docket */
    /*End*/
    else {
      const vehiclesNo = await getVehicleStatusFromApi(this.companyCode, this.operationService);
      const vehicleList: Vehicle[] = vehiclesNo.map(({ vehNo, driver, dMobNo, vMobNo, vendor, vendorType, capacity }) => ({
        name: vehNo,
        value: vehNo,
        driver,
        dMobNo,
        vMobNo,
        vendor,
        vendorType,
        capacity
      }));
      this.vehicleList=vehicleList;
      const vendorDetail = await getVendorDetails(this.masterService)
      const destinationMapping = await this.locationService.locationFromApi({ locCode: this.branchCode })
      const city = {
        name: destinationMapping[0].city,
        value: destinationMapping[0].city
      }
      this.thcTableForm.controls['fromCity'].setValue(city);
      this.vendorDetail = vendorDetail;
      this.filter.Filter(
        this.jsonControlArray,
        this.thcTableForm,
        vehicleList,
        this.vehicleName,
        this.vehicleStatus
      );
      this.filter.Filter(
        this.jsonControlArray,
        this.thcTableForm,
        vendorDetail,
        this.vendorName,
        this.vehicleStatus
      );
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

  async bindPrqData
  () {
    
    const vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.prqDetail?.prqNo
    );
    const vehno={
      name:this.prqDetail?.vehicleNo,
      value:this.prqDetail?.vehicleNo
    }
    const vendor={
      name:vehicleDetail?.vendor||"",
      value:vehicleDetail?.vendor||"",
    }
    this.thcTableForm.controls["vehicle"].setValue(vehno);
    this.thcTableForm.controls["vendorType"].setValue(vehicleDetail?.vendorType||"");
    this.thcTableForm.controls["vendorName"].setValue(vendor);
    this.thcTableForm.controls["route"].setValue(
      this.prqDetail?.fromToCity || ""
    );
    const fcity = this.prqDetail?.fromToCity.split('-')[0] || "";
    const tcity = this.prqDetail?.fromToCity.split('-')[1] || "";
    this.thcTableForm.controls["fromCity"].setValue(
      {name:fcity,value:fcity}
    );
    this.thcTableForm.controls["toCity"].setValue(
      {name:tcity,value:tcity}
    );
    this.thcTableForm.controls["capacity"].setValue(
      this.prqDetail?.vehicleSize || this.prqDetail?.containerSize|| ""
    );
    this.thcTableForm.controls["driverName"].setValue(
      vehicleDetail?.driver || ""
    );
    this.thcTableForm.controls["driverMno"].setValue(
      vehicleDetail?.dMobNo || ""
    );
    this.thcTableForm.controls["driverLno"].setValue(vehicleDetail?.lcNo || "");
    this.thcTableForm.controls["driverLexd"].setValue(
      vehicleDetail?.lcExpireDate || ""
    );
    this.thcTableForm.controls["panNo"].setValue(
      vehicleDetail?.driverPan || ""
    );
  }

  async getShipmentDetails() {
    this.tableLoad = true;
    if (!this.prqFlag && this.thcTableForm.controls["prqNo"].value.value) {
      const prqData = await prqDetail(this.operationService, false);
      this.prqDetail = prqData.find(
        (x) => x.prqNo === this.thcTableForm.controls["prqNo"].value.value
      );
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
    const shipment = this.allShipment.filter((x) => x.prqNo == prqNo);
    this.tableData = shipment.map((x) => {
      const actualWeights = [x].map((item) => {
        return item
          ? calculateTotalField(item.invoiceDetails, "actualWeight")
          : 0;
      });
      const noofPkts = [x].map((item) => {
        return item
          ? calculateTotalField(item.invoiceDetails, "noofPkts")
          : 0;
      });
      // Sum all the calculated actualWeights
      const totalActualWeight = actualWeights.reduce(
        (acc, weight) => acc + weight,
        0
      );
      // Sum all the calculated actualWeights
      const totalnoofPkts = noofPkts.reduce(
        (acc, noofPkts) => acc + noofPkts,
        0
      );

      x.actualWeight = totalActualWeight;
      x.noofPkts = totalnoofPkts
      x.actions = ["Update"];
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
    const actualWeights = event.map((item) => {
      return item
        ? calculateTotalField(item.invoiceDetails, "actualWeight")
        : 0;
    });
    // Sum all the calculated actualWeights
    const totalActualWeight = actualWeights.reduce(
      (acc, weight) => acc + weight,
      0
    );
    let capacityTons = parseFloat(this.thcTableForm.controls["capacity"].value); // Get the capacity value in tons
    let loadedTons = totalActualWeight / 1000;
    let percentage = (loadedTons * 100) / capacityTons;
    this.thcTableForm.controls["loadedKg"].setValue(totalActualWeight);
    this.thcTableForm.controls["weightUtilization"].setValue(
      percentage.toFixed(2)
    );
    this.selectedData = event;
  }
  async handleMenuItemClick(data) {
    if (data.label.label === "Update") {
      const dialogref = this.dialog.open(ThcUpdateComponent, {
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          const { shipment, remarks, podUpload, arrivalTime } = result;
          this.tableData.forEach((x) => {
            if (x.docketNumber === shipment) {
              x.remarks = remarks || "";
              x.pod = podUpload || "";
              x.arrivalTime = arrivalTime ? formatDate(arrivalTime, 'HH:mm') : "";
              x.receiveBy = localStorage.getItem("UserName");
            }
          });
        }

      });
    }
  }

  async createThc() {
    
    let extractedData = {};
    this.selectedData= this.tableData.filter((x)=>x.isSelected==true);
    /* here the condition block which is execution while the 
    selected value is zero and isUpdate is false */
    if (this.selectedData.length<=0 && !this.isUpdate) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'You must select any one of Shipment',
        showConfirmButton: true,
      });
      return false;
    }
    
    if (this.isUpdate && this.hasBlankFields()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incomplete Update: Please fill in all required fields before updating.',
      });
      return;
    }
     /* here the condition block which is execution while the 
        isUpdate is true */
   
    const selectedDkt= this.isUpdate?this.tableData : this.selectedData;
    extractedData = selectedDkt.map(({ docketNumber, remarks, pod, arrivalTime }) => ({ docketNumber, remarks, pod, arrivalTime }));
    const docket = selectedDkt.map((x) => x.docketNumber);
    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    const advPdAt = this.thcTableForm.controls["advPdAt"].value?.value || "";
    const balAmtAt = this.thcTableForm.controls["balAmtAt"].value?.value || "";
    this.thcTableForm.controls["prqNo"].setValue(prqNo);
    this.thcTableForm.controls["advPdAt"].setValue(advPdAt);
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    const branch = this.thcTableForm.controls["closingBranch"].value?.value || "";
    this.thcTableForm.controls["closingBranch"].setValue(branch);
    const fromCity = this.thcTableForm.controls['fromCity'].value?.value || ""
    const toCity = this.thcTableForm.controls['toCity'].value?.value || ""
    this.thcTableForm.controls['fromCity'].setValue(fromCity);
    this.thcTableForm.controls['toCity'].setValue(toCity);
    const vehicle = this.thcTableForm.controls['vehicle'].value?.value || this.thcTableForm.controls['vehicle'].value
    this.thcTableForm.controls['vehicle'].setValue(vehicle);
    const vendorName = this.thcTableForm.controls['vendorName'].value?.name || this.thcTableForm.controls['vendorName'].value;
    this.thcTableForm.controls['vendorName'].setValue(vendorName);
    this.thcTableForm.controls['fromCity'].setValue(fromCity);
    this.thcTableForm.controls['toCity'].setValue(toCity);
    if (this.isUpdate) {
      for (const element of docket) {
        await this.docketService.updateDocket(element,{ "status": "2" });
      }
      this.thcTableForm.controls["podDetail"].setValue(extractedData);
      this.thcTableForm.controls["status"].setValue("2");
      const res = await showConfirmationDialogThc(
        this.thcTableForm.value,
        this.operationService
      );
    
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `THC Number is ${this.thcTableForm.controls["tripId"].value}`,
          showConfirmButton: true,
        });
        this.goBack("THC");
      }
    } else {
       /*this docket detail was stored while the Thc is Generated*/
        this.thcTableForm.controls["docket"].setValue(docket);
      if (this.prqFlag) {
        const prqData = {
          prqNo: this.thcTableForm.controls["prqNo"].value,
        };
        await this.consigmentUtility.updatePrq(prqData, "7");
      }
      for (const element of docket) {
        await this.docketService.updateDocket(element,{ "status": "1" });
      }
      const vendorType = this.thcTableForm.value.vendorType;
      const thcTableFormValue = this.thcTableForm.value;
      const fleetTableFormValue = this.addFleetMaster?.fleetTableForm?.value || {};
      const mappingFormGroup = vendorType === 'Market'
        ? { ...thcTableFormValue, ...fleetTableFormValue }
        : thcTableFormValue;

      const resThc = await thcGeneration(
        this.operationService,
        mappingFormGroup
      );
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
    calculateTotal(form, control1, control2, resultControl);
  }
  /*here get vehicle detail function if it is not market*/
  async getVehicleDetail() {
    const vehDetail: Vehicle = this.thcTableForm.controls['vehicle'].value
    const vendorName = this.vendorDetail.find((x) => x.name === vehDetail.vendor)
    this.thcTableForm.controls['vendorName'].setValue(vendorName);
    this.thcTableForm.controls['driverName'].setValue(vehDetail.driver);
    this.thcTableForm.controls['driverMno'].setValue(vehDetail.dMobNo);
    const vendorDetail: VendorDetail[] = await this.vendorService.getVendorDetail({ vendorName: vendorName.name });
    const driverDetail: DriverMaster[] = await this.driverService.getDriverDetail({ vehicleNo: vehDetail.value });
    const vendorType=vendorTypeList.find((x)=>x.value.toLowerCase()==vehDetail.vendorType.toLowerCase());
    this.thcTableForm.controls['vendorType'].setValue(vendorType?.value);
    this.thcTableForm.controls['panNo'].setValue(vendorDetail[0].panNo);
    this.thcTableForm.controls['driverLexd'].setValue(driverDetail[0].valdityDt);
    this.thcTableForm.controls['driverLno'].setValue(driverDetail[0].licenseNo);
    this.thcTableForm.controls['capacity'].setValue(vehDetail.capacity);
    if (vehDetail.value) {
      const filteredShipments = this.allShipment.filter((x) =>x.vehicleNo==vehDetail.value &&  x.status=="0");
      this.tableData = filteredShipments.map((x) => {
        const actualWeights = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "actualWeight")
            : 0;
        });
        const noofPkts = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "noofPkts")
            : 0;
        });
        // Sum all the calculated actualWeights
        const totalActualWeight = actualWeights.reduce(
          (acc, weight) => acc + weight,
          0
        );
        // Sum all the calculated actualWeights
        const totalnoofPkts = noofPkts.reduce(
          (acc, noofPkts) => acc + noofPkts,
          0
        );

        x.actualWeight = totalActualWeight;
        x.noofPkts = totalnoofPkts
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

    const formCity = this.thcTableForm.controls['fromCity'].value?.value || ''
    const toCity = this.thcTableForm.controls['toCity'].value?.value || ''
    const fromTo = `${formCity}-${toCity}`
    this.thcTableForm.controls['route'].setValue(fromTo)
    if (toCity) {
      
      const filteredShipments = this.allShipment.filter((x) =>
        x.fromCity.toLowerCase() === formCity.toLowerCase() &&
        x.toCity.toLowerCase() === toCity.toLowerCase()&& x.status=="0" && x.vehicleNo==this.thcTableForm.controls['vehicle'].value.value
      );

      this.tableData = filteredShipments.map((x) => {
        const actualWeights = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "actualWeight")
            : 0;
        });
        const noofPkts = [x].map((item) => {
          return item
            ? calculateTotalField(item.invoiceDetails, "noofPkts")
            : 0;
        });
        // Sum all the calculated actualWeights
        const totalActualWeight = actualWeights.reduce(
          (acc, weight) => acc + weight,
          0
        );
        // Sum all the calculated actualWeights
        const totalnoofPkts = noofPkts.reduce(
          (acc, noofPkts) => acc + noofPkts,
          0
        );

        x.actualWeight = totalActualWeight;
        x.noofPkts = totalnoofPkts
        return x; // Make sure to return x to update the original object in the 'tableData' array.
      });
    }
  }

  /*below function call when user will try to view or
   edit Thc the function are create for autofill the value*/
  autoFillThc() {
    let propertiesToSet = [
      "route",
      "prqNo",
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
    ];
    if (this.prqFlag) {
      propertiesToSet = propertiesToSet.filter((x) => x !== "tripId");
    }
    propertiesToSet.forEach((property) => {
      if (property === "prqNo") {
        const prqNo = {
          name: this.thcDetail?.prqNo || "",
          value: this.thcDetail?.prqNo || "",
        };
        this.thcTableForm.controls[property].setValue(prqNo);
      } else {
        this.thcTableForm.controls[property].setValue(
          this.thcDetail?.[property] || ""
        );
      }
    });

    const location = this.locationData.find(
      (x) => x.value === this.thcDetail?.advPdAt
    );
    this.thcTableForm.controls["advPdAt"].setValue(location);
    const balAmtAt = this.locationData.find(
      (x) => x.value === this.thcDetail?.balAmtAt
    );
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    const closingBranch = this.locationData.find(
      (x) => x.value === this.thcDetail?.closingBranch
    );
    this.thcTableForm.controls["closingBranch"].setValue(closingBranch);
    const fromCity = { name: this.thcDetail?.route.split('-')[0] || "", value: this.thcDetail?.route.split('-')[0] || "" }
    const toCity = { name: this.thcDetail?.route.split('-')[1] || "", value: this.thcDetail?.route.split('-')[0] || "" }
    this.thcTableForm.controls["fromCity"].setValue(fromCity);
    this.thcTableForm.controls["toCity"].setValue(toCity);
    this.thcTableForm.controls["toCity"].setValue(toCity);
    this.thcTableForm.controls["vehicle"].setValue({name:this.thcDetail?.vehicle,value:this.thcDetail?.vehicle});
    this.thcTableForm.controls["vendorName"].setValue({name:this.thcDetail?.vendorName,value:this.thcDetail?.vendorName});
    if (this.addThc) {
      this.thcTableForm.controls['billingParty'].setValue(this.thcDetail?.billingParty);
      this.thcTableForm.controls['docketNumber'].setValue(this.thcDetail?.docketNumber);
    }
    this.getShipmentDetails();
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
    const vehicleDetail:Vehicle=this.vehicleList.find((x)=>x.value==vehicle.value);
    this.thcTableForm.controls['capacity'].setValue(vehicleDetail.capacity);

  }

  /*End*/
}
