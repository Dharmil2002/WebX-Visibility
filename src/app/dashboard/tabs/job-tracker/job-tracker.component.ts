import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getJobDetailFromApi } from '../job-summary-page/job-summary-utlity';
import { jobtrackingDetail } from './job-tracker-utility';
import { JobEntryService } from 'src/app/Utility/module/operation/job-entry/job-entry-service';
@Component({
  selector: 'app-job-tracker',
  templateUrl: './job-tracker.component.html'
})
export class JobTrackerComponent implements OnInit {
  tableLoad:boolean=true;
  tableData: any;
  boxData:any;
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  filterColumn:boolean=true;
  allColumnFilter:any;
  columnHeader = {
    createdOn:{
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:140px",
    },
    jobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "min-width: 250px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumncenter",
      Style: "min-width:125px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumncenter",
      Style: "min-width:110px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    fromToCity: {
      Title: "From & To City",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    jobLocation: {
      Title: "Loc",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    totalChaAmt: {
      Title: "CHA Amount Rs.",
      class: "matcolumncenter",
      Style: "min-width:160px",
    },
    chaDate: {
      Title: "CHA Date",
      class: "matcolumncenter",
      Style: "min-width:125px"
    }
  };
  //#endregion
  staticField = [
    "createdOn",
    "jobNo",
    "jobDate",
    "jobType",
    "billingParty",
    "fromToCity",
    "jobLocation",
    "pkgs",
    "totalChaAmt",
    "chaDate"
  ];
  linkArray = [
    // { Row: 'CHAAmount', Path: 'Operation/ChaDetail',componentDetails: ""},
    // { Row: 'NoofVoucher', Path: 'Operation/VoucherDetails',componentDetails: ""},
    // { Row: 'VendorBillAmount', Path: 'Operation/VendorBillDetails',componentDetails: ""},
    // { Row: 'CustomerBillAmount', Path: 'Operation/CustomerBillDetails',componentDetails: ""}
  ]
  constructor(
    private masterService: MasterService,
    private jobService: JobEntryService
  ) {
    this.allColumnFilter = this.columnHeader
  }

  ngOnInit(): void {
    this.getRakeDetail();
    this.getDashboadData();
  }
  getDashboadData() {

  }
  async getRakeDetail() {
    let data = await this.jobService.getJobDetails();
    this.tableData = data;
    this.tableLoad = false;
    const boxData = [
      {
        title: "Awaiting for CHA Entry",
        class: "info-box7 bg-c-Bottle-light order-info-box7",
        filterCondition: (x) => x.sTS == "1",
      },
      {
        title: "Awaiting for Rake Entry",
        class: "info-box7 bg-c-Grape-light order-info-box7",
        filterCondition: (x) => x.sTS == "2",
      },
      {
        title: "Awaiting for Rake Updation",
        class: "info-box7 bg-c-Daisy-light order-info-box7",
        filterCondition: (x) => x.sTS != "1" && x.sTS != "2",
      },
    ];

    const result = boxData.map((box) => ({
      count: data.filter(box.filterCondition).length,
      title: box.title,
      class: box.class,
    }));
    this.boxData = result;
    // Use the 'result' array for further processing

  }
}
