import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { error } from 'console';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { Employee } from 'src/app/core/models/Cnote';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';

@Component({
  selector: 'app-eway-bill-details',
  templateUrl: './eway-bill-details.component.html'
})
export class EwayBillDetailsComponent implements OnInit {
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  EwayBill: FormGroup;
  FlagHide: boolean = false;
  HideSubmit: boolean = false;
  selectedDateTime:any;
  isLoading:boolean = false;
  title = 'table-validation-demo';  
  elistMatTableDataSource = new MatTableDataSource < Employee > ();  
  displayedColumns: string[];  
  todaysDate: Date;  
  breadscrums = [
    {
      title: "Eway-bill Detail",
      items: ["Masters"],
      active: "Eway-bill Detail",
    },
  ]
  ServiceTypeDetail: any;
  payBasisDetail: any;
  ewayBillDetail: any;
  contractNo: any;
  ContractDetails: any;
  time: {
    "hour": 1,
    "minute": 30,
    }
  constructor(private fb: UntypedFormBuilder,private Route: Router, private ICnoteService: CnoteService) {
    this.EwayBill = this.createUserForm()
    //this.getGenaralMaster();
  }
  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      companyCode: [parseInt(localStorage.getItem("companyCode"))],
      EWBNo: [''],
      SVCTYP: [''],
      PayBasis: ['']

    });
  }
  ngOnInit(): void {
  }
  getGenaralMaster() {
    debugger;
      let reqBody = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        ddArray: ['SVCTYP']
      }
      this.ICnoteService.cnotePost('services/GetcommonActiveGeneralMasterCodeListByTenantId', reqBody).subscribe({
        next: (res: any) => {
          if (res) {
            this.ServiceTypeDetail = res.result;
          }
        }
        
        ,
        error:(err:any)=>{
          SwalerrorMessage("error","Not Data Found in Master or E-Way Bill","",true);
        }
      })
   
  }
  onFetchData() {
    debugger;
    this.isLoading = true;
    if(this.EwayBill.value.EWBNo){
    this.ICnoteService.cnotePost('courses/ewaybill', this.EwayBill.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.ewayBillDetail = res;
          this.contractNo =res[0][1]?.Consignor.ContractId || '';
          this.EwayBill.controls['PayBasis'].setValue(res[0][1].Consignor.Contract_Type || '');
          this.GetContractDetail();
        }
        else{
          SwalerrorMessage("Warn","No Data Fetch From Api","",true);
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        SwalerrorMessage("error","Not Data Found in  E-Way Bill Please Try Another EwayBill No","",true);
      }
    })
  }
  else{
    this.isLoading = false;
    SwalerrorMessage("Warn","Please Enter E-Way Bill No","",true);
  
  }
    
  }
  

  GetContractDetail() {
    debugger;
    let reqBody = {
      companyCode: parseInt(localStorage.getItem('companyCode')),
      PAYBAS: this.EwayBill.value.PayBasis,
      CONTRACTID: this.contractNo
    }
    this.ICnoteService.cnotePost('services/GetDetailedBasedOnContract', reqBody).subscribe({
      next: (res: any) => {
        if (res) {
          this.ContractDetails = res;
          this.isLoading = false;
          if (res.MASTER.length > 0) {
            this.ServiceTypeDetail = res.MASTER.filter((x)=>x.CodeType=='SVCTYP');
           if( this.ServiceTypeDetail.length>1){
            this.FlagHide = true;
             this.HideSubmit = true;
           }
           else{
            this.EwayBill.controls['SVCTYP'].setValue(this.ServiceTypeDetail[0].CodeId);
            this.isLoading = true;
            setTimeout(() => {
             this.onSubmit();
            }, 2000);
          }
          }
         
        }
        else{
          SwalerrorMessage("Warn","No Data Found in Master","",true);
          this.isLoading = false;
        }
      },
      error:(err:any)=>{
        SwalerrorMessage("Warn","i didn't get any contract","",true);
        this.isLoading = false;
      }
    })
  }

  onSubmit() {
    this.isLoading=false;
    this.Route.navigate(['/Masters/Docket/EwayBillDocketBooking'], {
      state: { Ewddata: this.ewayBillDetail, contractDetail: this.ContractDetails,ServiceType:this.EwayBill.value.SVCTYP }
    })
  }

}
