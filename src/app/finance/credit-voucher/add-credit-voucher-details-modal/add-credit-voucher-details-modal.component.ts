import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditVoucherControl } from 'src/assets/FormControls/Finance/CreditVoucher/creditVoucher';

@Component({
  selector: 'app-add-credit-voucher-details-modal',
  templateUrl: './add-credit-voucher-details-modal.component.html'
})
export class AddCreditVoucherDetailsModalComponent implements OnInit {
  CreditVoucherControl: CreditVoucherControl;
  CreditVoucherDetailsForm: UntypedFormGroup;
  jsonControlCreditVoucherDetailsArray: any;
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<AddCreditVoucherDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any) {
    console.log(objResult);

  }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.CreditVoucherControl = new CreditVoucherControl(this.objResult.Details);
    this.jsonControlCreditVoucherDetailsArray = this.CreditVoucherControl.getCreditVoucherDetailArrayControls();
    this.CreditVoucherDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditVoucherDetailsArray]);

    this.filter.Filter(
      this.jsonControlCreditVoucherDetailsArray,
      this.CreditVoucherDetailsForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    if (this.objResult.Details) {
      this.CreditVoucherDetailsForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.LedgerHdn))
    }

  }
  Close() {
    this.dialogRef.close()
  }
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  save(event) {
    const Ledger = this.CreditVoucherDetailsForm.value['Ledger'];

    this.CreditVoucherDetailsForm.controls.Ledger.patchValue(Ledger.name);
    this.CreditVoucherDetailsForm.controls.LedgerHdn.patchValue(Ledger.value);
    this.CreditVoucherDetailsForm.controls.LedgerHdn.patchValue(Ledger.value);
    this.CreditVoucherDetailsForm.controls.SubCategoryName.patchValue(Ledger.mRPNM);
    this.dialogRef.close(this.CreditVoucherDetailsForm.value);
  }
  cancel(event) {
    this.dialogRef.close()
  }
}
