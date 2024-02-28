import { Component, OnInit } from '@angular/core';
import { JobEntryService } from 'src/app/Utility/module/operation/job-entry/job-entry-service';

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
  filterColumn: boolean = true;
  allColumnFilter: any;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >

  columnHeader = {
    createdOn: {
      Title: "Created Date",
      class: "matcolumnleft",
      Style: "min-width:140px",
    },
    jobNo: {
      Title: "Job No",
      class: "matcolumnleft",
      Style: "min-width:220px",
      type: 'windowLink',
      functionName: 'OpenJob'
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumnleft",
      Style: "min-width:125px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumncenter",
      Style: "min-width:110px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:130px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    jobLocation: {
      Title: "Job Location",
      class: "matcolumnleft",
      Style: "min-width:137px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    // vehicleSize: {
    //   Title: "Size(MT)",
    //   class: "matcolumncenter",
    //   Style:  "max-width:90px",
    // },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "max-width:90px",
    },
    Action: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:50px",
    },
  };
  //#endregion
  staticField = [
    "createdOn",
    "jobDate",
    "jobType",
    "billingParty",
    "fromToCity",
    "jobLocation",
    "pkgs",
    "status"
  ];
  addAndEditPath: string;
  linkArray = [{ Row: "Action", Path: "Operation/CHAEntry" }];
  constructor(
    private jobservice: JobEntryService
  ) {
    this.addAndEditPath = "Operation/JobEntry";
    this.allColumnFilter = this.columnHeader
  }

  ngOnInit(): void {
    this.getJobDetails();
  }

  async getJobDetails() {
    let data = await this.jobservice.getJobDetails();
    this.tableData = data;
    this.tableLoad = false;
  }

  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }

  OpenJob(data) {
    const templateBody = {
      DocNo: data.jobNo,
      templateName: 'Job View-Print'
    }
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, '', 'width=1000,height=800');
  }
}
