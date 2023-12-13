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
  tableLoad = true; // flag , indicates if data is still lo or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableData: any[]
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "min-width:8%",
    },
    vendor: {
      Title: "Vendor",
      class: "matcolumnleft",
      Style: "min-width:20%",
    },
    billType: {
      Title: "Bill Type",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumncenter",
      Style: "min-width:14%",
      type: "Link",
      functionName: "BalanceFunction"
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
      Style: "min-width:10",
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

  staticField = ['Status', 'pendingAmount', 'billAmount', 'Date', 'billType', 'vendor']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };
  menuItems = [
    { label: 'Approve Bill' },
    { label: 'Bill Payment' },
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
  }

  ngOnInit(): void {
    this.getVendorBill()
  }

  functionCallHandler(event) {
    console.log(event);
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  //#region to approve bill
  async handleMenuItemClick(data) {
    const id = data.data._id;
    if (data.label.label === 'Approve Bill') {

      const updateData = {
        bSTATNM: "Approved",
        bSTAT: 2,
        mODDT: new Date(),
        mODBY: localStorage.getItem("UserName"),
        mODLOC: localStorage.getItem("Branch")
      };
      let req = {
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
          text: "Status is Approved",
          showConfirmButton: true,
        });

      }
      this.getVendorBill();

    };

  }
  //#endregion
  //#region to call function on change of service selection
  async selectCheckBox(event) {
    console.log(event);

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
    console.log('BalanceFunction', event)
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

      data.forEach(element => {
        if (element.Status === 'Approved') {
          // Remove 'Approve Bill' from the actions array
          const index = element.actions.indexOf('Approve Bill');
          if (index !== -1) {
            element.actions.splice(index, 1);
          }
        }
      });
      // Set the retrieved data to the tableData property
      this.tableData = data;

      // Set tableLoad to false to indicate that the table has finished loading
      this.tableLoad = false;
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching vendor bill:', error);
    }
  }
  //#endregion 
}