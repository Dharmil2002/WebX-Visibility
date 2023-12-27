import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { parseFloatWithFallback } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { DeducationControl } from 'src/assets/FormControls/billing-invoice/deducation-controls';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-deduction-charges',
  templateUrl: './deduction-charges.component.html'
})
export class DeductionChargesComponent implements OnInit {
  deducationTableForm: UntypedFormGroup;
  chargesTableForm: UntypedFormGroup;
  jsonControlArray: FormControls[];
  invoices: InvoiceModel[] = [];
  shipmentDetails: any;
  isChagesValid: boolean = false;
  className = "col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-2";
  constructor(
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private invoiceService: InvoiceServiceService
  ) {
    this.shipmentDetails = this.data;
    this.IntializeFormControl();
  }
  IntializeFormControl() {
    const loadingControlForm = new DeducationControl();
    this.jsonControlArray = loadingControlForm.getShipmentControls();
    this.invoices=loadingControlForm.getTdsControls();
    this.deducationTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.chargesTableForm = formGroupBuilder(this.fb, [this.invoices]);
    this.autoFillCustDetail();
  //  this.getProductionCharges();
  }
  async getProductionCharges() {
    const result = await this.invoiceService.getCharges("Road");
    if (result && result.length > 0) {
      this.invoices = result.map((element) => {
        if (element) {
          return new InvoiceModel({
            name: element.SelectCharges || '',
            label: `${element.SelectCharges}(${element.Add_Deduct})` || '',
            placeholder: element.Add_Deduct || '',
            type: 'text', // Set your default type here
            value:0, // Set your default value here
            filterOptions: '', // Set your default filterOptions here
            displaywith: '', // Set your default displaywith here
            generatecontrol: true,
            disable: true,
            Validations: [], // Set your default validations here
            additionalData: {
              showNameAndValue: false,
              metaData: ''
            },
            functions: {}
          });
        }
      }).filter(Boolean);
    }
  }

  ngOnInit(): void {
  }
  // Implement this method
  cancel(): void {
    this.dialogRef.close();
  }
  updateCharges() {

  }
  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
    }
  }
  autoFillCustDetail() {
    const custDetail = this.shipmentDetails;
    if (custDetail) {
      const { cD, nM } = custDetail.cUST ?? {};
      this.deducationTableForm.patchValue({
        customer: `${cD ?? ''}-${nM ?? ''}`,
        billNO: custDetail.bILLNO ?? '',
        amt: custDetail.aMT ?? 0,
        pendingAmt: custDetail.aMT ?? 0,
      });
    }
    this.chargesTableForm.controls['tds'].setValue((parseFloat(custDetail.aMT)*5/100).toFixed(2));
  }
  calucatedCharges() {
    
    const chargeFormGroup = this.chargesTableForm.controls;
    const tds = parseFloatWithFallback(chargeFormGroup['tds'].value);
    const ftDist = parseFloatWithFallback(chargeFormGroup['ftDist'].value);
    const otherDeduction = parseFloatWithFallback(chargeFormGroup['otherDeduction'].value);
    const claimsDeduction = parseFloatWithFallback(chargeFormGroup['claimsDeduction'].value, 0);
    const additionalCharges = parseFloatWithFallback(chargeFormGroup['additionalCharges'].value);
    const netDeduction = -tds - ftDist - otherDeduction - claimsDeduction + additionalCharges;
    chargeFormGroup.netDeduction.setValue(Math.abs(netDeduction).toFixed(2));
    
    const billingAmount = parseFloat(this.deducationTableForm.controls['amt'].value);
    if ( chargeFormGroup.netDeduction.value> billingAmount) {
      Swal.fire({
        icon: 'warning',
        title: 'Deduction Error',
        text: 'You cannot deduct more than the billing amount.',
      });
    }
  }
  save(){
    
    this.dialogRef.close({...this.chargesTableForm.value,...this.deducationTableForm.value});
  }
}
