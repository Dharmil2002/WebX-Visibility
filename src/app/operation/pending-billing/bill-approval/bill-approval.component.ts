import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwalerrorMessage } from 'src/app/Utility/Validation/Message/Message';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { BillSubmissionComponent } from './submission/bill-submission/bill-submission.component';
import { BillApproval } from 'src/app/Models/bill-approval/bill-approval';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill-approval',
  templateUrl: './bill-approval.component.html'
})
export class BillApprovalComponent implements OnInit {
  backPath: string;
  shipments: any;
  tableData: any;
  headerColumn: any;
  navigateExtra: any;
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
    private billApproval: BillApproval,/*this is a model object here so please dont remove bcz this model object is used in html page*/
    public dialog: MatDialog,
    private storage: StorageService,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {

      this.navigateExtra = this.router.getCurrentNavigation()?.extras?.state.data.columnData || "";
    }
    this.backPath = "/dashboard/Index?tab=Management​";
  }

  ngOnInit(): void {
    this.getApprovalData();
  }
  async getApprovalData() {
    const customer = this.navigateExtra.billingParty[0].split('-')[0].trim();
    const res = await this.invoiceService.getBillingData(customer);
    const filterData = await this.invoiceService.filterData(res);
    this.tableData = filterData;
    this.tableLoad = false;
  }
  async handleMenuItemClick(data) {

    if (data.label.label == "Approve Bill") {
      const filter = {
        bILLNO: data?.data?.bILLNO
      }
      const status = {
        bSTS: 2,
        bSTSNM: "Bill Approved",
        aPR: {
          loc: this.storage.branch,
          aDT: new Date(),
          aBY: this.storage.userName
        }
      }
      const res = await this.invoiceService.updateInvoiceStatus(filter, status);
      if (res) {
        this.getApprovalData();
        SwalerrorMessage("success", "Success", "The invoice has been successfully approved.", true)
      }
    }
    else if (data.label.label == "Cancel Bill") {
      Swal.fire({
        title: 'Reason For Cancel?',
        html: '<input id="swal-input1" class="swal2-input">',
        focusConfirm: false,
        showCancelButton: true, // Add this line to show the cancel button
        cancelButtonText: 'Cancel', // Optional: Customize the cancel button text
        preConfirm: () => {
          return (document.getElementById('swal-input1') as HTMLInputElement).value;
        }
      }).then(async (result) => {
        debugger
        if (result.isConfirmed) {
          // Handle the input value if the user clicks the confirm button
          const filter = {
            bILLNO: data?.data?.bILLNO
          }
          const status = {
            cNL: true,
            cNLDT: new Date(),
            cNBY: this.storage.userName,
            cNRES:  result.value//required cancel reason in popup
          }
          const res = await this.invoiceService.updateInvoiceStatus(filter, status);
          const filteDkt = {
            cID: this.storage.companyCode,
            bILLNO: data.data.bILLNO
          }
          await this.invoiceService.updateDocketStatus(filteDkt);
          if (res) {
            this.getApprovalData();
            SwalerrorMessage("success", "Success", "The invoice has been successfully Cancelled.", true)
          }
          // Your code to handle the input value
        } else if (result.isDismissed) {
          this.getApprovalData();
        }
      });
    }
    else if (data.label.label === "Submission Bill") {
      const dialogref = this.dialog.open(BillSubmissionComponent, {
        width: '100vw',
        height: '100vw',
        maxWidth: '232vw',
        data: data.data,
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          this.getApprovalData();
          SwalerrorMessage("success", "Success", "The invoice has been successfully Submission.", true)
        }
      });
    }

  }

}
