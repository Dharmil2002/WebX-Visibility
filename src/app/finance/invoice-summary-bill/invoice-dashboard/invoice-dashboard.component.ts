import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceCountService } from 'src/app/Utility/module/billing/invoice-count.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-invoice-dashboard',
  templateUrl: './invoice-dashboard.component.html'
})
export class InvoiceDashboardComponent implements OnInit {
  Transactions: any;
  TransactionsMore: any;
  OnlinePaymentApprovals: any;
  jsonUrl = '../../../assets/data/dashboard-data.json'
  tableload = true;
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
  constructor(private http: HttpClient, private router: Router,
    private objInvoiceCountService: InvoiceCountService,
    private storage: StorageService,) {
  }


  ngOnInit(): void {
    this.getBoxData();
  }
  //#region to get counts of boxes
  async getBoxData() {
    try {
      this.tableload = true;

      // Fetch data from the service
      const count = await this.objInvoiceCountService.getDashboardData();

      // Fetch count of shipments without POD
      //const emptyPodCount = await this.objInvoiceCountService.getPengPodCount(podFilter);    

      // Extract relevant data
      const dashboardCounts = count[0]?.dashboardCounts || {};
      const custBillHeaders = dashboardCounts.cust_bill_headers || [{}];

      // Destructure data for better readability
      const {
        Unbilledcount,
        Unbilled_aMT,
        approvedBillCount
      } = dashboardCounts;

      this.Transactions = Transactions;
      this.TransactionsMore = TransactionsMore;

      // Update Transactions object based on conditions
      this.Transactions.Items.forEach(item => {
        switch (item.title) {
          case "Unbilled Shipments":
            item['count'] = Unbilledcount || '0';
            break;
          case "Unbilled Amount":
            item['count'] = Unbilled_aMT || '0.00';
            break;
          case "Approved For Billing":
            item['count'] = approvedBillCount || '0';
            break;
          case "Pending PODs":
            item['count'] = approvedBillCount || '0';
            break;
        }
      });

      // Update TransactionsMore object based on conditions
      this.TransactionsMore.Items.forEach(item => {
        switch (item.title) {
          case "Generated":
            item['count'] = custBillHeaders[0]?.count || '0';
            break;
          case "Invoice Amount":
          case "Outstanding":
          case "Amount pending":
            item['count'] = custBillHeaders[0]?.total || '0.00';
            break;
        }
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      this.tableload = false;
    }
  }
  //#endregion
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

