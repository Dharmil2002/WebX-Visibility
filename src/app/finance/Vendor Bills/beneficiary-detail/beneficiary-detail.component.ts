import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';

@Component({
  selector: 'app-beneficiary-detail',
  templateUrl: './beneficiary-detail.component.html'
})
export class BeneficiaryDetailComponent implements OnInit {
  beneficiarydata: any;
  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableData: any[]
  columnHeader = {
    accountCode: {
      Title: "Account Code",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    IFSCcode: {
      Title: "IFSC Code",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    bankName: {
      Title: "Bank Name",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    branchName: {
      Title: "Branch Name",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    UPIId: {
      Title: "UPI IDs",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    contactPerson: {
      Title: "Contact Person",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    mobileNo: {
      Title: "Mobile No",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    emailId: {
      Title: "Email IDS",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    filename: {
      Title: "Upload KYC",
      class: "matcolumncenter",
      Style: "max-width:65px",
      type: "Link",
      functionName: "openImageDialog"
    },
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  staticField = ['accountCode', 'IFSCcode', 'branchName', 'bankName', 'city', 'UPIId', 'contactPerson', 'mobileNo', 'emailId']
  constructor(public dialogRef: MatDialogRef<BeneficiaryDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setTableData()
  }

  Close() {
    this.dialogRef.close()
  }
  setTableData() {
    this.tableLoad = true;

    this.tableData = this.objResult.Details.map(x => ({
      ...x,
      filename: "View"
      // filename: this.objImageHandling.extractFileName(x.uploadKYC)
    }));

    this.tableLoad = false;
  }
  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed", error);
    }
  }
  //#region to preview image
  openImageDialog(control) {
    console.log(control.data);
    const path = control.data.uploadKYC
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: path },
      width: '30%',
      height: '50%',
    });
  }
  //#endregion
}