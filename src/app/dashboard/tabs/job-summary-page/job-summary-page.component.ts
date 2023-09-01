import { Component, OnInit } from '@angular/core';
import { getJobDetailFromApi } from './job-summary-utlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';

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
  tableData: any[];
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
      Style: "min-width:180px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumnleft",
      Style: "min-width:2px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:180px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    jobLocation: {
      Title: "Job Location",
      class: "matcolumnleft",
      Style: "min-width:110px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    vehicleSize: {
      Title: "Vehicle Size",
      class: "matcolumncenter",
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
    "vehicleSize",
    "status"
  ];
  addAndEditPath: string;
  linkArray = [{ Row: "Action", Path: "Operation/CHAEntry" }];
  constructor(private _masterService: MasterService) {
    this.addAndEditPath = "Operation/JobEntry";
  }

  ngOnInit(): void {
    this.getJobDetails();
  }

  async getJobDetails() {
    let data = await getJobDetailFromApi(this._masterService);
    this.tableData = data;
    this.tableLoad = false;
  }
}