import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  TransactionsSecond: any;
  TransactionsFirst: any;
  TransactionsThird: any;
  OnlinePaymentApprovals: any;
  DebitNotes: any;

  jsonUrl = '../../../assets/data/dashboard-data.json'
  breadscrums = [
    {
      title: "Vendor Payment Dashboard",
      items: ["Home"],
      active: "Vendor Payment Dashboard"
    }
  ]
  constructor(private http: HttpClient, private router: Router,) {
    this.TransactionsFirst = TransactionsFirst;
    this.OnlinePaymentApprovals = OnlinePaymentApprovals;
    this.TransactionsSecond = TransactionsSecond;
    this.TransactionsThird = TransactionsThird;
    this.DebitNotes = DebitNotes;
  }

  ngOnInit(): void {


  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  MultiLevelMenuClick(event) {
    if (event.data.id == 1) {
      this.router.navigate(['/Finance/VendorPayment/THC-Payment']);
    }
    if (event.data.id == 7) {
      this.router.navigate(['/Finance/VendorPayment/VendorBillPayment']);
    }
    if (event.data.id == 9) {
      this.router.navigate(['/Finance/VendorBillGeneration/Criteria'])
    }
    if (event.data.id == 10) {  
      this.router.navigate(['/Finance/DebitNote/GenerateDebitNote']);
    }
    if (event.data.id == 11) {
      this.router.navigate(['/Finance/DebitNote/ApproveDebitNote']);
    }
    if (event.data.id == 12) {
      this.router.navigate(['/Finance/VendorPayment/TDS-Payment']);
    }
  }

}


const TransactionsFirst = {
  Title: "Transactions",
  Items: [
    {
      id: 1,
      title: "THC Advance / Balance",
      class: "info-box7  bg-c-Bottle-light order-info-box7",
    },
    {
      id: 2,
      title: "Payment to Business Associates",
      class: "info-box7 bg-c-Grape-light order-info-box7",
    },
    {
      id: 3,
      title: "Pick up and Delivery Payments",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },
    {
      id: 12,
      title: "TDS payment Vendor",
      class: "info-box7  bg-c-Bottle-light order-info-box7",
    },
  ],
};
const TransactionsSecond = {
  Items: [
    {
      id: 4,
      title: "Payment against PO",
      class: "info-box7  bg-c-Grape-light order-info-box7",
    },
    {
      id: 5,
      title: "Payment Against Consignments",
      class: "info-box7 bg-c-Grape-light order-info-box7",
    },
    {
      id: 6,
      title: "Payment Against Trips",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },
  ],
};
const TransactionsThird = {
  Items: [
    {
      id: 9,
      title: "Vendor Bill - General",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },
  ],
};

const OnlinePaymentApprovals = {
  "Title": "Online Payment Approvals",
  "Items": [
    {
      id: 7,
      "title": "Vendor Bill Payment Approval",
      "class": "info-box7  bg-c-Bottle-light order-info-box7"
    },
    {
      id: 8,
      "title": "Voucher Payment Approval",
      "class": "info-box7 bg-c-Grape-light order-info-box7"
    },
  ]
}


const DebitNotes = {
  "Title": "Debit Notes",
  "Items": [
    {
      id: 10,
      "title": "Generate Debit Note",
      "class": "info-box7  bg-c-Bottle-light order-info-box7"
    },
    {
      id: 11,
      "title": "Approve Debit Note",
      "class": "info-box7 bg-c-Grape-light order-info-box7"
    },
  ]
}