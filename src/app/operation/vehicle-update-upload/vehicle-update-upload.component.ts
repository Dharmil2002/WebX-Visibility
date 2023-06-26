import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import Swal from 'sweetalert2';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { transform } from '../create-loading-sheet/loadingSheetCommon';
import { updatePending } from '../update-loading-sheet/loadingSheetshipment';
import { groupShipingTableData } from './groupShipingTableData';
import { vehicleLoadingScan } from './packageUtilsvehiceLoading';

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
  shipingHeader = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  shipingHeaderForCsv = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
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
  shipingDataTable: any;
  legWiseData: any;
  constructor(private Route: Router, private dialog: MatDialog, public dialogRef: MatDialogRef<VehicleUpdateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpClient, private fb: UntypedFormBuilder, private cdr: ChangeDetectorRef, private cnoteService: CnoteService) {
    if (item.LoadingSheet) {
      this.arrivalData = this.cnoteService.getVehicleLoadingData();
      this.shipmentStatus = 'Loaded'
      this.vehicelLoadData = item;
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
      let shipments = updatePending(tableArray, this.currentBranch,true,false);
      let routeData = transform(this.arrivalData?.RouteandSchedule, this.currentBranch)
      let CurrectLeg = routeData.split("-").splice(1);
      this.legWiseData = shipments.filter((x) => {
        return x.Origin.trim() === this.currentBranch && CurrectLeg.includes(x.Destination);
      });
      let totalVolumeCFT, totalWeightKg, Packages
      this.csv = this.legWiseData;
      let shipingTableData = this.csv;
   // Call the function and pass the required arguments
  let shipingTableDataArray = groupShipingTableData(shipingTableData);

// Use the shipingTableDataArray as needed
      // Convert the groupedData object to an array of values
      this.shipingDataTable = shipingTableDataArray;
      this.kpiData("")

      this.tableload = false;

    });
  }
  updatePackage() {

    this.tableload = true;
    // Get the trimmed values of scan and leg
    const scanValue = this.loadingSheetTableForm.value.Scan.trim();

    // Find the unload package based on scan and leg values
    const loadPackage = this.data.packagesData.find(x => x.PackageId.trim() === scanValue && x.Leg.trim() === this.vehicelLoadData.Leg);
    const loading=vehicleLoadingScan(loadPackage,this.currentBranch,this.csv)

    this.kpiData(loading);
    this.cdr.detectChanges(); // Trigger change detection
    this.tableload=false;
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
      createShipDataObject(this.csv.length, "Shipments", "bg-white"),
      createShipDataObject(packages, "Packages", "bg-white"),
      createShipDataObject(event?.shipment || 0, "Shipments" + ' ' + this.shipmentStatus, "bg-white"),
      createShipDataObject(event?.Package || 0, "Packages" + ' ' + this.shipmentStatus, "bg-white"),
    ];

    this.boxData = shipData;
  }
  autoBindData() {
    const vehicleControl = this.loadingSheetTableForm.get('vehicle');
    vehicleControl?.patchValue(this.arrivalData?.VehicleNo || '');
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.arrivalData?.VehicleNo || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.arrivalData?.Route || this.arrivalData?.RouteandSchedule || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.arrivalData?.TripID || '')
    this.loadingSheetTableForm.controls['ArrivalLocation'].setValue(this.currentBranch || '')
    this.loadingSheetTableForm.controls['Loadingsheet'].setValue(this.arrivalData?.Unoadingsheet || this.arrivalData?.loadingSheetNo || '')
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
    let packageChecked = false;
    const exists = this.csv.some(obj => obj.hasOwnProperty("loaded"));
    if (exists) {
      packageChecked = this.csv.every(obj => obj.Packages === obj.loaded);
    }
    if (packageChecked) {
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
    else {
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


