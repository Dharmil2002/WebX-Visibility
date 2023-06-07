import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { loadingControl } from 'src/assets/FormControls/loadingSheet';
import { Router } from '@angular/router';
import { LodingSheetGenerateSuccessComponent } from '../loding-sheet-generate-success/loding-sheet-generate-success.component';
import { UpdateloadingControl } from 'src/assets/FormControls/updateLoadingSheet';

@Component({
  selector: 'app-update-loading-sheet',
  templateUrl: './update-loading-sheet.component.html'
})
export class UpdateLoadingSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/manifestGenerated.json'
  tableload = false;
  csv: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  loadingSheetTableForm:UntypedFormGroup
  jsonControlArray:any;
  columnHeader = {
    "MFNumber": "MF Number",
    "Leg": "Leg",
    "ShipmentsLoadedBooked": "Shipments- Loaded/Booked",
    "PackagesLoadedBooked": "Packages Loaded/Booked",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
    "Print": "Print"
  }
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "MFNumber": "MF Number",
    "Leg": "Leg",
    "ShipmentsLoadedBooked": "Shipments- Loaded/Booked",
    "PackagesLoadedBooked": "Packages Loaded/Booked",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  //declaring breadscrum
  breadscrums = [
    {
      title: "Manifest Generated",
      items: ["Home"],
      active: "Manifest Generated"
    }
  ]
  toggleArray=[]
  menuItems=[]
  linkArray=[]
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  loadingData: any;
  formdata: any;
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder) {

    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['tabledata'];
      this.formdata = this.data['formdata'];
      this.autoBindData();
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      this.tableload = false;
    });
    this.IntializeFormControl()
  }
  autoBindData() {
    this.loadingSheetTableForm.controls['vehicle'].setValue(this.formdata[0].Vehicle)
    this.loadingSheetTableForm.controls['Route'].setValue(this.formdata[0].Route)
    this.loadingSheetTableForm.controls['tripID'].setValue(this.formdata[0].TripID)
    this.loadingSheetTableForm.controls['LoadingLocation'].setValue(this.formdata[0].LoadingLocation)
    this.loadingSheetTableForm.controls['LoadingSheet'].setValue(this.formdata[0].LoadingSheet)
    this.loadingSheetTableForm.controls['Leg'].setValue(this.formdata[0].Leg)
  }
  ngOnInit(): void {
  }
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new UpdateloadingControl();
    this.jsonControlArray = ManifestGeneratedFormControl.getupdatelsFormControls();
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
  Close(): void {
    window.history.back();
  }
}
