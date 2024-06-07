import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ShipmentEditControls } from 'src/assets/FormControls/shipment-controls';
import Swal from 'sweetalert2';
import { EditShipmentDetailsComponent } from '../../vehicle-update-upload/edit-shipment-details/edit-shipment-details.component';
import { ShipmentRunSheetControls } from 'src/assets/FormControls/runsheet-edit-shipment';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';

@Component({
  selector: 'app-edit-runsheet-shipments',
  templateUrl: './edit-runsheet-shipments.component.html',

})
export class EditRunsheetShipmentsComponent implements OnInit {
  shipmentDetails:any;
  EditShipmentForm: UntypedFormGroup;
  jsonControlArray: FormControls[];
  constructor(@Inject(MAT_DIALOG_DATA) public item: any,
  private fb: UntypedFormBuilder,
  public dialogRef: MatDialogRef<EditShipmentDetailsComponent>,
  public dialog: MatDialog,) {
    debugger
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
    const shipmentControls = new ShipmentRunSheetControls();
    this.jsonControlArray =shipmentControls.getShipmentFormControls();
    this.EditShipmentForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.EditShipmentForm.controls['actualWeight'].setValue(this.shipmentDetails.wT);
    this.EditShipmentForm.controls['noofPkts'].setValue(this.shipmentDetails.pKGS);
  }
  cancel() {
    this.dialogRef.close()
  }
  getValidate(event) {      
    const fm = {
      pkgs: {
        name: 'noofPkts',
        ctrl: this.EditShipmentForm.controls['noofPkts'] ,
        field: 'Packages'
      },
      actWeight: {
        name: 'actualWeight',
        ctrl: this.EditShipmentForm.controls['actualWeight'],
        field: 'weight'
      }
    }

    function setFieldValues(values) {
      fm.pkgs.ctrl.setValue(values.pkgs);
      fm.actWeight.ctrl.setValue(values.actWeight);
    }
  
    function proportionalWeightCalculation(pkg, total, totalWeight) {
      return ConvertToNumber(pkg * (totalWeight / total), 2);
    }
  

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
        else if( pkg == 0) {
          setFieldValues({ pkgs: 0, actWeight: 0, chgWeight: 0 });
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

   save() {
    //this.notifyParent.emit((this.EditShipmentForm.value);
   this.dialogRef.close(this.EditShipmentForm.value)
  }
}
