import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { vehicleLoadingControl } from '../../../assets/FormControls/vehicleloading';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { UpdateLoadingSheetComponent } from '../update-loading-sheet/update-loading-sheet.component';
@Component({
  selector: 'app-vehicle-loading',
  templateUrl: './vehicle-loading.component.html'
})
export class VehicleLoadingComponent implements OnInit {
  vehicleLoadingTableForm: UntypedFormGroup;
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json'
  tripData: any;
  jsonControlArray: any;
  
  //declaring breadscrum
  breadscrums = [
    {
      title: "vehicle-loading",
      items: ["Loading-Sheet"],
      active: "vehicle-loading"
    }
  ]
  height='100vw';
  width='100vw';
  maxWidth:'232vw'
  columnHeader = {
    "LoadingSheet": "Loading Sheet",
    "Manifest": "Manifest",
    "Leg": "Leg",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "ShipmentsLoaded": "ShipmentsLoaded",
    "PackagesLoaded": "PackagesLoaded",
    "Pending": "Pending",
    "Action": "Action",
    "printPending": "Pending",
  }
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "LoadingSheet": "Loading Sheet",
    "Manifest": "Manifest",
    "Leg": "Leg",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "ShipmentsLoaded": "ShipmentsLoaded",
    "PackagesLoaded": "PackagesLoaded",
    "Pending": "Pending",
  }
  toggleArray = []
  linkArray = [
    { Row: 'printPending', Path: 'Operation/LoadingSheetView' },
    { Row: 'Action', Path: '' }
  ]
  menuItems = [
    { label: 'Load Vehicle', componentDetails: UpdateLoadingSheetComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  csv: any;
  data: Object;
  tableload: boolean=true;
  constructor(private Route: Router, private CnoteService: CnoteService, private http: HttpClient, private fb: UntypedFormBuilder) { 
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData =  this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl() ;
  }
  IntializeFormControl() {
    const vehicleLoadingControls = new vehicleLoadingControl();
    this.jsonControlArray = vehicleLoadingControls.getvehiceLoadingFormControls();
    this.vehicleLoadingTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  ngOnInit(): void {
    this.autofillvehicleData()
  }
  autofillvehicleData() {
   this.vehicleLoadingTableForm.controls['Vehicle'].setValue(this.tripData?.VehicleNo||'');
   this.vehicleLoadingTableForm.controls['Route'].setValue(this.tripData?.RouteandSchedule||'')
   this.vehicleLoadingTableForm.controls['TripID'].setValue(this.tripData?.TripID||'')
   this.vehicleLoadingTableForm.controls['LoadingLocation'].setValue(this.tripData?.location||'')
   this.vehicleLoadingTableForm.controls['LoadingLocation'].setValue(this.tripData?.location||'')
  this.getLoadingSheetData();
  }
  getLoadingSheetData() {

    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['shippingData'];
      let loadingcsv = tableArray.filter((item)=>item.routes==this.tripData.RouteandSchedule && item.Leg==this.tripData.Leg);
     let Packages=0;
      loadingcsv.forEach(element => {
        Packages=element.Packages+Packages
        
      });
    let dataLoading=[{}]
    let json={
      LoadingSheet: this.tripData?.loadingSheetNo||'',
      Manifest:'',
      Leg: this.tripData?.Leg||'',
      Shipments:loadingcsv.length,
      Packages:Packages,
      ShipmentsLoaded:loadingcsv.length,
      PackagesLoaded:Packages,
      Pending:'',
      Action:'Load Vehicle',
      printPending:'print'
    }
    dataLoading.push(json)
    dataLoading = dataLoading.filter(obj => Object.keys(obj).length !== 0);

    this.tableload=false;
    this.csv=dataLoading;
    this.CnoteService.setvehicelodingData(this.tripData)
  })
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
}
