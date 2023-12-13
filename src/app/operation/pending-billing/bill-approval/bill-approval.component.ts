import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { BillSubmissionComponent } from './submission/bill-submission/bill-submission.component';
import { BillApproval } from 'src/app/Models/bill-approval/bill-approval';

@Component({
  selector: 'app-bill-approval',
  templateUrl: './bill-approval.component.html'
})
export class BillApprovalComponent implements OnInit {
  backPath: string;
  shipments: any;
  tableData: any;
  headerColumn: any;
  tableLoad: boolean = true;
  breadScrums = [
    {
      title: "Customer and GST Details",
      items: ["InvoiceCollection"],
      active: "Customer and GST Details",
    },
  ];


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
    private invoiceService: InvoiceServiceService,
    private billApproval: BillApproval,
    public dialog: MatDialog
  ) {
    this.backPath = "/dashboard/Index?tab=Management​";
  }

  ngOnInit(): void {
    this.getApprovalData();
  }
  async getApprovalData() {
    const res = await this.invoiceService.getBillingData();
    const filterData = await this.invoiceService.filterData(res);
    this.tableData = filterData;
    this.tableLoad = false;
  }
  async handleMenuItemClick(data) {
    
    if (data.label.label === "Approve Bill") {
      const filter={
        bILLNO:data?.data?.bILLNO
      }
      const status={
        bSTS:2,
        bSTSNM:"Bill Approved"
      }
     const res = await this.invoiceService.updateInvoiceStatus(filter,status);
     if (res) {
      this.getApprovalData();
       SwalerrorMessage ("success","Success", "The invoice has been successfully approved.",true)
     }
    }
   else if (data.label.label === "Submission Bill") {
      const dialogref = this.dialog.open(BillSubmissionComponent, {
       width: '100vw',
       height: '100vw',
       maxWidth: '232vw',
       data: data.data,
     });
     dialogref.afterClosed().subscribe((result) => {
      this.getApprovalData();
      SwalerrorMessage ("success","Success", "The invoice has been successfully Submission.",true)
     });
   }

  }

}
