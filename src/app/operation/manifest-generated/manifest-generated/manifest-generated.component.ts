import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CnoteService } from '../../../core/service/Masters/CnoteService/cnote.service';
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
  centerAlignedData = ['PackagesLoadedBooked',  'WeightKg', 'VolumeCFT'];

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
  linkArray = [

    { Row: 'Action', Path: 'Operation/ViewPrint' }

  ]
  dynamicControls = {
    add: false,
    edit: false,
  }
  loadingData: any;
  formdata: any;
  menifest: any;
  constructor(private Route: Router,
    private http: HttpClient, private fb: UntypedFormBuilder,@Inject(MAT_DIALOG_DATA) public item: any,public dialogRef: MatDialogRef<ManifestGeneratedComponent>,private cnoteService:CnoteService) {

   if(item){
    this.menifest=item.loadingSheetData;
    this.getMenifest();
    
   }
  }
  getMenifest() {

    let groupedDataWithoutKey;
    const groupedData = this.menifest.reduce((acc, element) => {
      const leg = element.Leg;
      if (!acc[leg]) {
        acc[leg] = {
          Leg: leg,
          TotalWeightKg: 0,
          TotalVolumeCFT: 0,
          TotalPackages: 0,
          ShipmentCount: 0,
          Data: []
        };
      }
      acc[leg].TotalWeightKg += element.KgWt;
      acc[leg].TotalVolumeCFT += element.CftVolume;
      acc[leg].TotalPackages += element.Packages;
      acc[leg].ShipmentCount++;
      acc[leg].Data.push(element);
      return acc;
    }, {});
     groupedDataWithoutKey = Object.values(groupedData);
   let MeniFestDetails:any[]=[];
   groupedDataWithoutKey.forEach(element => {
      const randomNumber = "MF/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
      let meniFestjson={
        MFNumber: randomNumber,
        Leg: element?.Leg||'',
        ShipmentsLoadedBooked:element.ShipmentCount+"/"+element.ShipmentCount,
        PackagesLoadedBooked:element?.TotalPackages ||''+"/"+ element?.TotalPackages||'',
        WeightKg: element.TotalWeightKg,
        VolumeCFT:element.TotalVolumeCFT,
        Action: "Print"
      }
      MeniFestDetails.push(meniFestjson)
    });
    this.cnoteService.setMeniFestDetails(MeniFestDetails);
    this.csv=MeniFestDetails;
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
