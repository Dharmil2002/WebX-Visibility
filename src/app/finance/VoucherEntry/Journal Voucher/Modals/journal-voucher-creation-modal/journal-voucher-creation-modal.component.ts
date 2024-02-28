import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { AddVoucherDetailsModalComponent } from 'src/app/finance/Modals/add-voucher-details-modal/add-voucher-details-modal.component';
import { JournalVoucherControl } from 'src/assets/FormControls/Finance/VoucherEntry/JournalVouchercontrol';

@Component({
  selector: 'app-journal-voucher-creation-modal',
  templateUrl: './journal-voucher-creation-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class JournalVoucherCreationModalComponent implements OnInit {
  JournalVoucherControl: JournalVoucherControl;

  JournalVoucherDetailsForm: UntypedFormGroup;
  jsonControlJournalVoucherDetailsArray: any;

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
    this.JournalVoucherControl = new JournalVoucherControl(this.objResult.Details);
    this.jsonControlJournalVoucherDetailsArray = this.JournalVoucherControl.getJournalVoucherDetailsArrayControls();
    this.JournalVoucherDetailsForm = formGroupBuilder(this.fb, [this.jsonControlJournalVoucherDetailsArray]);

    this.filter.Filter(
      this.jsonControlJournalVoucherDetailsArray,
      this.JournalVoucherDetailsForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    if (this.objResult.Details) {
      this.JournalVoucherDetailsForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.LedgerHdn))
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
    const Ledger = this.JournalVoucherDetailsForm.value['Ledger'];
    this.JournalVoucherDetailsForm.controls.Ledger.patchValue(Ledger.name)
    this.JournalVoucherDetailsForm.controls.LedgerHdn.patchValue(Ledger.value)
    this.JournalVoucherDetailsForm.controls.SubLedger.patchValue(Ledger.mRPNM)
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
