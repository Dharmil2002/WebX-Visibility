import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { loadingControl } from 'src/assets/FormControls/loadingSheet';
import { Router } from '@angular/router';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { LodingSheetGenerateSuccessComponent } from '../loding-sheet-generate-success/loding-sheet-generate-success.component';
import { LoadingSheetViewComponent } from '../loading-sheet-view/loading-sheet-view.component';
import { filterDataByLocation, groupShipments } from './loadingSheetCommon';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { setFormControlValue } from 'src/app/Utility/commonFunction/setFormValue/setFormValue';
import { removeDuplicateObjects } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';

@Component({
  selector: 'app-create-loading-sheet',
  templateUrl: './create-loading-sheet.component.html'
})
export class CreateLoadingSheetComponent implements OnInit {
  tableload = true;
  addAndEditPath: string;
  uploadComponent: any;
  loadingSheetData: any;
  csvFileName: string; // Name of the CSV file, when data is downloaded. You can also use a function to generate filenames based on dateTime.
  dynamicControls = {
      add: false,
      edit: false,
      csv: true
  };
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw';
  menuItems = [
      { label: 'count', componentDetails: LoadingSheetViewComponent },
      // Add more menu items as needed
  ];
  // Declaring breadcrumbs
  breadscrums = [
      {
          title: "Create-Loading-Sheet",
          items: ["Loading-Sheet"],
          active: "Loading-Sheet"
      }
  ];
  linkArray = [
      { Row: 'count', Path: '' }
  ];
  toggleArray = [];
  menuItemflag: boolean = true;
  isShipmentUpdate: boolean = false;
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tripData: any;
  extraData: any;
  vehicleType: any;
  vehicleTypeStatus: any;
  orgBranch: string = localStorage.getItem("Branch");
  shipmentData: any;
  tableData: any[];
  columnHeader = {
      "checkBoxRequired": "",
      "leg": "Leg",
      "count": "Shipments",
      "Packages": "Packages",
      "WeightKg": "Weight Kg",
      "VolumeCFT": "Volume CFT"
  };
  centerAlignedData = ['Shipment', 'Packages', 'WeightKg', 'VolumeCFT'];
  // Declaring CSV file's header as key and value pair
  headerForCsv = {
      "RouteandSchedule": "Leg",
      "Shipments": "Shipments",
      "Packages": "Packages",
      "WeightKg": "Weight Kg",
      "VolumeCFT": "Volume CFT"
  };
  
  METADATA = {
      checkBoxRequired: false,
      // selectAllorRenderedData : false,
      noColumnSort: ['checkBoxRequired']
  };
  loadingData: any;
  shippingData: any;
  listDepartueDetail: any;
  getloadingFormData: any;
  legWiseData: any;
  updatedShipment: any[] = [];
  companyCode=parseInt(localStorage.getItem("companyCode"));
  packagesScan: any;
  constructor(
    private Route: Router,
    private CnoteService: CnoteService,
    private operationService: OperationService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils
) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
        // Retrieve tripData and shippingData from the navigation state
        this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data?.columnData || this.Route.getCurrentNavigation()?.extras?.state.data;
        this.shippingData = this.Route.getCurrentNavigation()?.extras?.state.shipping;

        // Check if tripData meets the condition for navigation
        const routeMap = {
            "DEPART VEHICLE": 'Operation/DepartVehicle',
            "Vehicle Loading": 'Operation/VehicleLoading',
        };

        const route = routeMap[this.tripData.Action];

        if (route) {
            this.navigationService.navigateTo(route, this.tripData);
        }

