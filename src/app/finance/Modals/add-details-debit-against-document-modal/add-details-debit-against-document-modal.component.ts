import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';

@Component({
  selector: 'app-add-details-debit-against-document-modal',
  templateUrl: './add-details-debit-against-document-modal.component.html',
})
export class AddDetailsDebitAgainstDocumentModalComponent implements OnInit {
  creditDebitVoucherControl: CreditDebitVoucherControl;

  CreditDebitAgainstDocumentForm: UntypedFormGroup;
  jsonControlCreditDebitAgainstDocumentArray: any;

  constructor(private filter: FilterUtils, private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddDetailsDebitAgainstDocumentModalComponent>,
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
    this.jsonControlCreditDebitAgainstDocumentArray = this.creditDebitVoucherControl.getCreditDebitAgainstDocumentArrayControls();
    this.CreditDebitAgainstDocumentForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitAgainstDocumentArray]);

    this.filter.Filter(
      this.jsonControlCreditDebitAgainstDocumentArray,
      this.CreditDebitAgainstDocumentForm,
      this.objResult.DocumentList,
      "Document",
      false
    );


    if (this.objResult.Details) {
      this.CreditDebitAgainstDocumentForm.controls.Document.setValue(this.objResult.DocumentList.find(x => x.value == this.objResult.Details
        .DocumentHdn))
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
    const Document = this.CreditDebitAgainstDocumentForm.value['Document'];
    this.CreditDebitAgainstDocumentForm.controls.Document.patchValue(Document.name)
    this.CreditDebitAgainstDocumentForm.controls.DocumentHdn.patchValue(Document.value)
    this.dialogRef.close(this.CreditDebitAgainstDocumentForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }

}

