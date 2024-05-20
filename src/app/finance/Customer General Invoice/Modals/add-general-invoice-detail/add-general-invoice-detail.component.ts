import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GetDocumentsWiseListFromApi } from 'src/app/finance/Vendor Bills/VendorGeneralBill/general-bill-detail/generalbillAPIUtitlity';
import { CustomerGeneralInvoiceControl } from 'src/assets/FormControls/Finance/InvoiceCollection/CustomerGeneralInvoicecontrol';

@Component({
  selector: 'app-add-general-invoice-detail',
  templateUrl: './add-general-invoice-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
    padding-top: 5px !important;
  }`]
})
export class AddGeneralInvoiceDetailComponent implements OnInit {

  CustomerGeneralInvoiceControl: CustomerGeneralInvoiceControl;

  CustomerGeneralInvoiceForm: UntypedFormGroup;
  jsonControlCustomerGeneralInvoiceArray: any;
  DocumentType: any;
  CustomerDetails: any;
  constructor(private filter: FilterUtils,
    private masterService: MasterService,
    private storageService: StorageService,
    private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<AddGeneralInvoiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
    console.log(this.objResult);
    this.CustomerDetails = this.objResult.CustomerDetails;
  }
  Close() {
    this.dialogRef.close()
  }
  initializeFormControl() {
    this.CustomerGeneralInvoiceControl = new CustomerGeneralInvoiceControl(this.objResult.Details);
    this.jsonControlCustomerGeneralInvoiceArray = this.CustomerGeneralInvoiceControl.getCustomerGeneralInvoiceDetailsArrayControls();
    this.CustomerGeneralInvoiceForm = formGroupBuilder(this.fb, [this.jsonControlCustomerGeneralInvoiceArray]);

    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceArray,
      this.CustomerGeneralInvoiceForm,
      this.objResult.LedgerList,
      "Ledger",
      false
    );

    this.filter.Filter(
      this.jsonControlCustomerGeneralInvoiceArray,
      this.CustomerGeneralInvoiceForm,
      this.objResult.Document,
      "Document",
      false
    );
    if (this.objResult.Details) {
      this.CustomerGeneralInvoiceForm.controls.Ledger.setValue(this.objResult.LedgerList.find(x => x.value == this.objResult.Details.LedgerHdn))
      this.CustomerGeneralInvoiceForm.controls.Document.setValue(
        {
          name: this.objResult.Details.Document,
          value: this.objResult.Details.Document
        }
      )
      // Remove Validation when Document is OTR
      if (this.objResult.Details.DocumentType == "OTR") {
        this.CustomerGeneralInvoiceForm.controls.Document.clearValidators();
        this.CustomerGeneralInvoiceForm.controls.Document.updateValueAndValidity();
      }
      this.DocumentType = this.objResult.Details.DocumentType;
    } else {
      // Remove Validation when Document is OTR
      if (this.objResult.DocumentType == "OTR") {
        this.CustomerGeneralInvoiceForm.controls.Document.clearValidators();
        this.CustomerGeneralInvoiceForm.controls.Document.updateValueAndValidity();
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
    const Ledger = this.CustomerGeneralInvoiceForm.value['Ledger'];
    this.CustomerGeneralInvoiceForm.controls.Ledger.patchValue(Ledger.name)
    this.CustomerGeneralInvoiceForm.controls.LedgerHdn.patchValue(Ledger.value)
    this.CustomerGeneralInvoiceForm.controls.SubCategoryName.patchValue(Ledger.mRPNM)
    this.dialogRef.close(this.CustomerGeneralInvoiceForm.value)
  }
  cancel(event) {
    this.dialogRef.close()
  }

  async SetDocumentOptions(event) {
    let fieldName = event.field.name;
    const search = this.CustomerGeneralInvoiceForm.controls[fieldName].value;
    let data = [];
    if (search.length >= 2) {
      switch (this.DocumentType) {
        case "DRS":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'drs_headers', 'dRSNO', search,
            'vND.cD', this.CustomerDetails?.customerCode, 'oPSST', 1)
          break;
        case "THCLTL":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'thc_summary_ltl', 'docNo', search,
            'vND.cD', this.CustomerDetails?.customerCode, 'oPSST', 1)
          break;
        case "THCFTL":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'thc_summary', 'docNo', search,
            'vND.cD', this.CustomerDetails?.customerCode, 'oPSST', 1)
          break;
        case "GCNLTL":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'dockets_ltl', 'dKTNO', search,
            'bPARTY', this.CustomerDetails?.customerCode, 'oRGN', this.storageService.branch)
          break;
        case "GCNFTL":
          data = await GetDocumentsWiseListFromApi(this.masterService, 'dockets', 'dKTNO', search,
            'bPARTY', this.CustomerDetails?.customerCode, 'oRGN', this.storageService.branch)
          break;
        case "OTR":
          break;
      }

      this.filter.Filter(
        this.jsonControlCustomerGeneralInvoiceArray,
        this.CustomerGeneralInvoiceForm,
        data,
        "Document",
        false
      );
    }
  }

}
