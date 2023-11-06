import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/debitvouchercontrol';
import { GetDocumentsWiseListFromApi } from '../../credit-debit-voucher/debitvoucherAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';

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
    private masterService: MasterService,
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

    this.DebitAgainstDocumentForm.get('DocumentType').setValue(this.objResult?.DocumentType?.value)
    // if (this.objResult.Details) {
    //   this.DebitAgainstDocumentForm.controls.Document.setValue(this.objResult.DocumentList.find(x => x.value == this.objResult.Details
    //     .DocumentHdn))
    // }

  }
  async SetDocumentOptions(event) {
    let fieldName = event.field.name;
    const search = this.DebitAgainstDocumentForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      switch (this.objResult.DocumentType?.name) {
        case "Consignment":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'docket_temp', 'docketNumber', search)
          break;
        case "THC":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'thc_detail', 'prqNo', search)
          break;
        case "DRS":
          break;
        case "PRS":
          break;
        case "JOB":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'job_detail', 'jobId', search)
          break;
      }
      this.filter.Filter(
        this.jsonControlDebitAgainstDocumentArray,
        this.DebitAgainstDocumentForm,
        data,
        "Document",
        false
      );
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

