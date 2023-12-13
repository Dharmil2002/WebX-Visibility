import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { invoiceModel } from 'src/app/Models/invoice-model/invoice-model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { UpdateShipmentAmountComponent } from '../update-shipment-amount/update-shipment-amount.component';

@Component({
  selector: 'app-shipment-edit-billing',
  templateUrl: './shipment-edit-billing.component.html'
  
})
export class ShipmentEditBillingComponent implements OnInit {
  shipments: any;
  tableData:any;
  headerColumn:any;
  isLoad:boolean=true;
  staticField=[''];
  menuItems = [{label:"Approve"},{label:"Edit"},{label:"Hold"}];
  menuItemflag: boolean = true;
metaData = {
  checkBoxRequired: true,
  noColumnSort: ["checkBoxRequired"],
};
dynamicControls = {
  add: false,
  edit: true,
  csv: false,
};
  constructor(
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceServiceService: InvoiceServiceService,
    public definition:invoiceModel,
    public dialog: MatDialog,

  ) {
    this.shipments = this.data;
    this.getShipmentDetails();
  }
  async getShipmentDetails() {
    const shipments=this.shipments.dKTNO;
    let details=await this.invoiceServiceService.getInvoice(shipments);
    let filterData=await this.invoiceServiceService.filterShipment(details);
    this.tableData=filterData;
    this.isLoad=false;
  }

  ngOnInit(): void {
  }
  onSelectAllClicked(event){

  }
   // Implement this method
   onCloseButtonClick(): void {
    // Add logic to close the MatDialog
    this.dialogRef.close();
  }
  async handleMenuItemClick(data) {
    
    if (data.label.label === "Edit") {
       const dialogref = this.dialog.open(UpdateShipmentAmountComponent, {
        width: '100vw',
        height: '100vw',
        maxWidth: '232vw',
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
        this.getShipmentDetails();
      });
    }
   
     
    }

  
}
