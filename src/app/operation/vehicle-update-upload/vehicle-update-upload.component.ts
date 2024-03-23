import { Component, OnInit, Inject, ChangeDetectorRef, HostListener, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { vehicleLoadingScan } from './packageUtilsvehiceLoading';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/core/service/storage.service';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import { ManifestService } from 'src/app/Utility/module/operation/mf-service/mf-service';

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
  scanPackage: string = '';
  currentBranch: string = localStorage.getItem("Branch") || '';
  companyCode: number = parseInt(localStorage.getItem('companyCode'));
  userName: string = localStorage.getItem('Username');
  columnHeader = {
    "Shipment": "Shipment",
    "Suffix": "Suffix",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "loaded": "Loaded",
    "Pending": "Pending",
    "Leg": "Leg",
  };
  centerAlignedData = ['Shipment', 'Suffix', 'Packages', 'loaded', 'Pending'];
  columnWidths = {
    'Shipment': 'min-width:20%',
    'Suffix': 'min-width:1%'
  };
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
  dktList: any;
  scanMessage: string = '';

  @ViewChild('scanPackageInput') scanPackageInput: ElementRef;
  
  constructor(
    private Route: Router,
    private mfService: ManifestService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<VehicleUpdateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private operationService: OperationService,
    private storage: StorageService
  ) {
    if (item.LoadingSheet) {

      this.shipmentStatus = 'Loaded'
      this.vehicelLoadData = item;
    }
    this.getLoadingSheet();
    this.IntializeFormControl()    
  }

  ngOnInit(): void {
    
  }

  async getLoadingSheet() {

    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "ls_headers_ltl",
      "filter": { cID: this.storage.companyCode, tHC: this.vehicelLoadData.tripId, lSNO: this.vehicelLoadData.LoadingSheet }
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost('generic/get', reqBody));
    const reqDetBody = {
      "companyCode": this.companyCode,
      "collectionName": "ls_details_ltl",
      "filter": { cID: this.storage.companyCode, lSNO: this.vehicelLoadData.LoadingSheet }
    }
    const resDetails = await firstValueFrom(this.operationService.operationMongoPost('generic/get', reqDetBody));
    if (res.data) {
      let dataLoading = []
      res.data.forEach((element: any) => { // Specify the type of 'element' as 'any'
        let json = {
          "Leg": element?.lEG.replace(" ", "") || '',
          "Shipment": element?.tOTDKT || 0,
          "Packages": parseInt(element?.pKGS) || 0,
          "WeightKg": parseInt(element?.wT) || 0,
          "VolumeCFT": parseInt(element?.vCFT) || 0
        };
        dataLoading.push(json);
      });

      this.shipingDataTable = dataLoading;
      let docketData = []

      if (resDetails.data.length > 0) {

        this.dktList = resDetails.data.map((x) => `${x.dKTNO}-${x.sFX}`);

        resDetails.data.forEach((element: any) => { // Specify the type of 'element' as 'any'          
          let lsDetails = res.data.find((x) => x.lSNO === element.lSNO);
          let json = {
            "Shipment": element?.dKTNO || '',
            "Suffix": element?.sFX || 0,
            "Origin": element?.bLOC || element?.lOC || '',
            "Destination": element?.dLOC || '',
            "Packages": parseInt(element?.pKGS) || 0,
            "weight": parseInt(element?.wT) || 0,
            "cft": parseInt(element?.vCFT) || 0,
            "loaded": 0,
            "Pending": parseInt(element?.pKGS) || 0,
            "Leg": lsDetails?.lEG.replace(" ", "") || '',
          };
          docketData.push(json);
        });
        this.loadingTableData = docketData;
      }
      this.kpiData("")
    }
    this.getPackagesData();
    this.autoBindData();
  }

  async getPackagesData() {
    const reqBody = {
      "companyCode": this.companyCode,
      "collectionName": "docket_pkgs_ltl",
      "filter": { 
        cID: this.storage.companyCode, 
        lSNO: this.vehicelLoadData.LoadingSheet,
        "D$or": [{ "mFNO": { "D$exists": false } }, { "mFNO": "" }] 
      }
    }
    const res = await firstValueFrom(this.operationService.operationMongoPost('generic/get', reqBody));
    this.packageData = res.data;
  }

  updatePackage() {
    if (this.scanPackage) {
      this.tableload = true;
      // Get the trimmed values of scan and leg
      const scanValue = this.scanPackage;
      // Find the unload package based on scan and leg values
      
      const loadPackage = this.packageData.find(x => x.pKGSNO.trim() === scanValue.trim());    
      const loading = vehicleLoadingScan(loadPackage, this.loadingTableData)      
      if (loading) {
        const { status, ...options}  = loading;
        if(!status) {
          this.scanMessage = options.text;         
          // Swal.fire( { 
          //   ...options,
          //   didClose: () => {
          //     this.clearAndFocusOnScan();
          //   }
          // })
        }
        else {
          this.scanMessage = "";
          this.kpiData(options);
        }
      }
      this.cdr.detectChanges(); // Trigger change detection
      this.tableload = false;     
      this.clearAndFocusOnScan();
    }
    else {      
      this.scanMessage = `Please Enter Package No`
      this.clearAndFocusOnScan();
      // Swal.fire({
      //   icon: "error",
      //   title: "Scan Package",
      //   text: `Please Enter Package No`,
      //   showConfirmButton: true,
      //   didClose: () => {
      //     this.clearAndFocusOnScan();
      //   }
      // });      
    }
  }

  clearAndFocusOnScan() {    
    this.scanPackage = '';
    this.scanPackageInput.nativeElement.focus();
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
    vehicleControl?.patchValue(this.vehicelLoadData?.vehNo || '');
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.vehicelLoadData?.vehNo || '')
    this.loadingSheetTableForm.controls['Route'].setValue(this.vehicelLoadData?.route || '')
    this.loadingSheetTableForm.controls['tripID'].setValue(this.vehicelLoadData?.tripId || '')
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
  async CompleteScan() {
    let packageChecked = this.loadingTableData.every(obj => obj.Pending >0);
    if(packageChecked){
      Swal.fire({
        icon: "error",
        title: "load Package",
        text: `Please load All  Your Package`,
        showConfirmButton: true,
      })
      return;
    }
    const fieldMapping = await this.mfService.getFieldMapping(this.loadingTableData, this.shipingDataTable, this.vehicelLoadData, this.packageData);
    const resMf = await this.mfService.createMfDetails(fieldMapping);
    if (resMf) {
      if (this.shipmentStatus == 'Loaded') {
        const dialogRef: MatDialogRef<ManifestGeneratedComponent> = this.dialog.open(ManifestGeneratedComponent, {
          width: '100%', // Set the desired width
          data: { arrivalData: this.arrivalData, loadingSheetData: this.shipingDataTable, mfNo: resMf } // Pass the data object
        });

        dialogRef.afterClosed().subscribe(result => {
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: `Manifest Generated Successfully`,
            showConfirmButton: true,
          })
          this.goBack('Departures');
          this.dialogRef.close("");
        });
      }
      else {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Arrival Scan done Successfully`,
          showConfirmButton: true,
        })
        this.dialogRef.close(this.loadingSheetTableForm.value);
        this.goBack('Departures');
        this.dialogRef.close("");
      }
    }

  }
  Close(): void {
    this.dialogRef.close()
  }
  goBack(tabIndex: string): void {
    this.Route.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }
}


