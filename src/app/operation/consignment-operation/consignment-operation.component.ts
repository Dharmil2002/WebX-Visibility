import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consignment-operation',
  templateUrl: './consignment-operation.component.html'
})
export class ConsignmentOperationComponent implements OnInit {
  breadScrums = [
    {
      title: "Consignment Note Operation Tracking ",
      items: ["Home"],
      active: "Consignment",
    },
  ];
  isTableLode = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  // EventButton = {
  //   functionName:'AddNew',
  //   name: "Add TDS",
  //   iconName:'add'
  // }
  columnHeader = {
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Activity: {
      Title: "Activity",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    DocumentNumber: {
      Title: "Document Number",
      class: "matcolumnleft",
      Style: "min-width:30%",
    },
    Status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    CumulativeDays: {
      Title: "Cumulative Days",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    // RateForOthers: {
    //   Title: "Rate For Others",
    //   class: "matcolumncenter",
    //   Style: "min-width:10%",
    // },
    // isActive: {
    //   type: "Activetoggle",
    //   Title: "Active",
    //   class: "matcolumncenter",
    //   Style: "min-width:10%",
    //   functionName: "ActiveFunction",
    // },
    // EditAction: {
    //   type: "iconClick",
    //   Title: "Action",
    //   class: "matcolumncenter",
    //   Style: "min-width:10%",
    //   functionName: "EditFunction",
    //   iconName: "edit",
    // },
  };
  staticField = [
    "Date",
    "Activity",
    "DocumentNumber",
    "Status",
    "CumulativeDays",
  ];
  CompanyCode = parseInt(localStorage.getItem('companyCode'))
  TableData: any = [];
  constructor() { }

  ngOnInit(): void {
  }

  functionCallHandler(event){

  }

}
