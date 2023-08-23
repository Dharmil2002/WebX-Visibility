import { Component, OnInit } from "@angular/core";
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { Router } from "@angular/router";
import { processProperties } from "src/app/Masters/processUtility";
import Swal from "sweetalert2";
import { ChaEntryControl } from "src/assets/FormControls/cha-entry";

@Component({
  selector: 'app-cha-entry-page',
  templateUrl: './cha-entry-page.component.html',
  providers: [FilterUtils],
})
export class ChaEntryPageComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  billingParty: any;
  billingPartyStatus: any;
  fleetSize: any;
  fleetSizeStatus: any;
  jobLocation: any;
  jobLocationStatus: any;
  transportMode: any;
  transportModeStatus: any;
  fromCity: any;
  fromCityStatus: any;
  toCity: any;
  toCityStatus: any;
  chaEntryFormControls: ChaEntryControl;
  isUpdate: boolean;
  chaEntryControlArray: any;
  chaEntryTableForm: UntypedFormGroup;
  cityData: any;
  tableLoad = true;
  columnHeader =
    {
      "srNo": "Sr No.",
      "customerClearance": "Customer Clearance",
      "clearanceCharge": "Clearance Charge",
      "gstRate ": "GST Rate ",
      "gstAmount": "GST Amount",
      "totalAmount ": "Total Amount ",
      "actions": "Actions",
    }
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "srNo": "Sr No.",
    "customerClearance": "Customer Clearance",
    "clearanceCharge": "Clearance Charge",
    "gstRate ": "GST Rate ",
    "gstAmount": "GST Amount",
    "totalAmount ": "Total Amount ",
    "actions": "Actions",
  }
  //#endregion 
  breadScrums = [
    {
      title: "CHA Entry",
      items: ["Home"],
      active: "CHA Entry",
    },
  ];

  constructor(private Route: Router, private fb: UntypedFormBuilder, private masterService: MasterService, private filter: FilterUtils) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.bindDropdown();
    this.getCityList();
    this.getCustomerDetails();
  }

  bindDropdown() {
    const jobPropertiesMapping = {
      billingParty: { variable: 'billingParty', status: 'billingPartyStatus' },
      fleetSize: { variable: 'fleetSize', status: 'fleetSizeStatus' },
      jobLocation: { variable: 'jobLocation', status: 'jobLocationStatus' },
      transportMode: { variable: 'transportMode', status: 'transportModeStatus' },
      fromCity: { variable: 'fromCity', status: 'fromCityStatus' },
      toCity: { variable: 'toCity', status: 'toCityStatus' }
    };
    processProperties.call(this, this.chaEntryControlArray, jobPropertiesMapping);
  }

  initializeFormControl() {
    this.chaEntryFormControls = new ChaEntryControl();
    // Get form controls for job Entry form section
    this.chaEntryControlArray = this.chaEntryFormControls.getChaEntryFormControls();
    // Build the form group using formGroupBuilder function
    this.chaEntryTableForm = formGroupBuilder(this.fb, [this.chaEntryControlArray]);
  }

  getCustomerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.chaEntryControlArray,
            this.chaEntryTableForm,
            res,
            this.billingParty,
            this.billingPartyStatus
          ); // Filter the docket control array based on customer details
        }
      },
    });
  }

  getCityList() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "city_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        const cityList = res.data.map(element => ({
          name: element.cityName,
          value: element.id
        }));
        this.filter.Filter(
          this.chaEntryControlArray,
          this.chaEntryTableForm,
          cityList,
          this.fromCity,
          this.fromCityStatus
        );

        this.filter.Filter(
          this.chaEntryControlArray,
          this.chaEntryTableForm,
          cityList,
          this.toCity,
          this.toCityStatus
        );
      }
    });
  }
  save() {
    this.chaEntryTableForm.controls["billingParty"].setValue(this.chaEntryTableForm.value.billingParty);
    this.chaEntryTableForm.controls["fleetSize"].setValue(this.chaEntryTableForm.value.fleetSize);
    this.chaEntryTableForm.controls["fromCity"].setValue(this.chaEntryTableForm.value.fromCity);
    this.chaEntryTableForm.controls["toCity"].setValue(this.chaEntryTableForm.value.toCity.value);
    this.chaEntryTableForm.controls["jobLocation"].setValue(this.chaEntryTableForm.value.jobLocation);
    this.chaEntryTableForm.controls["transportMode"].setValue(this.chaEntryTableForm.value.transportMode);
    console.log(this.chaEntryTableForm.value);
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    let jeNo = `CHA${dynamicValue}${paddedNumber}`;
    Swal.fire({
      icon: "success",
      title: "Generated SuccesFully",
      text: "Job Entry No: " + jeNo,
      showConfirmButton: true,
    })
  }

  cancel() {
    window.history.back();
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
