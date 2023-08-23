import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-summary-page',
  templateUrl: './job-summary-page.component.html'
})
export class JobSummaryPageComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    jobNo: {
      Title: "Job No",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    jobLocation: {
      Title: "Job Location",
      class: "matcolumnleft",
      Style: "min-width:80px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    weight: {
      Title: "Weight",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
  };
  //#endregion
  staticField = [
    "jobNo",
    "jobDate",
    "jobType",
    "billingParty",
    "fromToCity",
    "jobLocation",
    "pkgs",
    "weight",
    "status"
  ];
  addAndEditPath: string;
  constructor() {
    this.addAndEditPath = "Operation/JobEntry";
  }

  ngOnInit(): void {
    this.getPrqDetails();
  }
  getPrqDetails() {
    this.tableLoad = false;
  }
}