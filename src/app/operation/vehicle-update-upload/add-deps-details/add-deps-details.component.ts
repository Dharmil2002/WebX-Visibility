import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { ImageHandling } from 'src/app/Utility/Form Utilities/imageHandling';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ImagePreviewComponent } from 'src/app/shared-components/image-preview/image-preview.component';
import { DepsControls } from 'src/assets/FormControls/deps-controls';
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { DocketService } from 'src/app/Utility/module/operation/docket/docket.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { debug } from 'console';

@Component({
  selector: 'app-add-deps-details',
  templateUrl: './add-deps-details.component.html'
})
export class AddDepsDetailsComponent implements OnInit {
  shipmentDetails:any="";
  jsonControlArray:any;
  depsFormGroup:UntypedFormGroup;
  jsonControlAllArray: FormControls[];
  imageData: any = {};
  DocCalledAs: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private controlPanel: ControlPanelService,
    public dialogRef: MatDialogRef<AddDepsDetailsComponent>,
    public dialog: MatDialog,
    private storage:StorageService,
    private filter:FilterUtils,
    public generalService:GeneralService,
    public docketService:DocketService,
    private objImageHandling: ImageHandling
  ) {
    this.DocCalledAs = controlPanel.DocCalledAs;
    this.shipmentDetails = item;
  }

  functionCaller($event) {
    debugger
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
    const depsControls = new DepsControls(this.DocCalledAs);
    this.jsonControlAllArray =depsControls.getDepsControls();
    this.jsonControlArray=this.jsonControlAllArray.filter((x)=>x.additionalData?.require)
    this.depsFormGroup = formGroupBuilder(this.fb, [this.jsonControlAllArray]);
  }  
  cancel() {
    this.dialogRef.close()
  }
  async getDocketDetails(){
    const resDockets=await this.docketService.getOneDocketLtl({cID:this.storage.companyCode,dKTNO:this.depsFormGroup.controls['docketNumber'].value})
     if(resDockets){
      this.depsFormGroup.controls['docketNumber'].setValue(resDockets[0].dKTNO);
      this.depsFormGroup.controls['docketDate'].setValue(moment(resDockets[0].dKTDT).tz(this.storage.timeZone).format("DD MMM YYYY hh:mm A"));
      this.depsFormGroup.controls['paytyp'].setValue(resDockets[0].pAYTYPNM);
      this.depsFormGroup.controls['billingParty'].setValue(resDockets[0].bPARTYNM);
      this.depsFormGroup.controls['oRGN'].setValue(resDockets[0].oRGN);
      this.depsFormGroup.controls['dEST'].setValue(resDockets[0].dEST);
      this.depsFormGroup.controls['aCTWT'].setValue(resDockets[0].aCTWT);
      this.depsFormGroup.controls['cHRWT'].setValue(resDockets[0].cHRWT);
      this.depsFormGroup.controls['bookingPkgs'].setValue(resDockets[0].pKGS);
      this.depsFormGroup.controls['suffix'].setValue(resDockets[0].sFX);
     }
  }
  onExtraPkgs(){
    const extraPkgs = parseInt(this.depsFormGroup.controls['extraPkgs']?.value || 0);
    const bookedPkgs = parseInt(this.depsFormGroup.controls['bookingPkgs']?.value || 0);
    if(extraPkgs > bookedPkgs){
       // Display a Swal message if extra packages are greater than booked packages
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Extra packages cannot be greater than booked packages!',
      });
       this.depsFormGroup.controls['extraPkgs'].setValue(0);
       return ;
    }
 }
 
  save(){

  }
}