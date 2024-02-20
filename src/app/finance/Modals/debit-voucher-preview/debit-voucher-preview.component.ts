import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GetDebitLedgerPreviewcolumnHeader, GetLedgercolumnHeader } from '../../Debit Voucher/debitvoucherCommonUtitlity';

@Component({
  selector: 'app-debit-voucher-preview',
  templateUrl: './debit-voucher-preview.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class DebitVoucherPreviewComponent implements OnInit {
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
  columnHeader = GetDebitLedgerPreviewcolumnHeader()
  totalDebit: number;
  totalCredit: number;
  TotalAmountList: { count: any; title: string; class: string }[];
  tableData: any = [];
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DebitVoucherPreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

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
