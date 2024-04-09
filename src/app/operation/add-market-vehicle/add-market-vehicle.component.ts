import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MarkerVehicleService } from 'src/app/Utility/module/operation/market-vehicle/marker-vehicle.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { marketVehicleControls } from 'src/assets/FormControls/market-vehicle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-market-vehicle',
  templateUrl: './add-market-vehicle.component.html'
})
export class AddMarketVehicleComponent implements OnInit {
  imageData: any = {};
  jsonControlVehicleArray: any;
  marketVehicleTableForm: UntypedFormGroup;
  className: string = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  companyCode = 0;
  breadScrums = [
    {
      title: "Add Vehicle details",
      items: ["Home"],
      active: "Vehicle Status",
    },
  ];
  prqDetail: any;

  constructor
    (
      public dialogRef: MatDialogRef<GenericTableComponent>,
      @Inject(MAT_DIALOG_DATA) public item: any,
      private fb: UntypedFormBuilder,
      public dialog: MatDialog,
      private storage: StorageService,
      private markerVehicleService: MarkerVehicleService,
      private objImageHandling: ImageHandling) {

    this.companyCode = this.storage.companyCode;
    if (item) {
      this.prqDetail = item
    }

    this.initializeFormControl()
  }

  ngOnInit(): void {
    this.marketVehicleTableForm.controls['vehicleSize']?.setValue(this.prqDetail?.vehicleSize || this.prqDetail?.containerSize || "")
  }

  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    // Create vehicleFormControls instance to get form controls for different sections
    const maketVehicleControl = new marketVehicleControls();
    this.jsonControlVehicleArray = maketVehicleControl.getFormControls();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.marketVehicleTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleArray]);
  }
  async save() {
    const uploadSupport = this.imageData?.uploadSupport || ""
    const data = {
      vID: this.marketVehicleTableForm.value.vehicelNo,
      vndNM: this.marketVehicleTableForm.value.vendor,
      vndCD: this.marketVehicleTableForm.value.vendor,
      vndPH: this.marketVehicleTableForm.value.vMobileNo,
      pANNO: this.marketVehicleTableForm.value.venPan,
      wTCAP: this.marketVehicleTableForm.value.vehicleSize,
      drvNM: this.marketVehicleTableForm.value.driver,
      ETA: this.marketVehicleTableForm.value.ETA,
      drvPH: this.marketVehicleTableForm.value.dmobileNo,
      dLNO: this.marketVehicleTableForm.value.lcNo,
      dLEXP: this.marketVehicleTableForm.value.lcExpireDate,
      iNCEXP: this.marketVehicleTableForm.value.insuranceExpiryDate,
      fITDT: this.marketVehicleTableForm.value.fitnessValidityDate,
      eNGNO: this.marketVehicleTableForm.value.engineNo,
      cHNO: this.marketVehicleTableForm.value.chasisNo,
      vEHCNAMT: this.marketVehicleTableForm.value.vehContAmt,
      mRGAMT: this.marketVehicleTableForm.value.margAMT,
      rDPRT: this.marketVehicleTableForm.value.roadPrt,
      sDOC:uploadSupport
    };
    const res = await this.markerVehicleService.SaveVehicleData(data);
    if (res) {
      this.dialogRef.close(this.marketVehicleTableForm.value);
    }
  }
  calculateContractAmount() {
    const contractAmt= parseFloat(this.prqDetail?.contractAmt || 0);
    const vehCntAmt= parseFloat(this.marketVehicleTableForm.controls['vehContAmt']?.value||0);
    if(vehCntAmt>contractAmt){
      Swal.fire('Alert','Vehicle contract amount should not be greater than contract amount','warning');
      this.marketVehicleTableForm.controls['vehContAmt'].setValue(0);
      this.marketVehicleTableForm.controls['margAMT'].setValue(0);
      return false; 
    }
    const total=contractAmt-vehCntAmt
    this.marketVehicleTableForm.controls['margAMT'].setValue(total.toFixed(2));
  }
  async onVehicleNoChange() {
    const vehData = await this.markerVehicleService.GetVehicleData(this.marketVehicleTableForm.value.vehicelNo);
    if (vehData) {
      //this.marketVehicleTableForm.controls['vehicleSize'].setValue(vehData.wTCAP);
      this.marketVehicleTableForm.controls['vendor'].setValue(vehData.vndNM ?? '');
      this.marketVehicleTableForm.controls['vMobileNo'].setValue(vehData.vndPH ?? '');
      this.marketVehicleTableForm.controls['driver'].setValue(vehData.drvNM ?? '');
      this.marketVehicleTableForm.controls['venPan'].setValue(vehData.pANNO ?? '');
      this.marketVehicleTableForm.controls['lcNo'].setValue(vehData.dLNO ?? '');
      this.marketVehicleTableForm.controls['lcExpireDate'].setValue(vehData.dLEXP ?? new Date());
      this.marketVehicleTableForm.controls['dmobileNo'].setValue(vehData.drvPH ?? '');
      this.marketVehicleTableForm.controls['vehContAmt'].setValue(vehData.vEHCNAMT ?? '');
      this.marketVehicleTableForm.controls['margAMT'].setValue(vehData.mRGAMT ?? '');
      this.marketVehicleTableForm.controls['roadPrt'].setValue(vehData.rDPRT ?? '');
      this.marketVehicleTableForm.controls['engineNo'].setValue(vehData.eNGNO ?? '');
      this.marketVehicleTableForm.controls['chasisNo'].setValue(vehData.cHNO ?? '');
      this.marketVehicleTableForm.controls['insuranceExpiryDate'].setValue(vehData.iNCEXP ?? new Date());
      this.marketVehicleTableForm.controls['fitnessValidityDate'].setValue(vehData.fITDT ?? new Date());
      this.marketVehicleTableForm.controls['ETA'].setValue(vehData.ETA ?? '');
      this.marketVehicleTableForm.controls['uploadSupport'].setValue(vehData.sDOC ?? '');
    }
  }

  checkVehicleSize() {
    const vehicleSize = parseInt(this.prqDetail?.vehicleSize || 0);
    const resultVehicleSize = parseInt(this.marketVehicleTableForm.controls['vehicleSize']?.value || 0)
    // Assuming result.vehicleSize and this.NavData.vehicleSize are both defined
    if (resultVehicleSize != vehicleSize) {
      // Show a SweetAlert dialog
      Swal.fire({
        icon: 'warning',
        title: 'Alert',
        text: 'Markert vehicle size is not same as Prq vehicle size!',
        confirmButtonText: 'OK'
      })
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  async getFilePod(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "uploadSupport",this.marketVehicleTableForm,this.imageData,"Market Vehicle",'Masters',this.jsonControlVehicleArray, ["jpeg", "png", "jpg", "pdf"]);
  }
  openImageDialog(control) {
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
}
