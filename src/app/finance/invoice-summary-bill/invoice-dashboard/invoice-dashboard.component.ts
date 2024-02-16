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
    this.tableload = true;
    const invoiceCount = await this.objInvoiceCountService.getDocketCount({ isBILLED: false, bLOC: this.storage.branch });
    const invoicestsCount = await this.objInvoiceCountService.getDocketbilCount({ fSTS: 1, oRGN: this.storage.branch });
    const invCount = await this.objInvoiceCountService.getInvCount({ bSTS: 1, bLOC: this.storage.branch });

    const filter = {
      "D$pipeline": [
        {
          "D$match": {
            "D$or": [
              {
                'pOD': ''
              }, {
                'pOD': null
              }, {
                'pOD': undefined
              }, {
                'pOD': {
                  "D$exists": false
                }
              }
            ],
            "D$and": [
              {
                'sTS': 3
              }
            ]
          }
        }, {
          "D$group": {
            '_id': null,
            'emptyCount': {
              "D$sum": 1
            }
          }
        }
      ]
    };

    // const podCount = await this.objInvoiceCountService.getPengPodCount(filter);
    // console.log(podCount);

    // Calculate the count of unbilled shipments
    const unbilledShipments = invoiceCount.length;

    // Calculate the total amount of unbilled shipments
    const totalamt = invoiceCount.reduce((total, element) => total + element.tOTAMT, 0);

    // Calculate the count of shipments approved for billing
    const approvedForBilling = invoicestsCount.length;
    const Generated = invCount.length;
    const InvoiceAmount = invCount.reduce((total, element) => total + element.aMT, 0);

    this.Transactions = Transactions;
    this.TransactionsMore = TransactionsMore;

    // Update Transactions object based on conditions
    this.Transactions.Items.forEach(item => {
      if (item.title === "Unbilled Shipments") {
        item['count'] = unbilledShipments;
      } else if (item.title === "Unbilled Amount") {
        item['count'] = totalamt;
      } else if (item.title === "Approved For Billing") {
        item['count'] = approvedForBilling;
      } else if (item.title === "Pending PODs") {
        item['count'] = '0';
      }
    });
    // Update Transactions object based on conditions
    this.TransactionsMore.Items.forEach(item => {
      if (item.title === "Generated") {
        item['count'] = Generated;
      } else if (item.title === "Invoice Amount") {
        item['count'] = InvoiceAmount;
      } else if (item.title === "Outstanding") {
        item['count'] = InvoiceAmount;
      } else if (item.title === "Amount pending") {
        item['count'] = InvoiceAmount;
      }
    });
    this.tableload = false;
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

