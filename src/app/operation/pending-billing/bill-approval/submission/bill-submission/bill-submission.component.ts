import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { SubmitionControl } from 'src/assets/FormControls/billing-invoice/bill-Submition';

@Component({
  selector: 'app-bill-submission',
  templateUrl: './bill-submission.component.html'
})
export class BillSubmissionComponent implements OnInit {
  billSubmition: UntypedFormGroup;
  jsonControlArray: FormControls[];
  uploadedFiles: File[];
  shipmentDetails: any;
  isChagesValid: boolean = false;
  imageData: any = {};
  constructor(
    private fb:UntypedFormBuilder,
    private objImageHandling: ImageHandling, 
    private invoiceService: InvoiceServiceService,
    private storage: StorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.shipmentDetails = this.data;
    }

  ngOnInit(): void {
    this.IntializeFormControl();
  }

  functionCallHandler(event) {
    try {
      this[event.functionName](event);
    } catch (error) {
    }
  }
  
  IntializeFormControl() {
    const loadingControlForm = new SubmitionControl();
    this.jsonControlArray = loadingControlForm.getSubmitFormControls();
    this.billSubmition = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  
  async GetFileList(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData =  await this.objImageHandling.uploadFile(data.eventArgs, "Upload", this.
    billSubmition, this.imageData, "BillSubmit", 'Finance', this.jsonControlArray, allowedFormats);
  }
    //#region to preview image
    openImageDialog(control) {
      const file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
      this.dialog.open(ImagePreviewComponent, {
        data: { imageUrl: file },
        width: '30%',
        height: '50%',
      });
    }
    //#endregion
  async save(){
    const filter={
      bILLNO:this.shipmentDetails?.bILLNO
    }
    const pod = this.imageData?.Upload || ""
    const status={
      bSTS:3,
      bSTSNM:"Bill Submission",
      sUB:{
        lOC:this.storage.branch,
        dTM:this.billSubmition.controls['submitDate'].value,
        tO:this.billSubmition.controls['submissionTo'].value,
        tOMOB:this.billSubmition.controls['mobile'].value,
        dOC:pod
      }
    }
     await this.invoiceService.updateInvoiceStatus(filter,status);
    this.dialogRef.close('Success');
  }
  cancel(){
    this.dialogRef.close();
  }
}
