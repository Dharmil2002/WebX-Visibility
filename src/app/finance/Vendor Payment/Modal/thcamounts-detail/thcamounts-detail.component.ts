import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { THCAmountsControl } from 'src/assets/FormControls/Finance/VendorPayment/tHCAmountsControls';

@Component({
  selector: 'app-thcamounts-detail',
  templateUrl: './thcamounts-detail.component.html'
})
export class THCAmountsDetailComponent implements OnInit {

  THCAmountsLESSArray: any
  THCAmountsLESSForm: UntypedFormGroup;

  THCAmountsADDArray: any
  THCAmountsADDForm: UntypedFormGroup;

  THCAmountsArray: any
  THCAmountsForm: UntypedFormGroup;
  PaymentData;
  THCData;
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<THCAmountsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any) { }

  ngOnInit(): void {
    this.PaymentData = this.objResult?.PaymentData;
    this.THCData = this.objResult?.THCData;
    console.log(this.THCData)
    this.initializeFormControl();
  }
  initializeFormControl() {
    const thcAmountsFormControls = new THCAmountsControl('');
    this.THCAmountsADDArray = thcAmountsFormControls.getTHCAmountsADDControls();
    this.THCAmountsADDForm = formGroupBuilder(this.fb, [this.THCAmountsADDArray]);

    this.THCAmountsLESSArray = thcAmountsFormControls.getTHCAmountsLESSControls();
    this.THCAmountsLESSForm = formGroupBuilder(this.fb, [this.THCAmountsLESSArray]);

    this.THCAmountsArray = thcAmountsFormControls.getTHCAmountsControls();
    this.THCAmountsForm = formGroupBuilder(this.fb, [this.THCAmountsArray]);

    this.THCAmountsForm.get("Balancelocation").setValue(this.THCData?.OthersData?.balAmtAt);
    this.THCAmountsForm.get("AdvanceLocation").setValue(this.THCData?.OthersData?.advPdAt);
    this.OnChangePlusAmounts("")
  }
  OnChangePlusAmounts(event) {

    this.THCAmountsADDForm.get("ContractAmount").setValue(this.THCData?.THCamount);

    let THCTotal = 0;
    this.THCAmountsADDArray.forEach(item => {
      if (item.name != "THCTotal") {
        const value = parseFloat(this.THCAmountsADDForm.get(item.name).value);
        THCTotal += isNaN(value) ? 0 : value;
      }
    });
    this.THCAmountsADDForm.get("THCTotal").setValue(THCTotal);
    this.THCAmountsForm.get("Advance").setValue(this.THCData?.Advance);
    this.THCAmountsForm.get("Balance").setValue(THCTotal - this.THCData?.Advance);
  }
  OnChangeAdvanceAmount(event) {
    let THCTotal = 0;
    this.THCAmountsADDArray.forEach(item => {
      if (item.name != "THCTotal") {
        const value = parseFloat(this.THCAmountsADDForm.get(item.name).value);
        THCTotal += isNaN(value) ? 0 : value;
      }
    });
    this.THCAmountsForm.get("Balance").setValue(THCTotal - this.THCData?.Advance);
  }
  OnChangeBalanceAmount(event) {
    // this.THCAmountsForm.get("Balance").setValue(THCTotal - this.THCData?.Advance);
  }

  Close(): void {
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close()
  }

  functionCallHandler($event: any): void {
    const functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log('Failed');
    }
  }

}