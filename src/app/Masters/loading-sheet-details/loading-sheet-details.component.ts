import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { DyanmicControl } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import { LoadingsheetgenerateComponent } from '../loadingsheetgenerate/loadingsheetgenerate.component';

@Component({
  selector: 'app-loading-sheet-details',
  templateUrl: './loading-sheet-details.component.html'
})
export class LoadingSheetDetailsComponent implements OnInit {

  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  orgBranch:string=localStorage.getItem("Branch");
  BoxData:any[]
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < (column name) : Column name you want to display on table > 
  columnHeader = {
    "checkBoxRequired": "",
    "DKTNO":"Docket No",
    "CSGNNM":"Party Name",
    "ORGNCD": "Orginal Branch",
    "DESTCD": "Destionation Branch",
    "FROMLOC": "From Location",
    "TOLOC": "To Location",
    "PKGSNO": "No of Package",
    "ACTUWT": "Actual Weight(kg)",
    "CHRGWT":"Charge Weight(kg)"
  }

  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  IscheckBoxRequired: boolean;
  addAndEditPath:string;
  selectItems:DyanmicControl[];
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "Loading Sheet Details",
      items: ["Masters"],
      active: "Loading Sheet",
    },
  ]
  index: number;
  csv: any;
  ruteDetails: any;
  myArray: any;
  headerForCsv = {
    "DKTNO":"Docket No",
    "party_name":"Party Name",
    "ORGNCD": "Orginal Branch",
    "DESTCD": "Destionation Branch",
    "FROMLOC": "From Location",
    "TOLOC": "To Location",
    "PKGSNO": "No of Package",
    "ACTUWT": "Actual Weight(kg)",
    "CHRGWT":"Charge Weight(kg)"
  }
  loadingSheetData: any;
  dataDetails: any;
  tableloadloading:boolean=true;
  LoadingData:boolean=false;
  routeDetailsFromDropdown:any;
  iconCard=[
    'fas fa-cart-plus float-start',
    'fas fa-business-time float-start',
    'fas fa-chart-line float-start',
    'fas fas fa-truck-pickup float-start'
  ]

classDashboard=[
  'info-box7  bg-white order-info-box7',
  'info-box7 bg-white order-info-box7',
  'info-box7 bg-white order-info-box7',
  'info-box7 bg-white order-info-box7',
]
  constructor(private Route: Router,private ICnoteService: CnoteService, private modalService: NgbModal, private dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { 
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.loadingSheetData=this.Route.getCurrentNavigation()?.extras?.state.data.data;
      this.routeDetailsFromDropdown= this.Route.getCurrentNavigation()?.extras?.state.data.dropDownValue;
    this.routeDetails();
    }
  }

  ngOnInit(): void {
  }
  routeDetails() {
    try {
      // Creates the request object to be sent to the API endpoint
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        DESTCD:this.loadingSheetData?.Docket,
        ORGNCD:this.orgBranch.trim()
      };

      // Makes the API call to fetch the getDocket DocketDetails by DescCode
      this.ICnoteService.cnotePost("docket/getDocketDocketDetailsbyDescCode", req).subscribe({
        next: (res: any) => {
          if (res) {
            this.data =res;
            this.csv = this.data;
            this.tableload = false;
          } else {
            SwalerrorMessage("error", "No Data Found", "", true);
          }
        },
      });
    } catch (err) {
      SwalerrorMessage("error", "Please  Try Again", "", true);
    }
}
onFlagChange(data){
this.dataDetails=data;
let loadingData=[];
let PKGSNO=0;
let ACTUWT=0;
let CHRGWT=0;
this.dataDetails.forEach(element => {
  PKGSNO+=element.PKGSNO,
  ACTUWT+=element.ACTUWT,
  CHRGWT+=element.CHRGWT
});
let title=[
  {title:'Docket',value:this.dataDetails?.length||0},
  {title:'No of Package',value:PKGSNO},
  {title:'Actual Weight(kg)',value:ACTUWT},
  {title:'Charge Weight(kg)',value:CHRGWT},
]
title.forEach((element,index) => {
  let loadingSheetDetail={
    title:element.title,
    count:element.value,
    class:this.classDashboard[index],
    icon:this.iconCard[index]
  }
  loadingData.push(loadingSheetDetail);
});

this.BoxData=loadingData
}
loadingSheetGenerate() {
  if(this.dataDetails && this.dataDetails.length>0){
  this.LoadingData=true;
  this.index = 1;
  const countsObj = this.dataDetails.reduce((acc, obj) => {
    const key = obj.DESTCD;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  this.myArray = Object.keys(countsObj).map(key => {
    const filteredObjects = this.dataDetails.filter(obj => obj.DESTCD === key);
    const totalPackage = filteredObjects.reduce((acc, obj) => acc + obj.PKGSNO, 0);
    const totalWeight = filteredObjects.reduce((acc, obj) => acc + obj.ACTUWT, 0);
    const totalCFT = filteredObjects.reduce((acc, obj) => acc + obj.CHRGWT, 0);
    return {
      Docket: key,
      link: countsObj[key],
      TotalPackage: totalPackage,
      TotalWeight: totalWeight,
      TotalCFT: totalCFT,
      VehicleCapacity:''
    };
  });


  // Check if BcSerialType is "E"
    // If it is "E", set displaybarcode to true
    // Open a modal using the content parameter passed to the function
  

    const dialogRef: MatDialogRef<LoadingsheetgenerateComponent> = this.dialog.open(LoadingsheetgenerateComponent, {
      width: '100%', // Set the desired width
      data: {data:this.myArray,routeDetails:this.routeDetailsFromDropdown,NestedDocketDetails:this.dataDetails} // Pass the data object
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // Handle the result after the dialog is closed
    });
  }
  else{
    SwalerrorMessage("error", "Please Select Atleast One", "", true);
  }

}

generateLoadingSheet(){
   console.log(this.dataDetails);
}
}
