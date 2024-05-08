import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { count } from 'console';
import Swal from "sweetalert2";
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-creditnote-management',
  templateUrl: './creditnote-management.component.html'
})
export class CreditnoteManagementComponent implements OnInit {
  tableLoad1: boolean = true
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
  dynamicControlscNote = {
    add: false,
    edit: true,
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
      Title: "Credit Note No",
      class: "matcolumnleft",
      Style: "max-width: 300px",
      sticky: true
    },
    eNTDT: {
      Title: "Credit Note date​",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    aMT: {
      Title: "Credit Note Amount",
      class: "matcolumnright",
      Style: "max-width: 100px",
    },
    pARTY: {
      Title: "Party in Credit Note",
      class: "matcolumnleft",
      Style: "max-width: 220px",
    },
    docNo: {
      Title: "Credit Note Ref No",
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
      Title: "Credit Note Status ",
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

  //Credit Note Approved Table Form
  columnHeaderCnote = {
    nTNO: {
      Title: "Credit Note No",
      class: "matcolumnleft",
      Style: "max-width: 300px",
      sticky: true
    },
    eNTDT: {
      Title: "Credit Note date​",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    aMT: {
      Title: "Credit Note Amount",
      class: "matcolumnright",
      Style: "max-width: 100px",
    },
    pARTY: {
      Title: "Party in Credit Note",
      class: "matcolumnleft",
      Style: "max-width: 220px",
    },
    docNo: {
      Title: "Credit Note Ref No",
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
      Title: "Credit Note Status ",
      class: "matcolumnleft",
      Style: "max-width: 150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:7%",
      stickyEnd: true
    }

  }
  staticFieldCnote = [
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
    this.Transactions = this.Transactionsarray;
    this.getData();
    this.getDashbordData();
  }

  async getData() {
    const BodyDataHeader = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_header",
    };
    this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));
    this.cNoteData = this.DataResponseHeader.data;

    const BodyDataDetails = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_details",
    };
    this.DataResponseHeader1 = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataDetails));
    this.creditnotedetails = this.DataResponseHeader1.data;

    this.cNoteData = this.DataResponseHeader.data
      // .filter(item => item.sTS === 1) // Filter out items where sTS is not equal to 1
      .map(item => ({
        ...item,
        pARTY: item.pARTY.cD + ':' + item.pARTY.nM,
        gstRevlAmt: item.gST.aMT
      }));
      console.log( this.DataResponseHeader.data);

    this.cNoteData = this.DataResponseHeader.data
      // .filter(item => item.sTS === 1) // Filter out items where sTS is not equal to 1
      .map(item => {
        // Find the corresponding item in creditnotedetails based on the ntsno field
        const correspondingItem = this.creditnotedetails.find(data => data.ntsno === item.ntsno);
        // Initialize a variable to store the selected field
        let selectedField = null;
        // If a corresponding item is found, assign the selected field
        if (correspondingItem) {
          selectedField = correspondingItem.gST.rATE + '% -' + correspondingItem.gST.tYP;
        }
        // Return the modified item with the selected field
        return {
          ...item,
          pARTY: item.pARTY.cD + ':' + item.pARTY.nM,
          gstRevlAmt: item.gST.aMT,
          gST: selectedField // Assign the selected field
        };
      });


    // Assuming this.DataResponseHeader.data is an array of objects
    // Now each item in this.DataResponseHeader.data will have an 'actions' property with the specified array value
    this.DataResponseHeader.data.forEach(item => {
      item.actions = ["Modify", "Approve", "Cancel"];
    });
    this.cNoteDataAp = this.DataResponseHeader.data;


    this.cNoteDataAp = this.DataResponseHeader.data
    .filter(item => item.sTS === 1 )// Filter out items where sTS is not equal to 1
      .map(item => {
        // Find the corresponding item in creditnotedetails based on the ntsno field
        const correspondingItem = this.creditnotedetails.find(data => data.ntsno === item.ntsno);
        // Initialize a variable to store the selected field
        let selectedField = null;
        // If a corresponding item is found, assign the selected field
        if (correspondingItem) {
          selectedField = correspondingItem.gST.rATE + '% -' + correspondingItem.gST.tYP;
        }
        // Return the modified item with the selected field
        return {
          ...item,
          pARTY: item.pARTY.cD + ':' + item.pARTY.nM,
          gstRevlAmt: item.gST.aMT,
          gST: selectedField // Assign the selected field
        };
      });

    this.Transactions = this.Transactionsarray;
  }

  async getDashbordData() {
    const BodyDataHeader = {
      companyCode: this.storage.companyCode,
      collectionName: "cd_note_header",
    };
    this.DataResponseHeader = await firstValueFrom(this.masterService.masterPost("generic/get", BodyDataHeader));

    // Credit Generated Note Count 
    this.countCreditnoteRecords = this.DataResponseHeader.data
      // .filter(item => item.sTS === 1) // Filter out items where sTS is not equal to 1
      .length;
    this.Transactionsarray.Items[0].count =  this.countCreditnoteRecords > 0 ? this.countCreditnoteRecords : "0";

    // Credit Note Amount
    this.countSumOfAmounts = this.DataResponseHeader.data
      // .filter(item => item.sTS === 1) // Filter out items where sTS is not equal to 1
      .reduce((total, currentItem) => {
        // Check if the amount is null or undefined, and treat it as 0
        const amount = currentItem.aMT !== null && currentItem.aMT !== undefined ? currentItem.aMT :0;
        return total + amount;
      }, 0);
    this.Transactionsarray.Items[1].count = this.countSumOfAmounts > 0 ? this.countSumOfAmounts : "0";

    // Credit Approved Note Count 
    this.countCreditnoteARecords = this.DataResponseHeader.data
      .filter(item => item.sTS === 2) // Filter out items where sTS is not equal to 1
      .length;
      
    this.Transactionsarray.Items[2].count = this.countCreditnoteARecords > 0 ? this.countCreditnoteARecords : "0";
    
    // Credit Note Amount
    this.countSumOfApprovedAmounts = this.DataResponseHeader.data
      .filter(item => item.sTS === 2) // Filter out items where sTS is not equal to 1
      .reduce((total, currentItem) => {
        // Check if the amount is null or undefined, and treat it as 0
        const amount = currentItem.aMT !== null && currentItem.aMT !== undefined ? currentItem.aMT : 0;
        return total + amount;
      }, 0);
    this.Transactionsarray.Items[3].count =  this.countSumOfApprovedAmounts > 0 ? this.countSumOfApprovedAmounts : "0";

  }

  async handleMenuItemClick(data) {

    if (data.label.label == "Modify" || data.label.label == "Approve" || data.label.label == "Cancel") {
      // this.router.navigate(["Finance/CreditNote"]);
      this.router.navigate(["Finance/CreditNote"], { state: { data: data } });
    }
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
      this.tableLoad1 = true
      this.tableLoad2 = false
    }
    if (event.data.id == 3) {
      this.tableLoad1 = false
      this.tableLoad2 = true
    }
  }

  Transactionsarray = {
    Items: [
      {
        id: 1,
        title: "Credit Note Generated",
        class: "info-box7  bg-c-Bottle-light order-info-box7",
        count: "",
      },
      {
        id: 2,
        title: "Credit Note Amount",
        class: "info-box7 bg-c-Grape-light order-info-box7",
        count: ""

      },
      {
        id: 3,
        title: "Credit Note Approved",
        class: "info-box7 bg-c-Daisy-light order-info-box7",
        count: ""

      },
      {
        id: 4,
        title: "Approved Amount",
        class: "info-box7 bg-c-Grape-light order-info-box7",
        count: ""

      },
    ],
  };


}
