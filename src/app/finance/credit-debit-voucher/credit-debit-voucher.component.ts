import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class CreditDebitVoucherComponent implements OnInit {
  breadScrums = [
    {
      title: "Credit Debit Voucher",
      items: ["Finance"],
      active: "Credit Debit Voucher",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  creditDebitVoucherControl: CreditDebitVoucherControl;

  CreditDebitVoucherSummaryForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherSummaryArray: any;

  //Taxation Form Config
  CreditDebitVoucherTaxationTDSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTDSArray: any;

  CreditDebitVoucherTaxationTCSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTCSArray: any;

  CreditDebitVoucherTaxationGSTForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationGSTArray: any;

  displayedColumns = [
    {
      Key: "Ledger", title: "Ledger", width: "200", className: "matcolumnleft", show: true
    },
    { Key: "SACCode", title: "SAC Code", width: "200", className: "matcolumnleft", show: true },
    {
      Key: "DebitAmount", title: "Debit Amount ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "GSTRate", title: "GST Rate", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "GSTAmount", title: "GST Amount ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "Total", title: "Total ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "TDSApplicable", title: "TDS Applicable", width: "100", className: "matcolumncenter", show: true
    },
    {
      Key: "Narration", title: "Narration", width: "200", className: "matcolumnleft", show: true
    },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  public ModeldataSource = new MatTableDataSource<any>();
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private masterService: MasterService
  ) {
    this.ModeldataSource.data = [
      {
        Ledger: "EXP001: Conveyance",
        SACCode: "12022: Local conveyance",
        DebitAmount: "3450.50",
        GSTRate: "0",
        GSTAmount: "",
        Total: "3450.50",
        TDSApplicable: "No",
        Narration: "For local conveyance at Andheri"
      },
      {
        Ledger: "EXP003: Communication",
        SACCode: "12088: Telecom services",
        DebitAmount: "2340.00",
        GSTRate: "12%",
        GSTAmount: "280.8",
        Total: "2620.80",
        TDSApplicable: "Yes",
        Narration: "For phone expense"
      },
    ]
  }
  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.creditDebitVoucherControl = new CreditDebitVoucherControl();
    this.jsonControlCreditDebitVoucherSummaryArray = this.creditDebitVoucherControl.getCreditDebitVoucherSummaryArrayControls();
    this.CreditDebitVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherSummaryArray]);

    this.jsonControlCreditDebitVoucherTaxationTDSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTDSArrayControls();
    this.CreditDebitVoucherTaxationTDSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTDSArray]);

    this.jsonControlCreditDebitVoucherTaxationTCSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTCSArrayControls();
    this.CreditDebitVoucherTaxationTCSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTCSArray]);

    this.jsonControlCreditDebitVoucherTaxationGSTArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationGSTArrayControls();
    this.CreditDebitVoucherTaxationGSTForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationGSTArray]);

  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async save() {
  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
