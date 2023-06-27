import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from '@angular/router';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { MarkArrivalComponent } from 'src/app/dashboard/ActionPages/mark-arrival/mark-arrival.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import Swal from 'sweetalert2';
import { Shipment, autoBindData, filterShipments, kpiData } from '../shipment';
import { updatePending } from './loadingSheetshipment';
import { groupShipmentsByLeg } from './shipmentsUtils';
import { handlePackageUpdate } from './packageUtils';

@Component({
  selector: 'app-update-loading-sheet',
  templateUrl: './update-loading-sheet.component.html'
})
export class UpdateLoadingSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
  packageUrl = '../../../assets/data/package-data.json'
  tableload = true;
  csv: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  currentBranch: string = localStorage.getItem("Branch") || '';
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  jsonscanControlArray: any;
  shipingHeader = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  columnHeader = {
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "Unloaded": "Unloaded",
    "Pending": "Pending",
    "Leg": "Leg",
  }
  shipmentStatus: string = 'Unloaded';
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "Unloaded": "Unloaded",
    "Pending": "Pending",
    "Leg": "Leg"
  }
  shipingHeaderForCsv = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  //declaring breadscrum
  breadscrums = [
    {
      title: "Update Loading Sheet",
      items: ["Home"],
      active: "Update Loading Sheet"
    }
  ]
  toggleArray = []
  menuItems = []
  linkArray = []
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  loadingData: any;
  formdata: any;
  arrivalData: any;
  boxData: { count: any; title: any; class: string; }[];
  updateListData: any;
  Scan: any;
  shipingDataTable: any;

  
  constructor(
    private Route: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<MarkArrivalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpClient,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private cnoteService: CnoteService
  ) {
    // Set the initial shipment status to 'Unloaded'
    this.shipmentStatus = 'Unloaded';
  
    // Assign the item to the arrivalData property
    this.arrivalData = item;
  
    // Call the getShippningData() function to fetch shipping data
    this.getShippningData();
  
    // Initialize form controls for the loading sheet table
    this.IntializeFormControl();
  }
  

  getShippningData() {
    // Get vehicle arrival data
    this.data = this.cnoteService.getVehicleArrivalData();
    let tableArray = this.data['shippingData'];
  
    // Update pending shipments
    let shipments = updatePending(tableArray, this.currentBranch, false, true);
  
    // Filter shipments based on route and branch
    let filteredShipments = filterShipments(shipments, this.arrivalData?.Route, this.currentBranch);
  
    // Update CSV and boxData
    this.csv = filteredShipments;
    this.boxData = kpiData(this.csv, this.shipmentStatus, "");
    this.tableload = false;
  
    let shipingTableData = this.csv;
    let packagesData = this.data.packagesData;
  
    // Group shipments by leg using the utility function
    let shipingTableDataArray = groupShipmentsByLeg(shipingTableData);
  
    // Set the leg of the arrivalData
    this.arrivalData.Leg = shipingTableData[0]?.Leg;
  
    // Set the shipingDataTable to the grouped data
    this.shipingDataTable = shipingTableDataArray;
  }


  updatePackage() {
   
    this.tableload = true;

  const scanValue = this.loadingSheetTableForm.value.Scan.trim();
  const legValue = this.arrivalData.Route.trim();

  // Call the imported function to handle the logic
  let PackageUpdate =handlePackageUpdate(scanValue, legValue, this.currentBranch, this.data, this.csv, this.boxData, this.cdr);
    // Call kpiData function
    if(PackageUpdate){
    this.boxData = kpiData(this.csv, this.shipmentStatus, PackageUpdate);
    }
    this.cdr.detectChanges(); // Trigger change detection
    this.tableload=false;
  }


  setArrivalDataBindData() {
    autoBindData(this.loadingSheetTableForm.controls, {
      // Bind vehicle data to the 'vehicle' control
      vehicle: this.arrivalData?.VehicleNo,

      // Bind route data to the 'Route' control, or use RouteandSchedule as fallback
      Route: this.arrivalData?.Route || this.arrivalData?.RouteandSchedule,

      // Bind tripID data to the 'tripID' control
      tripID: this.arrivalData?.TripID,

      // Bind ArrivalLocation data to the 'ArrivalLocation' control,
      // or use location as fallback
      ArrivalLocation: this.currentBranch,

      // Bind Unoadingsheet data to the 'Unoadingsheet' control,
      // or use loadingSheetNo as fallback
      Unoadingsheet: this.arrivalData?.Unoadingsheet || this.arrivalData?.loadingSheetNo,

      // Bind Leg data to the 'Leg' control
      Leg: this.arrivalData?.Leg
    });

  }
  ngOnInit(): void {
  }
/**
 * Function to initialize form controls for the loading sheet table
 */

IntializeFormControl() {
  // Create an instance of UpdateloadingControl
  const ManifestGeneratedFormControl = new UpdateloadingControl();

  // Get the form controls for the update list
  this.jsonControlArray = ManifestGeneratedFormControl.getupdatelsFormControls();

  // Get the form controls for the scan
  this.jsonscanControlArray = ManifestGeneratedFormControl.getScanFormControls();

  // Filter out the "Scan" control from the update list
  this.updateListData = this.jsonControlArray.filter((x) => x.name != "Scan");

  // Get only the "Scan" control
  this.Scan = this.jsonControlArray.filter((x) => x.name == "Scan");

  // Build the form group using the form control array
  this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

  // Set the arrival data binding
  this.setArrivalDataBindData();
}

  IsActiveFuntion($event) {
    this.loadingData = $event
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


  CompleteScan() {
    let packageChecked = false;
    let locationWiseData = this.csv.filter((x) => x.Destination === this.currentBranch);
    const exists = locationWiseData.some(obj => obj.hasOwnProperty("Unloaded"));
    if (exists) {
      packageChecked = locationWiseData.every(obj => obj.Packages === obj.Unloaded);
    }
    if (packageChecked) {
  
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Arrival Scan done Successfully`,
          showConfirmButton: true,
        })
        this.dialogRef.close(this.loadingSheetTableForm.value)
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Unload Package",
        text: `Please Unload All  Your Package`,
        showConfirmButton: true,
      })
    }

  }
  Close(): void {
    this.dialogRef.close()
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }

}
