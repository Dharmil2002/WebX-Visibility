import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { getJobDetailFromApi } from '../job-summary-page/job-summary-utlity';
import { jobtrackingDetail } from './job-tracker-utility';
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
  columnHeader = {
    createdOn:{
      Title: "Created On",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    jobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "min-width: 250px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumncenter",
      Style: "",
    },
    jobType: {
      Title: "Job type",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "",
    },
    fromToCity: {
      Title: "From & To City",
      class: "matcolumncenter",
      Style: "",
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
    vehicleSize: {
      Title: "Size",
      class: "matcolumncenter",
      Style: "max-width: 70px",
    },
    totalChaAmt: {
      Title: "CHA Amount Rs.",
      class: "matcolumncenter",
      Style: "",
    },
    chaDate: {
      Title: "CHA Date",
      class: "matcolumncenter",
      Style: "",
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
    "vehicleSize",
    "totalChaAmt",
    "chaDate"
  ];
  linkArray = [
    // { Row: 'CHAAmount', Path: 'Operation/ChaDetail',componentDetails: ""},
    // { Row: 'NoofVoucher', Path: 'Operation/VoucherDetails',componentDetails: ""},
    // { Row: 'VendorBillAmount', Path: 'Operation/VendorBillDetails',componentDetails: ""},
    // { Row: 'CustomerBillAmount', Path: 'Operation/CustomerBillDetails',componentDetails: ""}
  ]
  constructor(private masterService: MasterService) {  }

  ngOnInit(): void {
    this.getRakeDetail();
    this.getDashboadData();
  }
  getDashboadData() {
   
  }
  async getRakeDetail(){
    let data = await getJobDetailFromApi(this.masterService);
    this.tableData = data;
    this.tableLoad=false;
    const boxData = [
      {
        title: "Awaiting for CHA Entry",
        class: "info-box7 bg-c-Bottle-light order-info-box7",
        filterCondition: (x) => x.statusCode === "0",
      },
      {
        title: "Awaiting for Rake Entry",
        class: "info-box7 bg-c-Grape-light order-info-box7",
        filterCondition: (x) => x.statusCode === "1",
      },
      {
        title: "Awaiting for Rake Updation",
        class: "info-box7 bg-c-Daisy-light order-info-box7",
        filterCondition: (x) => x.statusCode !== "1" && x.statusCode !== "0",
      },
    ];
    
    const result = boxData.map((box) => ({
      count: data.filter(box.filterCondition).length,
      title: box.title,
      class: box.class,
    }));
    this.boxData=result;
    // Use the 'result' array for further processing
    
  }
}
