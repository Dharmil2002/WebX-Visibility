import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-consignment-pod',
  templateUrl: './consignment-pod.component.html'
})
export class ConsignmentPodComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note POD Tracking",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  isTableLode=true
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    Date: {
      Title: "Date & Time",
      class: "matcolumncenter",
      Style: "min-width:30%",
    },
    POD: {
      Title: "POD",
      class: "matcolumncenter",
      Style: "min-width:40%",
    },
    UploadedBy: {
      Title: "Uploaded By",
      class: "matcolumnleft",
      Style: "min-width:30%",
    },
  };
  staticField = [
    "Date",
    "POD",
    "UploadedBy",
  ];
  CompanyCode = parseInt(localStorage.getItem('companyCode'))
  TableData: any = [];
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

  functionCallHandler(event){

  }
}
