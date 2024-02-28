import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-credit-voucher-preview',
  templateUrl: './credit-voucher-preview.component.html'
})
export class CreditVoucherPreviewComponent implements OnInit {
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "Submit",
    name: "Generate Voucher",
  };
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Ledgercode', 'Ledgername', 'SubLedger', 'Dr', 'Cr', 'Location', 'Narration',]
  //'Instance',
  // 'Value',DocumentReference
  columnHeader = {

    Ledgercode: {
      Title: "Ledger code",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    Ledgername: {
      Title: "Ledger name",
      class: "matcolumncenter",
      Style: "max-width:200px",
    },
    SubLedger: {
      Title: "Sub Ledger",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    Dr: {
      Title: "Dr. ₹",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    Cr: {
      Title: "Cr. ₹",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    Location: {
      Title: "Location",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    Narration: {
      Title: "Narration",
      class: "matcolumncenter",
      Style: "min-width:200px",
    }
  }
  totalDebit: number;
  totalCredit: number;
  TotalAmountList: { count: any; title: string; class: string }[];
  tableData: any = [];
  constructor(

    private dialogRef: MatDialogRef<CreditVoucherPreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any) { }

    ngOnInit(): void {
      this.tableData = this.objResult
      this.totalDebit = this.tableData.reduce((accumulator, currentValue) => {
        const drValue = parseFloat(currentValue['Dr']);
        return isNaN(drValue) ? accumulator : accumulator + drValue;
      }, 0);
      this.totalCredit = this.tableData.reduce((accumulator, currentValue) => {
        const drValue = parseFloat(currentValue['Cr']);
        return isNaN(drValue) ? accumulator : accumulator + drValue;
      }, 0);
      this.TotalAmountList = [
        {
          count: this.totalDebit.toFixed(2),
          title: "Total Debit Amount",
          class: `color-Ocean-danger`,
        },
        {
          count: this.totalCredit.toFixed(2),
          title: "Total Credit Amount",
          class: `color-Success-light`,
        }
      ]
    }
    functionCallHandler($event) {
      let functionName = $event.functionName;
      try {
        this[functionName]($event);
      } catch (error) {
        console.log("failed");
      }
    }
    Close() {
      this.dialogRef.close()
    }
    Submit() {
      this.dialogRef.close("Submit")
    }

}
