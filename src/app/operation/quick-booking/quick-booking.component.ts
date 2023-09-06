import { Component, HostListener, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { QuickBookingControls } from "src/assets/FormControls/quick-docket-booking";
import Swal from "sweetalert2";
import { getCity } from "./quick-utility";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import {  Router } from "@angular/router";
import { FailedApiServiceService } from "src/app/core/service/api-tracking-service/failed-api-service.service";
import { RetryAndDownloadService } from "src/app/core/service/api-tracking-service/retry-and-download.service";

@Component({
  selector: "app-quick-booking",
  templateUrl: "./quick-booking.component.html",
  providers: [FilterUtils],
})
export class QuickBookingComponent implements OnInit {
  docketControls: QuickBookingControls;
  quickDocketTableForm: UntypedFormGroup;
  jsonControlDocketArray: FormControls[];

  /*company code declare globly beacuse it's use multiple time in out code*/
  companyCode = parseInt(localStorage.getItem("companyCode"));

  /*here the declare varible to bind the dropdown*/
  fromCity: string; //it's used in getCity() for the binding a fromCity
  fromCityStatus: boolean; //it's used in getCity() for binding fromCity
  toCity: string; //it's used in getCity() for binding ToCity
  toCityStatus: boolean; //it's used in getCity() for binding ToCity
  customer: string; //it's used in customerDetails() for binding billingParty
  customerStatus: boolean; //it's used in customerDetails() for binding billingParty
  destination: string;
  destinationStatus: boolean;
  vehNo: string;
  vehicleStatus: boolean;
  /*it's breadScrums to used in html you must delcare here */
  userName = localStorage.getItem("Username");
  breadScrums = [
    {
      title: "CNote Quick Booking",
      items: ["Quick-Booking"],
      active: "CNote Quick Booking",
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private failedApiService: FailedApiServiceService,
    private retryAndDownloadService: RetryAndDownloadService,
    private operationService: OperationService,
    private _NavigationService: NavigationService
  ) {
    this.initializeFormControl();
    this.getCity();
    this.customerDetails();
    this.destionationDropDown();
    this.GetVehicleDetails();
  }

  ngOnInit(): void {
    // Component initialization logic goes here
  }

  initializeFormControl() {
    // Create an instance of QuickBookingControls to get form controls for different sections
    this.docketControls = new QuickBookingControls();
    // Get form controls for Quick Booking section
    this.jsonControlDocketArray = this.docketControls.getDocketFieldControls();
    this.commonDropDownMapping();
    // Create the form group using the form builder and the form controls array
    this.quickDocketTableForm = formGroupBuilder(this.fb, [
      this.jsonControlDocketArray,
    ]);
    this.quickDocketTableForm.controls["payType"].setValue("TBB");
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

  /*here i initilize the function which used to bind dropdown Controls*/
  commonDropDownMapping() {
    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this[mapping.target] = data.name; // Set the target property with the value of the name property
          this[`${mapping.target}Status`] =
            data.additionalData.showNameAndValue; // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };

    const docketMappings = [
      { name: "fromCity", target: "fromCity" },
      { name: "toCity", target: "toCity" },
      { name: "vehNo", target: "vehNo" },
      { name: "destination", target: "destination" },
      { name: "billingParty", target: "customer" },
    ];
    mapControlArray(this.jsonControlDocketArray, docketMappings); // Map docket control array
  }
  async getCity() {
    try {
      const cityDetail = await getCity(this.companyCode, this.masterService);

      if (cityDetail) {
        this.filter.Filter(
          this.jsonControlDocketArray,
          this.quickDocketTableForm,
          cityDetail,
          this.fromCity,
          this.fromCityStatus
        ); // Filter the docket control array based on fromCity details

        this.filter.Filter(
          this.jsonControlDocketArray,
          this.quickDocketTableForm,
          cityDetail,
          this.toCity,
          this.toCityStatus
        ); // Filter the docket control array based on toCity details
      }
    } catch (error) {
      console.error("Error getting city details:", error);
    }
  }

  // Customer details
  customerDetails() {
    this.masterService.getJsonFileDetails("customer").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.jsonControlDocketArray,
            this.quickDocketTableForm,
            res,
            this.customer,
            this.customerStatus
          ); // Filter the docket control array based on customer details
        }
      },
    });
  }
  //destionation
  destionationDropDown() {
    this.masterService.getJsonFileDetails("destination").subscribe({
      next: (res: any) => {
        if (res) {
          this.filter.Filter(
            this.jsonControlDocketArray,
            this.quickDocketTableForm,
            res,
            this.destination,
            this.destinationStatus
          );
        }
      },
    });
  }
  // get vehicleNo
  GetVehicleDetails() {
    //throw new Error("Method not implemented.");
    // Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails("masterUrl").subscribe((res) => {
      if (res) {
        let VehicleData = res.vehicleMaster.map((x) => {
          return { name: x.vehicleNo, value: x.vehicleNo };
        });
        this.filter.Filter(
          this.jsonControlDocketArray,
          this.quickDocketTableForm,
          VehicleData,
          this.vehNo,
          this.vehicleStatus
        );
      }
    });
  }
  cancel() {
    this._NavigationService.navigateTotab(
      1,
      "dashboard/GlobeDashboardPage"
    );
    }
   
  save() {
    // Remove all form errors
    const controls = this.quickDocketTableForm;
    clearValidatorsAndValidate(controls);
    /*End*/
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    let docketNo = `CN${dynamicValue}${paddedNumber}`;
    this.quickDocketTableForm.controls["docketNumber"].setValue(docketNo);
    this.quickDocketTableForm.controls["fromCity"].setValue(
      this.quickDocketTableForm.value.fromCity?.name || ""
    );
    this.quickDocketTableForm.controls["toCity"].setValue(
      this.quickDocketTableForm.value.toCity?.name || ""
    );
    this.quickDocketTableForm.controls["billingParty"].setValue(
      this.quickDocketTableForm.value?.billingParty.name || ""
    );
    this.quickDocketTableForm.controls["destination"].setValue(
      this.quickDocketTableForm.value?.destination.name || ""
    );
    this.quickDocketTableForm.controls["vehNo"].setValue(
      this.quickDocketTableForm.value?.vehNo.name || ""
    );

    let id = { _id: docketNo, isComplete: false,unloading: 0, lsNo: "", mfNo: "",unloadloc:"",entryBy:this.userName,entryDate:new Date().toISOString()};

    let docketDetails = { ...this.quickDocketTableForm.value, ...id };

    let reqBody = {
      companyCode: this.companyCode,
      collectionName: "docket",
      data: docketDetails
    };
    this.operationService.operationMongoPost("generic/create", reqBody).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Booked SuccesFully",
          text: "DocketNo: " + docketNo,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the desired page after the success message is confirmed.
            this._NavigationService.navigateTotab(
              1,
              "dashboard/GlobeDashboardPage"
            );
          }
        });
      },
    });
  }
    // Listen for page reload attempts
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      this.dowloadData();
      // Your custom message
      const confirmationMessage = 'Are you sure you want to leave this page? Your changes may not be saved.';
      // Set the custom message
      $event.returnValue = confirmationMessage;
  
    }
    dowloadData() {
      const failedRequests = this.failedApiService.getFailedRequests();
      if (failedRequests.length > 0) {
        this.retryAndDownloadService.downloadFailedRequests();
      }
    }
}
