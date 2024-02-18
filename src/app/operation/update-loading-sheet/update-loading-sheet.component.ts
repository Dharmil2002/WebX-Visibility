import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from '@angular/router';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { MarkArrivalComponent } from 'src/app/dashboard/ActionPages/mark-arrival/mark-arrival.component';
import Swal from 'sweetalert2';
import { autoBindData, filterShipments, kpiData } from '../shipment';
import { vehicleStatusUpdate } from './loadingSheetshipment';
import { groupShipmentsByLeg, updateTracking } from './shipmentsUtils';
import { handlePackageUpdate } from './packageUtils';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getNextLocation } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { ArrivalVehicleService } from 'src/app/Utility/module/operation/arrival-vehicle/arrival-vehicle.service';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/core/service/storage.service';

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
  companyCode: number = parseInt(localStorage.getItem('companyCode'));
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  jsonscanControlArray: any;
  scanPackage: string;
  shipingHeader = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  columnHeader = {
    "Shipment": "Shipment",
    "Suffix":"Suffix",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "Unloaded": "Unloaded",
    "Pending": "Pending",
    "Leg": "Leg",
  }
  centerShippingData = ['Shipment', 'Suffix', 'Packages', 'WeightKg', 'VolumeCFT'];
  centerAlignedData = ['Shipment', 'Suffix', 'Packages', 'Unloaded', 'Pending'];
  columnWidths = {
    'Shipment': 'min-width:20%'
  };
  shipmentStatus: string = 'Unloaded';
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "Shipment": "Shipment",
    "Suffix":"Suffix",
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
      title: "Vehicle Unloading",
      items: ["Home"],
      active: "Vehicle Unloading"
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
  scanPkgs:string[]=[];
  boxData: { count: any; title: any; class: string; }[];
  updateListData: any;
  Scan: any;
  shipingDataTable: any;
  packageData: any;
  updateTrip: any;
  mfNos: string[];

  scanMessage: string = '';
  @ViewChild('scanPackageInput') scanPackageInput: ElementRef;

  constructor(
    private Route: Router,
    public dialogRef: MatDialogRef<MarkArrivalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private _operation: OperationService,
    private cdr: ChangeDetectorRef,
    private storage:StorageService,
    private arrivalService: ArrivalVehicleService
  ) {

    // Set the initial shipment status to 'Unloaded'
    this.shipmentStatus = 'Unloaded';

    // Assign the item to the arrivalData property
    this.arrivalData = item;

    // Call the getShippningData() function to fetch shipping data
    this.getLoadingSheetDetail();
    // Initialize form controls for the loading sheet table
    this.IntializeFormControl();
  }

  async getLoadingSheetDetail() {
    
    const shipmentData = await this.arrivalService.getThcWiseMeniFest({tHC:this.arrivalData?.TripID,dEST:this.storage.branch,"D$or":[{iSDEL:{"D$exists":false}},{iSDEL:""}]});
    if(!shipmentData)
      return;
    this.mfNos = shipmentData.map((x)=>x.mFNO);

    this.csv = shipmentData.map((shipment) => ({
      Shipment: shipment.dKTNO||"",
      Origin: shipment.oRG||"",
      Destination: shipment?.dEST||"",
      Suffix: shipment?.sFX||0,
      Packages: parseInt(shipment.pKGS),
      Unloaded: 0,
      Pending: parseInt(shipment.pKGS),
      Leg: shipment?.lEG||"",
      KgWt: shipment?.wT||"",
      mfNo:shipment?.docNo||"",
      CftVolume: shipment?.vOL || ""
    }));
    this.boxData = kpiData(this.csv, this.shipmentStatus, "");
    this.tableload = false;
    let shipingTableData = this.csv;
    // Group shipments by leg using the utility function
    let shipingTableDataArray = groupShipmentsByLeg(shipingTableData);
    // Set the leg of the arrivalData
    this.arrivalData.Leg = shipingTableData[0]?.Leg;
    // Set the shipingDataTable to the grouped data
    this.shipingDataTable = shipingTableDataArray;
    this.getPackagesData();
  }
  async getPackagesData() {    
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "docket_pkgs_ltl",
      "filter": {"mFNO":{"D$in": this.mfNos}}
    }
    const res= await firstValueFrom(this._operation.operationMongoPost('generic/get', reqBody));
    this.packageData = res.data;
  }

  updatePackage() {
    if (this.scanPackage) {
      this.tableload = true;
      const scanValue = this.scanPackage.trim();
      const legValue = this.arrivalData.Route.trim();
      // Call the imported function to handle the logic
      let PackageUpdate = handlePackageUpdate(scanValue, legValue, this.currentBranch, this.packageData, this.csv, this.boxData, this.cdr);
      // Call kpiData function
      if (PackageUpdate) {
        const { status, ...options}  = PackageUpdate;
        if(!status) {
          this.scanMessage = options.text;         
        }
        else {          
          this.boxData = kpiData(this.csv, this.shipmentStatus, PackageUpdate);
          this.scanPkgs.push(scanValue);
          this.scanMessage = '';          
        }
      }
      this.cdr.detectChanges(); // Trigger change detection
      this.tableload = false;
      this.clearAndFocusOnScan();
    }
    else {
      this.scanMessage = `Please Enter Package No`;
      this.clearAndFocusOnScan();
      return;
      // Swal.fire({
      //   icon: "error",
      //   title: "Scan Package",
      //   text: `Please Enter Package No`,
      //   showConfirmButton: true,
      // })
    }
  }
  
  clearAndFocusOnScan() {    
    this.scanPackage = '';    
    this.scanPackageInput.nativeElement.focus();
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


  async CompleteScan() {
    let packageChecked = false;
    let locationWiseData = this.csv.filter((x) => x.Destination === this.currentBranch);
    const exists = locationWiseData.some(obj => obj.hasOwnProperty("Unloaded"));

    if (exists) {
      packageChecked = locationWiseData.every(obj => obj.Packages === obj.Unloaded);
    }
    if (packageChecked) {
      const res=await this.arrivalService.fieldMappingArrivalScan(this.arrivalData,locationWiseData,this.packageData);
      if(res){
        this.dialogRef.close(this.loadingSheetTableForm.value)
        this.goBack('Departures')
      }
     // this.updateTripStatus();
    } else {
      Swal.fire({
        icon: "error",
        title: "Unload Package",
        text: `Please Unload All Your Package`,
        showConfirmButton: true,
      });
    }
  }

  async UpdateDocketDetail(dkt) {
    if (dkt) {
      await updateTracking(this.companyCode, this._operation, dkt,this.arrivalData?.TripID);
    }
    const reqbody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collectionName": "docket",
      "filter": { docketNumber: dkt },
      "update": {
        "unloading": 1,
        "unloadloc": this.currentBranch
      }
    };

    return new Promise((resolve, reject) => {
      this._operation.operationPut("generic/update", reqbody).subscribe({
        next: (res: any) => {
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        }
      });
    });
  }

  Close(): void {
    this.dialogRef.close()
    this.goBack('Departures')
  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
  async updateTripStatus() {
    const next = getNextLocation(this.arrivalData.Route.split(":")[1].split("-"), this.currentBranch);
    let tripDetails
    if (next) {
      tripDetails = {
        orgLoc: this.currentBranch,
        nextUpComingLoc: next,
        status: "Update Trip"
      }

      const result = await vehicleStatusUpdate(this.currentBranch, this.companyCode, this.arrivalData, this._operation, false);
    }
    else {
      tripDetails = {
        status: "close",
        nextUpComingLoc: "",
        closeTime: new Date()
      }
      try {
        // Call the vehicleStatusUpdate function here
        const result = await vehicleStatusUpdate(this.currentBranch, this.companyCode, this.arrivalData, this._operation, true);
        Swal.fire({
          icon: "info",
          title: "Trip is close",
          text: "Trip is close at" + this.currentBranch,
          showConfirmButton: true,
        });
        // Handle the result if needed
      } catch (error) {
        // Handle any errors that might occur
      }
    }

    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_detail",
      "filter": { _id: this.arrivalData.id },
      "update": {
        ...tripDetails,
      }
    }
    this._operation.operationPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (!next) {
          this.tripHistoryUpdate()
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `trip Close  Successfully`,//
            showConfirmButton: true,
          })
        }
        else {
          this.tripHistoryUpdate()
        }
      }
    })
  }

  tripHistoryUpdate() {

    let tripDetails = {
      arrivalBranch: this.currentBranch,
    }
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_transaction_history",
      "filter": { _id: this.arrivalData?.TripID },
      "update": {
        ...tripDetails
      }
    }
    this._operation.operationMongoPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Arrival Scan done Successfully`,
            showConfirmButton: true,
          })
       
        }
      }
    })
  }
 
}
