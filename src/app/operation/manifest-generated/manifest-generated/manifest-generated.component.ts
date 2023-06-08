import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ManifestGeneratedControl } from 'src/assets/FormControls/ManifestGenerated';

@Component({
  selector: 'app-manifest-generated',
  templateUrl: './manifest-generated.component.html',
})
export class ManifestGeneratedComponent implements OnInit {
  jsonUrl = '../../../assets/data/manifestGenerated.json'
  tableload = false;
  csv: any[];
  data: [] | any;
  tripData: any;
  tabledata: any;
  manifestgeneratedTableForm:UntypedFormGroup
  manifestControlArray:any;
  columnHeader = {
    "MFNumber": "MF Number",
    "Leg": "Leg",
    "ShipmentsLoadedBooked": "Shipments- Loaded/Booked",
    "PackagesLoadedBooked": "Packages Loaded/Booked",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
    "Action": "Print"
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
  linkArray=[
    { Row: 'Action', Path: 'Operation/' }

  ]
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
    this.manifestgeneratedTableForm.controls['Vehicle'].setValue(this.formdata[0].Vehicle)
    this.manifestgeneratedTableForm.controls['Route'].setValue(this.formdata[0].Route)
    this.manifestgeneratedTableForm.controls['TripId'].setValue(this.formdata[0].TripID)
    this.manifestgeneratedTableForm.controls['LoadingLoc'].setValue(this.formdata[0].LoadingLocation)
    this.manifestgeneratedTableForm.controls['LoadingSheet'].setValue(this.formdata[0].LoadingSheet)
    this.manifestgeneratedTableForm.controls['Leg'].setValue(this.formdata[0].Leg)
  }
  ngOnInit(): void {
  }
  IntializeFormControl() {
    const ManifestGeneratedFormControl = new ManifestGeneratedControl();
    this.manifestControlArray = ManifestGeneratedFormControl.getManifestGeneratedFormControls();
    this.manifestgeneratedTableForm = formGroupBuilder(this.fb, [this.manifestControlArray])
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
