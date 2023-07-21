import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ManifestGeneratedComponent } from '../manifest-generated/manifest-generated/manifest-generated.component';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { vehicleLoadingScan } from './packageUtilsvehiceLoading';
import { OperationService } from 'src/app/core/service/operations/operation.service';

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
  shipments = []
  currentBranch: string = localStorage.getItem("Branch") || '';
  companyCode: number = parseInt(localStorage.getItem('companyCode'));
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
      "type": "operation",
      "collection": "trip_detail"

    }
    this.operationService.operationPost('common/getall', reqBody).subscribe(res => {
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
      "type": "operation",
      "collection": "docket"

    }
    this.operationService.operationPost('common/getall', reqBody).subscribe(res => {
      if (res) {
        this.dktDetailFromApi = res.data
        this.getLoadingSheet();
      }
    });
  }
  getLoadingSheet() {

    const reqBody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "loadingSheet_detail"

    }
    this.operationService.operationPost('common/getall', reqBody).subscribe(res => {
      if (res.data) {
        let dataLoading = []

        res.data.forEach((element: any) => { // Specify the type of 'element' as 'any'
          let shipmentData = this.dktDetailFromApi.filter((x) => x.lsNo === element.lsno);
          let json = {
            "Leg": element?.leg.replace(" ", "") || '',
            "Shipment": shipmentData?.length || 0,
            "Packages": element?.pacakges || 0,
            "WeightKg": element?.weightKg || 0,
            "VolumeCFT": element?.volumeCFT || 0
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
            "Packages": lsDetails?.pacakges || '',
            "loaded": 0,
            "Pending": lsDetails?.pacakges || '',
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
      "type": "operation",
      "collection": "docketScan"
    }
    this.operationService.operationPost('common/getall', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.packageData = res.data;
        }
      }
    })
  }
  updatePackage() {

    this.tableload = true;
    // Get the trimmed values of scan and leg
    const scanValue = this.loadingSheetTableForm.value.Scan.trim();

    // Find the unload package based on scan and leg values
    const loadPackage = this.packageData.find(x => x.bcSerialNo.trim() === this.loadingSheetTableForm.value.Scan.trim());

    const loading = vehicleLoadingScan(loadPackage, this.currentBranch, this.loadingTableData)
    if (loading) {
      this.kpiData(loading);
    }
    this.cdr.detectChanges(); // Trigger change detection
    this.tableload = false;
  }
  kpiData(event) {

    let packages = 0;
    let shipingloaded = 0;
    this.loadingTableData.forEach((element, index) => {
      packages = element.Packages + packages
      shipingloaded = element.loaded + shipingloaded;
    });
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });

    const shipData = [
      createShipDataObject(this.loadingTableData.length, "Shipments", "bg-white"),
      createShipDataObject(packages, "Packages", "bg-white"),
      createShipDataObject(event?.shipment || 0, "Shipments" + ' ' + this.shipmentStatus, "bg-white"),
      createShipDataObject(event?.Package || 0, "Packages" + ' ' + this.shipmentStatus, "bg-white"),
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
          // let arravalDataDetails = [this.arrivalData];
          // arravalDataDetails.forEach(x => {
          //   x.Action = "DEPART VEHICLE"
          //   x.menifestNo = result[0].MFNumber
          // })
          // this.cnoteService.setLsData(arravalDataDetails);
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
  generateMeniFest(result) {

    let menifestData = [];
    this.loadingTableData.forEach(element => {
      let menifestDetails = result.find((x) => x.Leg === element.Leg)
      this.updatedocketDetail(element.Shipment, menifestDetails.MFNumber)
      const jsonDetails =
      {
        "id": menifestDetails?.MFNumber || "",
        "mfNo": menifestDetails?.MFNumber || "",
        "leg": menifestDetails?.Leg || "",
        "lsNo": this.vehicelLoadData?.LoadingSheet || "",
        "tripId": this.vehicelLoadData?.tripId || "",
        "totDkt": result.length,
        "totPkg": menifestDetails?.PackagesLoadedBooked || "",
        "tot_cft": menifestDetails?.VolumeCFT || "",
        "entryDate":new Date()
      }
      menifestData.push(jsonDetails);
    });

    const reqBody = {
      "companyCode": this.companyCode,
      "type": "operation",
      "collection": "menifest_detail",
      "data":menifestData[0]
    }
    this.operationService.operationPost('common/create', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.goBack(3);
          this.dialogRef.close("")
        }
      }
    })
  }
  updatedocketDetail(dktNo, mfNumber) {
    let mfDetails = {
      mfNo: mfNumber
    }
    const reqBody = {
      companyCode: this.companyCode,
      type: "operation",
      collection: "docket",
      id: dktNo,
      updates: {
        ...mfDetails,
      }
    }
    this.operationService.operationPut("common/update", reqBody).subscribe({
      next: (res: any) => {
        if (res) {

        }
      }
    })
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}


