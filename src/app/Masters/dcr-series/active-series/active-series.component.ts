import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createShipDataObject } from 'src/app/Utility/commonFunction/dashboard/dashboard';

@Component({
  selector: 'app-active-series',
  templateUrl: './active-series.component.html',
})
export class ActiveSeriesComponent implements OnInit {

  boxdata: any[];
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  dynamicControls = {
    add: true,
    edit: false,
    csv: false
  }
  filterColumn: boolean = true;
  allColumnFilter: any;
  toggleArray = []
  menuItems = []
  METADATA = {
    // checkBoxRequired: true,
    // selectAllorRenderedData: false,
    // noColumnSort: ["checkBoxRequired"],
  };
  linkArray = []
  csv: any[];
  addAndEditPath: string;
  columnHeader = {
    documentId: {
      Title: "Document",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    bookcode: {
      Title: "Book code",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    seriesfrom: {
      Title: "Series from",
      class: "matcolumncenter",
      Style: "",//min-width:15%
    },
    seriesto: {
      Title: "Series To",
      class: "matcolumncenter",
      Style: "",//min-width:20%
    },
    allocated: {
      Title: "Allocated",
      class: "matcolumncenter",
      Style: "",//min-width:10%
    },
    used: {
      Title: "Used",
      class: "matcolumncenter",
      Style: "",//max-width:95px
    },
    dcrdate: {
      Title: "DCR date",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    location: {
      Title: "Location",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    allocatedto: {
      Title: "Allocated to",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    name: {
      Title: "Name",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
    action: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "",//max-width:90px
    },
  };
  staticField = [
    "documentId",
    "bookcode",
    "seriesfrom",
    "seriesto",
    "allocated",
    "used",
    "dcrdate",
    "location",
    "allocatedto",
    "name",
    "action"
  ];

  constructor(private Route: Router) { }

  ngOnInit(): void {
    const shipData = [
      createShipDataObject(0, "Active Series", "bg-c-Bottle-light"),
      createShipDataObject(0, "Customer Series", "bg-c-Grape-light"),
      createShipDataObject(0, "Location Series", "bg-c-Bottle-light"),
    ];
    this.addAndEditPath = "/Masters/DocumentControlRegister/AddDCR";//setting Path to add data
    this.boxdata = shipData;
    this.tableload = false;
  }

  // AddNew(){
  //   this.Route.navigateByUrl("/Masters/AccountMaster/AddAccountGroup");
  // }

}
