import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
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
    SLNo: {
      Title: "Sl No",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    JobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    JobDate: {
      Title: "Job Date",
      class: "matcolumncenter",
      Style: "",
    },
    Jobtype: {
      Title: "Job type",
      class: "matcolumncenter",
      Style: "max-width: 90px",
    },
    BillingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "",
    },
    FromToCity: {
      Title: "From & To City",
      class: "matcolumncenter",
      Style: "",
    },
    JobLocation: {
      Title: "Loc",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    NoofPkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    VehicleSize: {
      Title: "Size",
      class: "matcolumncenter",
      Style: "max-width: 70px",
    },
    CHAAmount: {
      Title: "CHA Amount Rs.",
      class: "matcolumncenter",
      Style: "",
    },
    CHADate: {
      Title: "CHA Date",
      class: "matcolumncenter",
      Style: "",
    },
    NoofVoucher: {
      Title: "No of Voucher",
      class: "matcolumncenter",
      Style: "",
    },
    VoucherAmount: {
      Title: "Voucher Amount Rs.",
      class: "matcolumncenter",
      Style: "",
    },
    VendorBillAmount: {
      Title: "Vendor Bill Amount Rs.",
      class: "matcolumncenter",
      Style: "",
    },
    CustomerBillAmount: {
      Title: "Customer Bill Amount Rs.",
      class: "matcolumncenter",
      Style: "",
    },
    CurrentStatus: {
      Title: "Current Status",
      class: "matcolumncenter",
      Style: "",
    },
  };
  //#endregion
  staticField = [
    "SLNo",
    "JobNo",
    "JobDate",
    "Jobtype",
    "BillingParty",
    "FromToCity",
    "JobLocation",
    "NoofPkgs",
    "VehicleSize",
    "CHADate",
    "VoucherAmount",
    "CurrentStatus"
  ];
  linkArray = [
    { Row: 'CHAAmount', Path: 'Operation/ChaDetail',componentDetails: ""},
    { Row: 'NoofVoucher', Path: 'Operation/VoucherDetails',componentDetails: ""},
    { Row: 'VendorBillAmount', Path: 'Operation/VendorBillDetails',componentDetails: ""},
    { Row: 'CustomerBillAmount', Path: 'Operation/CustomerBillDetails',componentDetails: ""}
  ]
  constructor(private masterService: MasterService) {  }

  ngOnInit(): void {
    this.getRakeDetail();
    this.getDashboadData();
  }
  getDashboadData() {
    this.boxData = [
      {
        "count": 130,
        "title": "Awaiting for CHA Entry",
        "class": "info-box7 bg-c-Bottle-light order-info-box7"
      },
      {
        "count": 87,
        "title": "Awaiting for Rake Entry",
        "class": "info-box7 bg-c-Grape-light order-info-box7"
      },
      {
        "count": 160,
        "title": "Awaiting for Rake Updation",
        "class": "info-box7 bg-c-Daisy-light order-info-box7"
      },
    ];
  }
  async getRakeDetail(){
    const detail= await jobtrackingDetail(this.masterService) ;
    this.tableData=detail;
    this.tableLoad=false;
  }
}
