import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeductionsControl } from 'src/assets/FormControls/Finance/InvoiceCollection/Deductions-control';

@Component({
  selector: 'app-deductions',
  templateUrl: './deductions.component.html',
})
export class DeductionsComponent implements OnInit {

  DeductionsTableForm: UntypedFormGroup;
  DeductionsjsonControlArray: any;
  DeductionsFormControls: DeductionsControl;

  constructor(private fb: UntypedFormBuilder) {
    this.initializeFormControl();
   }

  ngOnInit(): void {
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  initializeFormControl() {
    this.DeductionsFormControls = new DeductionsControl();
    // Get form controls for job Entry form section
    this.DeductionsjsonControlArray = this.DeductionsFormControls.getDeductionsControls();
    // Build the form group using formGroupBuilder function
    this.DeductionsTableForm = formGroupBuilder(this.fb, [this.DeductionsjsonControlArray]);
  }
}
