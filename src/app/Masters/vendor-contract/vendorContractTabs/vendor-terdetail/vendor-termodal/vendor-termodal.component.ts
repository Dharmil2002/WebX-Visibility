import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TERCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';

@Component({
  selector: 'app-vendor-termodal',
  templateUrl: './vendor-termodal.component.html' 
})
export class VendorTERModalComponent implements OnInit {
  companyCode: any;
  jsonControlArray: any;
  ContractTERControls: TERCharges;
  data: any;
  TERForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,
    // public ObjcontractMethods: locationEntitySearch,
    private masterService: MasterService,
    private filter: FilterUtils,
    //private changeDetectorRef: ChangeDetectorRef,
    private sessionService: SessionService,
    public dialogRef: MatDialogRef<VendorTERModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode()}

  ngOnInit(): void {
    this.initializeFormControl()
  }
  initializeFormControl() {

    this.ContractTERControls = new TERCharges(this.data);
    this.jsonControlArray = this.ContractTERControls.getStandardChargesArrayControls( );
    this.TERForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    console.log(this.jsonControlArray);
    


  }
  Close() {
    this.dialogRef.close()
  }
  //#region to send data to parent component using dialogRef
  save(event) {
     
    const data = this.TERForm.value;
    ;
    // console.log(data);
    this.dialogRef.close(data)
  }
  //#endregion
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
