import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { SubmitionControl } from 'src/assets/FormControls/billing-invoice/bill-Submition';

@Component({
  selector: 'app-bill-submission',
  templateUrl: './bill-submission.component.html'
})
export class BillSubmissionComponent implements OnInit {
  billSubmition: UntypedFormGroup;
  jsonControlArray: FormControls[];
  shipmentDetails: any;
  isChagesValid: boolean = false;
  imageData: any = {};
  constructor(
    private fb:UntypedFormBuilder,
    private objImageHandling: ImageHandling, 
    private invoiceService: InvoiceServiceService,
    private storage: StorageService,
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
      this[event.functionName](event.data);
    } catch (error) {
    }
  }
  
  IntializeFormControl() {
    const loadingControlForm = new SubmitionControl();
    this.jsonControlArray = loadingControlForm.getSubmitFormControls();
    this.billSubmition = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  
  GetFileList(data) {
    
    this.imageData =  this.objImageHandling.uploadFile(data.eventArgs, "Upload", this.
    billSubmition, this.imageData, "BillSubmit", 'Finance', this.jsonControlArray, ["jpeg", "png", "jpg", "pdf"]);
    console.log(this.imageData);

  }
  async save(){
    
    const filter={
      docNo:this.shipmentDetails?.data?.docNo
    }
    const pod = this.imageData?.Upload || ""
    const status={
      bSTS:3,
      bSTSNM:"Bill Submission",
      sUB:{
        loc:this.storage.branch,
        sDT:this.billSubmition.controls['submitDate'].value,
        sBY:this.billSubmition.controls['submissionBy'].value,
        sDoc:pod
      }
    }
     await this.invoiceService.updateInvoiceStatus(filter,status);
    this.dialogRef.close('Success');
  }
  cancel(){
    this.dialogRef.close();
  }
}
