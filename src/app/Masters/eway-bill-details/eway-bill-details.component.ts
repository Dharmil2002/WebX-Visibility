import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';

@Component({
  selector: 'app-eway-bill-details',
  templateUrl: './eway-bill-details.component.html'
})
export class EwayBillDetailsComponent implements OnInit {
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  EwayBill:FormGroup;
  breadscrums = [
    {
      title: "Eway-bill Detail",
      items: ["Masters"],
      active: "Eway-bill Detail",
    },
  ]
  ServiceTypeDetail: any;
  constructor(private fb: UntypedFormBuilder,private Route:Router,private ICnoteService: CnoteService) { 
    this.EwayBill=this.createUserForm()
    this.getGenaralMaster();
  }
  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      companyCode:[parseInt(localStorage.getItem("companyCode"))],
      EWBNo:[''],
      Serivestype:['']
     
    });
  }
  ngOnInit(): void {
  }
  getGenaralMaster(){
    debugger;
    try{
     let reqBody={
      companyCode:parseInt(localStorage.getItem("companyCode")),
      ddArray:['SVCTYP']
     }
     this.ICnoteService.cnotePost('services/GetcommonActiveGeneralMasterCodeListByTenantId',reqBody).subscribe({next:(res:any)=>{
       if(res){
         this.ServiceTypeDetail=res.result;
       }
     }})
    }
    catch(err){

    }
  }
  onSubmit(){
    debugger;
   this.ICnoteService.cnotePost('courses/ewaybill',this.EwayBill.value).subscribe({next:(res:any)=>{
      this.Route.navigate(['/Masters/Docket/Create'],{
        state: {Ewddata:res[0].data,ServiceType:this.EwayBill.value.Serivestype}
      })
   }})
  }

}
