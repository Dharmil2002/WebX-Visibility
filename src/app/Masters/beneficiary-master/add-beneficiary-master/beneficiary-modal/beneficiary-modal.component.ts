import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { BeneficiaryControl } from 'src/assets/FormControls/BeneficiaryMaster';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiary-modal',
  templateUrl: './beneficiary-modal.component.html'
})
export class BeneficiaryModalComponent implements OnInit {
  jsonDetailControl: any;
  beneficiaryDetailForm: UntypedFormGroup
  beneficiarydata: any;
  imageData: any = {};
  url: any;
  isEditable: boolean;
  constructor(public dialogRef: MatDialogRef<BeneficiaryModalComponent>,
    private fb: UntypedFormBuilder,
    private objImageHandling: ImageHandling,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {

    if (objResult.Details) {
      this.isEditable = true
      this.url = objResult.url
    }

  }

  ngOnInit(): void {
    this.initialize();
    console.log(this.objResult);
  }
  //#region to initialize beneficiaryControl
  initialize() {
    const beneficiaryControls = new BeneficiaryControl(this.url, this.isEditable);
    this.jsonDetailControl = beneficiaryControls.getDetailContol();
    this.beneficiaryDetailForm = formGroupBuilder(this.fb, [this.jsonDetailControl])
    if (this.objResult.Details) {
      this.beneficiaryDetailForm.controls['accountCode'].setValue(this.objResult.Details.accountCode);
      this.beneficiaryDetailForm.controls['IFSCcode'].setValue(this.objResult.Details.IFSCcode);
      this.beneficiaryDetailForm.controls['bankName'].setValue(this.objResult.Details.bankName);
      this.beneficiaryDetailForm.controls['branchName'].setValue(this.objResult.Details.branchName);
      this.beneficiaryDetailForm.controls['city'].setValue(this.objResult.Details.city);
      this.beneficiaryDetailForm.controls['UPIId'].setValue(this.objResult.Details.UPIId || "");
      this.beneficiaryDetailForm.controls['contactPerson'].setValue(this.objResult.Details.contactPerson);
      this.beneficiaryDetailForm.controls['mobileNo'].setValue(this.objResult.Details.mobileNo);
      this.beneficiaryDetailForm.controls['emailId'].setValue(this.objResult.Details.emailId);

      //setting isFileSelected  
      const fileName = this.objImageHandling.extractFileName(this.url);
      // Set isFileSelected to true
      const control = this.jsonDetailControl.find(x => x.name === 'uploadKYC');
      control.additionalData.isFileSelected = false;
      // Set the form control value using the control name
      this.beneficiaryDetailForm.controls['uploadKYC'].setValue(fileName);
    }
  }
  //#endregion
  Close() {
    this.dialogRef.close()
  }
  //#region to send data to parent component using dialogRef
  save(event) {
    let file = this.objImageHandling.getFileByKey('uploadKYC', this.imageData);
    file = file ? file : this.url
    const data = this.beneficiaryDetailForm.value;
    data.uploadKYC = file;
    // console.log(data);
    this.dialogRef.close(data)
  }
  //#endregion
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#region to set image at the change of accountCode
  OnAccountChange() {
    const accountCode = this.beneficiaryDetailForm.value.accountCode
    const isDuplicate = this.objResult.beneficiaryList.some((item) => item.accountCode === parseInt(accountCode));
    if (isDuplicate) {
      this.beneficiaryDetailForm.controls['accountCode'].setValue('');
      // Show an error message using Swal (SweetAlert)
      Swal.fire({
        text: `Account Code:${accountCode} already exists! Please try with another.`,
        icon: 'warning',
        title: 'Warning',
        showConfirmButton: true,
      });
      return false
    }
    this.beneficiaryDetailForm.controls['uploadKYC'].setValue('');
    const control = this.jsonDetailControl.find(x => x.name === 'uploadKYC');
    control.additionalData.isFileSelected = true;
  }
  //#endregion
  //#region to upload Kyc image
  async uploadKYC(data) {
    const allowedFormats = ["jpeg", "png", "jpg"];
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "uploadKYC", this.beneficiaryDetailForm, this.imageData, "Beneficiary", 'Master', this.jsonDetailControl, allowedFormats);
  }
  //#endregion
  //#region to preview image
  openImageDialog(control) {
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    file = file ? file : this.url
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
  cancel() {
    this.dialogRef.close()
  }
}