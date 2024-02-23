import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';

@Component({
  selector: 'app-add-voucher-details-modal',
  templateUrl: './add-voucher-details-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})

export class AddVoucherDetailsModalComponent implements OnInit {
  DebitVoucherControl: DebitVoucherControl;

  DebitVoucherDetailsForm: UntypedFormGroup;
  jsonControlDebitVoucherDetailsArray: any;

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
    this.DebitVoucherControl = new DebitVoucherControl(this.objResult.Details);
    this.jsonControlDebitVoucherDetailsArray = this.DebitVoucherControl.getDebitVoucherDetailsArrayControls();
    this.DebitVoucherDetailsForm = formGroupBuilder(this.fb, [this.jsonControlDebitVoucherDetailsArray]);

    this.filter.Filter(
      this.jsonControlDebitVoucherDetailsArray,
      this.DebitVoucherDetailsForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    this.filter.Filter(
      this.jsonControlDebitVoucherDetailsArray,
      this.DebitVoucherDetailsForm,
      this.objResult.SACCode,
      "SACCode",
      false
    );
    if (this.objResult.Details) {
      this.DebitVoucherDetailsForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.LedgerHdn))
      this.DebitVoucherDetailsForm.controls.SACCode.setValue(this.objResult.SACCode.find(x => x.value == this.objResult.Details.SACCodeHdn))
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
    const Ledger = this.DebitVoucherDetailsForm.value['Ledger'];
    const SACCode = this.DebitVoucherDetailsForm.value['SACCode'];
    this.DebitVoucherDetailsForm.controls.Ledger.patchValue(Ledger.name)
    this.DebitVoucherDetailsForm.controls.SACCode.patchValue(SACCode.name)
    this.DebitVoucherDetailsForm.controls.LedgerHdn.patchValue(Ledger.value)
    this.DebitVoucherDetailsForm.controls.SACCodeHdn.patchValue(SACCode.value)
    this.DebitVoucherDetailsForm.controls.SubCategoryName.patchValue(Ledger.mRPNM)
    this.dialogRef.close(this.DebitVoucherDetailsForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }
  SACCodeFieldChanged(event) {
    this.DebitVoucherDetailsForm.controls.GSTRate.patchValue(event?.eventArgs?.option?.value?.GSTRT)
    this.calculateGSTAndTotal('');
  }
  calculateGSTAndTotal(event) {
    const DebitAmount = Number(this.DebitVoucherDetailsForm.value['DebitAmount']);
    const GSTRate = Number(this.DebitVoucherDetailsForm.value['GSTRate']);

    if (!isNaN(DebitAmount) && !isNaN(GSTRate)) {
      const GSTAmount = (DebitAmount * GSTRate) / 100;
      const Total = GSTAmount + DebitAmount;

      this.DebitVoucherDetailsForm.controls.GSTAmount.setValue(GSTAmount.toFixed(2));
      this.DebitVoucherDetailsForm.controls.Total.setValue(Total.toFixed(2));
    } else {
      console.error('Invalid input values for DebitAmount or GSTRate');
    }
  }


}
