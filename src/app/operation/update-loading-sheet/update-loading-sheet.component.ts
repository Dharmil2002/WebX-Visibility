import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from '@angular/router';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { MarkArrivalComponent } from 'src/app/dashboard/ActionPages/mark-arrival/mark-arrival.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import Swal from 'sweetalert2';
import { Shipment, autoBindData, filterShipments, kpiData } from '../shipment';
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
  constructor(private Route: Router, private dialog: MatDialog, public dialogRef: MatDialogRef<MarkArrivalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpClient, private fb: UntypedFormBuilder,private cdr: ChangeDetectorRef,private cnoteService: CnoteService) {
    this.shipmentStatus = 'Unloaded'
    this.arrivalData = item;
    this.getShippningData();
    this.IntializeFormControl()
  }
  getShippningData() {


    this.data = this.cnoteService.getVehicleArrivalData();
    let tableArray = this.data['shippingData'];
    // const shippingData = tableArray.map(shipData => {
    //   return { ...shipData, Pending: shipData.Packages };
    // });
    let shipments: Shipment[] = tableArray.map(shipData => {
      return { ...shipData, Pending: shipData.Packages };
    });;
    let filteredShipments = filterShipments(shipments, this.arrivalData?.Route, this.currentBranch);
    // const filteredData = this.filterShipmentsByRouteAndLocation(tableArray, this.arrivalData?.Route, this.arrivalData?.ArrivalLocation);
    // this.csv = shippingData.filter((item) => item.routes.trim() == this.arrivalData?.Route.trim() && item.Leg.trim() == this.arrivalData.Leg.trim());
    this.csv = filteredShipments;

    this.boxData = kpiData(this.csv, this.shipmentStatus, "");
    this.tableload = false;

    let shipingTableData = this.csv;
    let shipingTableDataArray: any = []
    shipingTableData.forEach(element => {
      let uniqueShipments = {};
      this.data.packagesData.forEach(x => {
        if (x.Leg.trim() === element.Leg && x.Routes === element.routes) {
          uniqueShipments[x.Shipment] = true;
        }
      });
      let packageData = this.data.packagesData.filter(x => x.Leg.trim() === element.Leg && x.Routes === element.routes);
      let totalWeightKg = packageData.reduce((total, current) => total + current.KgWeight, 0);
      let totalVolumeCFT = packageData.reduce((total, current) => total + current.CftVolume, 0)
      let shipingJson = {
        Leg: element?.Leg || '',
        Shipment: [uniqueShipments].length,
        Packages: element?.Packages || 0,
        WeightKg: totalWeightKg,
        VolumeCFT: totalVolumeCFT
      }
      shipingTableDataArray.push(shipingJson)
    });
    this.shipingDataTable = shipingTableDataArray;


  }
  updatePackage() {
    this.tableload=true;
    // Get the trimmed values of scan and leg
    const scanValue = this.loadingSheetTableForm.value.Scan.trim();
    ///const legValue = this.arrivalData.Leg.trim();
    const legValue = this.arrivalData.Route.trim();

    // Find the unload package based on scan and leg values
    const unloadPackage = this.data.packagesData.find(x => x.PackageId.trim() === scanValue && x.Routes.trim() === legValue);

    // Check if the unload package exists
    if (!unloadPackage) {
      // Package does not belong to the current branch
      Swal.fire({
        icon: "error",
        title: "Not Allow to Unload Package",
        text: "This package does not belong to the current branch.",
        showConfirmButton: true,
      });
      return;
    }
    //if Destination is Not Belongs to Currect location then to allow to unload a packaged
    if (unloadPackage.Destination.trim() !== this.currentBranch) {
      Swal.fire({
        icon: "error",
        title: "Not Allow to Unload Package",
        text: "This package does not belong to the current branch.",
        showConfirmButton: true,
      });
      return;
    }
    // Check if the package is already scanned
    if (unloadPackage.ScanFlag) {
      Swal.fire({
        icon: "info",
        title: "Already Scanned",
        text: "Your Package ID is already scanned.",
        showConfirmButton: true,
      });
      return;
    }

    // Find the element in csv array that matches the shipment
    const element = this.csv.find(e => e.Shipment === unloadPackage.Shipment);

    // Check if the element exists and the number of unloaded packages is less than the total packages
    if (!element || (element.hasOwnProperty('Unloaded') && element.Packages <= element.Unloaded)) {
      // Invalid operation, packages must be greater than Unloaded
      Swal.fire({
        icon: "error",
        title: "Invalid Operation",
        text: "Cannot perform the operation. Packages must be greater than Unloaded.",
        showConfirmButton: true,
      });
      return;
    }

    // Update Pending and Unloaded counts
    element.Pending--;
    element.Unloaded = (element.Unloaded || 0) + 1;
    unloadPackage.ScanFlag = true;

    // Prepare kpiData
    const event = {
      shipment: this.csv.length,
      Package: element.Unloaded,
    };

    // Call kpiData function
    this.boxData = kpiData(this.csv, this.shipmentStatus, event);
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
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new UpdateloadingControl();
    this.jsonControlArray = ManifestGeneratedFormControl.getupdatelsFormControls();
    this.jsonscanControlArray = ManifestGeneratedFormControl.getScanFormControls();
    this.updateListData = this.jsonControlArray.filter((x) => x.name != "Scan");
    this.Scan = this.jsonControlArray.filter((x) => x.name == "Scan");

    this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
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
  // GetShipmentDet() {
  //   this.http.get(this.packageUrl).subscribe(res => {
  //     this.shipmentdet = res;
  //     const matchingPackages = this.shipmentdet.filter((item: any) => {
  //       
  //       return (
  //         item.PackageId === this.ScanTableForm.value.Shipment &&
  //         item.shipment === this.csv[0].shipment
  //       );
  //     });
  //     
  //     if (matchingPackages.length > 0) {
  //       console.log('Match found');
  //     } else {
  //       console.log('No match found');
  //     }
  //   });
  // }

}
