import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loding-sheet-generate-success',
  templateUrl: './loding-sheet-generate-success.component.html'
})
export class LodingSheetGenerateSuccessComponent implements OnInit {
  tableload=false;
  toggleArray=[]  
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  }
  IscheckBoxRequired: boolean;
  menuItemflag: boolean = true;
  orgBranch: string = localStorage.getItem("Branch");
    //declaring breadscrum
    breadscrums = [
      {
        title: "Loading-Sheet",
        items: ["Loading"],
        active: "Loading-Sheet"
      }
    ]
  columnHeader = {
    "LoadingSheet": "Loading Sheet",
    "lag": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  headerForCsv = {
    "LoadingSheet": "Loading Sheet",
    "lag": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  linkArray = [
  ]
  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent>,public Route:Router) { 
    const randomNumber = "Ls/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
    this.data.forEach(obj => {
      obj.LoadingSheet = randomNumber;
    });
    this.csv=this.data;
  }

  ngOnInit(): void {
  }

}
