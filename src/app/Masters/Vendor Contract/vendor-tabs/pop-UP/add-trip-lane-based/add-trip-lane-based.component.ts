import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { TripLaneBased } from "src/assets/FormControls/VendorContractControls/add-trip-lane-based";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";

@Component({
  selector: "app-add-trip-lane-based",
  templateUrl: "./add-trip-lane-based.component.html",
})
export class AddTripLaneBasedComponent implements OnInit {
  breadScrums = [
    {
      title: "Standard Charges",
      items: ["Vendor Contract"],
      active: "Standard Charges",
    },
  ];
  addtripLaneBasedTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tripLaneBasedFormControls: TripLaneBased;
  modeName: any;
  modeValue: any;
  locationName: any;
  locationValue: any;
  areaName: any;
  areaValue: any;
  vehicleCapacityName: any;
  vehicleCapacityValue: any;
  rateTypeValue: any;
  rateTypeName: any;
  modeDropdown = [
    {
      name:'mode/1',
      value:'01',
    },
    {
      name:'mode/2',
      value:'02',
    },
    {
      name:'mode/3',
      value:'03',
    },
  ]
  locationDropdown = [
    {
      name:'location/1',
      value:'01',
    },
    {
      name:'location/2',
      value:'02',
    },
    {
      name:'location/3',
      value:'03',
    },
  ]
  AreaDropdown = [
    {
      name:'Area/1',
      value:'01',
    },
    {
      name:'Area/2',
      value:'02',
    },
    {
      name:'Area/3',
      value:'03',
    },
  ]
  vehicleCapacityDropdown = [
    {
      name:'vehicleCapacity/1',
      value:'01',
    },
    {
      name:'vehicleCapacity/2',
      value:'02',
    },
    {
      name:'vehicleCapacity/3',
      value:'03',
    },
  ]
  rateTypeDropdown = [
    {
      name:'rateType/1',
      value:'01',
    },
    {
      name:'rateType/2',
      value:'02',
    },
    {
      name:'rateType/3',
      value:'03',
    },
  ]

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private Route: Router
  ) {}

  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    this.tripLaneBasedFormControls = new TripLaneBased();
    // Get form controls for job Entry form section
    this.jsonControlArray =
      this.tripLaneBasedFormControls.getTripLaneBasedArrayControls();
    // Build the form group using formGroupBuilder function
    this.jsonControlArray.forEach((data) => {
      if (data.name === "mode") {
        this.modeName = data.name;
        this.modeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "location") {
        this.locationName = data.name;
        this.locationValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "area") {
        this.areaName = data.name;
        this.areaValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "rateType") {
        this.rateTypeName = data.name;
        this.rateTypeValue = data.additionalData.showNameAndValue;
      }
      if (data.name === "vehicleCapacity") {
        this.vehicleCapacityName = data.name;
        this.vehicleCapacityValue = data.additionalData.showNameAndValue;
      }
    });
    this.addtripLaneBasedTableForm = formGroupBuilder(this.fb, [this.jsonControlArray,]);
    this.Getmode();
    this.Getlocation();
    this.GetArea();
    this.GetVehicleCapacity();
    this.GetRateType();
  }
  Getmode() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addtripLaneBasedTableForm,
      this.modeDropdown,
      this.modeName,
      this.modeValue
      );
    // this.GetVendorName()
  }
  Getlocation() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addtripLaneBasedTableForm,
      this.locationDropdown,
      this.locationName,
      this.locationValue
      );
    // this.GetVendorName()
  }
  GetArea() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addtripLaneBasedTableForm,
      this.AreaDropdown,
      this.areaName,
      this.areaValue
      );
    // this.GetVendorName()
  }
  GetVehicleCapacity() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addtripLaneBasedTableForm,
      this.vehicleCapacityDropdown,
      this.vehicleCapacityName,
      this.vehicleCapacityValue
      );
    // this.GetVendorName()
  }
  GetRateType() {
    this.filter.Filter(
      this.jsonControlArray,
      this.addtripLaneBasedTableForm,
      this.rateTypeDropdown,
      this.rateTypeName,
      this.rateTypeValue
      );
    // this.GetVendorName()
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  SubmitFunction() {
    console.log(
      "this.standardChargesTableForm",
      this.addtripLaneBasedTableForm.value
    );
  }
  cancel(){
    this.Route.navigateByUrl("/Masters/VendorContract/VendorIndex");
  }
}

