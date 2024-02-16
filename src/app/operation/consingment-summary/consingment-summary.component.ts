import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-consingment-summary',
  templateUrl: './consingment-summary.component.html'
})
export class ConsingmentSummaryComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note Summary Tracking ",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  DocData: any;
  constructor(
    private Route: Router,
    private masterService: MasterService
  ) { 
    if (this.Route.getCurrentNavigation().extras?.state) {
      this.DocData= this.Route.getCurrentNavigation().extras?.state.data;
      console.log('this.DocData' ,this.DocData)
    }else{
      this.Route.navigateByUrl("Operation/ConsignmentFilter")
    }
  }

  ngOnInit(): void {
  }

}
