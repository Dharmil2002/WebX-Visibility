import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import Swal from 'sweetalert2';

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
  jsonControlsEdit: any[];
  allJson: any[];
  chargeList: any;
  chargeControls: InvoiceModel[];
  chargeData: any;
  showSaveAndCancelButton: boolean;
  constructor(private dialogRef: MatDialogRef<DeliveryMrGenerationModalComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any,
    private thcService: ThcService) {
      debugger
    this.chargeData = this.objResult?.charges?.otherCharge;
    console.log(this.objResult, this.chargeData);

    this.objResult.show ? this.showSaveAndCancelButton = false : this.showSaveAndCancelButton = true;
  }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  //#region to initialize form control
  async initializeFormControl() {
    this.mrGenerationControls = new DeliveryMrGeneration();
    this.jsonControlsEdit = this.mrGenerationControls.getDeliveryMrDetailsControls();
    this.getCharges();
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
  //#region to close dialog
  Close() {
    this.dialogRef.close(null)
  }
  cancel() {
    this.dialogRef.close(null)
  }
  //#endregion
  //#region to send charges to parent component
  save() {
    let formData = this.MrGenerationForm.value;
    formData.id = this.objResult.Details.data.id;
    formData.consignmentNoteNumber = this.objResult.Details.data.consignmentNoteNumber;
    formData.payBasis = this.objResult.Details.data.payBasis;
    formData.subTotal = this.objResult.Details.data.subTotal;
    formData.newSubTotals = this.objResult.Details.data.newSubTotal;
    clearValidatorsAndValidate(this.MrGenerationForm);

    let chargeData = [];

    let showAlert = false;
    this.chargeControls.filter(x => x.hasOwnProperty("id")).forEach(element => {
      if (element?.additionalData.showNameAndValue && this.MrGenerationForm.controls[element.name].value == 0) {
        showAlert = true;
        Swal.fire({
          icon: "info",
          title: "Information",
          text: `As charges are mandatory, they cannot be zero. Please enter another value.`,
          showConfirmButton: true,
        });
        return;
      } else {
        let json = {
          cHGID: element.name,
          cHGNM: element.placeholder,
          aMT: (element?.additionalData.metaData === "-") ? -Math.abs(this.MrGenerationForm.controls[element.name].value || 0) : (parseFloat(this.MrGenerationForm.controls[element.name].value) || 0),
          oPS: element?.additionalData.metaData || "",
        };
        chargeData.push(json);
      }
    });

    formData.chargeData = chargeData;
    formData.Charge = { consignmentNoteNumber: this.objResult.Details.data.consignmentNoteNumber, charges: chargeData }

    if (!showAlert) {
      this.dialogRef.close(formData);
    }
  }
  //#endregion
  //#region to get charges
  async getCharges() {
    debugger
    try {
      if (this.showSaveAndCancelButton && this.chargeData) {//to edit charges
        await this.processChargeData(this.chargeData, false);
      } 
      else if (!this.showSaveAndCancelButton && this.chargeData) { //to show charges
        await this.processChargeData(this.chargeData, true);
      }
      else if (this.showSaveAndCancelButton) {//to add charges
        await this.fetchAndProcessCharges();
      }
    } catch (error) {
      console.error('Error fetching or processing charges:', error);
      // Handle the error appropriately
    }
  }

  private async processChargeData(data: any[], disable: boolean) {
    const invoiceList = data
      .map((element, index) => ({
        id: index + 1,
        name: element.cHGID || '',
        label: `${element.cHGNM}(${element.oPS})`,
        placeholder: element.cHGNM || '',
        type: 'text',
        value: `${Math.abs(element.aMT)}`,
        filterOptions: '',
        displaywith: '',
        generatecontrol: true,
        disable: disable,
        Validations: [{
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        additionalData: {
          showNameAndValue: element.iSREQ,
          metaData: element.oPS
        },
      }));

    const enable = invoiceList.map(x => ({
      ...x,
      name: `${x.name}`,
      disable: disable
    }));

    this.chargeControls = enable.sort((a, b) => a.name.localeCompare(b.name));
    this.allJson = this.chargeControls;
    this.MrGenerationForm = formGroupBuilder(this.fb, [this.allJson]);
  }

  private async fetchAndProcessCharges() {
    this.chargeList = await this.thcService.getCharges({
      "cHAPP": { 'D$eq': 'DeliveryMR' },
      'isActive': { 'D$eq': true }
    });

    if (this.chargeList && this.chargeList.length > 0) {
      const invoiceList = this.chargeList
        .filter(element => element)
        .map((element, index) => ({
          id: 1 + index,
          name: element.cHACD || '',
          label: `${element.sELCHA}(${element.aDD_DEDU})`,
          placeholder: element.cAPTION || '',
          type: 'text',
          value: '0',
          filterOptions: '',
          displaywith: '',
          generatecontrol: true,
          disable: true,
          Validations: [{
            name: "pattern",
            message: "Please Enter only positive numbers with up to two decimal places",
            pattern: '^\\d+(\\.\\d{1,2})?$'
          }],
          additionalData: {
            metaData: element.aDD_DEDU,
            showNameAndValue: element.iSREQ
          },
        }));

      const enable = invoiceList.map(x => ({
        ...x,
        name: `${x.name}`,
        disable: false
      }));

      this.chargeControls = enable.sort((a, b) => a.name.localeCompare(b.name));
      this.allJson = [...this.jsonControlsEdit, ...this.chargeControls];
      this.MrGenerationForm = formGroupBuilder(this.fb, [this.allJson]);
    }
  }

  //#endregion
}