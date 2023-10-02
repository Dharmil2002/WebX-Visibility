import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { thcControl } from 'src/assets/FormControls/thc-generation';
import { calculateTotal, getShipment, prqDetail, thcGeneration } from './thc-utlity';
import { Router } from '@angular/router';
import { calculateTotalField } from '../unbilled-prq/unbilled-utlity';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getLocationApiDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { updatePrq } from '../consignment-entry-form/consigment-utlity';
import { showConfirmationDialogThc } from '../thc-summary/thc-update-utlity';

@Component({
  selector: 'app-thc-generation',
  templateUrl: './thc-generation.component.html'
})
export class ThcGenerationComponent implements OnInit {
  //FormGrop
  thcTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tableData: any;
  tableLoad: boolean;
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
  TableStyle = "width:49%"
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
      Style: "max-width:150px",
    },
    docketNumber: {
      Title: "Shipment",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    fromCity: {
      Title: "From City",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    toCity: {
      Title: "To City",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    transMode: {
      Title: "Trans Mode",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    actualWeight: {
      Title: "Actual Weight",
      class: "matcolumnleft",
      Style: "max-width:150px",
    }
  };
  //#endregion
  staticField = [
    "billingParty",
    "docketNumber",
    "fromCity",
    "toCity",
    "transMode",
    "actualWeight"
  ];
  addAndEditPath: string;
  uploadedFiles: File[];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  //here declare varible for the KPi
  boxData: { count: number; title: string; class: string; }[];
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
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private operationService: OperationService,
    private masterService: MasterService,
    private route: Router
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.isUpdate = navigationState.hasOwnProperty('isUpdate') ? true : false;
      this.isView = navigationState.hasOwnProperty('isView') ? true : false;
      if (this.isUpdate) {
        this.thcDetail = navigationState.data;
      }
      else if (this.isView) {
        this.thcDetail = navigationState.data;
      }
      else {
        this.prqDetail = navigationState;
        this.prqFlag = true;
      }
    }
    this.getShipmentDetail();
  }

  async getShipmentDetail() {
    const shipmentList = await getShipment(this.operationService, false);
    //this.tableData = shipmentList;
    //this.tableData = [];
    this.allShipment = shipmentList;
    this.tableLoad = false;
  }

  ngOnInit(): void {
    this.IntializeFormControl()
    this.getDropDownDetail();

  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new thcControl(this.isUpdate, this.isView);

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlArray =
      loadingControlFormControls.getThcFormControls();

    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.vehicleName = this.jsonControlArray.find(data => data.name === "vehicle")?.name;
    this.vehicleStatus = this.jsonControlArray.find(data => data.name === "vehicle")?.additionalData.showNameAndValue;
    this.prqName = this.jsonControlArray.find(data => data.name === "prqNo")?.name;
    this.prqNoStatus = this.jsonControlArray.find(data => data.name === "prqNo")?.additionalData.showNameAndValue;
    this.advanceName = this.jsonControlArray.find(data => data.name === "advPdAt")?.name;
    this.advanceStatus = this.jsonControlArray.find(data => data.name === "advPdAt")?.additionalData.showNameAndValue;
    this.balanceName = this.jsonControlArray.find(data => data.name === "balAmtAt")?.name;
    this.balanceStatus = this.jsonControlArray.find(data => data.name === "balAmtAt")?.additionalData.showNameAndValue;
    // Build the form group using the form controls obtained
    this.thcTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
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
    const locationList = await getLocationApiDetail(this.masterService)
    this.prqlist = await prqDetail(this.operationService, true);
    this.locationData = locationList.map((x) => { return { value: x.locCode, name: x.locName } })

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
    if (this.prqFlag) {
      this.bindDataPrq()
    }
    if (this.isUpdate || this.isView) {
      this.autoFillThc();
    }
  }
  bindDataPrq() {
    const prq = {
      name: this.prqDetail?.prqNo || "",
      value: this.prqDetail?.prqNo || ""
    }
    this.thcTableForm.controls['prqNo'].setValue(prq);
    this.bindPrqData();
    this.getShipmentDetails();
  }
  bindPrqData() {
    this.thcTableForm.controls['vehicle'].setValue(this.prqDetail?.vehicleNo);
    this.thcTableForm.controls['VendorType'].setValue('Market');
    this.thcTableForm.controls['route'].setValue(this.prqDetail?.fromToCity || "");
    this.thcTableForm.controls['capacity'].setValue(this.prqDetail?.vehicleSize || "");
  }
  async getShipmentDetails() {

    this.tableLoad = true;
    if (!this.prqFlag) {
      const prqData = await prqDetail(this.operationService, false);
      this.prqDetail = prqData.find((x) => x.prqNo === this.thcTableForm.controls['prqNo'].value.value);
      this.bindPrqData();
    }
    const prqNo = this.thcTableForm.controls['prqNo'].value.value;
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
        return item ? calculateTotalField(item.invoiceDetails, 'actualWeight') : 0;
      });

      // Sum all the calculated actualWeights
      const totalActualWeight = actualWeights.reduce((acc, weight) => acc + weight, 0);

      x.actualWeight = totalActualWeight
      return x; // Make sure to return x to update the original object in the 'tableData' array.
    });
    this.thcTableForm.controls['vendorName'].setValue(shipment ? shipment[0].vendorName : "");
    if (this.isUpdate || this.isView) {
      const thcDetail = this.thcDetail
      this.tableData.forEach(item => {
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
      return item ? calculateTotalField(item.invoiceDetails, 'actualWeight') : 0;
    });
    // Sum all the calculated actualWeights
    const totalActualWeight = actualWeights.reduce((acc, weight) => acc + weight, 0);
    let capacityTons = parseFloat(this.thcTableForm.controls['capacity'].value); // Get the capacity value in tons
    let loadedTons = totalActualWeight / 1000;
    let percentage = (loadedTons * 100) / capacityTons;
    this.thcTableForm.controls['loadedKg'].setValue(totalActualWeight);
    this.thcTableForm.controls['weightUtilization'].setValue(percentage.toFixed(2));
    this.selectedData=event;
  }
  autoFillThc() {
    const propertiesToSet = [
      'route',
      'prqNo',
      'vehicle',
      'VendorType',
      'tripId',
      'capacity',
      'loadedKg',
      'weightUtilization',
      'driverName',
      'driverMno',
      'driverLno',
      'driverLexd',
      'contAmt',
      'advAmt',
      'balAmt',
      'advPdAt',
      'balAmtAt',
      'status',
      'VendorType',
      'vendorName',
      'panNo'
    ];

    propertiesToSet.forEach(property => {
      if (property === 'prqNo') {
        const prqNo = {
          name: this.thcDetail?.prqNo || "",
          value: this.thcDetail?.prqNo || ""
        };
        this.thcTableForm.controls[property].setValue(prqNo);
      } else {
        this.thcTableForm.controls[property].setValue(this.thcDetail?.[property] || "");
      }
    });

    const location = this.locationData.find(x => x.value === this.thcDetail?.advPdAt);
    this.thcTableForm.controls['advPdAt'].setValue(location);

    const balAmtAt = this.locationData.find(x => x.value === this.thcDetail?.balAmtAt);
    this.thcTableForm.controls['balAmtAt'].setValue(balAmtAt);

    this.getShipmentDetails();
  }


  async createThc() {
    
    if (!this.selectedData && !this.isUpdate) {
      Swal.fire({
        icon: "info", // You can use the "info" icon for informational messages
        title: "Information",
        text: "You must select any one of Shipment",
        showConfirmButton: true,
      });
      return false
    }
    else{
      this.selectedData=this.tableData;
    }
    const docket = this.selectedData.map((x) => x.docketNumber);
    this.thcTableForm.controls["docket"].setValue(docket);
    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    const advPdAt = this.thcTableForm.controls["advPdAt"].value?.value || "";
    const balAmtAt = this.thcTableForm.controls["balAmtAt"].value?.value || "";
    this.thcTableForm.controls["prqNo"].setValue(prqNo);
    this.thcTableForm.controls["advPdAt"].setValue(advPdAt);
    this.thcTableForm.controls["balAmtAt"].setValue(balAmtAt);
    if (this.isUpdate) {

      this.thcTableForm.controls["status"].setValue('2');
      this.thcTableForm.controls["_id"].setValue(this.thcTableForm.controls["tripId"].value);
      const res = await showConfirmationDialogThc(this.thcTableForm.value, this.operationService);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Update Successfuly",
          text: `THC Number is ${this.thcTableForm.controls["tripId"].value}`,
          showConfirmButton: true,
        })
        this.goBack('THC');
      }
    }
    else {
      const randomNumber =
        "TH/" +
        this.orgBranch +
        "/" +
        2223 +
        "/" +
        Math.floor(Math.random() * 100000);
      this.thcTableForm.controls["tripId"].setValue(randomNumber);
      this.thcTableForm.controls["_id"].setValue(randomNumber);

      if (this.prqFlag) {
        const prqData = {
          prqId: this.thcTableForm.controls["prqNo"].value,
        }
        await updatePrq(this.operationService, prqData, "7")

      }
      const resThc = await thcGeneration(this.operationService, this.thcTableForm.value)
      if (resThc) {
        Swal.fire({
          icon: "success",
          title: "THC Generated Successfuly",
          text: `THC Number is ${randomNumber}`,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.goBack('THC')
          }
        });
      }
    }
  }
  goBack(tabIndex: string): void {
    this.route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
  onCalculateTotal() {
    // Assuming you have a form named 'thcTableForm'
    const form = this.thcTableForm;
    const control1 = 'contAmt';
    const control2 = 'advAmt';
    const resultControl = 'balAmt';
    calculateTotal(form, control1, control2, resultControl);
  }
}
