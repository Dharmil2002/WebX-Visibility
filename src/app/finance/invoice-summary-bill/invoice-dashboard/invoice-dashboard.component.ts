import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-dashboard',
  templateUrl: './invoice-dashboard.component.html'
})
export class InvoiceDashboardComponent implements OnInit {
  Transactions: any;
  TransactionsMore: any;
  OnlinePaymentApprovals: any;
  jsonUrl = '../../../assets/data/dashboard-data.json'
  breadscrums = [
    {
      title: "Bill Payment Dashboard",
      items: ["Home"],
      active: "Bill Payment Dashboard"
    }
  ]
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
  constructor(private http: HttpClient, private router: Router,) {
    this.Transactions = Transactions;
    this.TransactionsMore = TransactionsMore;
  }


  ngOnInit(): void {
  }
  MultiLevelMenuClick(event) {
    // if (event.data.id == 1) {
    //   this.router.navigate(['/Finance/VendorPayment/THC-Payment']);
    // }
    // if (event.data.id == 7) {
    //   this.router.navigate(['/Finance/VendorPayment/VendorBillPayment']);
    // }
  }

}

const Transactions = {
  Title: "Pending for Billing",
  Items: [
    {
      id: 1,
      title: "Unbilled Shipments",
      class: "info-box7  bg-c-Bottle-light order-info-box7",
    },
    {
      id: 2,
      title: "Unbilled Amount",
      class: "info-box7 bg-c-Grape-light order-info-box7",
    },
    {
      id: 3,
      title: "Approved For Billing",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },
    {
      id: 4,
      title: "Pending PODs",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },

  ],
};
const TransactionsMore = {
  Title: "Invoice Status",
  Items: [
    {
      id: 5,
      title: "Generated",
      class: "info-box7  bg-c-Grape-light order-info-box7",
    },
    {
      id: 6,
      title: "Invoice Amount",
      class: "info-box7 bg-c-Grape-light order-info-box7",
    },
    {
      id: 7,
      title: "Outstanding",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    },
    {
      id: 8,
      title: "Amount pending",
      class: "info-box7 bg-c-Daisy-light order-info-box7",
    }
  ],
};

