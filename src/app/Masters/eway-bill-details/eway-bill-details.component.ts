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
  EwayBill: FormGroup;
  FlagHide: boolean = false;
  HideSubmit: boolean = false;
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
  constructor(private fb: UntypedFormBuilder, private Route: Router, private ICnoteService: CnoteService) {
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
    try {
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
      })
    }
    catch (err) {

    }
  }
  onFetchData() {
    debugger;
    this.ICnoteService.cnotePost('courses/ewaybill', this.EwayBill.value).subscribe({
      next: (res: any) => {
        if (res) {
          this.ewayBillDetail = res;
          this.contractNo =res[0][1]?.Consignor.ContractId || '';
          this.EwayBill.controls['PayBasis'].setValue(res[0][1].Consignor.Contract_Type || '');
          this.GetContractDetail();
        }
      }
    })
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
          if (res.MASTER.length > 0) {
            debugger;
            this.ServiceTypeDetail = res.MASTER.filter((x)=>x.CodeType=='SVCTYP');
           if( this.ServiceTypeDetail.length>1){
            this.FlagHide = true;
           }
           else{
            this.EwayBill.controls['SVCTYP'].setValue(this.ServiceTypeDetail[0].CodeId);
           }
          }
          this.HideSubmit = true;

        }
      }
    })
  }

  onSubmit() {

    this.Route.navigate(['/Masters/Docket/EwayBillDocketBooking'], {
      state: { Ewddata: this.ewayBillDetail, contractDetail: this.ContractDetails,ServiceType:this.EwayBill.value.SVCTYP }
    })
  }

}
