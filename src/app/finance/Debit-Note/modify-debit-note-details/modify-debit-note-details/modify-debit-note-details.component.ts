import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { debitNoteGenerationControls } from 'src/assets/FormControls/debitnote-entry';

@Component({
  selector: 'app-modify-debit-note-details',
  templateUrl: './modify-debit-note-details.component.html',
  // styleUrls: ['./modify-debit-note-details.component.sass']
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]                                
})
export class ModifyDebitNoteDetailsComponent implements OnInit {
  modifyDebitNoteControl: debitNoteGenerationControls;
  gstRevlAmt:any;
  modifyDebitNoteDetailsForm: UntypedFormGroup;
  jsonControlmodifyDebitNoteDetailsArray: any;
  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ModifyDebitNoteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  Close() {
    this.dialogRef.close()
  }
  initializeFormControl() {
    this.modifyDebitNoteControl = new debitNoteGenerationControls(this.objResult);
    this.jsonControlmodifyDebitNoteDetailsArray = this.modifyDebitNoteControl.getModifydebitNote();
    this.modifyDebitNoteDetailsForm = formGroupBuilder(this.fb, [this.jsonControlmodifyDebitNoteDetailsArray]);
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
    this.dialogRef.close(this.modifyDebitNoteDetailsForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }
  onChangeAmount(event) {

    const fieldName = event?.field?.name;
    if (fieldName === "DebitAmount") { 
      //this.gstRevlAmt = ((this.modifyDebitNoteDetailsForm.controls.DebitAmount.value * this.modifyDebitNoteDetailsForm.controls.gstRate.value) / 100).toFixed(2);
      this.gstRevlAmt = parseFloat((((this.modifyDebitNoteDetailsForm.controls.DebitAmount.value) / (1 + (this.modifyDebitNoteDetailsForm.controls.gstRate.value / 100)) * (this.modifyDebitNoteDetailsForm.controls.gstRate.value / 100))).toFixed(2)),
      this.modifyDebitNoteDetailsForm.get("GstRevAmount").setValue(this.gstRevlAmt);
      const tdsRevlAmt=((this.modifyDebitNoteDetailsForm.controls.DebitAmount.value-this.gstRevlAmt)*0.1).toFixed(2);
      this.modifyDebitNoteDetailsForm.get("TdsRevAmount").setValue(tdsRevlAmt);
    }
  }
}
