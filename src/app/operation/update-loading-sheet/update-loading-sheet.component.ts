import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { Router } from '@angular/router';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { MarkArrivalComponent } from 'src/app/dashboard/ActionPages/mark-arrival/mark-arrival.component';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';

@Component({
  selector: 'app-update-loading-sheet',
  templateUrl: './update-loading-sheet.component.html'
})
export class UpdateLoadingSheetComponent implements OnInit {
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

  constructor(private Route: Router, private dialog: MatDialog, public dialogRef: MatDialogRef<MarkArrivalComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpClient, private fb: UntypedFormBuilder, private cnoteService: CnoteService) {
    if (item.LoadingSheet) {
      this.arrivalData = this.cnoteService.getVehicleLoadingData();
      this.shipmentStatus = 'Loaded'
    } else {
      this.shipmentStatus = 'Unloaded'
      this.arrivalData = item;
    }
    this.getShippningData();
    this.IntializeFormControl()
  }
  getShippningData() {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['shippingData'];
      if(this.shipmentStatus === 'Loaded'){
      this.csv = tableArray.filter((item) => item.routes.trim() == this.arrivalData?.RouteandSchedule.trim() && item.Leg.trim() == this.arrivalData.Leg.trim());
      }
      else{
        this.csv = tableArray.filter((item) => item.routes.trim() == this.arrivalData?.Route.trim() && item.Leg.trim() == this.arrivalData.Leg.trim());
      }
     
    this.kpiData("")

      this.tableload = false;

    });
  }
  updatePackage(){
   let Unload=  this.data.packagesData.find((x)=>x.PackageId.trim()===this.loadingSheetTableForm.value.Scan.trim() && x.Leg.trim()== this.arrivalData.Leg.trim())
    if(Unload){
      this.csv.forEach(element => {
        if(element.Shipment===Unload.Shipment){
          element.Packages=element.Packages-1,
          element.Unloaded = element?.Unloaded||0+1
        }
      });
      this.csv=this.csv
    }
  }
  kpiData(event) {
    let packages = 0;
    let shipingUnloaded = 0;
    this.csv.forEach((element, index) => {
      packages = element.Packages + packages
      shipingUnloaded = element.Unloaded + shipingUnloaded;
    });
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });

    const shipData = [
      createShipDataObject(this.csv.length, "Shipments", "bg-danger"),
      createShipDataObject(packages, "Packages", "bg-warning"),
      createShipDataObject(event?.shipment||0, "Shipments" + ' ' + this.shipmentStatus, "bg-info"),
      createShipDataObject(event?.Package||0, "Packages" + ' ' + this.shipmentStatus, "bg-warning"),
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
    this.loadingSheetTableForm.controls['Unoadingsheet'].setValue(this.arrivalData?.Unoadingsheet || this.arrivalData?.loadingSheetNo || '')
    this.loadingSheetTableForm.controls['Leg'].setValue(this.arrivalData?.Leg || '')
  }
  ngOnInit(): void {
  }
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new UpdateloadingControl();
    this.jsonControlArray = ManifestGeneratedFormControl.getupdatelsFormControls();
    if (this.shipmentStatus === 'Loaded') {
      this.jsonControlArray = this.jsonControlArray.filter((x) => {
        if (x.name === "Unoadingsheet") {
          x.label = "Loading sheet"
        }
        return x
      })
    }
    this.jsonscanControlArray = ManifestGeneratedFormControl.getScanFormControls();
    this.updateListData=this.jsonControlArray.filter((x)=>x.name!="Scan");
    this.Scan=this.jsonControlArray.filter((x)=>x.name=="Scan");

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
        this.goBack(2);
        this.dialogRef.close(arravalDataDetails)
        // Handle the result after the dialog is closed
      });
    }
    else {
      this.dialogRef.close(this.loadingSheetTableForm.value)
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
