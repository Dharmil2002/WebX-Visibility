import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { depsStatus } from 'src/app/Models/docStatus';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { DepsService } from 'src/app/Utility/module/operation/deps/deps-service';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { DepsUpdateControls } from 'src/assets/FormControls/deps';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deps-update',
  templateUrl: './deps-update.component.html'
})
export class DepsUpdateComponent implements OnInit {
  tableLoad: boolean;
  allJsonControlArray: FormControls[];
  depsFormGroup: UntypedFormGroup;
  DocCalledAs: any;
  imageData: any = {};
  className: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  depsDetails: any;
  lastImage: any;
  constructor(private fb: UntypedFormBuilder,
    private controlPanel: ControlPanelService,
    private depsService: DepsService,
    private objImageHandling: ImageHandling,
    private storage: StorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DepsUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any) {
    this.depsDetails = item;
    this.DocCalledAs = controlPanel.DocCalledAs;
  }


  ngOnInit(): void {
    this.IntializeFormControl();
  }

  IntializeFormControl() {
    debugger
    const shipmentControls = new DepsUpdateControls();
    this.allJsonControlArray = shipmentControls.getDepsControlsData();
    this.depsFormGroup = formGroupBuilder(this.fb, [this.allJsonControlArray]);
    this.depsFormGroup.controls['dEPSNO'].setValue(this.depsDetails?.dEPSNO || "");
    this.depsFormGroup.controls['dEPSDT'].setValue(moment(this.depsDetails?.dEPSDT).format("DD MM YYYY HH:MM"));
    this.depsFormGroup.controls['dKTNO'].setValue(this.depsDetails?.dKTNO || "");
    this.depsFormGroup.controls['pKGS'].setValue(this.depsDetails?.pKGS || "");
    this.depsFormGroup.controls['dEPSCREAT'].setValue(this.depsDetails?.extra?.eNTLOC || "");
    this.depsFormGroup.controls['dEPSCREBY'].setValue(this.depsDetails?.extra?.eNTBY || "");
    this.depsFormGroup.controls['sPKGS'].setValue(this.depsDetails?.extra?.sHORT?.pKGS || 0);
    this.depsFormGroup.controls['nOEPKGS'].setValue(this.depsDetails?.extra?.eXEC?.pKGS || 0);
    this.depsFormGroup.controls['nOPPKGS'].setValue(this.depsDetails?.extra?.pF?.pKGS || 0);
    this.depsFormGroup.controls['nODPKGS'].setValue(this.depsDetails?.extra?.dMG?.pKGS || 0);
    this.depsFormGroup.controls['suffix'].setValue(this.depsDetails?.extra?.sFX);
    const res = this.getValuesIfKeyExists(this.depsDetails?.extra, ['sHORT', 'eXEC', 'pF', 'dMG'], 'rES');
    this.depsFormGroup.controls['dEPSRes'].setValue(res);
    this.depsFormGroup.controls['uPLOAD'].setValue(this.depsDetails?.extra?.lSDDEPS.dOC||"");
    this.depsFormGroup.controls['rMK'].setValue(this.depsDetails?.extra?.lSDDEPS.rMK);
    this.imageData.uPLOAD=this.depsDetails?.extra?.lSDDEPS.dOC;

  }
  getValuesIfKeyExists(data: any, keysToCheck: string[], keyOfInterest: string): any {
    let result = {};
    let res = ""
    keysToCheck.forEach(key => {
      if (data[key] && data[key][keyOfInterest] !== undefined) {
        result[key] = data[key];
        if (data[key][keyOfInterest]) {
          res = data[key][keyOfInterest];
        }
      }
    });
    return res;
  }
  cancel() {
    this.dialogRef.close();
  }
  /*below is the deps close function*/
  async close() {
        debugger
    if (!this.depsFormGroup.valid || !this.depsFormGroup.valid) {
      this.depsFormGroup.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    try {
      let formData = this.depsFormGroup.getRawValue();
      formData['dOC'] = this.imageData?.uPLOAD || ""
      const filter = {
        cID: this.storage.companyCode,
        dEPSNO: this.depsFormGroup.controls['dEPSNO'].value,
        dKTNO: this.depsFormGroup.controls['dKTNO'].value,
        sFX: this.depsFormGroup.controls['suffix'].value,
        sTS: depsStatus.Update
      }
      const depsCount = await this.depsService.getDepsCount(filter)
      if (depsCount &&depsCount[0].count>0) {
        await this.depsService.depsUpdate(formData, { sTS: depsStatus.Closed, sTSNM: depsStatus[depsStatus.Closed] })
        Swal.fire({
          icon: "success",
          title: "DEPS Closed Successfully",
          text: `DEPS Number: ${this.depsFormGroup.controls['dEPSNO'].value}`,
          showConfirmButton: true,
        }).then((result) => {
          this.dialogRef.close();
        });
      }
      else {
        Swal.fire('Warning', 'Please update deps before closing.', 'warning');
      }
    }
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  }
  /*End*/
  functionCaller($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  async save() {
    if (!this.depsFormGroup.valid || !this.depsFormGroup.valid) {
      this.depsFormGroup.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        timer: 5000,
        timerProgressBar: true,

      });
      return false;
    }
    try {
      let formData = this.depsFormGroup.getRawValue();
      formData['dOC'] = this.imageData?.uPLOAD || ""
      await this.depsService.depsUpdate(formData, { sTS: depsStatus.Update, sTSNM: depsStatus[depsStatus.Update] });
      Swal.fire({
        icon: "success",
        title: "DEPS Closed Successfully",
        text: `DEPS Number: ${this.depsFormGroup.controls['dEPSNO'].value}`,
        showConfirmButton: true,
      }).then((result) => {
        this.dialogRef.close();
      });
    }
    catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  }
  /*Below is the file Upload Functions*/
  async getFilePod(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "uPLOAD", this.
      depsFormGroup, this.imageData, "Delivery", 'Operations', this.allJsonControlArray, ["jpeg", "png", "jpg", "pdf"]);
  }
  openImageDialog(control) {
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  /*End*/
}
