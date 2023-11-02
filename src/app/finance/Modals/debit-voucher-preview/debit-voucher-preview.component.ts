import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GetDebitLedgerPreviewcolumnHeader, GetLedgercolumnHeader } from '../../credit-debit-voucher/debitvoucherCommonUtitlity';

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
  menuItems = [
    { label: 'Edit' },
    { label: 'Remove' }
  ]
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  staticField = ['Instance',
    'Value', 'Ledgercode', 'Ledgername', 'SubLedger', 'Dr', 'Cr', 'Location', 'Narration', 'DocumentReference']

  columnHeader = GetDebitLedgerPreviewcolumnHeader()

  tableData: any = [];
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DebitVoucherPreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.tableData = this.objResult
  }

  Close() {
    this.dialogRef.close()
  }
  Submit() {

  }
}
