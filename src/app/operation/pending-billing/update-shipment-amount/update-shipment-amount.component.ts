import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { UpdateShipmentsControl } from 'src/assets/FormControls/billing-invoice/update-shipment';
import { StorageService } from "src/app/core/service/storage.service";
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FormControls } from 'src/app/core/models/FormControl/formcontrol';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { PackageInfo } from 'src/app/core/models/finance/update.shipmet';
import { handleError, showSuccessMessage } from 'src/app/Utility/message/sweet-alert';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
@Component({
  selector: 'app-update-shipment-amount',
  templateUrl: './update-shipment-amount.component.html'
})
export class UpdateShipmentAmountComponent implements OnInit {
  shipmentTableForm: UntypedFormGroup;
  accountDetail: UntypedFormGroup;
  jsonControlArray: FormControls[];
  jsonControlsEdit: any[];
  shipmentDetails: any;
  className = "col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-2";
  isChagesValid: boolean;
  chargeDetails: any[];
  constructor(
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private invoiceService: InvoiceServiceService
  ) {
    this.shipmentDetails = this.data;
  }

  ngOnInit(): void {
    this.IntializeFormControl();
  }
  onSelectAllClicked(event) {

  }
  async functionCallHandler($event) {
    const field = $event.field; //what is use of this variable
    const functionName = $event.functionName;

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  // Implement this method
  onCloseButtonClick(): void {
    // Add logic to close the MatDialog
    this.dialogRef.close();
  }

  IntializeFormControl() {
    const loadingControlForm = new UpdateShipmentsControl(this.storage, this.shipmentDetails);
    this.jsonControlArray = loadingControlForm.getShipmentControls();
    this.jsonControlsEdit = loadingControlForm.getEditDocket();
    this.shipmentTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.getCharges()

  }
  calucatedData() {
    const eFreight = this.accountDetail.controls['eDFreight']?.value || 0;
    const eRate = this.accountDetail.controls['eDRate']?.value || 0;
    const tot = parseFloat(eFreight) + parseFloat(eRate);
    this.accountDetail.controls['edited']?.setValue(tot);
  }
  /*Below the function are mainly for the edit the shipment*/
  async updateShipment() {
    const { eDWeight, eDRate, eDInvoiceAmt, eDNoOfPackage, eDFreight } = this.accountDetail.controls;
    const { shipment } = this.shipmentTableForm.controls;

    const partialPackageInfo: PackageInfo = {
      eDWeight: eDWeight.value || 0,
      eDRate: parseFloat(eDRate?.value || 0),
      eDInvoiceAmt: parseFloat(eDInvoiceAmt?.value || 0),
      shipment: shipment.value || 0,
      datetime: new Date(),
      editBy: this.storage.userName,
      location: this.storage.branch,
      eDNoOfPackage: parseInt(eDNoOfPackage?.value || 0),
      eDFreight: parseFloat(eDFreight?.value || 0)
    };

    try {
      await this.invoiceService.updateBillingInvoice(partialPackageInfo);
      await showSuccessMessage('Shipment Updated Successfully!');
      this.dialogRef.close();
    } catch (error) {
      await handleError(error, 'Error updating shipment');
    }
  }
  async getCharges() {
    
    const result = await this.invoiceService.getContractCharges({"cHTY":{"D$in":['C','B']}});
    if (result && result.length > 0) {
      const invoiceList: InvoiceModel[] = [];

      result.forEach((element) => {
        if (element) {
          const invoice: InvoiceModel = {
            name: element.cHCD || '',
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
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      const enable: InvoiceModel[] = invoiceList.map((x) => ({
        ...x,
        name:`${x.name}Ed`,
        disable: false
      }));
      this.chargeDetails=[...invoiceList,...enable];
      const combinedArray = [...invoiceList, ...enable].sort((a,b)=>a.name.localeCompare(b.name));
      this.jsonControlsEdit.push(...combinedArray);
    }
    this.accountDetail = formGroupBuilder(this.fb, [this.jsonControlsEdit]);
    this.accountDetail.controls['eDFreightType'].setValue(this.shipmentDetails?.extraData.fRTYPE || "")
    this.accountDetail.controls['eFreightType'].setValue(this.shipmentDetails?.extraData.fRTYPE || "")
    this.isChagesValid = true;

  }
  /*End*/
  calucatedCharges(data){
    const fieldData=this.accountDetail.controls[data.field.name]?.value||"";
    this.accountDetail.controls[data.field.name.split("Ed")[0]].setValue(fieldData); 

  }

}
