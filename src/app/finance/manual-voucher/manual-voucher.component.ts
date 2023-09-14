import { Component, OnInit } from '@angular/core';
import { manualvoucharDetail } from './manual-voucher-utility';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-manual-voucher',
  templateUrl: './manual-voucher.component.html'
})
export class ManualVoucherComponent implements OnInit {

  tableLoad:boolean=true;
  tableData: any;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    voucherNo: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "min-width: 70px",
    },
    voucherType: {
      Title: "Voucher Type",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    voucherDate: {
      Title: "Voucher  Date",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    amount: {
      Title: "Amount",
      class: "matcolumncenter",
      Style: "max-width: 120px",
    },
    createdBy: {
      Title: "Created By",
      class: "matcolumncenter",
      Style: "max-width: 170px",
    },
    createdOn: {
      Title: "Created on",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    action: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width: 140px",
    }
  };
  staticField = [
    "voucherNo",
    "voucherType",
    "voucherDate",
    "amount",
    "createdBy",
    "createdOn",
    "status",
    "action",
  ];
  linkArray = [
    // { Row: 'CHAAmount', Path: 'Operation/ChaDetail',componentDetails: ""},
    // { Row: 'NoofVoucher', Path: 'Operation/VoucherDetails',componentDetails: ""},
    // { Row: 'VendorBillAmount', Path: 'Operation/VendorBillDetails',componentDetails: ""},
    // { Row: 'CustomerBillAmount', Path: 'Operation/CustomerBillDetails',componentDetails: ""}
  ]
  constructor(private masterService: MasterService) { }

  ngOnInit(): void {
    this.getRakeDetail();
  }
  async getRakeDetail(){
    const detail= await manualvoucharDetail(this.masterService) ;
    this.tableData=detail;
    this.tableLoad=false;
  }
}
