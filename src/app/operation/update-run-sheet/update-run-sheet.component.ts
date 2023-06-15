import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UpdateloadingControl } from 'src/assets/FormControls/UpdateRunsheet';

@Component({
  selector: 'app-update-run-sheet',
  templateUrl: './update-run-sheet.component.html'
})
export class UpdateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/updateRunsheet.json'
  tableload = false;
  csv: any[];
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
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder) {

    // if (this.Route.getCurrentNavigation()?.extras?.state != null) {
    //   this.tripData = this.Route.getCurrentNavigation()?.extras?.state.data;
    // }
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
    const formControlsMap = {
      Vehicle: 'vehicle',
      Cluster: 'cluster',
      Runsheet: 'runSheetID',
      LoadingLocation: 'loadingLocation',
      Startkm: 'startKm',
      Departuretime: 'departureTime'
    };
  
    Object.keys(formControlsMap).forEach(controlName => {
      const formControl = this.updateSheetTableForm.controls[controlName];
      const formdataKey = formControlsMap[controlName];
      const value = this.formdata[0][formdataKey];
      formControl.setValue(value);
    });
  }
  ngOnInit(): void {
  }
  IntializeFormControl() {
    const UpdaterunsheetFormControl = new UpdateloadingControl();
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
    this.Route.navigateByUrl('/dashboard/GlobeDashboardPage');
  }
}