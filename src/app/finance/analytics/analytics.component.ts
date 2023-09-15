import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  tableLoad: boolean = true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    CNC: {
      Title: "Customer Name & Code",
      class: "matcolumncenter",
      Style: "",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "",
    },
    taxableValue: {
      Title: "Taxable Value",
      class: "matcolumncenter",
      Style: "",
    },
    PTR: {
      Title: "Pending for TDS Reconciliation",
      class: "matcolumncenter",
      Style: "",
    },
    totalValue: {
      Title: "Total Value",
      class: "matcolumncenter",
      Style: "",
    },
    NV: {
      Title: "No of Voucher",
      class: "matcolumncenter",
      Style: "",
    },
    totalvalue: {
      Title: "Total Value",
      class: "matcolumncenter",
      Style: "",
    }
  };
  tableData = [
    {
      CNC: "DTDC : C000001",
      invoiceNo: 230,
      taxableValue: "120,345.00",
      PTR: "150",
      totalValue: "76,345.00",
      NV:110,
      totalvalue:"65,000.00",
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: 230,
      taxableValue: "87,560.50",
      PTR: "150",
      totalValue: "65,560.50",
      NV:200,
      totalvalue:"54,560.50",
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: 230,
      taxableValue: "345,980.00",
      PTR: "150",
      totalValue: "210,980.00",
      NV:340,
      totalvalue:"189,980.00",
    }
  ];
  staticField = ["CNC", "invoiceNo", "taxableValue", "PTR", "totalValue", "NV","totalvalue"];
  constructor() {
    this.tableLoad = false;
  }

  ngOnInit(): void {
  }

}
