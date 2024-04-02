import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { InvoiceModel } from 'src/app/Models/dyanamic-form/dyanmic.form.model';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ThcService } from 'src/app/Utility/module/operation/thc/thc.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';

@Component({
  selector: 'app-consignment-charges',
  templateUrl: './consignment-charges.component.html'
})
export class ConsignmentChargesComponent implements OnInit {
  chargeForm: UntypedFormGroup;
  chargeControls: FormControls[];
  chargeData:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    private fb: UntypedFormBuilder,
    private thcService:ThcService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog
  ) {
    if (item) {
       this.chargeData = item;
    }
   }

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl(){
     this.getCharges();
  }
    // /*below code is for getting a Chages from Charge Master*/
    async getCharges() {
      const result = await this.thcService.getCharges({ "cHACAT": { "D$in": ['V', 'B'] }, "pRNM": this.chargeData.transModeName},);
      if (result && result.length > 0) {
        const invoiceList = [];
        result.forEach((element, index) => {
          if (element) {
            const invoice: InvoiceModel = {
              id: index + 1,
              name: element.cHACD || '',
              label: `${element.sELCHA}(${element.aDD_DEDU})`,
              placeholder:element.sELCHA || '',
              type: 'text',
              value: '0.00',
              filterOptions: '',
              displaywith: '',
              generatecontrol: true,
              disable: false,
              Validations: [],
              additionalData: {
                showNameAndValue: false,
                metaData: element.aDD_DEDU
              },
              functions: {
                onChange: 'calucatedCharges',
              },
            };
  
            invoiceList.push(invoice);
          }
        });
        this.chargeControls = invoiceList;
        this.chargeForm = formGroupBuilder(this.fb, [this.chargeControls]);
      }
    }
    /*End*/
    functionCallHandler($event) {
      // console.log("fn handler called" , $event);
      let field = $event.field; // the actual formControl instance
      let functionName = $event.functionName; // name of the function , we have to call
  
      // we can add more arguments here, if needed. like as shown
      // $event['fieldName'] = field.name;
  
      // function of this name may not exists, hence try..catch
      try {
        this[functionName]($event);
      } catch (error) {
        // we have to handle , if function not exists.
        console.log("failed");
      }
    }
    save(){
      this.dialogRef.close(this.chargeForm.value);
    }
    cancel(){
      this.dialogRef.close(null);
    }
}
