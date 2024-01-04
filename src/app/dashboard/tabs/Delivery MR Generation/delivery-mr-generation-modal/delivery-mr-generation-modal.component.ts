import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';

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
    private masterService: MasterService,
    private filter: FilterUtils,
    @Inject(MAT_DIALOG_DATA)
    private objResult: any,
    private invoiceService: InvoiceServiceService) { }

  ngOnInit(): void {
    this.initializeFormControl();
    // this.getDropdownData();
  }
  //#region to initialize form control
  async initializeFormControl() {
    this.mrGenerationControls = new DeliveryMrGeneration();
    this.jsonControlsEdit = this.mrGenerationControls.getDeliveryMrDetailsControls();
    this.getCharges();
    
    // if (this.objResult.Details) {
    // this.BusiAssocForm.controls['min'].setValue(this.objResult.Details.mIN);
    // this.BusiAssocForm.controls['max'].setValue(this.objResult.Details.mAX);
    // this.BusiAssocForm.controls['rate'].setValue(this.objResult.Details.rT);

    // }
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
    console.log(this.MrGenerationForm.value);
    this.dialogRef.close(this.MrGenerationForm.value)
  }
  async getDropdownData() {
  const payBasis = await PayBasisdetailFromApi(this.masterService, 'PAYTYP');

  // Filter and update payBasis dropdown in the UI
  this.filter.Filter(this.jsonControlArray, this.MrGenerationForm, payBasis, this.payBasisName, this.payBasisstatus);
  }
  getTotal() {
    const total =
      //  parseFloat(this.MrGenerationForm.value.subTotal) +
      parseFloat(this.MrGenerationForm.value.newSubTotal) +
      // parseFloat(this.MrGenerationForm.value.rateDifference) +
      parseFloat(this.MrGenerationForm.value.doorDelivery) +
      parseFloat(this.MrGenerationForm.value.demmurage) +
      parseFloat(this.MrGenerationForm.value.loadingCharge) +
      parseFloat(this.MrGenerationForm.value.unLoadingCharge) +
      parseFloat(this.MrGenerationForm.value.forclipCharge) +
      parseFloat(this.MrGenerationForm.value.gatepassCharge) +
      parseFloat(this.MrGenerationForm.value.otherCharge)
    console.log(total);
    this.MrGenerationForm.controls['totalAmount'].setValue(total);

  }
  async getCharges() {
    const result = await this.invoiceService.getContractCharges({ "cHTY": { "D$in": ['C', 'B','V'] } });
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
            functions: {
              onChange: 'calculatedCharges',
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
      console.log(this.allJson);

      // this.jsonControlsEdit = this.jsonControlsEdit.sort((a, b) => a.id - b.id);
    }
    this.MrGenerationForm = formGroupBuilder(this.fb, [this.allJson]);
    this.isChagesValid = true;

  }
  calculatedCharges(data) {
    // const fieldData=this.accountDetail.controls[data.field.name]?.value||"";
    // let editedAmt=this.accountDetail.controls['edited'];
    // editedAmt.setValue(parseFloat(fieldData)+parseFloat(editedAmt.value||0));
  }
}
