import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { thcGenerationFilterControls } from 'src/assets/FormControls/thc-generation-filters';

@Component({
  selector: 'app-docket-filters',
  templateUrl: './docket-filters.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.mat-dialog-container {
      padding-top: 5px !important;
    }`
  ]
})
export class DocketFiltersComponent implements OnInit {
  ThcFilterControls: thcGenerationFilterControls;
  protected _onDestroy = new Subject<void>();
  DocketFilterForm: UntypedFormGroup;
  jsonControlDocketFilterArray: any;
  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    
    public dialogRef: MatDialogRef<DocketFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public objResult: any
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
    //console.log(this.objResult.DefaultData);
  }

  Close(): void {
    this.dialogRef.close();
  }

  initializeFormControl(): void {
    this.ThcFilterControls = new thcGenerationFilterControls(this.objResult.DefaultData);
    this.jsonControlDocketFilterArray = this.ThcFilterControls.getDocketFilterControls();
    this.DocketFilterForm = formGroupBuilder(this.fb, [this.jsonControlDocketFilterArray]);
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
    this.dialogRef.close(this.DocketFilterForm.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
