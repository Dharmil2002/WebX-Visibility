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
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
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

  deliveryPkgsChange(event) {     
    const fm = {
      pkgs: {
        name: 'deliveryPkgs',
        ctrl: this.deliveryForm.controls['deliveryPkgs'] ,
        field: 'pKGS'
      },
      actWeight: {
        name: 'deliveryWeight',
        ctrl: this.deliveryForm.controls['deliveryWeight'],
        field: 'wT'
      },  
     
    }

    function setFieldValues(values) {
      fm.pkgs.ctrl.setValue(values.pkgs);
      fm.actWeight.ctrl.setValue(values.actWeight);
    }
  
    function proportionalWeightCalculation(pkg, total, totalWeight) {
      return ConvertToNumber(pkg * (totalWeight / total), 2);
    }
  
    const data=this.shipmentDetails;
    const pkg = parseInt(fm.pkgs.ctrl.value);
    const actWT = parseFloat(fm.actWeight.ctrl.value);
    const totPkg = this.shipmentDetails[fm.pkgs.field] || 0;
    const totActWT = this.shipmentDetails[fm.actWeight.field] || 0;

    let result = { isValid: true, message: ''};
    switch(event.field.name) {
      case fm.pkgs.name: 
        if(pkg > totPkg) {
          result.isValid = false;
          result.message = `Number of packages should be less than or equal to ${totPkg}`;
          setFieldValues({ pkgs: totPkg, actWeight: totActWT });          
        }
        else if( pkg < totPkg ) {        
          const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
          setFieldValues({ pkgs: pkg, actWeight: aWT});     
        }
        else if( pkg == totPkg) {        
          const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
          setFieldValues({ pkgs: pkg, actWeight: aWT});     
        }
        else if( pkg == 0) {
          setFieldValues({ pkgs: 0, actWeight: 0});
        }
        break;
      case fm.actWeight.name: 
        const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
        if(actWT > totActWT) {
          result.isValid = false;
          result.message = `Actual weight should be less than or equal to ${totActWT}`;
          fm.actWeight.ctrl.setValue(totActWT);
        }
        else if(actWT == 0 && pkg > 0) {
          result.isValid = false;
          result.message = `Actual weight should be greter than 0`;
          fm.actWeight.ctrl.setValue(aWT);
        }
        else if(actWT == totActWT && pkg < totPkg) {
          result.isValid = false;
          result.message = `Actual weight should be less than total weight [${totActWT}] if number of packages are less than total packages`;
          fm.actWeight.ctrl.setValue(aWT);
        }
        break;
    }

    if (!result.isValid) {
      Swal.fire('Warning', result.message, 'warning');
    }
  }

  autoPopulateForm(){
    this.deliveryForm.controls['dKTNO'].setValue(this.shipmentDetails.shipment);
    this.deliveryForm.controls['bookedPkgs'].setValue(this.shipmentDetails?.dockets.pKGS||0);
    this.deliveryForm.controls['arrivedPkgs'].setValue(this.shipmentDetails.dockets?.pEND?.pKGS !== undefined ? this.shipmentDetails.dockets?.pEND?.pKGS : this.shipmentDetails.dockets?.pKGS);
    this.deliveryForm.controls['arrivedWeight'].setValue(this.shipmentDetails.dockets?.pEND?.wT !== undefined ? this.shipmentDetails.dockets?.pEND?.wT : this.shipmentDetails.dockets?.aCTWT);
    this.deliveryForm.controls['bookWeight'].setValue(this.shipmentDetails?.dockets.aCTWT||0);
   
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
