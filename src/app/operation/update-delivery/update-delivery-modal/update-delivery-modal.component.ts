import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { UpdateShipmentDeliveryControl } from 'src/assets/FormControls/update.delivery';
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import Swal from 'sweetalert2';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
@Component({
  selector: 'app-update-delivery-modal',
  templateUrl: './update-delivery-modal.component.html'
})
export class UpdateDeliveryModalComponent implements OnInit {
  //here the declare the flag
  tableLoad: boolean;
  deliveryForm: UntypedFormGroup;
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
  selectedFiles: boolean;
  shipmentDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog,
    private filter: FilterUtils,
    public generalService:GeneralService,
    private objImageHandling: ImageHandling
  ) {
    this.shipmentDetails = item;
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
    const thcFormControls = new UpdateShipmentDeliveryControl();
    this.jsonControlArray = thcFormControls.getupdaterunsheetFormControls();
    this.deliveryForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.autoPopulateForm();
    this.bindDropDown();
  }
  async bindDropDown(){
    const lateDelivery = await this.generalService.getGeneralMasterData("LTDEP");
    const partialDelivery = await this.generalService.getGeneralMasterData("PART_D");
    const unDelivery = await this.generalService.getGeneralMasterData("UNDELY");
    this.filter.Filter(
      this.jsonControlArray,
      this.deliveryForm,
      [...unDelivery,...partialDelivery],
      'deliveryPartial',
      false
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.deliveryForm,
      lateDelivery,
      'ltReason',
      false
    );

  }
  deliveryPkgsChange(){
    const bookedPkgs = parseInt(this.deliveryForm.controls['bookedPkgs'].value);
    const deliveryPkgs = this.deliveryForm.controls['deliveryPkgs'].value;
    if(bookedPkgs < deliveryPkgs){
    Swal.fire("Error","Delivery Pkgs should not be greater than Booked Pkgs","error");
    this.deliveryForm.controls['deliveryPkgs'].setValue(0);
    return false
    }
  }
  autoPopulateForm(){
    this.deliveryForm.controls['dKTNO'].setValue(this.shipmentDetails.shipment);
    this.deliveryForm.controls['bookedPkgs'].setValue(this.shipmentDetails.packages);
    this.deliveryForm.controls['arrivedPkgs'].setValue(this.shipmentDetails.packages);
  }
  cancel() {
    this.dialogRef.close()
  }

   async getFilePod(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "pod", this.
    deliveryForm, this.imageData, "Delivery", 'Operations', this.jsonControlArray, ["jpeg", "png", "jpg", "pdf"]);

  }
  openImageDialog(control) {
    
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  async save() {
    this.deliveryForm.controls['deliveryPartial'].setValue(this.deliveryForm.controls['deliveryPartial'].value?.name||"");
    this.deliveryForm.controls['ltReason'].setValue(this.deliveryForm.controls['ltReason'].value?.name||"");
    let deliveryData=this.deliveryForm.getRawValue();
    deliveryData['upload']=this.imageData?.pod
    // await showConfirmationDialogThc(this.thcTableForm.value,this._operationService);
    this.dialogRef.close(deliveryData)
  }

}
