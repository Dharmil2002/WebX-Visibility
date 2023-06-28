import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { UpdateloadingRunControl } from '../../../assets/FormControls/UpdateRunsheet';
import { runSheetLoadingScan, updateRunsheetPending } from './updateRunSheet';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-run-sheet',
  templateUrl: './update-run-sheet.component.html'
})
export class UpdateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/create-runsheet-data.json'
  tableload = false;
  csv: any[];
  branch = localStorage.getItem("Branch");
  data: [] | any;
  tripData: any;
  tabledata: any;
  updateSheetTableForm: UntypedFormGroup
  UpdaterunControlArray: any;
  columnHeader = {
    "shipment": "Shipments",
    "packages": "Packages",
    "loaded": "Loaded",
    "pending": "Pending",
  }
  centerAlignedData = ['shipment',  'packages', 'loaded','pending'];
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "shipment": "Shipment",
    "packages": "Packages",
    "loaded": "Loaded",
    "pending": "Pending",
  }
  //declaring breadscrum
  breadscrums = [
    {
      title: "Update Run Sheet",
      items: ["Home"],
      active: "Update Run Sheet"
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
  dialogRef: any;
  boxData: { count: number; title: string; class: string; }[];
  runsheetDetails: any;
  updateRunSheetData: any;
  Scan: any;
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder,private cdr: ChangeDetectorRef, private cnoteService: CnoteService) {

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }

    this.IntializeFormControl()
    this.getRunSheetDetails();
  }
  autoBindData(runsheetDetails) {

    let runSheetDetails = runsheetDetails;
    let autoFillUpdateRunSheet = runSheetDetails.cluster.find((x) => x.cluster === this.tripData.columnData.Cluster)
    this.updateSheetTableForm.controls['Vehicle'].setValue(autoFillUpdateRunSheet?.vehicleNo || '')
    this.updateSheetTableForm.controls['Cluster'].setValue(autoFillUpdateRunSheet?.cluster || '')
    this.updateSheetTableForm.controls['Runsheet'].setValue(this.tripData?.columnData.RunSheet || '')
    this.updateSheetTableForm.controls['LoadingLocation'].setValue(this.branch || '')
    this.updateSheetTableForm.controls['Startkm'].setValue(0)
    this.updateSheetTableForm.controls['Departuretime'].setValue('')
    this.getShipingData(runSheetDetails)
  }
  getShipingData(runSheetDetails) {
    // Update pending shipments
    let shipmentRoutingData=this.cnoteService.getDepartVehicleData();
    let shipmentDetails=shipmentRoutingData?.shipments||''
    let runSheetShipingDetails
    let data= runSheetDetails.cluster.some((x)=>x.runSheetID=== this.tripData.columnData.RunSheet)
    if(!data && shipmentDetails){
     runSheetShipingDetails =shipmentDetails.shippingData.filter((x) => x.cluster === this.tripData.columnData.Cluster
    );
    }
    else{
      runSheetShipingDetails = runSheetDetails.shipment.filter((x) => x.cluster === this.tripData.columnData.Cluster
      );
    }
    let shipments = updateRunsheetPending(runSheetShipingDetails,this.tripData.columnData.Cluster)

    let runSheetList: any[] = [];
    shipments.forEach(element => {
      let runSheetJson = {
        shipment: element?.documentId || '',
        packages: element?.packages || '',
        loaded: 0,
        pending: element?.pending,
      }
      runSheetList.push(runSheetJson)
    });
    this.csv = runSheetList;
    this.kpiData("")
  }
  ngOnInit(): void {
  }

  kpiData(event) {
    let packages = 0;
    let shipingloaded = 0;
    this.csv.forEach((element, index) => {
      packages = element.packages + packages
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
      createShipDataObject(event?.shipment || 0, "Shipments Loaded", "bg-white"),
      createShipDataObject(event?.Package || 0, "Packages Loaded", "bg-white"),
    ];

    this.boxData = shipData;
  }
  IntializeFormControl() {
    const UpdaterunsheetFormControl = new UpdateloadingRunControl();
    this.UpdaterunControlArray = UpdaterunsheetFormControl.getupdaterunsheetFormControls();
    // Filter out the "Scan" control from the update list
    this.updateRunSheetData = this.UpdaterunControlArray.filter((x) => x.name != "Scan");
    // Get only the "Scan" control
    this.Scan = this.UpdaterunControlArray.filter((x) => x.name == "Scan");
    this.updateSheetTableForm = formGroupBuilder(this.fb, [this.UpdaterunControlArray])
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
    const exists =  this.csv.some(obj => obj.hasOwnProperty("loaded"));
    if (exists) {
      packageChecked = this.csv.every(obj => obj.packages === obj.loaded);
    }
    if (packageChecked) {
  
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Depart Vehicle Succesful`,
          showConfirmButton: true,
        })
        this.DepartDelivery() ;
        this.dialogRef.close(this.updateSheetTableForm.value)
        
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
  updatePackage() {

    this.tableload = true;
    // Get the trimmed values of scan and leg
    const scanValue = this.updateSheetTableForm.value.Scan.trim();
   
    // Find the unload package based on scan and leg values
    const loadPackage =  this.runsheetDetails.packages.find(x => x.packageId.trim() === scanValue && x.cluster.trim() === this.tripData.columnData.Cluster);

    const loading=runSheetLoadingScan(loadPackage, this.tripData.columnData.Cluster,this.csv)
    if(loading){
    this.kpiData(loading);
    }
    this.cdr.detectChanges(); // Trigger change detection
    this.tableload=false;
  }
  DepartDelivery() {
    let updateStatus = {
      RunSheet: this.tripData.columnData?.RunSheet || '',
      Cluster: this.tripData.columnData?.RunSheet || '',
      Shipments: this.tripData.columnData?.Shipments || '',
      Packages: this.tripData.columnData?.Packages || '',
      WeightKg: this.tripData.columnData?.WeightKg || '',
      VolumeCFT: this.tripData.columnData?.VolumeCFT || '',
      Status: "OUT FOR DELIVERY",
      Action: "Update Delivery"
    }
    this.cnoteService.setdepartRunSheetData(updateStatus)
    this.goBack(4);
  }
  getRunSheetDetails() {

    this.http.get(this.jsonUrl).subscribe((res: any) => {
      this.runsheetDetails = res;
      this.autoBindData(this.runsheetDetails)
    })
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}