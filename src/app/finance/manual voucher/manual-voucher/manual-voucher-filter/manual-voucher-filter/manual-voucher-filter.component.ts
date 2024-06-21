import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { voucherFilterControl } from 'src/assets/FormControls/Finance/VoucherEntry/VoucherFilter';
import { manualvoucharDetail } from '../../manual-voucher-utility';

@Component({
  selector: 'app-manual-voucher-filter',
  templateUrl: './manual-voucher-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
      padding-top: 5px !important;
    }`
  ]
})
export class ManualVoucherFilterComponent implements OnInit {
  voucherFilterControl: voucherFilterControl;
  jsonControlArray: any;
  VoucherFilterForm: UntypedFormGroup
  protected _onDestroy = new Subject<void>()
  companyCode = 0;
  submit = "Filter"
  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<voucherFilterControl>,
    @Inject(MAT_DIALOG_DATA) public objResult: any) { 
      this.companyCode = this.storageService.companyCode;
    }

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
    this.voucherFilterControl = new voucherFilterControl(this.objResult.DefaultData);
    this.jsonControlArray = this.voucherFilterControl.getVoucherFilterArrayControls();
    this.VoucherFilterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getVoucherList();
  }
  async getVoucherList(): Promise<void> {
  debugger
    const voucherdetailList = await manualvoucharDetail(this.masterService);

    if (this.objResult.DefaultData) {
      const voucherNo = this.objResult?.DefaultData?.docNo;
      const selectedData = voucherdetailList.filter((x) =>
        voucherNo.includes(x.name)
      );
      this.VoucherFilterForm.controls['VoucherNo'].setValue(selectedData);

      // const status = this.objResult?.DefaultData?.StatusNames;
      // const selectedStatusData = statusList.filter((x) =>
      //   status.includes(x.name)
      // );
      // this.VoucherFilterForm.controls['statussupport'].setValue(selectedStatusData);

    }
    this.filter.Filter(
      this.jsonControlArray,
      this.VoucherFilterForm,
      voucherdetailList,
      'VoucherNo',
      true
    );
    this.filter.Filter(
      this.jsonControlArray,
      this.VoucherFilterForm,
      voucherdetailList,
      'VoucherType',
      true
    );
  }
  save(): void {
    this.dialogRef.close(this.VoucherFilterForm.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
  // toggleSelectAll(argData: any): void {
  //   const fieldName = argData.field.name;
  //   const autocompleteSupport = argData.field.additionalData.support;
  //   const isSelectAll = argData.eventArgs;

  //   const index = this.jsonControlArray.findIndex(
  //     (obj) => obj.name === fieldName
  //   );
  //   this.jsonControlArray[index].filterOptions
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe((val) => {
  //       this.VendorBillFilterForm.controls[autocompleteSupport].patchValue(
  //         isSelectAll ? val : []
  //       );
  //     });
  // }
}

