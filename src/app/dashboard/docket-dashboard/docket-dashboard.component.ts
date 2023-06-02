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
    const routeMap = {
      'Docket': '/Masters/Docket/Create',
      'EwaybillNo': '/Masters/Docket/Ewaybill',
      'LoadingSheet': '/Masters/Docket/LoadingSheet',
      'Manifest': '/Masters/Docket/ManifestGeneration',
      'GlobeDashboardPage': 'dashboard/GlobeDashboardPage',
      'default': '/Masters/Docket/Ewaybill-Config'
    };
    
    const route = routeMap[event] || routeMap['default'];
    this.router.navigate([route]);
  }    
  

}
