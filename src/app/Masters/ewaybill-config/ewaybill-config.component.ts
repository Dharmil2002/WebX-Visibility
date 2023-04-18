import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';


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
    const url = 'http://localhost:3000/api/courses/ewaybill';
    const headers = {
      'Ocp-Apim-Subscription-Key': 'd141e1390212494bb9a577af2d4ccb74',
      'Content-Type': 'application/json'
    };
   
    this.http.post(url,this.EwayBillFrom.value).subscribe(response => {
       localStorage.setItem("EwayBillDetail",this.EwayBillFrom.value);
      this.Route.navigate(['/Masters/Docket/Create'], {
        state: {
          UserTable: response,
        },
      });
    });
   
  }
  

}
