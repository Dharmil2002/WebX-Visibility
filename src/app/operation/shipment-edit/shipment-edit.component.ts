import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ShipmentEditControls } from 'src/assets/FormControls/shipment-controls';

@Component({
  selector: 'app-shipment-edit',
  templateUrl: './shipment-edit.component.html'
})
export class ShipmentEditComponent implements OnInit {
 //here the declare the flag
 tableLoad: boolean;
 shipmentTableForm: UntypedFormGroup;
 jsonControlArray: any;
  shipmentDetail: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog
  ) { 
    this.shipmentDetail = item;
  }

  ngOnInit(): void {
    this.IntializeFormControl();
  }
  IntializeFormControl() {
      
    const shipMentEditFormControls = new ShipmentEditControls();
    this.jsonControlArray = shipMentEditFormControls.getShipmentFormControls();
    this.shipmentTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.shipmentTableForm.controls['shipment'].setValue(this.shipmentDetail?.docketNumber||"");
    this.shipmentTableForm.controls['noofPkts'].setValue(this.shipmentDetail?.noOfPkg||0);
    this.shipmentTableForm.controls['actualWeight'].setValue(this.shipmentDetail?.totWeight||0);
  } 
  

  cancel() {
    this.dialogRef.close()
  }
  
  functionCaller($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
    }
  }
  async save(){
    // await showConfirmationDialogThc(this.thcTableForm.value,this._operationService);
     this.dialogRef.close(this.shipmentTableForm.value)
   }
  
}