        // Check if shippingData exists
        if (this.shippingData) {
            // Get loading form data and set isShipmentUpdate flag
            this.getloadingFormData = this.CnoteService.getData();
            this.isShipmentUpdate = true;
        }
    }

    // Initialize form controls
    this.IntializeFormControl();

    // Auto-bind data
    this.autoBindData();
}

  autoBindData() {
    // Set the value of 'vehicle' form control with tripData's VehicleNo or getloadingFormData's vehicle or an empty string
    setFormControlValue(this.loadingSheetTableForm.controls['vehicle'], this.tripData?.VehicleNo, this.getloadingFormData?.vehicle, '');

    // Set the value of 'Route' form control with tripData's RouteandSchedule or getloadingFormData's Route or an empty string
    setFormControlValue(this.loadingSheetTableForm.controls['Route'], this.tripData?.RouteandSchedule, this.getloadingFormData?.Route, '');

    // Set the value of 'tripID' form control with tripData's TripID or getloadingFormData's TripID or an empty string
    setFormControlValue(this.loadingSheetTableForm.controls['tripID'], this.tripData?.TripID, this.getloadingFormData?.TripID, '');

    // Set the value of 'Expected' form control with tripData's Expected or getloadingFormData's Expected or an empty string
    setFormControlValue(this.loadingSheetTableForm.controls['Expected'], this.tripData?.Expected, this.getloadingFormData?.Expected, '');

    // Set the value of 'LoadingLocation' form control with the value retrieved from localStorage for 'Branch'
    setFormControlValue(this.loadingSheetTableForm.controls['LoadingLocation'], localStorage.getItem('Branch'), '');

    this.vehicleTypeDropdown(); // Call the vehicleTypeDropdown() method
}

