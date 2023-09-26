import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { thcControl } from 'src/assets/FormControls/thc-generation';
import { getShipment, prqDetail, thcGeneration } from './thc-utlity';
import { Router } from '@angular/router';
import { calculateTotalField } from '../unbilled-prq/unbilled-utlity';
import Swal from 'sweetalert2';

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
    }
  };
  //#endregion
  staticField = [
    "billingParty",
    "docketNumber",
    "fromCity",
    "toCity",
    "transMode"
  ];
  addAndEditPath: string;
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
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private operationService: OperationService,
    private route: Router
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.prqDetail = navigationState;
      this.prqFlag = true;
    }
    this.getShipmentDetail();
  }

  async getShipmentDetail() {
    const shipmentList = await getShipment(this.operationService, false);
    this.tableData = shipmentList;
    this.allShipment = shipmentList;
    this.tableLoad = false;
  }

  ngOnInit(): void {
    this.IntializeFormControl()
    this.getDropDownDetail();
  }

  IntializeFormControl() {
    // Create an instance of loadingControl class
    const loadingControlFormControls = new thcControl();

    // Get the form controls from the loadingControlFormControls instance
    this.jsonControlArray =
      loadingControlFormControls.getThcFormControls();

    // Loop through the jsonControlArray to find the vehicleType control and set related properties
    this.jsonControlArray.forEach((data) => {
      this.jsonControlArray.forEach((data) => {
        if (data.name === "vehicle") {
          this.vehicleName = data.name;
          this.vehicleStatus = data.additionalData.showNameAndValue;
        }
        if (data.name === "prqNo") {
          this.prqName = data.name;
          this.prqNoStatus = data.additionalData.showNameAndValue;
        }
      });
    });

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
    const vehicleList = await getShipment(this.operationService, true);
    const prqList = await prqDetail(this.operationService);
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
      prqList,
      this.prqName,
      this.prqNoStatus
    );
    if (this.prqFlag) {
      this.bindDataPrq()
    }
  }
  bindDataPrq() {
    const vehicle = {
      name: this.prqDetail?.vehicleNo || "",
      value: this.prqDetail?.vehicleNo || ""
    }

    const prq = {
      name: this.prqDetail?.prqNo || "",
      value: this.prqDetail?.prqNo || ""
    }
    this.thcTableForm.controls['vehicle'].setValue(vehicle);
    this.thcTableForm.controls['prqNo'].setValue(prq);
    this.thcTableForm.controls['vehicleType'].setValue('Market');
    this.thcTableForm.controls['route'].setValue(this.prqDetail?.fromToCity || "");
    this.thcTableForm.controls['capacity'].setValue(this.prqDetail?.vehicleSize || "");
    this.getShipmentDetails();
  }

  async getShipmentDetails() {
    this.tableLoad = true;
    const prqNo = this.thcTableForm.controls['prqNo'].value.value;
    // Set the delay duration in milliseconds (e.g., 2000 milliseconds for 2 seconds)
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    // Now, update the tableData and set tableLoad to false
    this.tableData = this.allShipment.filter((x) => x.prqNo == prqNo);
    this.tableLoad = false;
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
    this.thcTableForm.controls['loadaddedKg'].setValue(totalActualWeight);
    this.thcTableForm.controls['loadedKg'].setValue(totalActualWeight);
    this.thcTableForm.controls['weightUtilization'].setValue(percentage.toFixed(2));
  }
  async createThc() {
    const randomNumber =
      "TH/" +
      this.orgBranch +
      "/" +
      2223 +
      "/" +
      Math.floor(Math.random() * 100000);
    this.thcTableForm.controls["tripId"].setValue(randomNumber);
    const docket = this.tableData.map((x) => x.docketNumber);
    this.thcTableForm.controls["docket"].setValue(docket);
    const vehNo = this.thcTableForm.controls["vehicle"].value.value;
    const prqNo = this.thcTableForm.controls["prqNo"].value.value;
    this.thcTableForm.controls["vehicle"].setValue(vehNo);
    this.thcTableForm.controls["prqNo"].setValue(prqNo);
    this.thcTableForm.controls["_id"].setValue(randomNumber);
    const resThc = await thcGeneration(this.operationService, this.thcTableForm.value)
    if (resThc) {
      Swal.fire({
        icon: "success",
        title: "Update Successfuly",
        text: `THC Number is ${randomNumber}`,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.goBack('THC')
        }
      });
    }
  }
  goBack(tabIndex: string): void {
    this.route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
