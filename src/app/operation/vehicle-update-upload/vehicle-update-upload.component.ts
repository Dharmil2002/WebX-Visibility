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
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { Manifest } from 'src/app/Models/vehicle-loading/manifest';
import { EditShipmentDetailsComponent } from './edit-shipment-details/edit-shipment-details.component';

@Component({
  selector: 'app-vehicle-update-upload',
  templateUrl: './vehicle-update-upload.component.html'
})
export class VehicleUpdateUploadComponent implements OnInit {
  arrivalUrl = '../../../assets/data/arrival-dashboard-data.json'
  packageUrl = '../../../assets/data/package-data.json'
  tableload = true;
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
  currentBranch: string = '';
  companyCode: number = 0;
  userName: string = '';
  columnHeader = {
    "Shipment": "Shipment",
    "Suffix": "Suffix",
    "Origin": "Origin",
    "Destination": "Destination",
    "Packages": "Packages",
    "loaded": "Loaded",
    "Pending": "Pending",
    "Leg": "Leg"
  };
  centerAlignedData = ['Shipment', 'Suffix', 'Packages', 'loaded', 'Pending'];
  columnWidths = {
    'Shipment': 'min-width:20%',
    'Suffix': 'min-width:1%'
  };
  shipingHeader = {
    "Leg":  {
      Title: 'Leg',
      class: "matcolumnleft",
      Style: "min-width:18%",
    },
    "Shipment": {
      Title: 'Shipments',
      class: "matcolumnright",
      Style: "min-width:80px;max-width:80px;",
    },
    "Packages": {
      Title: 'Packages',
      class: "matcolumnright",
      Style: "min-width:80px;max-width:80px;",
    },
    "WeightKg": {
      Title: 'Weight (KG)',
      class: "matcolumnright",
      Style: "min-width:100px;max-width:100px;",
    },
    "VolumeCFT": {
      Title: 'Volume (CFT)',
      class: "matcolumnright",
      Style: "min-width:100px;max-width:100px;",
    }
  }
  shipingStaticHeader = {
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
  isScan:boolean=false;
  vehicelLoadData: any;
  shipingDataTable: any;
  legWiseData: any;
  tripDetails: any;
  dktDetailFromApi: any;
  packageData: any;
  dktList: any;
  scanMessage: string = '';
  menuItemflag=true;
  @ViewChild('scanPackageInput') scanPackageInput: ElementRef;
  rules: any;
  selectAllRequired:boolean=true;
  metaData = {};
  constructor(
    private Route: Router,
    private mfService: ManifestService,
    private definition:Manifest,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<VehicleUpdateUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private controlPanel: ControlPanelService,
    private cdr: ChangeDetectorRef,
    private operationService: OperationService,
    private storage: StorageService
  ) {
    this.metaData={
      checkBoxRequired: true,
      noColumnSort: Object.keys(this.definition.columnHeader),
    }
    this.companyCode = this.storage.companyCode;
    this.currentBranch = this.storage.branch;
    this.userName = this.storage.userName;
    if (item.LoadingSheet) {

      this.shipmentStatus = 'Loaded'
      this.vehicelLoadData = item;
    }
    this.getLoadingSheet();
    this.IntializeFormControl()    
  }

  ngOnInit(): void {
    this.getRules(); 
  }
  async getRules(){
    const filter={
      cID:this.storage.companyCode,
      mODULE:"Scanning",
      aCTIVE:true
    }
    const res=await this.controlPanel.getModuleRules(filter);
    if(res.length>0){
      this.rules=res;
      this.checkDocketRules();
    }
    
  }
  checkDocketRules(){
    const scan = this.rules.find(x=>x.rULEID=="SCAN" && x.aCTIVE);
    this.isScan=scan.vAL=="Y"?true:false;
  }
  
/*below function is call when the partial */
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
          "Packages": parseInt(element?.pKGS||0) || 0,
          "WeightKg": parseFloat(element?.wT||0) || 0,
          "VolumeCFT": parseFloat(element?.vCFT||0) || 0,
          "CWeightKg": parseFloat(element?.cWT||0) || 0
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
            "weight": parseFloat(element?.wT) || 0,
            "cWeight": parseFloat(element?.cWT) || 0,
            "cft": parseFloat(element?.vCFT) || 0,
            "loadedPkg": 0,
            "loadedWT": 0,
            "pendPkg": 0,
            "pendWt": 0,
            "Leg": lsDetails?.lEG.replace(" ", "") || '',
            "actions":["Edit"]
          };
          docketData.push(json);
        });
        this.loadingTableData = docketData;
      }
      this.tableload=false;
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
  onDailogClose(event){
    this.shipmentsEdit(event)
  }
  shipmentsEdit(event) {
    const { shipment, suffix, noofPkts, actualWeight, ctWeight } = event;
    const data = this.loadingTableData.find(x => x.Shipment === shipment && x.Suffix === suffix);
    if (data) {
      const loadedPkg = parseInt(noofPkts, 10);
      const loadedWT = parseFloat(actualWeight).toFixed(2);
      const pendPkg = data.Packages - loadedPkg;
      const pendWt = data.weight - parseFloat(actualWeight);
      const pendCwt = data.cWeight - parseFloat(ctWeight);
    
      // Update the data object directly
      Object.assign(data, { loadedPkg, loadedWT, pendPkg, pendWt, pendCwt });
    
      this.cdr.detectChanges();
    }
  }
  
  async CompleteScan() {
    let resMf=""
    if(this.isScan){
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
       resMf = await this.mfService.createMfDetails(fieldMapping);
    }
    else{
      let selectedData= this.loadingTableData.filter((x) => x.hasOwnProperty('isSelected') && x.isSelected);
      if(selectedData.length>0){
        Swal.fire({
          icon: "warning",
          title: "Action Needed",
          text: "Please select at least one option to proceed.",
          showConfirmButton: true,
          confirmButtonText: 'OK'
        })
        
        return false;
      }
      let notSelectedData= this.loadingTableData.filter((x) => !x.hasOwnProperty('isSelected') || !x.isSelected);
      const fieldMapping = await this.mfService.mapFieldsWithoutScanning(selectedData, this.shipingDataTable, this.vehicelLoadData,this.isScan,notSelectedData);
      resMf = await this.mfService.createMfDetails(fieldMapping);
    }
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


