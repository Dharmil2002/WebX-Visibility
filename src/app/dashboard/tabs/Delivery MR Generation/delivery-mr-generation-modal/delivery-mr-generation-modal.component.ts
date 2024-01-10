import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { clearValidatorsAndValidate } from 'src/app/Utility/Form Utilities/remove-validation';

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
  isChagesValid: boolean;
  jsonControlsEdit: any[];
  allJson: any[];
  constructor(private dialogRef: MatDialogRef<DeliveryMrGenerationModalComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any,
    private invoiceService: InvoiceServiceService) { }

  ngOnInit(): void {
    this.initializeFormControl();
    console.log(this.objResult);
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
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
  save() {
    let data = this.MrGenerationForm.value
    data["id"] = this.objResult.Details.data.id
    data["consignmentNoteNumber"] = this.objResult.Details.data.consignmentNoteNumber
    data["payBasis"] = this.objResult.Details.data.payBasis
    data["subTotal"] = this.objResult.Details.data.subTotal
    clearValidatorsAndValidate(this.MrGenerationForm)
    this.dialogRef.close(data)
  }

  async getCharges() {
    const result = await this.invoiceService.getContractCharges({ "cHTY": { "D$in": ['C', 'B', 'V'] } });
    // console.log(result);

    if (result && result.length > 0) {
      const invoiceList: InvoiceModel[] = [];

      result.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
            id: 1 + index,
            name: element.cHNM || '',
            label: `${element.cHNM}`,
            placeholder: element.cHNM || '',
            type: 'text',
            value: '0',
            filterOptions: '',
            displaywith: '',
            generatecontrol: true,
            disable: true,
            Validations: [],
            additionalData: {
              showNameAndValue: false,
              metaData: '',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const enable: InvoiceModel[] = invoiceList.map((x) => ({
        ...x,
        name: `${x.name}`,
        disable: false
      }));
      const combinedArray = enable.sort((a, b) => a.name.localeCompare(b.name));
      this.allJson = [...this.jsonControlsEdit, ...combinedArray]
    }
    this.MrGenerationForm = formGroupBuilder(this.fb, [this.allJson]);
    this.isChagesValid = true;

  }
}