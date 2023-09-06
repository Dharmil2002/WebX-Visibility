import { Component, OnInit, Inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { vehicleLoadingScan } from './packageUtilsvehiceLoading';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { updateTracking } from './vehicleLoadingUtility';
import { RetryAndDownloadService } from 'src/app/core/service/api-tracking-service/retry-and-download.service';
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';

@Component({
  selector: 'app-vehicle-update-upload',
  templateUrl: './vehicle-update-upload.component.html'
})
export class VehicleUpdateUploadComponent implements OnInit {
  arrivalUrl = '../../../assets/data/arrival-dashboard-data.json'
  packageUrl = '../../../assets/data/package-data.json'
  tableload = false;
  csv: any[];
  loadingTableData: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  loadingSheetTableForm: UntypedFormGroup;
  jsonControlArray: any;
  jsonscanControlArray: any;
  shipments = [];
  scanPackage: string;
  currentBranch: string = localStorage.getItem("Branch") || '';
  companyCode: number = parseInt(localStorage.getItem('companyCode'));
  userName: string = localStorage.getItem('Username');
  columnHeader = {
    "Shipment": "Shipment",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "loaded": "Loaded",
    "Pending": "Pending",
    "Leg": "Leg",
  };
  centerAlignedData = ['Shipment', 'Packages', 'loaded', 'Pending'];

  shipingHeader = {
    "Leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  centerShippingData = ['Shipment', 'Packages', 'WeightKg', 'VolumeCFT'];
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
  tripDetails: any;
  dktDetailFromApi: any;
  packageData: any;
  constructor(
    private Route: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<VehicleUpdateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private operationService: OperationService,
    private failedApiService: FailedApiServiceService,
    private retryAndDownloadService: RetryAndDownloadService
  ) {
    if (item.LoadingSheet) {
      this.shipmentStatus = 'Loaded'
      this.vehicelLoadData = item;
    }

    this.getTripDetailData();
    this.IntializeFormControl()
  }

  ngOnInit(): void {
  }

  getTripDetailData() {

    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_detail",
      "filter":{}

    }
    this.operationService.operationMongoPost('generic/get', reqBody).subscribe(res => {
      if (res) {

        this.tripDetails = res.data.find((x) => x.tripId === this.vehicelLoadData.tripId);
        this.getShipmentData();
        this.autoBindData();

      }
    });
  }

  getShipmentData() {
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "docket",
      "filter":{}

    }
    this.operationService.operationMongoPost('generic/get', reqBody).subscribe(res => {
      if (res) {
        this.dktDetailFromApi = res.data
        this.getLoadingSheet();
      }
    });
  }
  getLoadingSheet() {

    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "loadingSheet_detail",
      "filter":{}

    }
    this.operationService.operationMongoPost('generic/get', reqBody).subscribe(res => {
      if (res.data) {
        let dataLoading = []
        const loadingSheetDetail = res.data.filter((x) => x.lsno === this.vehicelLoadData.LoadingSheet)
        loadingSheetDetail.forEach((element: any) => { // Specify the type of 'element' as 'any'
          let shipmentData = this.dktDetailFromApi.filter((x) => x.lsNo === this.vehicelLoadData.LoadingSheet);
          let json = {
            "Leg": element?.leg.replace(" ", "") || '',
            "Shipment": shipmentData?.length || 0,
            "Packages": parseInt(element?.pacakges) || 0,
            "WeightKg": parseInt(element?.weightKg) || 0,
            "VolumeCFT": parseInt(element?.volumeCFT) || 0
          };
          dataLoading.push(json);
        });
        this.shipingDataTable = dataLoading;

        let docketData = []
        let dktDetail = this.dktDetailFromApi.filter((x) => x.lsNo === this.vehicelLoadData.LoadingSheet)
        dktDetail.forEach((element: any) => { // Specify the type of 'element' as 'any'
          let lsDetails = res.data.find((x) => x.lsno === element.lsNo);
          let json = {
            "Shipment": element?.docketNumber || '',
            "Origin": element?.orgLoc || '',
            "Destination": element?.destination.split(":")[1] || '',
            "Packages": parseInt(element?.totalChargedNoOfpkg) || 0,
            "loaded": 0,
            "Pending": parseInt(element?.totalChargedNoOfpkg) || 0,
            "Leg": lsDetails?.leg.replace(" ", "") || '',
          };
          docketData.push(json);
        });
        this.loadingTableData = docketData;
        this.kpiData("")
      }
    });
    this.getPackagesData();
  }

  getPackagesData() {
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "docketScan",
      "filter":{},
    }
    this.operationService.operationMongoPost('generic/get', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.packageData = res.data;
        }
      }
    })
  }
  updatePackage() {

  
    if(this.scanPackage){
      this.tableload = true;
    // Get the trimmed values of scan and leg
    const scanValue = this.scanPackage;
    // Find the unload package based on scan and leg values
    const loadPackage = this.packageData.find(x => x.bcSerialNo.trim() === scanValue.trim());
    const loading = vehicleLoadingScan(loadPackage, this.loadingTableData)
    if (loading) {
      this.kpiData(loading);
    }
    this.cdr.detectChanges(); // Trigger change detection
    this.tableload = false;
  }
  else{
    Swal.fire({
      icon: "error",
        title: "Scan Package",
        text: `Please Enter Package No`,
        showConfirmButton: true,
    })
  }
  }
  kpiData(event) {

    let packages = 0;
    let shipingloaded = 0;
    this.loadingTableData.forEach((element, index) => {
      packages = parseInt(element.Packages) + packages
      shipingloaded = parseInt(element.loaded) + shipingloaded;
    });
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });

    const shipData = [
      createShipDataObject(this.loadingTableData.length, "Shipments", "bg-c-Bottle-light"),
      createShipDataObject(packages, "Packages", "bg-c-Grape-light"),
      createShipDataObject(event?.shipment || 0, "Shipments" + ' ' + this.shipmentStatus, "bg-c-Daisy-light"),
      createShipDataObject(event?.Package || 0, "Packages" + ' ' + this.shipmentStatus, "bg-c-Grape-light"),
    ];

    this.boxData = shipData;
  }
  autoBindData() {
    const vehicleControl = this.loadingSheetTableForm.get('vehicle');
    vehicleControl?.patchValue(this.arrivalData?.VehicleNo || '');
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.tripDetails?.vehicleNo || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.vehicelLoadData?.route || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.tripDetails?.tripId || '')
    this.loadingSheetTableForm.controls['ArrivalLocation'].setValue(this.currentBranch || '')
    this.loadingSheetTableForm.controls['Loadingsheet'].setValue(this.vehicelLoadData?.LoadingSheet || '')
  }
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new UpdateloadingControl();
    this.jsonControlArray = ManifestGeneratedFormControl.getVehicleLoadingSheet();
    this.jsonscanControlArray = ManifestGeneratedFormControl.getScanFormControls();
    this.updateListData = this.jsonControlArray.filter((x) => x.name != "Scan");
    this.Scan = this.jsonControlArray.filter((x) => x.name == "Scan");

    this.loadingSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])

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
    const exists = this.loadingTableData.some(obj => obj.hasOwnProperty("loaded"));
    if (exists) {

      packageChecked = this.loadingTableData.every(obj => obj.Packages === obj.loaded);

    }
    
    if (packageChecked) {
      if (this.shipmentStatus == 'Loaded') {
        const dialogRef: MatDialogRef<ManifestGeneratedComponent> = this.dialog.open(ManifestGeneratedComponent, {
          width: '100%', // Set the desired width
          data: { arrivalData: this.arrivalData, loadingSheetData: this.shipingDataTable } // Pass the data object
        });

        dialogRef.afterClosed().subscribe(result => {

          this.generateMeniFest(result);
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Manifest Generated Successfully`,
            showConfirmButton: true,
          })

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
  async generateMeniFest(result) {
    let menifestData = [];

    for (const element of this.loadingTableData) {
      let menifestDetails = result.find((x) => x.Leg === element.Leg);
      await this.updatedocketDetail(element.Shipment, menifestDetails.MFNumber);

      const jsonDetails = {
        "_id": menifestDetails?.MFNumber || "",
        "mfNo": menifestDetails?.MFNumber || "",
        "leg": menifestDetails?.Leg || "",
        "lsNo": this.vehicelLoadData?.LoadingSheet || "",
        "tripId": this.vehicelLoadData?.tripId || "",
        "totDkt": result.length,
        "totPkg": menifestDetails?.PackagesLoadedBooked || "",
        "tot_cft": menifestDetails?.VolumeCFT || "",
        "WeightKg": menifestDetails?.WeightKg || "",
        "entryDate": new Date(),
        "entryBy": this.userName
      };

      menifestData.push(jsonDetails);
    }

    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "menifest_detail",
      "data": menifestData[0]
    };

    this.operationService.operationMongoPost('generic/create', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          if (this.vehicelLoadData.count === 1) {
            this.updateTripStatus();
          } else {
            if (res) {
              Swal.fire({
                icon: "success",
                title: "Successful",
                text: `Vehicle Loaded Successfully`,
                showConfirmButton: true,
              });
              this.goBack(3);
              this.dialogRef.close("");
            }
          }
        }
      }
    });
  }

  async updatedocketDetail(dktNo, mfNumber) {
    let mfDetails = {
      mfNo: mfNumber
    };
     await updateTracking(this.companyCode,this.operationService,mfDetails,dktNo)
    const reqBody = {
      companyCode: this.companyCode,
      collectionName: "docket",
      filter:{_id: dktNo},
      update: {
        ...mfDetails
      }
    };

    return new Promise((resolve, reject) => {
      this.operationService.operationMongoPut("generic/update", reqBody).subscribe({
        next: (res: any) => {
          if (res) {
            resolve(res);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  updateTripStatus() {
    let tripDetails = {
      status: "Depart Vehicle"
    }
    const id=this.vehicelLoadData?.id || "";
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "trip_detail",
      "filter": {_id: id},
      "update": {
        ...tripDetails,
      }
    }
    this.operationService.operationMongoPut("generic/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Vehicle Load Successfully`,//
            showConfirmButton: true,
          })
          this.goBack(3);
          this.dialogRef.close("")
        }
      }
    })
  }
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
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}


