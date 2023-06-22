import { Component, OnInit,Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import Swal from 'sweetalert2';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
@Component({
  selector: 'app-vehicle-update-upload',
  templateUrl: './vehicle-update-upload.component.html'
})
export class VehicleUpdateUploadComponent implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
  packageUrl = '../../../assets/data/package-data.json'
  tableload = false;
  csv: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  jsonscanControlArray: any;
  currentBranch: string = localStorage.getItem("Branch") || '';
  columnHeader = {
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "loaded": "Loaded",
    "Pending": "Pending",
    "Leg": "Leg",
  }
  shipmentStatus: string = 'Loaded';
    //declaring breadscrum
    breadscrums = [
      {
        title: "Vehicle Loading Sheet",
        items: ["Home"],
        active: "Vehicle Loading Sheet"
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
  vehicelLoadData: any;
  constructor(private Route: Router, private dialog: MatDialog, public dialogRef: MatDialogRef<VehicleUpdateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpClient, private fb: UntypedFormBuilder, private cnoteService: CnoteService) { 
      if (item.LoadingSheet) {
        this.arrivalData = this.cnoteService.getVehicleLoadingData();
        this.shipmentStatus = 'Loaded'
        this.vehicelLoadData=item;
      }
      this.getShippningData();
      this.IntializeFormControl()
    }

  ngOnInit(): void {
  }
  getShippningData() {
  
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['shippingData'];
      const shippingData = tableArray.map(shipData => {
        return { ...shipData, Pending: shipData.Packages };
      });

        this.csv = shippingData.filter((item) => item.routes.trim() == this.arrivalData?.RouteandSchedule.trim() && item.Leg.trim() === this.vehicelLoadData.Leg.trim());

      this.kpiData("")

      this.tableload = false;

    });
  }
  updatePackage() {
      
      // Get the trimmed values of scan and leg
      const scanValue = this.loadingSheetTableForm.value.Scan.trim();
      ///const legValue = this.arrivalData.Leg.trim();
      const legValue = this.arrivalData.RouteandSchedule.trim();
  
      // Find the unload package based on scan and leg values
      const loadPackage = this.data.packagesData.find(x => x.PackageId.trim() === scanValue && x.Routes.trim() === legValue);
  
      // Check if the unload package exists
      if (!loadPackage) {
        // Package does not belong to the current branch
        Swal.fire({
          icon: "error",
          title: "Not Allow to load Package",
          text: "This package does not belong to the current branch.",
          showConfirmButton: true,
        });
        return;
      }
      //if Destination is Not Belongs to Currect location then to allow to unload a packaged
      if (loadPackage.Destination.trim() == this.currentBranch) {
        Swal.fire({
          icon: "error",
          title: "Not Allow to load Package",
          text: "This package does not belong to the current branch.",
          showConfirmButton: true,
        });
        return;
      }
      // Check if the package is already scanned
      if (loadPackage.ScanFlag) {
        Swal.fire({
          icon: "info",
          title: "Already Scanned",
          text: "Your Package ID is already scanned.",
          showConfirmButton: true,
        });
        return;
      }
  
      // Find the element in csv array that matches the shipment
      const element = this.csv.find(e => e.Shipment === loadPackage.Shipment);
  
      // Check if the element exists and the number of unloaded packages is less than the total packages
      if (!element || (element.hasOwnProperty('loaded') && element.Packages <= element.loaded)) {
        // Invalid operation, packages must be greater than Unloaded
        Swal.fire({
          icon: "error",
          title: "Invalid Operation",
          text: "Cannot perform the operation. Packages must be greater than loaded.",
          showConfirmButton: true,
        });
        return;
      }
  
      // Update Pending and Unloaded counts
      element.Pending--;
      element.loaded = (element.loaded || 0) + 1;
      loadPackage.ScanFlag = true;
  
      // Prepare kpiData
      const event = {
        shipment: this.csv.length,
        Package: element.loaded,
      };
  this.kpiData(event);
  }
  kpiData(event) {
    let packages = 0;
    let shipingloaded = 0;
    this.csv.forEach((element, index) => {
      packages = element.Packages + packages
      shipingloaded = element.loaded + shipingloaded;
    });
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });

    const shipData = [
      createShipDataObject(this.csv.length, "Shipments", "bg-danger"),
      createShipDataObject(packages, "Packages", "bg-warning"),
      createShipDataObject(event?.shipment || 0, "Shipments" + ' ' + this.shipmentStatus, "bg-info"),
      createShipDataObject(event?.Package || 0, "Packages" + ' ' + this.shipmentStatus, "bg-warning"),
    ];

    this.boxData = shipData;
  }
  autoBindData() {
    const vehicleControl = this.loadingSheetTableForm.get('vehicle');
    vehicleControl?.patchValue(this.arrivalData?.VehicleNo || '');
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.arrivalData?.VehicleNo || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.arrivalData?.Route || this.arrivalData?.RouteandSchedule || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.arrivalData?.TripID || '')
    this.loadingSheetTableForm.controls['ArrivalLocation'].setValue(this.arrivalData?.ArrivalLocation || this.arrivalData?.location || '')
    this.loadingSheetTableForm.controls['Loadingsheet'].setValue(this.arrivalData?.Unoadingsheet || this.arrivalData?.loadingSheetNo || '')
    this.loadingSheetTableForm.controls['Leg'].setValue(this.arrivalData?.Leg || '')
  }
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new UpdateloadingControl();
    this.jsonControlArray = ManifestGeneratedFormControl.getVehicleLoadingSheet();
    this.jsonscanControlArray = ManifestGeneratedFormControl.getScanFormControls();
    this.updateListData = this.jsonControlArray.filter((x) => x.name != "Scan");
    this.Scan = this.jsonControlArray.filter((x) => x.name == "Scan");

    this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
    this.autoBindData();
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
    let packageChecked=false;
    const exists =this.csv.some(obj => obj.hasOwnProperty("loaded"));
    if(exists){
     packageChecked= this.csv.every(obj => obj.Packages === obj.loaded);
    }
   if(packageChecked){
    if (this.shipmentStatus == 'Loaded') {
      const dialogRef: MatDialogRef<ManifestGeneratedComponent> = this.dialog.open(ManifestGeneratedComponent, {
        width: '100%', // Set the desired width
        data: { arrivalData: this.arrivalData, loadingSheetData: this.csv } // Pass the data object
      });

      dialogRef.afterClosed().subscribe(result => {
        let arravalDataDetails = [this.arrivalData];
        arravalDataDetails.forEach(x => {
          x.Action = "DEPART VEHICLE"
          x.menifestNo = result[0].MFNumber
        })
        // this.cnoteService.setLsData(arravalDataDetails);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Manifest Generated Successfully`,
          showConfirmButton: true,
        })
        this.goBack(2);
        this.dialogRef.close(arravalDataDetails)
        // Handle the result after the dialog is closed
      });
    }
    else {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: `Arrival Scan done Successfully`,
        showConfirmButton: true,
      })
      this.dialogRef.close(this.loadingSheetTableForm.value)
    }
  }
    else{
      Swal.fire({
        icon: "error",
        title: "load Package",
        text: `Please load All  Your Package`,
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


