import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { thcControl } from "src/assets/FormControls/thc-generation";
import {
  calculateTotal,
  getShipment,
  prqDetail,
  thcGeneration,
} from "./thc-utlity";
import { Router } from "@angular/router";
import { calculateTotalField } from "../unbilled-prq/unbilled-utlity";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getLocationApiDetail } from "src/app/finance/invoice-summary-bill/invoice-utility";
import { updatePrq } from "../consignment-entry-form/consigment-utlity";
import { showConfirmationDialogThc } from "../thc-summary/thc-update-utlity";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { MatDialog } from "@angular/material/dialog";
import { ThcUpdateComponent } from "src/app/dashboard/tabs/thc-update/thc-update.component";
import { VehicleStatusService } from "src/app/Utility/module/operation/vehicleStatus/vehicle.service";
import { formatDate } from "src/app/Utility/date/date-utils";
import { debug } from "console";

@Component({
  selector: "app-thc-generation",
  templateUrl: "./thc-generation.component.html",
})
export class ThcGenerationComponent implements OnInit {
  //FormGrop
  thcTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tableData: any;
  tableLoad: boolean;
  backPath:string;
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
      Style: "max-width:260px",
    },
    docketNumber: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "max-width:250px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    actualWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumnleft",
      Style: "max-width:160px",
    },
    noofPkts: {
      Title: "No of Packets ",
      class: "matcolumnleft",
      Style: "max-width:160px",
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
      Title: "Arrival Time",
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
  selectedData: any;
  menuItems = [{ label: "Update" }];
  menuItemflag: boolean = true;
  jsonControlBasicArray: any;
  jsonControlVehLoadArray: any;
  jsonControlDriverArray: any;
  unloadName: any;
  unloadStatus: any;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private operationService: OperationService,
    private masterService: MasterService,
    private route: Router,
    private docketService: DocketService,
    private vehicleStatusService: VehicleStatusService,
    public dialog: MatDialog
  ) {
    const navigationState =
      this.route.getCurrentNavigation()?.extras?.state?.data;

    if (navigationState != null) {
      this.isUpdate = navigationState.hasOwnProperty("isUpdate") ? true : false;
      this.isView = navigationState.hasOwnProperty("isView") ? true : false;
      if (this.isUpdate) {
        this.thcDetail = navigationState.data;
        const field =
          ["pod", "receiveBy", "arrivalTime", "remarks"]
        this.staticField.push(...field)
      } else if (this.isView) {
        const field =
          ["pod", "receiveBy", "arrivalTime", "remarks"]
        this.staticField.push(...field)
        delete this.columnHeader.actionsItems;
        this.thcDetail = navigationState.data;
      } else {
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
    this.allShipment = shipmentList;
    this.tableLoad = false;
  }

  ngOnInit(): void {
    this.IntializeFormControl();
    this.getDropDownDetail();
    this.backPath = "/dashboard/GlobeDashboardPage?tab=6";
  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new thcControl(
      this.isUpdate,
      this.isView
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
    this.jsonControlArray = [...this.jsonControlBasicArray, ...this.jsonControlVehLoadArray, ...this.jsonControlDriverArray]
    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.vehicleName = this.jsonControlArray.find(
      (data) => data.name === "vehicle"
    )?.name;
    this.vehicleStatus = this.jsonControlArray.find(
      (data) => data.name === "vehicle"
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
    const vehicleDetail = await this.vehicleStatusService.vehiclList(
      this.prqDetail?.prqNo
    );
    this.thcTableForm.controls["vehicle"].setValue(this.prqDetail?.vehicleNo);
    this.thcTableForm.controls["VendorType"].setValue("Market");
    this.thcTableForm.controls["route"].setValue(
      this.prqDetail?.fromToCity || ""
    );
    this.thcTableForm.controls["capacity"].setValue(
      this.prqDetail?.vehicleSize || ""
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
    if (!this.prqFlag) {
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
      x.noofPkts=totalnoofPkts
      x.actions = ["Update"];
      return x; // Make sure to return x to update the original object in the 'tableData' array.
    });
    this.thcTableForm.controls["vendorName"].setValue(
      shipment ? shipment[0].vendorName : ""
    );
    if (this.isUpdate || this.isView) {
      const thcDetail = this.thcDetail;
      this.tableData.forEach((item) => {
        if (thcDetail.docket.includes(item.docketNumber)) {
          item.isSelected = true;
        }
      });
    }
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
  autoFillThc() {
    const propertiesToSet = [
      "route",
      "prqNo",
      "vehicle",
      "VendorType",
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
      "VendorType",
      "vendorName",
      "panNo",
    ];

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
      (x) => x.value === this.thcDetail?.balAmtAt
    );
    this.thcTableForm.controls["closingBranch"].setValue(closingBranch);
    this.getShipmentDetails();
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
    this.selectedData = this.tableData;
    if (!this.selectedData || (this.isUpdate && this.hasBlankFields())) {
      if (!this.selectedData) {
        Swal.fire({
          icon: "info",
          title: "Information",
          text: "You must select any one of Shipment",
          showConfirmButton: true,
        });
      } else if (this.isUpdate && this.hasBlankFields()) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `The following fields are blank: ${this.getBlankFields()}`,
        });
      }
      return false;
    } else {
      extractedData = this.selectedData.map((item) => ({
        docketNumber: item.docketNumber,
        remarks: item.remarks,
        pod: item.pod,
        arrivalTime: item.arrivalTime,
      }));
    }




    const docket = this.selectedData.map((x) => x.docketNumber);
    this.thcTableForm.controls["docket"].setValue(docket);
    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    const advPdAt = this.thcTableForm.controls["advPdAt"].value?.value || "";
    const balAmtAt = this.thcTableForm.controls["balAmtAt"].value?.value || "";
    this.thcTableForm.controls["prqNo"].setValue(prqNo);
    this.thcTableForm.controls["advPdAt"].setValue(advPdAt);
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    const branch = this.thcTableForm.controls["closingBranch"].value?.value || "";
    this.thcTableForm.controls["closingBranch"].setValue(branch);
    if (this.isUpdate) { 
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
      if (this.prqFlag) {
        const prqData = {
          prqNo: this.thcTableForm.controls["prqNo"].value,
        };
        await updatePrq(this.operationService, prqData, "7");
      }
      for (const element of docket) {
        await this.docketService.updateDocket(element);
      }

      const resThc = await thcGeneration(
        this.operationService,
        this.thcTableForm.value
      );
      if (resThc) {
        Swal.fire({
          icon: "success",
          title: "THC Generated Successfully",
          text: `THC Number  Generated Successfully `,
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

    return Object.keys(fieldMap).some(fieldName => this.selectedData.some(item => !item[fieldName]));
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
    this.route.navigate(["/dashboard/GlobeDashboardPage"], {
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
}
