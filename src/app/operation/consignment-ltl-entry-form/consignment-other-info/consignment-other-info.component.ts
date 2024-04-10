import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { ConsignmentLtl } from 'src/assets/FormControls/consgiment-ltl-controls';

@Component({
  selector: 'app-consignment-other-info',
  templateUrl: './consignment-other-info.component.html'
})
export class ConsignmentOtherInfoComponent implements OnInit {
  otherInfoForm: UntypedFormGroup;
  otherControls:FormControls[];
  otherChargeData: any;
  imageData: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private generalService: GeneralService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    private objImageHandling: ImageHandling
    ) { 
     if(item){
      this.otherChargeData=item
     }      
    }

  ngOnInit(): void {
    this.initializeFormControls()
  }
  /*below function is for initalize formcontrols from Json*/
  initializeFormControls(){
    const controls = new ConsignmentLtl(this.generalService);
    this.otherControls = controls.getOtherDetails()
    this.otherInfoForm = formGroupBuilder(this.fb, [this.otherControls]);
    this.autofillData();
  }
  /*End*/
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call

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
  
  save(){
    let doc
    if(this.imageData?.invoiceAttech){
      doc=this.imageData.invoiceAttech;
    }
    else{
      doc=this.otherInfoForm.controls['invoiceAttech'].value;
    }
    const req={
      "cSTRFNO":this.otherInfoForm.value.cust_ref_no,
      "cOD":this.otherInfoForm.value.cod,
      "oRDNO":this.otherInfoForm.value.orderNo,
      "dOD":this.otherInfoForm.value.dod,
      "iNVATT":this.imageData?.invoiceAttech||"",
      "pOLNO":this.otherInfoForm.value.policyNo,
      "sPPNT":this.otherInfoForm.value.supplyPlant,
      "pLCDT":this.otherInfoForm.value.policyDate,
      "lOCAL":this.otherInfoForm.value.local,
      "iNSCMP":this.otherInfoForm.value.invoiceCompany,
      "BUSASS":this.otherInfoForm.value.busAssociate,
      "rEMK":this.otherInfoForm.value.remarks
  }
  
    this.dialogRef.close(req);
  }
  autofillData(){
    if(this.otherChargeData){
    this.otherInfoForm.controls['cust_ref_no'].setValue(this.otherChargeData?.cSTRFNO||"");
    this.otherInfoForm.controls['cod'].setValue(this.otherChargeData?.cOD||false);
    this.otherInfoForm.controls['orderNo'].setValue(this.otherChargeData?.oRDNO||"");
    this.otherInfoForm.controls['dod'].setValue(this.otherChargeData?.dOD||false);
    this.otherInfoForm.controls['policyNo'].setValue(this.otherChargeData?.pOLNO||"");
    this.otherInfoForm.controls['supplyPlant'].setValue(this.otherChargeData?.sPPNT||"");
    this.otherInfoForm.controls['policyDate'].setValue(this.otherChargeData?.pLCDT||"");
    this.otherInfoForm.controls['local'].setValue(this.otherChargeData?.lOCAL||false);
    this.otherInfoForm.controls['invoiceCompany'].setValue(this.otherChargeData?.iNSCMP||"");
    this.otherInfoForm.controls['busAssociate'].setValue(this.otherChargeData?.BUSASS||"");
    this.otherInfoForm.controls['remarks'].setValue(this.otherChargeData?.rEMK||'');
    this.otherInfoForm.controls['invoiceAttech'].setValue(this.otherChargeData?.iNVATT||0);
    }
  }
  async getFileInvoice(data) {
    this.imageData = await this.objImageHandling.uploadFile(data.eventArgs, "invoiceAttech", this.
    otherInfoForm, this.imageData, "Docket", 'Operations', this.otherControls, ["jpeg", "png", "jpg", "pdf"]);
  }
  openImageDialog(control) {
    let file = this.objImageHandling.getFileByKey(control.imageName, this.imageData);
    this.dialog.open(ImagePreviewComponent, {
      data: { imageUrl: file },
      width: '30%',
      height: '50%',
    });
  }
  cancel(){
    this.dialogRef.close(null)
  }
}
