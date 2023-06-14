import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
    const mappings = {
      'Cluster': 'DeliveryCluster',
      'RunSheetID': 'RunSheetID',
      'Vehicle': 'VehicleNo',
      'VehType': 'VehType',
      'Vendor': 'VendorID',
      'VenType': 'VenType',
      'CapacityKg': 'CapacityKg',
      'CapVol': 'CapacityVolumeCFT',
      'LoadKg': 'LoadedKg',
      'LoadVol': 'LoadedVolumeCFT',
      'WeightUti': 'WeightUtilization',
      'VolUti': 'VolumeUtilization'
    };

    for (let key in mappings) {
      let value = this.data[0]?.[mappings[key]] || '';
      if (key === 'Cluster') value = this.RunSheetTable?.columnData.DeliveryCluster || '';
      this.RunSheetTableForm.controls[key].setValue(value);
    }
  }
  GenerateRunsheet() {
    this.Route.navigateByUrl('/dashboard/GlobeDashboardPage');
  }
}
