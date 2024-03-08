import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { THCTrackingControls } from "src/assets/FormControls/ControlTower/THCTrackingControls";

@Component({
  selector: "app-thctracking",
  templateUrl: "./thctracking.component.html",
})
export class THCTrackingComponent implements OnInit {
  VehicleDetailsForm: UntypedFormGroup;
  jsonControlArray: any;
  items: any;
  ThcTrackingControls: THCTrackingControls;
  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<THCTrackingComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {
    this.items = item;
    this.initializeFormControl()
  }

  ngOnInit(): void {}
  initializeFormControl() {
    this.ThcTrackingControls = new THCTrackingControls(this.item);
    this.jsonControlArray = this.ThcTrackingControls.getTHCTrackingControls();
    this.VehicleDetailsForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
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
  close() {
    this.dialogRef.close("");
  }
  submit() {
    this.dialogRef.close(this.VehicleDetailsForm.value);
  }
}
