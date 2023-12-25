import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { invoiceModel } from 'src/app/Models/invoice-model/invoice-model';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { GenericViewTableComponent } from 'src/app/shared-components/generic-view-table/generic-view-table.component';
import { UpdateShipmentAmountComponent } from '../update-shipment-amount/update-shipment-amount.component';
import Swal from 'sweetalert2';
import { GenericService } from 'src/app/core/service/generic-services/generic-services';

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
  menuItems = [{label:"Approve",status:[0]},{label:"Edit",status:[1]},{label:"Hold",status:[1]}];
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
  status: number;
  constructor(
    public dialogRef: MatDialogRef<GenericViewTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceServiceService: InvoiceServiceService,
    public definition:invoiceModel,
    private genericService:GenericService,
    public dialog: MatDialog,
  ) {
    const flag=this.genericService.getSharedData();
    this.status=flag.title.shipment=="apDkt"?1:0
    this.shipments = this.data;
    this.menuItems=this.menuItems.filter((item)=>item.status.includes(this.status));
    this.getShipmentDetails();
  }
  async getShipmentDetails() {
    const shipments=this.shipments.dKTNO;
    let details=await this.invoiceServiceService.getInvoice(shipments,this.status);
    let filterData=await this.invoiceServiceService.filterShipment(details,true);
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
    if(data.label.label==="Approve"){
      await this.invoiceServiceService.confirmApprove(data);
      this.getShipmentDetails();
    }
    }
    ngOnDestroy() {
     this.genericService.clearSharedData();
    }

}
