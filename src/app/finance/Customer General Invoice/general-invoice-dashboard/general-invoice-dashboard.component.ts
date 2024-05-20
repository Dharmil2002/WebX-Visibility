import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-general-invoice-dashboard',
  templateUrl: './general-invoice-dashboard.component.html',
})
export class GeneralInvoiceDashboardComponent implements OnInit {
  tableData: any[];
  addAndEditPath: string;
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };
  columnHeader = {
    customerCodeAndName: {
      Title: "Customer Name",
      class: "matcolumncenter",
      Style: "min-width:180px",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    billDate: {
      Title: "Bill Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    billAmount: {
      Title: "Bill Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    billPendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    billStatus: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "max-width:90px",
    }
  };
  staticField =
    [
      "customerCodeAndName",
      "billNo",
      "billDate",
      "billAmount",
      "billPendingAmount",
      "billStatus",
    ]


  constructor(
    private invoiceServiceService: InvoiceServiceService,
  ) {
    this.addAndEditPath = "Finance/CustomerInvoiceGeneral/Criteria";
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {

    // Get Bill data and bind to the table 
    let data = await this.invoiceServiceService.getBillList()
    this.tableData = data;
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

}
