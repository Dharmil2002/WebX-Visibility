import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorPaymentControl } from 'src/assets/FormControls/Finance/VendorPayment/vendorpaymentcontrol';

interface DropdownItem {
  value: string;
  name: string;
}

@Component({
  selector: 'app-thc-payment-filter',
  templateUrl: './thc-payment-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
      padding-top: 5px !important;
    }`
  ]
})
export class ThcPaymentFilterComponent implements OnInit {
  DebitVoucherControl: VendorPaymentControl;
  protected _onDestroy = new Subject<void>();
  THCPaymentFilterForm: UntypedFormGroup;
  jsonControlTHCPaymentFilterArray: any;

  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<ThcPaymentFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
    console.log(this.objResult.DefaultData);
  }

  Close(): void {
    this.dialogRef.close();
  }

  initializeFormControl(): void {
    this.DebitVoucherControl = new VendorPaymentControl(this.objResult.DefaultData);
    this.jsonControlTHCPaymentFilterArray = this.DebitVoucherControl.getTHCPaymentFilterArrayControls();
    this.THCPaymentFilterForm = formGroupBuilder(this.fb, [this.jsonControlTHCPaymentFilterArray]);
    this.getLocationsDropdown();
  }

  async getLocationsDropdown(): Promise<void> {
    const body = {
      companyCode: localStorage.getItem('companyCode'),
      collectionName: 'vendor_detail',
      filter: {},
    };

    let vendordetailList: DropdownItem[];

    const res = await firstValueFrom(this.masterService.masterPost('generic/get', body));

    if (res) {
      vendordetailList = res?.data
        .map((x) => ({ value: x.vendorCode, name: x.vendorName }))
        .filter((x) => x != null)
        .sort((a, b) => a.value.localeCompare(b.value));
    }

    if (this.objResult.DefaultData) {
      const vendorNames = this.objResult?.DefaultData?.vendorList;
      const selectedData = vendordetailList.filter((x) =>
        vendorNames.includes(x.value)
      );
      this.THCPaymentFilterForm.controls['vendorNamesupport'].setValue(selectedData);
    }

    this.filter.Filter(
      this.jsonControlTHCPaymentFilterArray,
      this.THCPaymentFilterForm,
      vendordetailList,
      'vendorName',
      true
    );
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
    this.dialogRef.close(this.THCPaymentFilterForm.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  toggleSelectAll(argData: any): void {
    const fieldName = argData.field.name;
    const autocompleteSupport = argData.field.additionalData.support;
    const isSelectAll = argData.eventArgs;

    const index = this.jsonControlTHCPaymentFilterArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlTHCPaymentFilterArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.THCPaymentFilterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
}
