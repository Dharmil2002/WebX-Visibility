import { Component, OnInit } from '@angular/core';
import { manualvoucharDetail } from './manual-voucher-utility';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manual-voucher',
  templateUrl: './manual-voucher.component.html'
})
export class ManualVoucherComponent implements OnInit {
  tableLoad: boolean = true;
  tableData: any;
  addAndEditPath: string;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  TableStyle = "width:100%"
  columnHeader = {
    docNo: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    voucherType: {
      Title: "Voucher Type",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    voucherDate: {
      Title: "Voucher  Date",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    amount: {
      Title: "Amount (₹)",
      class: "matcolumncenter",
      Style: "max-width: 120px",
    },
    createdBy: {
      Title: "Created By",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    createdOn: {
      Title: "Created on",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width: 140px",
    }
  };
  staticField = [
    "docNo",
    "voucherType",
    "voucherDate",
    "amount",
    "createdBy",
    "createdOn",
    "status"
  ];
  menuItems = [
    { label: 'Modify' },
    { label: 'Delete' }
  ];
  menuItemflag: boolean = true;
  linkArray = [
    // { Row: 'CHAAmount', Path: 'Operation/ChaDetail',componentDetails: ""},
    // { Row: 'NoofVoucher', Path: 'Operation/VoucherDetails',componentDetails: ""},
    // { Row: 'VendorBillAmount', Path: 'Operation/VendorBillDetails',componentDetails: ""},
    // { Row: 'CustomerBillAmount', Path: 'Operation/CustomerBillDetails',componentDetails: ""}
  ]
  constructor(
    private masterService: MasterService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.addAndEditPath = "Finance/CreditDebitVoucher";
  }

  ngOnInit(): void {
    this.getRakeDetail();
  }
  async getRakeDetail() {
    const detail = await manualvoucharDetail(this.masterService);
    console.log(detail)
    const result = detail.map((x) => {
      if (x.status === "0") {
        // Modify the status property to "Generated"
        const formattedDate = this.datePipe.transform(x.voucherDate, 'dd-MMM-yy HH:mm a');
        const createdDate = this.datePipe.transform(x.createdDate, 'dd-MMM-yy HH:mm a');
        return {
          ...x, status: "Generated", voucherDate: formattedDate, createdOn: createdDate,
          actions: ["Modify", "Delete"]
        };
      } else {
        // Keep the object unchanged
        return x;
      }
    });

    this.tableData = result;
    this.tableLoad = false;
  }

  async handleMenuItemClick(data) {
    if (data.label.label === "Modify") {
      this.router.navigate(['Finance/CreditDebitVoucher'], {
        state: {
          data: data.data
        },
      });
    }
  }
}
