import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';

@Component({
  selector: 'app-add-voucher-details-modal',
  templateUrl: './add-voucher-details-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
  padding: 3px 11px 0 11px !important;
}
    `,
  ]
})

export class AddVoucherDetailsModalComponent implements OnInit {
  creditDebitVoucherControl: CreditDebitVoucherControl;

  CreditDebitVoucherDetailsForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherDetailsArray: any;

  constructor(private filter: FilterUtils, private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<AddVoucherDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
    console.log(this.objResult);
  }
  Close() {
    this.dialogRef.close()
  }
  initializeFormControl() {
    this.creditDebitVoucherControl = new CreditDebitVoucherControl(this.objResult.Details);
    this.jsonControlCreditDebitVoucherDetailsArray = this.creditDebitVoucherControl.getCreditDebitVoucherDetailsArrayControls();
    this.CreditDebitVoucherDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherDetailsArray]);

    this.filter.Filter(
      this.jsonControlCreditDebitVoucherDetailsArray,
      this.CreditDebitVoucherDetailsForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    this.filter.Filter(
      this.jsonControlCreditDebitVoucherDetailsArray,
      this.CreditDebitVoucherDetailsForm,
      this.objResult.SACCode,
      "SACCode",
      false
    );
    if (this.objResult.Details) {
      this.CreditDebitVoucherDetailsForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.Ledger))
      this.CreditDebitVoucherDetailsForm.controls.SACCode.setValue(this.objResult.SACCode.find(x => x.value == this.objResult.Details.SACCode))
    }

  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  save(event) {
    this.CreditDebitVoucherDetailsForm.controls.Ledger.patchValue(this.CreditDebitVoucherDetailsForm.value['Ledger'].value)
    this.CreditDebitVoucherDetailsForm.controls.SACCode.patchValue(this.CreditDebitVoucherDetailsForm.value['SACCode'].value)
    this.dialogRef.close(this.CreditDebitVoucherDetailsForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }
  calculateGSTAndTotal(event) {
    const DebitAmount = Number(this.CreditDebitVoucherDetailsForm.value['DebitAmount']);
    const GSTRate = Number(this.CreditDebitVoucherDetailsForm.value['GSTRate']);

    if (!isNaN(DebitAmount) && !isNaN(GSTRate)) {
      const GSTAmount = (DebitAmount * GSTRate) / 100;
      const Total = GSTAmount + DebitAmount;

      this.CreditDebitVoucherDetailsForm.controls.GSTAmount.setValue(GSTAmount.toFixed(2));
      this.CreditDebitVoucherDetailsForm.controls.Total.setValue(Total.toFixed(2));
    } else {
      console.error('Invalid input values for DebitAmount or GSTRate');
    }
  }


}
