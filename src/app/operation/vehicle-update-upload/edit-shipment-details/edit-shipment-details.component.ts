import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ManifestService } from 'src/app/Utility/module/operation/mf-service/mf-service';
import { ThcUpdate } from 'src/app/core/models/operations/thc/thc-update';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericTableV2Component } from 'src/app/shared-components/Generic Table V2/generic-table-v2/generic-table-v2.component';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { ShipmentEditControls } from 'src/assets/FormControls/shipment-controls';
import { ThcUpdateControls } from 'src/assets/FormControls/thc-update';
import Swal from 'sweetalert2';
import { VehicleUpdateUploadComponent } from '../vehicle-update-upload.component';
import { de, tr } from 'date-fns/locale';
import { ConvertToNumber } from 'src/app/Utility/commonFunction/common';
import { calculateBalanceAmount } from '../../depart-vehicle/depart-vehicle/depart-common';

@Component({
  selector: 'app-edit-shipment-details',
  templateUrl: './edit-shipment-details.component.html'
})
export class EditShipmentDetailsComponent implements OnInit {
  tableLoad: boolean;
  EditShipmentForm: UntypedFormGroup;
  jsonControlArray: any;
  imageData: any = {};
  @Output() notifyParent: EventEmitter<string> = new EventEmitter();
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  shipmentDetails:any;
  selectedFiles: boolean;
  dataFromThirdDialog: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditShipmentDetailsComponent>,
    public dialog: MatDialog,
    private storage:StorageService,
    private manifestService:ManifestService
  ) {
    debugger;
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
    const shipmentControls = new ShipmentEditControls();
    this.jsonControlArray =shipmentControls.getShipmentFormControls();
    this.EditShipmentForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.EditShipmentForm.controls['suffix'].setValue(this.shipmentDetails.Suffix);
    this.EditShipmentForm.controls['shipment'].setValue(this.shipmentDetails.Shipment);
    this.EditShipmentForm.controls['actualWeight'].setValue(this.shipmentDetails.weight);
    this.EditShipmentForm.controls['ctWeight'].setValue(this.shipmentDetails.cWeight);
    this.EditShipmentForm.controls['noofPkts'].setValue(this.shipmentDetails.Packages);
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
      },  
      chgWeight: {
        name: 'ctWeight',
        ctrl: this.EditShipmentForm.controls['ctWeight'],
        field: 'cWeight'
      }
    }

    function setFieldValues(values) {
      fm.pkgs.ctrl.setValue(values.pkgs);
      fm.actWeight.ctrl.setValue(values.actWeight);
      fm.chgWeight.ctrl.setValue(values.chgWeight);
    }
  
    function proportionalWeightCalculation(pkg, total, totalWeight) {
      return ConvertToNumber(pkg * (totalWeight / total), 2);
    }
  

    const pkg = parseInt(fm.pkgs.ctrl.value);
    const actWT = parseFloat(fm.actWeight.ctrl.value);
    const chgWT = parseFloat(fm.chgWeight.ctrl.value);
    const totPkg = this.shipmentDetails[fm.pkgs.field] || 0;
    const totActWT = this.shipmentDetails[fm.actWeight.field] || 0;
    const totChgWT = this.shipmentDetails[fm.chgWeight.field] || 0;

    let result = { isValid: true, message: ''};
    switch(event.field.name) {
      case fm.pkgs.name: 
        if(pkg > totPkg) {
          result.isValid = false;
          result.message = `Number of packages should be less than or equal to ${totPkg}`;
          setFieldValues({ pkgs: totPkg, actWeight: totActWT, chgWeight: totChgWT });          
        }
        else if( pkg < totPkg ) {        
          const aWT = proportionalWeightCalculation(pkg, totPkg, totActWT);
          const cWT = proportionalWeightCalculation(pkg, totPkg, totChgWT);
          setFieldValues({ pkgs: pkg, actWeight: aWT, chgWeight: cWT });     
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
      case fm.chgWeight.name: 
      const cWT = proportionalWeightCalculation(pkg, totPkg, totChgWT);
        if(chgWT > totChgWT) {
          result.isValid = false;
          result.message = `Charge weight should be less than or equal to ${totChgWT}`;
          fm.chgWeight.ctrl.setValue(totChgWT);
        }
        else if(chgWT == 0 && pkg > 0) {
          result.isValid = false;
          result.message = `Charge weight should be greter than 0`;
          fm.chgWeight.ctrl.setValue(cWT);
        }
        else if(chgWT == totChgWT && pkg < totPkg) {
          result.isValid = false;
          result.message = `Charge weight should be less than total weight [${totChgWT}] if number of packages are less than total packages`;          
          fm.chgWeight.ctrl.setValue(cWT);
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
