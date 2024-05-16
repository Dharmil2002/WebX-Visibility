import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
    nTNO: {
      Title: "CN No",
      class: "matcolumnleft",
      Style: "max-width: 300px",
      sticky: true
    },
    eNTDT: {
      Title: "CN date​",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    aMT: {
      Title: "CN Amount",
      class: "matcolumnright",
      Style: "max-width: 100px",
    },
    pARTY: {
      Title: "Party in Credit Note",
      class: "matcolumnleft",
      Style: "max-width: 220px",
    },
    docNo: {
      Title: "CN Ref No",
      class: "matcolumnleft",
      Style: "max-width: 300px",
    },
    gST: {
      Title: "GST Type​",
      class: "matcolumnleft",
      Style: "max-width: 200px",
    },
    tXBLAMT: {
      Title: "Taxable Amt",
      class: "matcolumnright",
      Style: "max-width: 100px",
    },
    gstRevlAmt: {
      Title: "GST Reversal Amt ",
      class: "matcolumnright",
      Style: "max-width: 100px",
    },
    sTSNM: {
      Title: "CN Status ",
      class: "matcolumnleft",
      Style: "max-width: 150px",
      stickyEnd: true

    },
  }
  staticField = [

    "nTNO",
    "eNTDT",
    "aMT",
    "pARTY",
    "pARTYAmt",
    "docNo",
    "gST",
    "tXBLAMT",
    "gstRevlAmt",
    "sTSNM",
  ]
  constructor(
  ) {
    this.addAndEditPath = "Finance/CustomerInvoiceGeneral/Criteria";
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
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
