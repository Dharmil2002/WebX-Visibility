import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';

@Component({
  selector: 'app-delivery-mr-generation-modal',
  templateUrl: './delivery-mr-generation-modal.component.html'
})
export class DeliveryMrGenerationModalComponent implements OnInit {
  submit = 'Save';
  mrGenerationControls: DeliveryMrGeneration;
  jsonControlArray: any;
  MrGenerationForm: UntypedFormGroup
  payBasisName: string;
  payBasisstatus: boolean;
  constructor(private dialogRef: MatDialogRef<DeliveryMrGenerationModalComponent>,
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any) { }

  ngOnInit(): void {
    this.initializeFormControl();
    this.getDropdownData();
  }
  //#region to initialize form control
  async initializeFormControl() {
    this.mrGenerationControls = new DeliveryMrGeneration();
    this.jsonControlArray = this.mrGenerationControls.getDeliveryMrDetailsControls();
    this.MrGenerationForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    this.jsonControlArray.forEach(element => {
      if (element.name === 'PayBasis') {
        this.payBasisName = element.name,
          this.payBasisstatus = element.additionalData.showNameAndValue
      }

    });
    if (this.objResult.Details) {
      // this.BusiAssocForm.controls['min'].setValue(this.objResult.Details.mIN);
      // this.BusiAssocForm.controls['max'].setValue(this.objResult.Details.mAX);
      // this.BusiAssocForm.controls['rate'].setValue(this.objResult.Details.rT);
      this.submit = 'Update';

    }
  }
  //#endregion
  //#region to handle functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
  save() { }
  async getDropdownData() {
    const payBasis = await PayBasisdetailFromApi(this.masterService, 'PAYTYP');

    // Filter and update payBasis dropdown in the UI
    this.filter.Filter(this.jsonControlArray, this.MrGenerationForm, payBasis, this.payBasisName, this.payBasisstatus);
  }
}