import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { THCAmountsControl } from 'src/assets/FormControls/Finance/VendorPayment/tHCAmountsControls';

@Component({
  selector: 'app-thcamounts-detail',
  templateUrl: './thcamounts-detail.component.html'
})
export class THCAmountsDetailComponent implements OnInit {
  jsonControlArray: any
   tHCDetailsForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<THCAmountsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    const thcAmountsFormControls = new THCAmountsControl('');
    this.jsonControlArray = thcAmountsFormControls.getTHCDetailsControls();
    this. tHCDetailsForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }

  Close(): void {
    this.dialogRef.close();
  }
  
  functionCallHandler($event: any): void {
    const functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log('Failed');
    }
  }

  save(): void {
    this.dialogRef.close(this. tHCDetailsForm.value);
  }
}
