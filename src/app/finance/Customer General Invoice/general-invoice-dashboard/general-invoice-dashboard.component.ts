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
  tableLoad2: boolean = false
  Transactions: any;
  tableLoad = true;
  tableData: any[];
  csvFileName: string;
  addAndEditPath: string;
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };

  menuItems = [{ label: "Modify" }, { label: "Approve" }, { label: "Cancel" }];
  menuItemflag = true;


  linkArray = [{ Row: "Action", Path: "" }];

  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  boxData: { count: number; title: string; class: string; }[];

  EventButton = {
    functionName: "openFilterDialog",
    name: "Filter",
    iconName: "filter_alt",
  };
  toggleArray = [];


  //Credit Note Generated Table Form

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




  unBillingData: any;
  allPrq: any;
  allColumnFilter: any;
  DataResponseDetails: any;
  DataResponseHeader: any;
  cNoteData: any;
  cNoteDataAp: any;
  tableData1 = [];
  tableData2 = [];
  countSumOfAmounts: any;
  countCreditnoteRecords: any;
  countCreditnoteARecords: any;
  countSumOfApprovedAmounts: any;
  DataResponseHeader1: any;
  creditnotedetails: any;
  constructor(
    private router: Router,
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.addAndEditPath = "Finance/CreditNote";
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {


    this.Transactions = []
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
