import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { AddVoucherDetailsModalComponent } from 'src/app/finance/Modals/add-voucher-details-modal/add-voucher-details-modal.component';
import { SetOpeningBalanceLedgerWise } from 'src/assets/FormControls/Finance/FA Masters/SetOpeningBalance/SetOpeningBalanceLedgerWise';
import { JournalVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/JournalVouchercontrol';

@Component({
  selector: 'app-edit-opening-balance-ledger-wise',
  templateUrl: './edit-opening-balance-ledger-wise.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class EditOpeningBalanceLedgerWiseComponent implements OnInit {
  JournalVoucherControl: SetOpeningBalanceLedgerWise;

  JournalVoucherDetailsForm: UntypedFormGroup;
  jsonControlJournalVoucherDetailsArray: any;

  constructor(private filter: FilterUtils, private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditOpeningBalanceLedgerWiseComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  Close() {
    this.dialogRef.close()
  }
  initializeFormControl() {
    this.JournalVoucherControl = new SetOpeningBalanceLedgerWise(this.objResult);
    this.jsonControlJournalVoucherDetailsArray = this.JournalVoucherControl.getJournalVoucherDetailsArrayControls();
    this.JournalVoucherDetailsForm = formGroupBuilder(this.fb, [this.jsonControlJournalVoucherDetailsArray]);
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
    this.dialogRef.close(this.JournalVoucherDetailsForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }
  onChangeAmount(event) {
    const fieldName = event?.field?.name;

    const resetFields = (field1) => {
      this.JournalVoucherDetailsForm.get(field1).setValue(0.00);
      this.JournalVoucherDetailsForm.get(field1).updateValueAndValidity();
    };

    if (fieldName === "DebitAmount") {
      resetFields("CreditAmount");
    }

    if (fieldName === "CreditAmount") {
      resetFields("DebitAmount");
    }
  }
}
