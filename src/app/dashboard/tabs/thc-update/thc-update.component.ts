import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThcUpdateControls } from 'src/assets/FormControls/thc-update';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ThcUpdate } from 'src/app/core/models/operations/thc/thc-update';
import Swal from 'sweetalert2';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';

@Component({
  selector: 'app-thc-update',
  templateUrl: './thc-update.component.html'
})
export class ThcUpdateComponent implements OnInit {
  //here the declare the flag
  tableLoad: boolean;
  thcTableForm: UntypedFormGroup;
  jsonControlArray: any;
  imageData: any = {};
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  //add dyamic controls for generic table
  uploadedFiles: File[];
  menuItems = [
  ];
  menuItemflag: boolean = true;
  thcDetail: ThcUpdate;
  selectedFiles: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog,
    private objImageHandling: ImageHandling
  ) {
    this.thcDetail = item;
  }

  functionCaller($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  ngOnInit(): void {
    this.IntializeFormControl();
  }

  IntializeFormControl() {
    const thcFormControls = new ThcUpdateControls();
    this.jsonControlArray = thcFormControls.getThcFormControls();
    this.thcTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.thcTableForm.controls['shipment'].setValue(this.thcDetail.docNo);
  }

  cancel() {
    this.dialogRef.close()
  }

  async getFilePod(data) {

    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "Upload", this.
      thcTableForm, this.imageData, "ThcUpdate", 'Operations', this.jsonControlArray, ["jpeg", "png", "jpg", "pdf"]);

  }
  async save() {
    const pod = this.imageData?.Upload || ""
    this.thcTableForm.controls['podUpload'].setValue(pod);
    // await showConfirmationDialogThc(this.thcTableForm.value,this._operationService);
    this.dialogRef.close(this.thcTableForm.value)
  }

}
