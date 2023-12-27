import { Component, OnInit } from '@angular/core';
import { VendorBillFilterComponent } from './vendor-bill-filter/vendor-bill-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorBillService } from '../../../vendor-bill.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-bill-list',
  templateUrl: './vendor-bill-list.component.html'
})
export class VendorBillListComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  tableData: any[]
  columnHeader = {
    srno: {
      Title: "Sr. No.",
      class: "matcolumncenter",
      Style: "min-width:5%",
    },
    vendor: {
      Title: "Vendor",
      class: "matcolumnleft",
      Style: "min-width:20%",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:17%",
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
      Style: "min-width:9%",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:9%",
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
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [
  ];
  addFlag = true;
  menuItemflag = true;

  staticField = ['billNo', 'Status', 'pendingAmount', 'billAmount', 'Date', 'billType', 'vendor', 'srno']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };
  menuItems = [
    { label: 'Approve Bill' },
    // { label: 'Bill Payment' },
    { label: 'Hold Payment' },
    { label: 'Unhold Payment' },
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
  constructor(private matDialog: MatDialog,
    private route: Router,
    private objVendorBillService: VendorBillService,
    private masterService: MasterService) {
    this.filterRequest.startdate.setDate(new Date().getDate() - 30);
    this.getVendorBill();
  }

  ngOnInit(): void {
    this.getVendorBill()
  }

  functionCallHandler(event) {
    // console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  //#region to handle actions
  async handleMenuItemClick(data) {
    const id = data.data._id;
    let updateData: any = {};

    switch (data.label.label) {
      case 'Approve Bill':
        updateData = this.createUpdateData("Approved");
        break;
      case 'Modify':
        this.route.navigateByUrl("/Finance/VendorPayment/BalancePayment");
        break;
      // case 'Bill Payment':
      //   this.route.navigate(["/Finance/VendorPayment/VendorBillPaymentDetails"], {
      //     state: { data: data.data },
      //   });
      //   break;
      case 'Hold Payment':
        updateData = this.createUpdateData("On Hold");
        break;
      case 'Unhold Payment':
        updateData = this.createUpdateData("Awaiting Approval");
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
      case "Approved":
        bSTAT = 2;
        break;
      case "Hold Payment":
        bSTAT = 4;
        break;
      case "Awaiting Approval":
        bSTAT = 1;
        break;
      case "Cancelled":
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

  filterFunction() {
    const dialogRef = this.matDialog.open(VendorBillFilterComponent, {
      data: { DefaultData: this.filterRequest },
      width: "60%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.filterRequest.StatusNames = result.statussupport.map(item => item.name)
        this.filterRequest.vendorNames = result.vendorNamesupport.map(item => item.name)
        this.filterRequest.startdate = result.StartDate,
          this.filterRequest.enddate = result.EndDate,
          this.getVendorBill()
      }
    });
  }
  BalanceFunction(event) {
    // console.log('BalanceFunction', event)
    this.route.navigate(['/Finance/VendorPayment/VendorBillPaymentDetails'], {
      state: {
        data: event
      },
    });

  }
  // #region to retrieve vendor bill data
  async getVendorBill() {
    this.tableLoad = true;
    try {
      // Call the vendor bill service to get the data
      let data = await this.objVendorBillService.getVendorBillList(this.filterRequest);
      data.forEach((element, i) => {
        if (element.Status === 'Approved') {
          // Remove 'Approve Bill' from the actions array
          const index = element.actions.indexOf('Approve Bill');
          if (index !== -1) {
            element.actions.splice(index, 1);
          }
        }
        if (element.Status === 'On Hold') {
          // Remove 'Approve Bill' from the actions array
          const index = element.actions.indexOf('Hold Payment');
          if (index !== -1) {
            element.actions.splice(index, 1);
          }
          // Add 'Unhold Payment' to the actions array
          element.actions.push('Unhold Payment');

        }
        if (element.Status === 'Cancelled' || element.Status === 'Paid') {
          // Remove all values from the actions array
          element.actions = [];
        }
      });
      data = data.filter(x => x.Status != 'Approved');
      // Set the retrieved data to the tableData property
      this.tableData = data.map((x, index) => ({
        ...x,
        srno: index + 1
      }))

      // Set tableLoad to false to indicate that the table has finished loading
      this.tableLoad = false;
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching vendor bill:', error);
    }
  }
  //#endregion 
}