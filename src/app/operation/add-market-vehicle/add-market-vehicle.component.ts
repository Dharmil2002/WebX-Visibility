import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { marketVehicleControls } from 'src/assets/FormControls/market-vehicle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-market-vehicle',
  templateUrl: './add-market-vehicle.component.html'
})
export class AddMarketVehicleComponent implements OnInit {

  jsonControlVehicleArray: any;
  marketVehicleTableForm: UntypedFormGroup;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  breadScrums = [
    {
      title: "Add Vehicle details",
      items: ["Home"],
      active: "Vehicle Status",
    },
  ];
  prqDetail: any;

  constructor
  (
    public dialogRef: MatDialogRef<GenericTableComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder) { 
      if(item){
        this.prqDetail=item
      }

    this.initializeFormControl()
  }

  ngOnInit(): void {
    this.marketVehicleTableForm.controls['vehicleSize']?.setValue(this.prqDetail?.vehicleSize||this.prqDetail?.containerSize||"")
  }

  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    // Create vehicleFormControls instance to get form controls for different sections
    const  maketVehicleControl = new marketVehicleControls();
    this.jsonControlVehicleArray = maketVehicleControl.getFormControls();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.marketVehicleTableForm = formGroupBuilder(this.fb, [this.jsonControlVehicleArray]);
  }
  save() {
    Swal.fire({
      icon: "success",
      title: "Add Market Vehicle Successfully", // Update the title here
      showConfirmButton: true,
    });
    
    this.dialogRef.close(this.marketVehicleTableForm.value)

  }
  checkVehicleSize(){
    const vehicleSize=parseInt(this.prqDetail?.vehicleSize||0);
    const resultVehicleSize=parseInt(this.marketVehicleTableForm.controls['vehicleSize']?.value||0)
    // Assuming result.vehicleSize and this.NavData.vehicleSize are both defined
    if (resultVehicleSize!=vehicleSize) {
      // Show a SweetAlert dialog
      Swal.fire({
        icon: 'warning',
        title: 'Alert',
        text: 'Markert vehicle size is not same as Prq vehicle size!',
        confirmButtonText: 'OK'
      })
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
