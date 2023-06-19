import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CnoteService } from '../../core/service/Masters/CnoteService/cnote.service';
import { UpdateloadingRunControl } from '../../../assets/FormControls/UpdateRunsheet';

@Component({
  selector: 'app-update-run-sheet',
  templateUrl: './update-run-sheet.component.html'
})
export class UpdateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/updateRunsheet.json'
  tableload = false;
  csv: any[];
  branch=localStorage.getItem("Branch");
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
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder,private cnoteService:CnoteService) {

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    
    this.IntializeFormControl()
    this.autoBindData();
  }
  autoBindData() {
    let runSheetDetails=this.cnoteService.getRunSheetData();
    let runSheetNestedDetails=[runSheetDetails.runSheetDetails];
    let autoFillUpdateRunSheet=runSheetNestedDetails.find((x)=>x.Cluster===this.tripData.columnData.Cluster)
    this.updateSheetTableForm.controls['Vehicle'].setValue(autoFillUpdateRunSheet?.Vehicle||'')
    this.updateSheetTableForm.controls['Cluster'].setValue(autoFillUpdateRunSheet?.Cluster||'')
    this.updateSheetTableForm.controls['Runsheet'].setValue(autoFillUpdateRunSheet?.RunSheetID||'')
    this.updateSheetTableForm.controls['LoadingLocation'].setValue(this.branch||'')
    this.updateSheetTableForm.controls['Startkm'].setValue(0)
    this.updateSheetTableForm.controls['Departuretime'].setValue('')
    this.getShipingData(runSheetDetails)
   }
  getShipingData(runSheetDetails){
    let runSheetShipingDetails=runSheetDetails.shippingData.filter((x)=>x.Cluster===this.tripData.columnData.Cluster);
    let runSheetList:any[]=[];
    runSheetShipingDetails.forEach(element => {
      let runSheetJson={
        shipment: element?.Document||'',
        packages:element?.Packages||'',
        loaded:element?.Packages||'',
        pending: 0,
      }
      runSheetList.push(runSheetJson)
    });
    this.csv=runSheetList;
    
      // Create shipData objects for displaying summary information
      const createShipDataObject = (count: number, title: string, className: string) => ({
        count,
        title,
        class: `info-box7 ${className} order-info-box7`,
      });
  
      const totalPackages = runSheetShipingDetails.reduce(
        (total: number, shipment: any) => total + shipment.Packages,
        0
      );
      // Prepare the shipData array with summary information
      const shipData = [
        createShipDataObject(this.csv.length, "Shipments", "bg-danger"),
        createShipDataObject(totalPackages, "Packages", "bg-info"),
        createShipDataObject(this.csv.length, "Shipments Loaded", "bg-warning"),
        createShipDataObject(totalPackages, "Packages Loaded", "bg-primary"),
      ];
  
      // Store the shipData in boxData property
      this.boxData = shipData;
  }
  ngOnInit(): void {
  }
  IntializeFormControl() {
    const UpdaterunsheetFormControl = new UpdateloadingRunControl();
    this.UpdaterunControlArray = UpdaterunsheetFormControl.getupdaterunsheetFormControls();
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
 
  CompleteScan(){
    this.dialogRef.close(this.updateSheetTableForm.value)
  }
  DepartDelivery(){
    let updateStatus={
        RunSheet:this.tripData.columnData?.RunSheet||'',
        Cluster: this.tripData.columnData?.RunSheet||'',
        Shipments:this.tripData.columnData?.Shipments||'',
        Packages: this.tripData.columnData?.Packages||'',
        WeightKg: this.tripData.columnData?.WeightKg||'',
        VolumeCFT:this.tripData.columnData?.VolumeCFT||'',
        Status: "OUT FOR DELIVERY",
        Action:"Update Delivery"
    }
    this.cnoteService.setdepartRunSheetData(updateStatus)
    this.goBack(3);
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex } });
  }
}