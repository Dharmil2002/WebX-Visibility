import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { ViewPrintComponent } from '../view-print/view-print.component';
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
    "leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
    "Action":"Print"
  };
  centerAlignedData = ['Shipment', 'Packages', 'WeightKg', 'VolumeCFT'];
  headerForCsv = {
    "LoadingSheet": "Loading Sheet",
    "leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  // linkArray = [

  // ]
  linkArray = [
    { Row: 'Action', Path: '', componentDetails: "" }
  ]
  menuItems = [
    { label: 'Print',componentDetails: ViewPrintComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
  ];

  METADATA = {
    checkBoxRequired: false,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private CnoteService: CnoteService,public dialogRef: MatDialogRef<LodingSheetGenerateSuccessComponent>,public Route:Router) {

    this.data.forEach(obj => {
    const randomNumber = "Ls/" + this.orgBranch + "/" + 2223 + "/" + Math.floor(Math.random() * 100000);
      obj.LoadingSheet = randomNumber;
      obj.Action= "Print";
    });
    this.csv=this.data;
    Swal.fire({
      icon: "success",
      title: "Successful",
      text: `Loading Sheet generated Successfully`,//
      showConfirmButton: true,
    })
  }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close(this.csv);
  }
  
}
