import { Component, OnInit } from '@angular/core';
import { RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';

@Component({
  selector: 'app-vendor-lhldetail',
  templateUrl: './vendor-lhldetail.component.html'
})
export class VendorLHLDetailComponent implements OnInit {
 // @Input() contractData: any;

  TErouteBasedTableData=RouteBasedTableData
  columnHeaderTErouteBased={
    route: {
      Title: "Route",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    capacity: {
      Title: "Capacity",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rate: {
      Title: "Rate",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    min: {
      Title: "Min",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    max: {
      Title: "Max",
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
  staticFieldTErouteBased=['min','rate','capacity','route','rateType','max']
  constructor() { }

  ngOnInit(): void {
  }

}
