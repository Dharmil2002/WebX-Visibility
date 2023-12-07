import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-payments',
  templateUrl: './advance-payments.component.html'
})
export class AdvancePaymentsComponent implements OnInit {
  breadScrums = [
    {
      title: "Advance Payments",
      items: ["Home"],
      active: "List",
    },
  ];
  linkArray = [];
  menuItems = [];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    THC: {
      Title: "THC",
      class: "matcolumncenter",
      Style: "min-width:20%",
      type: "Link",
      functionName:"BalanceUnbilledFunction"
    },
    GenerationDate: {
      Title: "Generation date",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    VehicleNumber: {
      Title: "Vehicle No.",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    THCamount: {
      Title: "THC Amount",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
    Advance: {
      Title: "Advance",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
  };
  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };

  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = ["GenerationDate", "VehicleNumber", "THCamount" , "Advance"];
  companyCode = parseInt(localStorage.getItem("companyCode"));
  tableData: any = [
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },
    {
      THC: "VHMUM00383",
      GenerationDate: "12-10-2023",
      VehicleNumber: "MH02CB6655",
      THCamount: "23450.45",
      Advance: "5000.00",
    },
    
  ];
  isTableLode = true;
  constructor() {}

  ngOnInit(): void {}

  AdvancePendingFunction(event){
    console.log('AdvancePendingFunction' ,event)
  }

  BalanceUnbilledFunction(event){
    console.log('BalanceUnbilledFunction' ,event)
  }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
}
