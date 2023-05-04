import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docket-dashboard',
  templateUrl: './docket-dashboard.component.html'
})
export class DocketDashboardComponent implements OnInit {
  breadscrums = [
    {
      title: "Docket Dashboard",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  ewayBillDetail: any;
  

  constructor(private router: Router,) { }

  ngOnInit(): void {
    this.ewayBillDetail=localStorage.getItem("EwayBillDetail");
  }
  docketBooking(event){
    if(event=='Docket'){
    this.router.navigate(["/Masters/Docket/Create"]);
    }
    else if(event=='EwaybillNo'){
      this.router.navigate(["/Masters/Docket/Ewaybill"]);
    }
    else{
      this.router.navigate(["/Masters/Docket/Ewaybill-Config"])}
     
    }
  

}