IntializeFormControl() {
  // Create an instance of loadingControl class
  const loadingControlFormControls = new loadingControl();

  // Get the form controls from the loadingControlFormControls instance
  this.jsonControlArray = loadingControlFormControls.getMarkArrivalsertFormControls();

  // Loop through the jsonControlArray to find the vehicleType control and set related properties
  this.jsonControlArray.forEach(data => {
      if (data.name === 'vehicleTypecontrolHandler') {
          this.vehicleType = data.name;
          this.vehicleTypeStatus = data.additionalData.showNameAndValue;
      }
  });

  // Build the form group using the form controls obtained
  this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
}

  ngOnInit(): void {

  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

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
  
  IsActiveFuntion($event) {
    // Assign the value of $event to the loadingData property
    this.loadingData = $event;
}

// Function to retrieve vehicle types from JSON file and populate the dropdown
vehicleTypeDropdown() {
  
  this.operationService.getJsonFileDetails('loadingJsonUrl').subscribe(res => {
      this.loadingSheetData = res;
      let vehicleType: any[] = [];
      if (this.loadingSheetData) {
          this.loadingSheetData.data[0].forEach(element => {
              let json = {
                  name: element.Type_Name,
                  value: element.Type_Code,
              };
              vehicleType.push(json);
          });
      }
      // Apply filter to control array based on vehicle types
      this.filter.Filter(
          this.jsonControlArray,
          this.loadingSheetTableForm,
          vehicleType,
          this.vehicleType,
          this.vehicleTypeStatus
      );
      // Set the default vehicle type if it matches any in the dropdown options
      let vehicleTypeDetails = vehicleType.find((x) => x.name.trim() == this.tripData?.VehicleType.trim() || '');
      if (vehicleTypeDetails) {
          this.loadingSheetTableForm.controls['vehicleType'].setValue(vehicleTypeDetails);
          this.vehicleTypeDataAutofill();
      }
  });
  // Retrieve shipment data
  this.getshipmentData()
  
}

// Function to retrieve departure details based on the route
getDepartueDetail(route) {
  this.operationService.getJsonFileDetails('departureJsonUrl').subscribe(res => {
      this.listDepartueDetail = res;
      // Find the departure detail that matches the given route
      this.tripData = this.listDepartueDetail.data.find((x) => x.RouteandSchedule == route);
      if (!this.getloadingFormData) {
          // Auto-bind data if loading form data is not available
          this.autoBindData();
      }
  });
}
// Function to retrieve shipment data
getshipmentData() {
  debugger
  if (!this.isShipmentUpdate) {
      let routeDetail = this.tripData?.RouteandSchedule.split(":")[1].split("-");
      routeDetail = routeDetail.map(str => String.prototype.replace.call(str, ' ', ''));
      // Update route details if shipment is not being updated
  }
  const req = {
    companyCode: this.companyCode,
    type: "operation",
    collection: "docket",
  };
  this.operationService.operationPost("common/getall", req).subscribe(res => {
          this.shipmentData = res.data;
          // Filter shipment data based on location and trip details
          const filterData = filterDataByLocation(this.shipmentData, this.tripData, this.orgBranch);
        const shipingfilterData = filterData.legWiseData;
          

      // Call the function to group shipments based on criteria
      const groupedShipments = groupShipments(shipingfilterData);
      console.log(groupedShipments);
      this.tableData = groupedShipments;
      this.tableload = false;
  });
}
// Function to autofill vehicle type data
vehicleTypeDataAutofill() {
  // Check if tripID is not already set
  if (!this.loadingSheetTableForm.controls['tripID'].value) {
      const randomNumber = "TH/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
      this.loadingSheetTableForm.controls['tripID'].setValue(randomNumber);
      // Generate and set a random tripID if not already set
  }

  let loadingSheetDetails = this.loadingSheetData.data[0].find((x) => x.Type_Code == this.loadingSheetTableForm.value?.vehicleType.value || '');
  // Find the matching vehicle type details

  if (loadingSheetDetails) {
      // Set control values based on loading sheet details
      const controlNames = [
          'CapacityKg',
          'CapacityVolumeCFT',
          'LoadaddedKg',
          'LoadedKg',
          'LoadedvolumeCFT',
          'VolumeaddedCFT',
          'VolumeUtilization',
          'WeightUtilization',
      ];

      controlNames.forEach(controlName => {
          this.loadingSheetTableForm.controls[controlName].setValue(loadingSheetDetails[controlName] || '');
      });

      this.CnoteService.setData(this.loadingSheetTableForm.value);
      // Set form data and save to service
  }
}

  loadingSheetGenerate() {

    if (!this.loadingSheetTableForm.value.vehicle) {
      SwalerrorMessage("error", "Please Enter Vehicle No", "", true);
    }
    else {
      if (this.loadingData) {

        let shipmentUpdatedData = removeDuplicateObjects(this.updatedShipment);
        /*Set value of updated  shipment*/
        this.CnoteService.setUpdatedShipmentData(shipmentUpdatedData[0]);
        /* End */
        let unmatchedRecords = this.loadingData.filter((record) => {
          return this.legWiseData.some((item) => item.Leg !== record.lag);
        });
        // Check if BcSerialType is "E"
        // If it is "E", set displaybarcode to true
        // Open a modal using the content parameter passed to the function

        if (unmatchedRecords.length <= 0) {
          const dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent> = this.dialog.open(LodingSheetGenerateSuccessComponent, {
            width: '100%', // Set the desired width
            data: this.loadingData // Pass the data object
          });

          dialogRef.afterClosed().subscribe(result => {
            let lsData = [this.tripData]
            lsData.forEach((x) => {
              x.VehicleNo = this.loadingSheetTableForm.value.vehicle,
                x.TripID = this.loadingSheetTableForm.value.tripID,
                x.loadingSheetNo = result[0].LoadingSheet,
                x.VehicleType = this.loadingSheetTableForm.value?.vehicleType.value || ''
              x.Action = "Vehicle Loading"
            })
            this.CnoteService.setLsData(lsData);
            this.goBack(3);
            // Handle the result after the dialog is closed
          });
        } else {
          SwalerrorMessage("error", "Please Select Only For Your Leg", "", true);
        }
      }
      else {
        SwalerrorMessage("error", "Please Select Any one Record", "", true);
      }
    }
  }
  updateLoadingData(event) {
    this.updatedShipment.push(event.shipping);
    let packages = event.shipping.reduce((total, current) => total + current.Packages, 0);
    let totalWeightKg = event.shipping.reduce((total, current) => total + current.KgWeight, 0);
    let totalVolumeCFT = event.shipping.reduce((total, current) => total + current.CftVolume, 0)
    this.tableData.find((x) => {
      if (x.leg === event.shipping[0].Leg) {
        x.Shipment = event.shipping.length,
          x.WeightKg = totalWeightKg,
          x.VolumeCFT = totalVolumeCFT,
          x.Packages = packages
      }
    });
    // this.getshipmentData(event) 
  }
  goBack(tabIndex: number): void {
    this.navigationService.navigateTotab(tabIndex, '/dashboard/GlobeDashboardPage')
  }
}
