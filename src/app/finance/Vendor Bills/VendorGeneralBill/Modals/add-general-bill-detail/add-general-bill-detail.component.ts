import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorGeneralBillControl } from 'src/assets/FormControls/Finance/VendorPayment/VendorGeneralBillcontrol';
import { GetDocumentsWiseListFromApi } from '../../general-bill-detail/generalbillAPIUtitlity';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-add-general-bill-detail',
  templateUrl: './add-general-bill-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class AddGeneralBillDetailComponent implements OnInit {
  VendorBillControl: VendorGeneralBillControl;

  VendorBillDetailsForm: UntypedFormGroup;
  jsonControlVendorBillDetailsArray: any;
  DocumentType: any;
  constructor(private filter: FilterUtils,
    private masterService: MasterService,
    private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<AddGeneralBillDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
    console.log(this.objResult);
  }
  Close() {
    this.dialogRef.close()
  }
  initializeFormControl() {
    this.VendorBillControl = new VendorGeneralBillControl(this.objResult.Details);
    this.jsonControlVendorBillDetailsArray = this.VendorBillControl.getVendorBillDetailsArrayControls();
    this.VendorBillDetailsForm = formGroupBuilder(this.fb, [this.jsonControlVendorBillDetailsArray]);

    this.filter.Filter(
      this.jsonControlVendorBillDetailsArray,
      this.VendorBillDetailsForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    this.filter.Filter(
      this.jsonControlVendorBillDetailsArray,
      this.VendorBillDetailsForm,
      this.objResult.SACCode,
      "SACCode",
      false
    );
    this.filter.Filter(
      this.jsonControlVendorBillDetailsArray,
      this.VendorBillDetailsForm,
      this.objResult.Document,
      "Document",
      false
    );
    if (this.objResult.Details) {
      this.VendorBillDetailsForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.LedgerHdn))
      this.VendorBillDetailsForm.controls.SACCode.setValue(this.objResult.SACCode.find(x => x.value == this.objResult.Details.SACCodeHdn))
      this.VendorBillDetailsForm.controls.Document.setValue(
        {
          name: this.objResult.Details.Document,
          value: this.objResult.Details.Document
        }
      )
      // Remove Validation when Document is OTR
      if (this.objResult.Details.DocumentType == "OTR") {
        this.VendorBillDetailsForm.controls.Document.clearValidators();
        this.VendorBillDetailsForm.controls.Document.updateValueAndValidity();
      }
      this.DocumentType = this.objResult.Details.DocumentType;
    } else {
      // Remove Validation when Document is OTR
      if (this.objResult.DocumentType == "OTR") {
        this.VendorBillDetailsForm.controls.Document.clearValidators();
        this.VendorBillDetailsForm.controls.Document.updateValueAndValidity();
      }
      this.DocumentType = this.objResult.DocumentType;
    }

  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  save(event) {
    const Ledger = this.VendorBillDetailsForm.value['Ledger'];
    const SACCode = this.VendorBillDetailsForm.value['SACCode'];
    this.VendorBillDetailsForm.controls.Ledger.patchValue(Ledger.name)
    this.VendorBillDetailsForm.controls.SACCode.patchValue(SACCode.name)
    this.VendorBillDetailsForm.controls.LedgerHdn.patchValue(Ledger.value)
    this.VendorBillDetailsForm.controls.SACCodeHdn.patchValue(SACCode.value)
    this.VendorBillDetailsForm.controls.SubCategoryName.patchValue(Ledger.mRPNM)
    this.dialogRef.close(this.VendorBillDetailsForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }
  SACCodeFieldChanged(event) {
    this.VendorBillDetailsForm.controls.GSTRate.patchValue(event?.eventArgs?.option?.value?.GSTRT)
    this.calculateGSTAndTotal('');
  }
  calculateGSTAndTotal(event) {
    const Amount = Number(this.VendorBillDetailsForm.value['Amount']);
    const GSTRate = Number(this.VendorBillDetailsForm.value['GSTRate']);

    if (!isNaN(Amount) && !isNaN(GSTRate)) {
      const GSTAmount = (Amount * GSTRate) / 100;
      const Total = GSTAmount + Amount;

      this.VendorBillDetailsForm.controls.GSTAmount.setValue(GSTAmount.toFixed(2));
      this.VendorBillDetailsForm.controls.Total.setValue(Total.toFixed(2));
    } else {
      console.error('Invalid input values for Amount or GSTRate');
    }
  }
  async SetDocumentOptions(event) {
    let fieldName = event.field.name;
    const search = this.VendorBillDetailsForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      switch (this.DocumentType) {
        case "DRS":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'dockets', 'dKTNO', search, 'bPARTYNM', this.objResult?.PartName, 'oRGN', this.objResult?.Origin)
          break;
        case "THC":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'thc_summary', 'docNo', search)
          break;
        case "TS":
          break;
        case "OTR":
          break;
      }

      this.filter.Filter(
        this.jsonControlVendorBillDetailsArray,
        this.VendorBillDetailsForm,
        data,
        "Document",
        false
      );
    }
  }

}
