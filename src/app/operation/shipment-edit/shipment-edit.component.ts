import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ShipmentEditControls } from 'src/assets/FormControls/shipment-controls';
import Swal from 'sweetalert2';

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
    this.shipmentTableForm.controls['shipment'].setValue(this.shipmentDetail?.docNo||"");
    this.shipmentTableForm.controls['noofPkts'].setValue(this.shipmentDetail?.pKGS||0);
    this.shipmentTableForm.controls['actualWeight'].setValue(this.shipmentDetail?.aCTWT||0);
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
  /*Validation on Shipments*/
  getValidate() {
    const { aCTWT = 0, pKGS = 0 } = this.shipmentDetail || {};
    const fWeight = parseInt(this.shipmentTableForm.controls['actualWeight']?.value || 0);
    const fNoofPkts = parseInt(this.shipmentTableForm.controls['noofPkts']?.value || 0);
  
    const handleExceededLimit = (condition, title, message, control) => {
      if (condition) {
        Swal.fire({
          icon: 'error',
          title: title,
          text: message
        });
        control?.setValue(0);
      }
    };
    handleExceededLimit(fWeight > aCTWT, 'Weight Limit Exceeded', 'Weight exceeds docket limit. Please adjust.', this.shipmentTableForm.controls['actualWeight']);
    handleExceededLimit(fNoofPkts > pKGS, 'Package Exceeded', 'The package exceeds the specified limit. Please adjust accordingly.', this.shipmentTableForm.controls['noofPkts']);
  }
  
  /*End*/
  async save(){
    // await showConfirmationDialogThc(this.thcTableForm.value,this._operationService);
     this.dialogRef.close(this.shipmentTableForm.value)
   }
  
}
