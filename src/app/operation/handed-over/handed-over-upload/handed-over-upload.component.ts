import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { xlsxutilityService } from 'src/app/core/service/Utility/xlsx Utils/xlsxutility.service';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-handed-over-upload',
  templateUrl: './handed-over-upload.component.html'
})
export class HandedOverUploadComponent implements OnInit {
  fileUploadForm: UntypedFormGroup;
  containerFor: any;
  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<HandedOverUploadComponent>,
    private matDialog: MatDialog,
    public xlsxUtils: xlsxutilityService,
    private generalService:GeneralService
  ) { 
    this.fileUploadForm = fb.group({
      singleUpload: [""],
    });
    this.getGeneralMasterData();
  }

  ngOnInit(): void {
  }
  Close() {
    this.dialogRef.close()
  }
     /*Bulk Upload Functionality in rake Updation For Container For*/
  public selectedFile(event) {
  
    let fileList: FileList = event.target.files;
    if (fileList.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const file = fileList[0];

    if (file) {
      this.xlsxUtils.readFile(file).then((jsonData) => {
        const validationRules = [
          {
            ItemsName: "ContainerNo",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "ContainerType",
            Validations: [{ Required: true }],
          },
          {
            ItemsName: "IsEmpty",
            Validations: [],
          },
          {
            ItemsName: "ContainerFor",
            Validations: [
              { Required: true },
              {
                TakeFromList:  this.containerFor.map((x) => {
                  return x.name;
                }),
              },
            ],
          },
        ];

        let rPromise = firstValueFrom(this.xlsxUtils.validateDataWithApiCall(jsonData, validationRules));
        rPromise.then(response => {
          this.OpenPreview(response);
          //this.model.containerTableForm.controls["Company_file"].setValue("");
        })
          .catch(error => {
            Swal.fire({
              title: "Data Entry Error",
              text: "The Excel sheet appears to be missing some data or contains incorrect entries. Please review your data and ensure all required fields are correctly filled out.",
              icon: "error",
              confirmButtonColor: '#d33', // Example of customizing the button color
              confirmButtonText: "Try Again", // Link to a help page or further instructions
            });
          });
      });
    }
  }

  OpenPreview(results) {
    const dialogRef = this.matDialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.dialogRef.close(result)
        //this.model.previewResult = result;
        //this.containorCsvDetail();
      }
    });
  }

  /*End*/
  async getGeneralMasterData() {
    this.containerFor = await this.generalService.getGeneralMasterData("CONTFOR");
 }
 
}
