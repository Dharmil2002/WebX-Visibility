import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { vehicleLoadingControl } from '../../../assets/FormControls/vehicleloading';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VehicleUpdateUploadComponent } from '../vehicle-update-upload/vehicle-update-upload.component';
import { ViewPrintComponent } from '../view-print/view-print.component';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { setFormControlValue } from 'src/app/Utility/commonFunction/setFormValue/setFormValue';
@Component({
  selector: 'app-vehicle-loading',
  templateUrl: './vehicle-loading.component.html'
})
export class VehicleLoadingComponent implements OnInit {
  vehicleLoadingTableForm: UntypedFormGroup; // Declaration of UntypedFormGroup for vehicle loading table
  tripData: any; // Declaration of tripData variable
  jsonControlArray: any; // Declaration of jsonControlArray variable
  orgBranch: string = localStorage.getItem("Branch"); // Retrieve value from localStorage for orgBranch
  
  // Declaring breadscrum
  breadscrums = [
      {
          title: "vehicle-loading",
          items: ["Loading-Sheet"],
          active: "vehicle-loading"
      }
  ];
  
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw';
  
  columnHeader = {
      "LoadingSheet": "Loading Sheet",
      "Manifest": "Manifest",
      "Leg": "Leg",
      "Shipments": "Shipments",
      "Packages": "Packages",
      "ShipmentsLoaded": "ShipmentsLoaded",
      "PackagesLoaded": "PackagesLoaded",
      "Pending": "Pending",
      "Action": "Action",
      "printPending": "Print"
  };
  
  centerAlignedData = ['Shipments', 'Packages', 'ShipmentsLoaded', 'PackagesLoaded', 'Pending'];
  
  // Declaring Csv File's Header as key and value Pair
  headerForCsv = {
      "LoadingSheet": "Loading Sheet",
      "Manifest": "Manifest",
      "Leg": "Leg",
      "Shipments": "Shipments",
      "Packages": "Packages",
      "ShipmentsLoaded": "ShipmentsLoaded",
      "PackagesLoaded": "PackagesLoaded",
      "Pending": "Pending"
  };
  
  toggleArray = [];
  linkArray = [
      { Row: 'Action', Path: '' },
      { Row: 'printPending', Path: '' },
  ];
  
  menuItems = [
      { label: 'Load Vehicle', componentDetails: VehicleUpdateUploadComponent, function: "GeneralMultipleView" },
      { label: 'printPending', componentDetails: ViewPrintComponent, function: "GeneralMultipleView" },
      // Add more menu items as needed
  ];
  
  dynamicControls = {
      add: false,
      edit: false,
      //csv: true
  };
  
  csv: any;
  data: Object;
  tableload: boolean = true;
  
  constructor(
    private Route: Router, // Injecting Router service
    private CnoteService: CnoteService, // Injecting CnoteService
    private navigationService: NavigationService, // Injecting NavigationService
    private operationService: OperationService, // Injecting OperationService
    private fb: UntypedFormBuilder // Injecting UntypedFormBuilder
) {
    // Check if there is data in the state passed through navigation
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
        // Retrieve the data from the state
        this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    
    this.IntializeFormControl(); // Call the IntializeFormControl() method
}

 IntializeFormControl() {
    // Create an instance of vehicleLoadingControl class
    const vehicleLoadingControls = new vehicleLoadingControl();

    // Get the form controls from the vehicleLoadingControls instance
    this.jsonControlArray = vehicleLoadingControls.getvehiceLoadingFormControls();

    // Build the form group using the form controls obtained
    this.vehicleLoadingTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
}

ngOnInit(): void {
  this.autofillvehicleData();
}

autofillvehicleData() {
  // Set the value of 'Vehicle' form control with tripData's VehicleNo or an empty string
  setFormControlValue(this.vehicleLoadingTableForm.controls['Vehicle'], (this.tripData?.VehicleNo || ''));

  // Set the value of 'Route' form control with tripData's RouteandSchedule or an empty string
  setFormControlValue(this.vehicleLoadingTableForm.controls['Route'], (this.tripData?.RouteandSchedule || ''));

  // Set the value of 'TripID' form control with tripData's TripID or an empty string
  setFormControlValue(this.vehicleLoadingTableForm.controls['TripID'], (this.tripData?.TripID || ''));

  // Set the value of 'LoadingLocation' form control with orgBranch or an empty string
  setFormControlValue(this.vehicleLoadingTableForm.controls['LoadingLocation'], (this.orgBranch || ''));

  // Call the getLoadingSheetData() method
  this.getLoadingSheetData();
}

getLoadingSheetData() {
  // Call the operationService to get JSON file details from 'arrivalUrl'
  this.operationService.getJsonFileDetails('arrivalUrl').subscribe(res => {
      this.data = res;

      let loadingSheetData = this.CnoteService.getVehicleLoadingSheetData(); // Call the function to get the actual data

      // Rest of the code...
      let dataLoading: any[] = [];
      if (loadingSheetData) {
          loadingSheetData.forEach((element: any) => { // Specify the type of 'element' as 'any'
              let json = {
                  LoadingSheet: element?.LoadingSheet || '',
                  Manifest: '',
                  Leg: element?.lag || '',
                  Shipments: element?.Shipment || '',
                  Packages: element?.Packages || '',
                  ShipmentsLoaded: 0,
                  PackagesLoaded: 0,
                  Pending: element?.Shipment || '',
                  Action: 'Load Vehicle',
                  printPending: 'print'
              };
              dataLoading.push(json);
          });
      }

      this.tableload = false;
      this.csv = dataLoading;
      this.CnoteService.setvehicelodingData(this.tripData);
  });
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
  goBack(tabIndex: number): void {
    this.navigationService.navigateTotab(tabIndex,'/dashboard/GlobeDashboardPage');
  }
}
