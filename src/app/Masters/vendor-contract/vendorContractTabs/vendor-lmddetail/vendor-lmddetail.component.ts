import { Component, OnInit } from '@angular/core';
import { LastMileData } from '../../vendor-contract-list/VendorStaticData';

@Component({
  selector: 'app-vendor-lmddetail',
  templateUrl: './vendor-lmddetail.component.html'
})
export class VendorLMDDetailComponent implements OnInit {
  TErouteBasedTableData=LastMileData
  columnHeaderTErouteBased={
    location: {
      Title: "Location",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    timeFrame: {
      Title: "Time Frame",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    capacity: {
      Title: "Capacity",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    minCharge: {
      Title: "Min Change",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    committedKm: {
      Title: "CommittedKm",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    additionalKm: {
      Title: "Additional KM",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    maxCharges: {
      Title: "Max Change",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
  }
  tableLoad: boolean=true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  staticFieldTErouteBased=['location','rateType','timeFrame','capacity','minCharge','committedKm','additionalKm','maxCharges']
  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";
 
  constructor() { }

  ngOnInit(): void {
  }

}
