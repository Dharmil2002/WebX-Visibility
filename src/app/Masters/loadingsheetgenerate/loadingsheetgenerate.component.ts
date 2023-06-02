import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loadingsheetgenerate',
  templateUrl: './loadingsheetgenerate.component.html'
})
export class LoadingsheetgenerateComponent implements OnInit {
  addAndEditPath:string;
  csv: any;
  LsDetails:any[];
  routeDetails:any;
  docketNestedDetails:any;
  METADATA = {
    checkBoxRequired: true,
    selectAllorRenderedData: false,
    noColumnSort: ['checkBoxRequired']
  }
  tripcolumnHeader = {
    "checkBoxRequired": "",
    "Docket": "Docket Dest Loc",
    "Count": "Count",
    "TotalPackage": "TotalPackage",
    "TotalWeight": "TotalWeight",
    "TotalCFT": "TotalCFT"
  }
  orgBranch:string=localStorage.getItem("Branch");
  companyCode:number=parseInt(localStorage.getItem('companyCode'));
  dayName: any;
  dataDetails: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<LoadingsheetgenerateComponent>,public Route:Router,private ICnoteService: CnoteService) {
     let loadingList=[];
    data.data.forEach(element => {
      let loadingSheetData={
        Docket:element.Docket,
        Count:element.link,
        TotalPackage:element.TotalPackage,
        TotalWeight:element.TotalWeight,
        TotalCFT:element.TotalCFT,
        VehicleCapacity:element.VehicleCapacity
      }
      loadingList.push(loadingSheetData)
    });
    this.LsDetails=loadingList;
    this.routeDetails=data.routeDetails;
    this.docketNestedDetails=data.NestedDocketDetails;
   }

  ngOnInit(): void {
    this.getRouteDetail()
  }
  onFlagChange(data){
    this.dataDetails=data;
    }
  /*Below a Method is Help to Give A all Details Regarding to route*/
  getRouteDetail(){
    let req = {
      companyCode:this.companyCode,
      ruteCode:this.routeDetails?.Value||''
    };
    this.ICnoteService.cnotePost("docket/getRouteDetails",req).subscribe({
      next:(res:any)=>{
      if(res){
         this.dayName=res?.Day_Name||'';
      }
    }
      
  })
  }

 /*End*/

 /*generate a  loadingSheet as Per User Selection*/
  generateLoadingSheet(){
    if(this.dataDetails && this.dataDetails.length>0){
    const result = this.docketNestedDetails.map(obj => obj.DKTNO).join(',');
    let req={
      finYear:2223,
      companyCode:this.companyCode,
      loadingSheetNumber: "",
      loadingSheetDateTime: new Date(),
      loadingSheetBranch: this.orgBranch,
      routeCode: this.routeDetails?.Value,
      routeSchedule: this.dayName,
      unloadingBranchCode: this.LsDetails[0]?.Docket||'',
      docketIDs: result,
      totalDocket: this.LsDetails[0]?.link||0,
      boxIDs: "",
      totalPackages: this.LsDetails[0]?.TotalPackage||0,
      totalActualWeight: this.LsDetails[0]?.TotalWeight||0,
      totalCFT: this.LsDetails[0]?.TotalCFT||0,
      loadingSheetGeneratedBy: "Dhaval",
      loadingSheetStatus: "-",
      totalLoadPackages: 0,
      totalLoadActualWeight: 0,
      totalLoadCFTWt: 0,
      totalLoadedDocket: 0,
      loadedDocketIDs:"",
      loadedPackageIDs: "",
      loadingSheetUpdatedBy: "",
      loadingSheetUpdatedDateTime: "",
      loadingSheetManifested: true,
      manifestNum: "",
      vehicleNumber: "",
      loadingFromMobile: true
    }
    this.ICnoteService.cnotePost("docket/createLoadingSheet",req).subscribe({
      next:(res:any)=>{
        if (res) {
          Swal.fire({
            icon: "success",
            title: "LoadingSheetNumber:" + res.loadingSheetNumber,
            html:  "",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close();
              // Call your function here
             this.Route.navigate(["Masters/Docket/DispatchVehicle"]);
            }
          });
        }
    }
      
  })
}
else{
  SwalerrorMessage("error", "Please Select Atleast One", "", true);
}
}
 /*End*/
}
