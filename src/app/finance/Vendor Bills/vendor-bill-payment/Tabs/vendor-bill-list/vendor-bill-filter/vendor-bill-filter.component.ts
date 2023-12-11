import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, take, takeUntil } from 'rxjs';
import { getVendorDetails } from 'src/app/Masters/vendor-master/vendor-utility';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { vendorBillFilterControl } from 'src/assets/FormControls/Finance/Vendor Bill Payment/vendorBillFilter';
import { billType, status } from '../../../VendorStaticData';

@Component({
  selector: 'app-vendor-bill-filter',
  templateUrl: './vendor-bill-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
      padding-top: 5px !important;
    }`
  ]
})
export class VendorBillFilterComponent implements OnInit {
  vendorBillFilterControl: vendorBillFilterControl;
  jsonControlArray: any;
  VendorBillFilterForm: UntypedFormGroup
  protected _onDestroy = new Subject<void>()
  companyCode = localStorage.getItem('companyCode')
  submit = "Filter"
  constructor(private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<VendorBillFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
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
  initializeFormControl(): void {
    this.vendorBillFilterControl = new vendorBillFilterControl(this.objResult.DefaultData);
    this.jsonControlArray = this.vendorBillFilterControl.getVendorBillFilterArrayControls();
    this.VendorBillFilterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getVendorList();
  }
  async getVendorList(): Promise<void> {

    const vendordetailList = await getVendorDetails(this.masterService);

    const billTypeList = billType
    const statusList = status

    if (this.objResult.DefaultData) {
      const vendorNames = this.objResult?.DefaultData?.vendorNames;
      const selectedData = vendordetailList.filter((x) =>
        vendorNames.includes(x.name)
      );
      this.VendorBillFilterForm.controls['vendorNamesupport'].setValue(selectedData);

      const status = this.objResult?.DefaultData?.StatusNames;
      const selectedStatusData = statusList.filter((x) =>
        status.includes(x.name)
      );
      this.VendorBillFilterForm.controls['statussupport'].setValue(selectedStatusData);

      // const billtype = this.objResult?.DefaultData?.billtypeList;
      // const selectedbilltypeData = billTypeList.filter((x) =>
      //   billtype.includes(x.value)
      // );
      // this.VendorBillFilterForm.controls['billTypesupport'].setValue(selectedbilltypeData);
    }

    this.filter.Filter(
      this.jsonControlArray,
      this.VendorBillFilterForm,
      vendordetailList,
      'vendorName',
      true
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.VendorBillFilterForm,
      billTypeList,
      'billType',
      false
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.VendorBillFilterForm,
      statusList,
      'status',
      false
    );
  }
  save(): void {
    this.dialogRef.close(this.VendorBillFilterForm.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
  toggleSelectAll(argData: any): void {
    const fieldName = argData.field.name;
    const autocompleteSupport = argData.field.additionalData.support;
    const isSelectAll = argData.eventArgs;

    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.VendorBillFilterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
}
