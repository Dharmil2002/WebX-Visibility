import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
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
  isChagesValid: boolean;
  jsonControlsEdit: any[];
  allJson: any[];
  chargeList: any;
  chargeControls: InvoiceModel[];
  constructor(private dialogRef: MatDialogRef<DeliveryMrGenerationModalComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any,
    private thcService: ThcService) { }

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
    let formData = this.MrGenerationForm.value;
    formData.id = this.objResult.Details.data.id;
    formData.consignmentNoteNumber = this.objResult.Details.data.consignmentNoteNumber;
    formData.payBasis = this.objResult.Details.data.payBasis;
    formData.subTotal = this.objResult.Details.data.subTotal;
    clearValidatorsAndValidate(this.MrGenerationForm);

    console.log(formData);
    debugger;

    let chargeData = [];

    let showAlert = false;
    this.chargeControls.filter(x => x.hasOwnProperty("id")).forEach(element => {
      if (element?.additionalData.showNameAndValue && this.MrGenerationForm.controls[element.name].value == 0) {
        showAlert = true;
        Swal.fire({
          icon: "info",
          title: `As charges are mandatory, they cannot be zero. Please enter another value.`,
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

    if (!showAlert) {
      this.dialogRef.close(formData);
    }
  }


  async getCharges() {
    this.chargeList = await this.thcService.getCharges(
      {
        "cHAPP": { 'D$eq': 'DeliveryMR' },
        'isActive': { 'D$eq': true }
      });
    console.log(this.chargeList);

    if (this.chargeList && this.chargeList.length > 0) {
      const invoiceList: InvoiceModel[] = [];

      this.chargeList.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
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
            functions: {
              onChange: 'calucatedCharges',
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
      this.chargeControls = enable.sort((a, b) => a.name.localeCompare(b.name));
      this.allJson = [...this.jsonControlsEdit, ...this.chargeControls]

    }
    this.MrGenerationForm = formGroupBuilder(this.fb, [this.allJson]);
    this.isChagesValid = true;

  }
}