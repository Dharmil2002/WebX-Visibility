import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from 'src/app/Utility/date/date-utils';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getThcDetail } from 'src/app/operation/thc-generation/thc-utlity';
import { showConfirmationDialogThc } from '../../../operation/thc-summary/thc-update-utlity';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThcUpdateControls } from 'src/assets/FormControls/thc-update';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ThcUpdate } from 'src/app/core/models/operations/thc/thc-update';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thc-update',
  templateUrl: './thc-update.component.html'
})
export class ThcUpdateComponent implements OnInit {
  //here the declare the flag
  tableLoad: boolean;
  thcTableForm: UntypedFormGroup;
  jsonControlArray: any;
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
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog,
    private _operationService:OperationService,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
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
    this.thcTableForm.controls['shipment'].setValue(this.thcDetail.shipment);
  }

  cancel() {
    this.dialogRef.close()
  }
  
  getFilePod(data) {
    let fileList: FileList = data.eventArgs;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const allowedFormats = ["jpeg", "png", "jpg"];
      const fileFormat = file.type.split("/")[1]; // Extract file format from MIME type

      if (allowedFormats.includes(fileFormat)) {
        const podUpload = file.name;
        this.selectedFiles = true;
        this.thcTableForm.controls["podUpload"].setValue(podUpload);
      } else {
        this.selectedFiles = false;
        Swal.fire({
          icon: "warning",
          title: "Alert",
          text: `Please select a JPEG, PNG, or JPG file.`,
          showConfirmButton: true,
        });
      }
    } else {
      this.selectedFiles = false;
      alert("No file selected");
    }
  }
  async save(){
    await showConfirmationDialogThc(this.thcTableForm.value,this._operationService);
    this.dialogRef.close()
  }
 
}
