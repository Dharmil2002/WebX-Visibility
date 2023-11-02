import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';

@Component({
  selector: 'app-add-details-debit-against-document-modal',
  templateUrl: './add-details-debit-against-document-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class AddDetailsDebitAgainstDocumentModalComponent implements OnInit {
  DebitVoucherControl: DebitVoucherControl;

  DebitAgainstDocumentForm: UntypedFormGroup;
  jsonControlDebitAgainstDocumentArray: any;

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
    this.DebitVoucherControl = new DebitVoucherControl(this.objResult.Details);
    this.jsonControlDebitAgainstDocumentArray = this.DebitVoucherControl.getDebitAgainstDocumentArrayControls();
    this.DebitAgainstDocumentForm = formGroupBuilder(this.fb, [this.jsonControlDebitAgainstDocumentArray]);

    this.filter.Filter(
      this.jsonControlDebitAgainstDocumentArray,
      this.DebitAgainstDocumentForm,
      this.objResult.DocumentList,
      "Document",
      false
    );


    if (this.objResult.Details) {
      this.DebitAgainstDocumentForm.controls.Document.setValue(this.objResult.DocumentList.find(x => x.value == this.objResult.Details
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
    const Document = this.DebitAgainstDocumentForm.value['Document'];
    this.DebitAgainstDocumentForm.controls.Document.patchValue(Document.name)
    this.DebitAgainstDocumentForm.controls.DocumentHdn.patchValue(Document.value)
    this.dialogRef.close(this.DebitAgainstDocumentForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }

}

