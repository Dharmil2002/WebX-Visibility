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
  contract: any;
  isEdit:boolean=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: any,
    //@Inject(MAT_DIALOG_DATA) public cont: any,
    private fb: UntypedFormBuilder,
    private thcService:ThcService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
    public dialog: MatDialog
  ) {
    //this.contract = cont;
    if (item.length>0) {
       this.chargeData = item;
       this.isEdit=true;
    }
    else{
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
      if(!this.isEdit){
      const filter = { "pRNm": this.chargeData.transModeName, aCTV: true,cHBTY: {D$in:["Booking","Both"] }};
      const productFilter = { "cHACAT": { "D$in": ['C', 'B'] }, "pRNM":this.chargeData.transModeName,cHATY:"Charges","cHAPP":{D$in:["GCN"]},isActive:true}
      const result = await this.thcService.getChargesV2(filter, productFilter);
      if (result && result.length > 0) {
        const invoiceList = [];
        result.forEach((element, index) => {
          if (element) {
            const invoice: InvoiceModel = {
              id: index + 1,
              name: element.cHACD || '',
              label: `${element?.cAPTION||element?.sELCHA||""}(${element.aDD_DEDU})`,
              placeholder: element?.cAPTION ||element?.sELCHA||"",
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
      else{
        if (this.chargeData &&  this.chargeData.length > 0) {
          const invoiceList = [];
          this.chargeData.forEach((element, index) => {
            if (element) {
              const invoice: InvoiceModel = {
                id: index + 1,
                name: element.cHGID || '',
                label: `${element.cHGNM} (${element.oPS})`,
                placeholder:element.cHGNM || '',
                type: 'text',
                value:`${Math.abs(element.aMT)}`,
                filterOptions: '',
                displaywith: '',
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                  showNameAndValue: false,
                  metaData:element.oPS
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
      let charges=[];
      this.chargeControls.filter((x) => x.hasOwnProperty("id")).forEach(element => {
        let json = {
          cHGID: element.name,
          cHGNM: element.placeholder,
          aMT: (element?.additionalData.metaData === "-") ? -Math.abs(this.chargeForm.controls[element.name].value || 0) : (this.chargeForm.controls[element.name].value || 0),
          oPS:element?.additionalData.metaData || "+",
          tY: "nFC"
        }
        charges.push(json);
      });
      this.dialogRef.close(charges);
    }
    cancel(){
      this.dialogRef.close(null);
    }
}
