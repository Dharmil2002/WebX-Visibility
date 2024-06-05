import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { UpdateShipmentsControl } from 'src/assets/FormControls/billing-invoice/update-shipment';
import { StorageService } from "src/app/core/service/storage.service";
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FormControls } from 'src/app/core/models/FormControl/formcontrol';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { handleError, showSuccessMessage } from 'src/app/Utility/message/sweet-alert';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { ConsigmentUtility } from 'src/app/Utility/module/operation/docket/consigment-utlity.module';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
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
  extraCharges: InvoiceModel[];
  tMODE: any;
  constructor(
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    private storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private invoiceService: InvoiceServiceService,
    private consigmentUtility: ConsigmentUtility,
    private thcService: ThcService
  ) {
    this.shipmentDetails = this.data;
    this.tMODE = this.shipmentDetails.tMODE;
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
    this.shipmentTableForm.controls['edited']?.setValue(tot);
  }
  /*Below the function are mainly for the edit the shipment*/
  async updateShipment() {
   
     const extraCharge=  this.extraCharges;
     const group =this.accountDetail
    const { eDWeight, eDRate, eDInvoiceAmt, eDNoOfPackage, eDFreight, edited } = this.accountDetail.controls;
    const { shipment, gst } = this.shipmentTableForm.controls;
    let charges = [];
    this.extraCharges.forEach(element => {
      let chg = {};
      chg['cHGID'] = element.name;
      chg['cHGNM'] = element.label;
      chg['aMT'] = this.accountDetail.controls[`${element.name}Ed`].value;
      chg['oPS'] = element.additionalData.metaData;
      chg['tY'] = element.additionalData.tY;
      charges.push(chg);
    });
    const sumOfOtherAmount = charges.reduce((a, b) => a + parseFloat(b.aMT), 0);
    /*below file is for the bindBillingData for add dockets collection*/
    const bindBiillingData = {
      gROAMT: edited.value,
      pKGS: parseInt(eDNoOfPackage.value),
      fRTRT: parseFloat(eDRate.value),
      fRTAMT: parseFloat(eDFreight.value),
      cHRWT: parseFloat(eDWeight.value),
      tOTAMT: parseFloat(edited.value) + parseFloat(gst.value),
      mODBY: this.storage.userName,
      mODLOC: this.storage.branch,
      mODDT: new Date()
    }
    /*End*/
    /*below file is for the financeData for add docket_fin_det collection*/
    const financeData = {
      fRTAMT: parseFloat(eDFreight.value),
      oTHAMT: sumOfOtherAmount,
      cHG: charges,
      gROAMT: edited.value,
      tOTAMT: parseFloat(edited.value) + parseFloat(gst.value),
      mODDT: new Date(),
      mODLOC: this.storage.branch,
      mODBY: this.storage.userName
    }
    /*End*/
    /*below file is for the bindBillingData for Update Api*/
    const reqData = {
      dockets: bindBiillingData,
      finance: financeData,
      dktNo: shipment.value
    }
    try {
      await this.invoiceService.updateBillingInvoice(reqData, this.tMODE);
      await showSuccessMessage('Shipment Updated Successfully!');
      this.dialogRef.close();
    } catch (error) {
      await handleError(error, 'Error updating shipment');
    }
  }
  async getCharges() {

    const filter = { "pRNm": this.shipmentDetails.extraData.tRNMODNM, aCTV: true, cHBTY: { D$in: ["Booking", "Both"] } };
    const productFilter = { "cHACAT": { "D$in": ['C', 'B'] }, "pRNM": this.shipmentDetails.extraData.tRNMODNM, cHATY: "Charges", "cHAPP": { D$in: ["GCN"] }, isActive: true }
    const result = await this.thcService.getChargesV2(filter, productFilter);
    const getbillingDetail = await this.consigmentUtility.getBillingData({ dKTNO: this.shipmentDetails.shipment }, this.tMODE);
    if (result && result.length > 0) {
      const invoiceList: InvoiceModel[] = [];

      result.forEach((element, index) => {
        if (element) {
          const invoice: InvoiceModel = {
            id: 14 + index,
            name: element.cHACD || '',
            label: `${element.cAPTION}`,
            placeholder: element.cAPTION || '',
            type: 'text',
            value: '0',
            filterOptions: '',
            displaywith: '',
            generatecontrol: true,
            disable: true,
            Validations: [],
            additionalData: {
              showNameAndValue: false,
              metaData: element.aDD_DEDU,
              tY: "nFC"
            },
            functions: {
              onChange: 'calucatedCharges',
            },
          };

          invoiceList.push(invoice);
        }
      });
      if (getbillingDetail.length > 0) {
   
        const lastIdx = invoiceList[invoiceList.length - 1];
        getbillingDetail.forEach((element, index) => {
          if (element) {
            let invoice: InvoiceModel = {
              id: lastIdx.id + index,
              name: element.cHGID || '',
              label: `${element.cHGNM}`,
              placeholder: element.cHGNM || '',
              type: 'number',
              value: element?.aMT || 0,
              filterOptions: '',
              displaywith: '',
              generatecontrol: true,
              disable: true,
              Validations: [],
              additionalData: {
                showNameAndValue: false,
                metaData: element.oPS,
                tY: element.tY
              },
              functions: {
                onChange: 'calucatedCharges',
              },
            };
            const existingInvoice = invoiceList.find((x) => x.name === invoice.name);
            if (existingInvoice && parseInt(existingInvoice.value) <= parseInt(invoice.value)) {
              // Update the existing invoice's value
              existingInvoice.value = invoice.value;
            } else {
              invoiceList.push(invoice);
            }
          }
        })
      }

      const enable: InvoiceModel[] = invoiceList.map((x) => ({
        ...x,
        name: `${x.name}Ed`,
        disable: false
      }));
      
      this.extraCharges = invoiceList;
      this.chargeDetails = [...invoiceList, ...enable];
      const combinedArray = [...invoiceList, ...enable].sort((a, b) => a.name.localeCompare(b.name));
      this.jsonControlsEdit.push(...combinedArray);
      this.jsonControlsEdit = this.jsonControlsEdit.sort((a, b) => a.id - b.id);
    }

    this.accountDetail = formGroupBuilder(this.fb, [this.jsonControlsEdit]);
    this.isChagesValid = true;
    if (getbillingDetail.length > 0) {
      getbillingDetail.forEach(element => {
        this.accountDetail.controls[element.cHGID].setValue(element.aMT);
        this.accountDetail.controls[`${element.cHGID}Ed`].setValue(element.aMT);
      });
      let totAmt = getbillingDetail.reduce((total, amt) => total + amt.aMT, 0);
      const frtAmt = parseFloat(this.accountDetail.controls['eDFreight']?.value || 0.0)
      let total = frtAmt + totAmt
      this.accountDetail.controls['edited'].setValue(total);
      this.accountDetail.controls['entered'].setValue(total);
    }


  }
  /*End*/

  calucatedCharges(data) {
    const fieldData = this.accountDetail.controls[data.field.name]?.value || "";
    let editedAmt = this.accountDetail.controls['edited'];
    editedAmt.setValue(parseFloat(fieldData) + parseFloat(editedAmt.value || 0));
  }

}
