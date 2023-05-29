import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';


@Component({
  selector: 'app-ewaybill-config',
  templateUrl: './ewaybill-config.component.html',
})
export class EwaybillConfigComponent implements OnInit {
  EwayBillFrom:FormGroup;
  divcol: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  breadscrums = [
    {
      title: "Eway-bill",
      items: ["Masters"],
      active: "Eway-bill",
    },
  ]
  constructor(private http: HttpClient,private fb: UntypedFormBuilder,private Route:Router) { 
   this.EwayBillFrom=this.createUserForm()

  }
  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      UserName:[''],
      Password:[''],
      CustomerId:[''],
      LoginGSTIN:[''],
      TransGSTIN:['']
    });
  }
  ngOnInit(): void {
  }

  getEWayBill() {
    const url = 'https://webx-tms-api.azurewebsites.net/v1/auth/login';
    const reqBody = {
      "companycode":10065,
      "username": "ABHISHEK",
      "password":"User@123"
  }
    this.http.post(url,reqBody).subscribe({next:(res:any)=>{
      
    }
    ,error: (err:any)=>{
       console.log(err);
    }
  })
 
   
  }
  

}
