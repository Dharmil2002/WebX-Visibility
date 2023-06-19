import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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
  orgBranch: string = localStorage.getItem("Branch");
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
  // linkArray=[
  //   { Row: 'Action', Path: 'Operation/' }

  // ]
  linkArray = [

    { Row: 'Action', Path: 'Operation/ViewPrint' }

  ]
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  loadingData: any;
  formdata: any;
  menifest: any;
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder,@Inject(MAT_DIALOG_DATA) public item: any,public dialogRef: MatDialogRef<ManifestGeneratedComponent>) {

   if(item){
    this.menifest=item.loadingSheetData;
    this.getMenifest();
    
   }
  }
  getMenifest() {
    const randomNumber = "MF/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
    let meniFestjson={
      MFNumber: randomNumber,
      Leg: this.menifest[0].Leg,
      ShipmentsLoadedBooked:this.menifest.length+"/"+this.menifest.length,
      PackagesLoadedBooked: this.menifest[0].Packages+"/"+this.menifest[0].Packages,
      WeightKg: this.menifest[0].WeightKg,
      VolumeCFT:this.menifest[0].VolumeCFT,
      Action: "Print"
    }
    let MenifestGenerate=[meniFestjson];
    this.csv=MenifestGenerate;
  }

  ngOnInit(): void {
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
    this.dialogRef.close(this.csv)
  }
}
