import { Component, Input, OnInit } from '@angular/core';
import { VendorBillService } from '../../../vendor-bill.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-payment-approval',
  templateUrl: './online-payment-approval.component.html'
})
export class OnlinePaymentApprovalComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableData: any[]
  columnHeader = {
    vendor: {
      Title: "Vendor",
      class: "matcolumnleft",
      Style: "min-width:20%",
    },
    billType: {
      Title: "Bill Type",
      class: "matcolumncenter",
      Style: "min-width:14%",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:18%",
      // type: "Link",
      // functionName: "BalanceFunction"
    },
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    billAmount: {
      Title: "Bill Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },

    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "min-width:8%",
    }
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;
  menuItems = [
    { label: 'Bill Payment' },
    // { label: 'Hold Payment' },
    // { label: 'Unhold Payment' },
    { label: 'Cancel Bill' },
    { label: 'Modify' },
  ]
  filterRequest = {
    companyCode: this.companyCode,
    vendorNames: [],
    StatusNames: [],
    startdate: new Date(),
    enddate: new Date()
  }
  @Input() tabName: string
  staticField = ['Status', 'pendingAmount', 'billAmount', 'Date', 'billType', 'vendor', 'billNo']
  constructor(private objVendorBillService: VendorBillService,
    private masterService: MasterService,
    private route: Router) {
    this.filterRequest.startdate.setDate(new Date().getDate() - 30);
    this.getVendorBill();
  }

  ngOnInit(): void {

    this.getVendorBill()
  }

  // #region to retrieve vendor bill data
  async getVendorBill() {
    //this.tableLoad = true
    try {
      // Call the vendor bill service to get the data
      const data = await this.objVendorBillService.getVendorBillList(this.filterRequest);

      // Set the retrieved data to the tableData property
      this.tableData = data.filter(x => x.Status === 'Approved' && x.status != 'Cancelled')

      // Set tableLoad to false to indicate that the table has finished loading
      this.tableLoad = false;
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching vendor bill:', error);
    }
  }
  //#endregion

  //#region to handle actions
  async handleMenuItemClick(data) {
    const id = data.data._id;
    let updateData: any = {};

    switch (data.label.label) {

      case 'Modify':
        this.route.navigateByUrl("/Finance/VendorPayment/BalancePayment");
        break;
      case 'Bill Payment':
        this.route.navigate(["/Finance/VendorPayment/VendorBillPaymentDetails"], {
          state: { data: data.data },
        });
        break;
      case 'Cancel Bill':
        updateData = this.createUpdateData("Cancelled");
        break;
    }

    if (Object.keys(updateData).length > 0) {
      const req = {
        companyCode: this.companyCode,
        filter: { _id: id },
        collectionName: "vend_bill_summary",
        update: updateData
      }

      const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: `Status is ${updateData.bSTATNM}`,
          showConfirmButton: true,
        });

      }
    }

    this.getVendorBill();
  }

  private createUpdateData(status: string) {
    let bSTAT: number;

    switch (status) {
      case "Cancel Bill":
        bSTAT = 6;
        break;
      default:
        break;
    }

    return {
      bSTATNM: status,
      bSTAT: bSTAT,
      mODDT: new Date(),
      mODBY: localStorage.getItem("UserName"),
      mODLOC: localStorage.getItem("Branch")
    };
  }
  //#endregion
}