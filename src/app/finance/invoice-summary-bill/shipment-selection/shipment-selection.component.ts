import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { invoiceModel } from 'src/app/Models/invoice-model/invoice-model';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';

@Component({
  selector: 'app-shipment-selection',
  templateUrl: './shipment-selection.component.html'
})
export class ShipmentSelectionComponent implements OnInit {
  isLoad:boolean=true;
  shipments: any;
  tableData:any;
metaData = {
  checkBoxRequired: true,
  noColumnSort: ["checkBoxRequired"],
};
dynamicControls = {
  add: false,
  edit: false,
  csv: false,
};
  stateName: any;
  constructor(
    public definition:invoiceModel,
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
   this.stateName=this.data.stateName;
   this.tableData=this.data.extraData;
   this.isLoad=false;
  }

  ngOnInit(): void {
  }
  onCloseButtonClick(): void {
    // Add logic to close the MatDialog
    this.dialogRef.close();
  }
  onSubmitButtonClick(){
    this.dialogRef.close({stateName:this.stateName,selectedData:this.tableData.filter((x)=>x.isSelected==true)});
  }
  getCalucationDetails($event){    
    const gstRate = parseFloat(this.data.gstRate.replace('%', '')) / 100;
    $event.filter((x)=>x.isSelected==true);
    $event = $event.map((item) => {
      if(item.isSelected) {
        item.gst = parseFloat((item.amount * (gstRate)).toFixed(2));
        item.total = parseFloat(item.amount) + parseFloat(item.gst)      
      }
      else {
        item.gst = 0.00;
        item.total= parseFloat(item.amount); 
      }
      return item;
    });
  }
}
