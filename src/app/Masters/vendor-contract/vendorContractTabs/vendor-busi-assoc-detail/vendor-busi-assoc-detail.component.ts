import { Component, OnInit } from '@angular/core';
import { BusinessAssociates, RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';

@Component({
  selector: 'app-vendor-busi-assoc-detail',
  templateUrl: './vendor-busi-assoc-detail.component.html'
})
export class VendorBusiAssocDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData=BusinessAssociates
  columnHeaderTErouteBased={
    city: {
      Title: "City",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    controlLocation: {
      Title: "controlLocation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    operation: {
      Title: "operation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mode: {
      Title: "Transport Mode",
      class: "matcolumncenter",
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
  staticFieldTErouteBased=['city','controlLocation','operation','rateType','mode',,'rate','min','max']
  constructor() { }

  ngOnInit(): void {
  }

}
