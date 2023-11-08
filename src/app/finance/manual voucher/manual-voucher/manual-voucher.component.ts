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
    vNO: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    tTYP: {
      Title: "Voucher Type",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    tTDT: {
      Title: "Voucher  Date",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    pAMT: {
      Title: "Amount (₹)",
      class: "matcolumncenter",
      Style: "max-width: 120px",
    },
    eBY: {
      Title: "Created By",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    eDT: {
      Title: "Created on",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    vCAN: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    // actionsItems: {
    //   Title: "Action",
    //   class: "matcolumncenter",
    //   Style: "max-width: 140px",
    // }
  };
  staticField = [
    "vNO",
    "tTYP",
    "tTDT",
    "pAMT",
    "eBY",
    "eDT",
    "vCAN"
  ];

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
    this.addAndEditPath = "Finance/DebitVoucher";
  }

  ngOnInit(): void {
    this.getRakeDetail();
  }
  async getRakeDetail() {
    const detail = await manualvoucharDetail(this.masterService);
    const result = detail.map((x) => {
      const formattedDate = this.datePipe.transform(x.tTDT, 'dd-MMM-yy HH:mm a');
      const createdDate = this.datePipe.transform(x.eDT, 'dd-MMM-yy HH:mm a');
      return {
        ...x, vCAN: "Generated", tTDT: formattedDate, eDT: createdDate,
        actions: ["Modify", "Delete"]
      };
    });

    this.tableData = result;
    this.tableLoad = false;
  }

  async handleMenuItemClick(data) {
    if (data.label.label === "Modify") {
      this.router.navigate(['Finance/DebitVoucher'], {
        state: {
          data: data.data
        },
      });
    }
  }
}
