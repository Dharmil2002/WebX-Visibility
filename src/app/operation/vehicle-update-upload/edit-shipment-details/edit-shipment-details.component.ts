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
    this.EditShipmentForm.controls['shipment'].setValue(this.shipmentDetails.Shipment);
    this.EditShipmentForm.controls['actualWeight'].setValue(this.shipmentDetails.weight);
    this.EditShipmentForm.controls['ctWeight'].setValue(this.shipmentDetails.cWeight);
    this.EditShipmentForm.controls['noofPkts'].setValue(this.shipmentDetails.Packages);
  }
  cancel() {
    this.dialogRef.close()
  }
  getValidate(event) {
    const name = event.field.name;
    const formControl = this.EditShipmentForm.controls[name];
    let maxValue;
    let message;
    if (name === 'actualWeight' || name === 'ctWeight' || name === 'noofPkts') {
      switch (name) {
        case 'actualWeight':
          maxValue = parseFloat(this.shipmentDetails.weight);
          message = `Actual Weight should be less than or equal to ${maxValue}`;
          break;
        case 'ctWeight':
          maxValue = parseFloat(this.shipmentDetails.cWeight);
          message = `Charge Weight should be less than or equal to ${maxValue}`;
          break;
        case 'noofPkts':
          maxValue = parseFloat(this.shipmentDetails.Packages);
          message = `Number of packages should be less than or equal to ${maxValue}`;
          break;
      }

      const value = parseFloat(formControl.value);
      if (isNaN(value) || value > maxValue) {
        Swal.fire('Warning', message, 'warning');
        formControl.setValue(this.shipmentDetails.pkg);
      }
    }
  }

  async save() {
    debugger
    //this.notifyParent.emit((this.EditShipmentForm.value);
   this.dialogRef.close(this.EditShipmentForm.value)
  }
}
