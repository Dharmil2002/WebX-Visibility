import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MarkArrivalControl } from 'src/assets/FormControls/MarkArrival';

@Component({
  selector: 'app-mark-arrival',
  templateUrl: './mark-arrival.component.html',
})
export class MarkArrivalComponent implements OnInit {
  MarkArrivalTableForm: UntypedFormGroup;
  MarkArrivalTable: any;
  constructor(public dialogRef: MatDialogRef<any>,
    private http: HttpClient, @Inject(MAT_DIALOG_DATA) public item: any, private fb: UntypedFormBuilder,) {
    this.MarkArrivalTable = item;
  }
  jsonControlArray: any;
  IntializeFormControl() {
    const MarkArrivalFormControls = new MarkArrivalControl();
    this.jsonControlArray = MarkArrivalFormControls.getMarkArrivalsertFormControls();
    this.MarkArrivalTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  ngOnInit(): void {
    this.IntializeFormControl()
    this.MarkArrivalTableForm.controls.Vehicle.setValue(this.MarkArrivalTable.VehicleNo)
    this.MarkArrivalTableForm.controls.ETA.setValue(this.MarkArrivalTable.ETAATA)
    this.MarkArrivalTableForm.controls.Route.setValue(this.MarkArrivalTable.Route)
    this.MarkArrivalTableForm.controls.TripID.setValue(this.MarkArrivalTable.TripID)
  }
  functionCallHandler($event) {
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
  save() {
    console.log(JSON.stringify(this.MarkArrivalTableForm.value));
    const jsonUrl = '../../../assets/data/arrival-dashboard-data.json';

    // Get the existing JSON data from the file
    this.http.get(jsonUrl)
      .subscribe(
        (responseData: any) => {
          // Update the 'data' property with the new data
          responseData.data.push(this.MarkArrivalTableForm.value);
          console.log(responseData);
          this.dialogRef.close();
        },
        error => {
          console.error('Error retrieving existing data:', error);
          // Handle error cases or display error messages
        }
      );
  }

  cancel() {
    window.location.reload()
  }

}
