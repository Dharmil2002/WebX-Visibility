import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { RunSheetControl } from 'src/assets/FormControls/RunsheetGeneration';


@Component({
  selector: 'app-create-run-sheet',
  templateUrl: './create-run-sheet.component.html'
})
export class CreateRunSheetComponent implements OnInit {
  jsonUrl = '../../../assets/data/create-runsheet-data.json'
  RunSheetTableForm: UntypedFormGroup
  jsonControlArray: any;
  RunSheetTable: any;
  runsheetData: any;
  //declaring breadscrum
  breadscrums = [
    {
      title: "Create Run Sheet",
      items: ["Home"],
      active: "Create Run Sheet"
    }
  ]
  data: any;
  tableload = false;
  csv: any[];
  constructor(private http: HttpClient, private Route: Router, private fb: UntypedFormBuilder
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.RunSheetTable = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    this.IntializeFormControl()
  }
  toggleArray = []
  menuItems = []
  linkArray = []
  columnHeader = {
    "Document": "Document",
    "Type": "Type",
    "Customer": "Customer",
    "Address": "Address",
    "Pincode": "Pin code",
    "Packages": "Packages",
    "Weight": "Weight",
    "Volume": "Volume",
    "checkBoxRequired": "Select"
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  }
  ngOnInit(): void {
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res['GenerateData'];
      this.autoBindData();
      this.csv = res['RunsheetData'];
      this.tableload = false;
    });
  }
  IntializeFormControl() {
    const RunSheetFormControl = new RunSheetControl();
    this.jsonControlArray = RunSheetFormControl.RunSheetFormControls();
    this.RunSheetTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // we can add more arguments here, if needed. like as shown
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  autoBindData() {
    this.RunSheetTableForm.controls['Cluster'].setValue(this.RunSheetTable?.columnData.DeliveryCluster || '')
    this.RunSheetTableForm.controls['RunSheetID'].setValue(this.data[0]?.RunSheetID || '')
    this.RunSheetTableForm.controls['Vehicle'].setValue(this.data[0]?.VehicleNo || '')
    this.RunSheetTableForm.controls['VehType'].setValue(this.data[0]?.VehType || '')
    this.RunSheetTableForm.controls['Vendor'].setValue(this.data[0]?.VendorID || '')
    this.RunSheetTableForm.controls['VenType'].setValue(this.data[0]?.VenType || '')
    this.RunSheetTableForm.controls['CapacityKg'].setValue(this.data[0]?.CapacityKg || '')
    this.RunSheetTableForm.controls['CapVol'].setValue(this.data[0]?.CapacityVolumeCFT || '')
    this.RunSheetTableForm.controls['LoadKg'].setValue(this.data[0]?.LoadedKg || '')
    this.RunSheetTableForm.controls['LoadVol'].setValue(this.data[0]?.LoadedVolumeCFT || '')
    this.RunSheetTableForm.controls['WeightUti'].setValue(this.data[0]?.WeightUtilization || '')
    this.RunSheetTableForm.controls['VolUti'].setValue(this.data[0]?.VolumeUtilization || '')
  }
  GenerateRunsheet(){
    this.Route.navigateByUrl('/dashboard/GlobeDashboardPage');
  }
}
