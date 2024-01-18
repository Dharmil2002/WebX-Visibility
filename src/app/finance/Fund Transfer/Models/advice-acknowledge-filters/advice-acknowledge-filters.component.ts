import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { AdviceAcknowledgeControl } from 'src/assets/FormControls/Finance/AdviceAcknowledge/adviceacknowledgecontrol';


@Component({
  selector: 'app-advice-acknowledge-filters',
  templateUrl: './advice-acknowledge-filters.component.html',
})
export class AdviceAcknowledgeFiltersComponent implements OnInit {
  AdviceAcknowledgeControl: AdviceAcknowledgeControl;
  protected _onDestroy = new Subject<void>();
  THCPaymentFilterForm: UntypedFormGroup;
  jsonControlAdviceAcknowledgeFilterArray: any;

  constructor(
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<AdviceAcknowledgeFiltersComponent>,
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
    this.AdviceAcknowledgeControl = new AdviceAcknowledgeControl(this.objResult.DefaultData);
    this.jsonControlAdviceAcknowledgeFilterArray = this.AdviceAcknowledgeControl.getFilterFormControls();
    this.THCPaymentFilterForm = formGroupBuilder(this.fb, [this.jsonControlAdviceAcknowledgeFilterArray]);
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
}