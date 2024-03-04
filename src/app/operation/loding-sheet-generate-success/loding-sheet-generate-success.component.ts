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
    "hyperlink": "Loading Sheet",
    "leg": "Leg",
    "count": "Shipments",
    "packages": "Packages",
    "weightKg": "Weight Kg",
    "volumeCFT": "Volume CFT",
    // "Action":"Print"
  };
  hyperlinkControls = {
    value: "LoadingSheet",
    functionName: "viewLoadingSheet"
  }
  centerAlignedData = ['Shipment', 'Packages', 'WeightKg', 'VolumeCFT'];
  headerForCsv = {
    "LoadingSheet": "Loading Sheet",
    "leg": "Leg",
    "Shipment": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  columnWidths = {
    'hyperlink': 'min-width:20%'
  };
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
  
    console.log('this.data',this.data)
    this.csv=this.data;
    Swal.fire({
      icon: "success",
      title: "Successfull",
      text: `Loading Sheet generated Successfully`,//
      showConfirmButton: true,
    })
  }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close(this.csv);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    console.log('functionName' ,functionName)
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  viewLoadingSheet(event){
      const req = {
        templateName: "LoadingSheet View-Print",
        DocNo: event.data?.LoadingSheet,
      };
      const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
      window.open(url, '', 'width=1000,height=800');
  }
}
