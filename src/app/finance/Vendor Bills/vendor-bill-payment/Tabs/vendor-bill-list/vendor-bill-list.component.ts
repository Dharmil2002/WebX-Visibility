import { Component, OnInit } from '@angular/core';
import { VendorBillFilterComponent } from './vendor-bill-filter/vendor-bill-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorBillService } from '../../../vendor-bill.service';

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
      class: "matcolumnright",
      Style: "min-width:9%",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumnright",
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
  filterRequest: any;
  constructor(private matDialog: MatDialog,
    private router: Router,
    private masterService: MasterService,
    private objVendorBillService: VendorBillService) { }

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
  async handleMenuItemClick(data) { }
  //#region to call function on change of service selection
  async selectCheckBox(event) {
    console.log(event);

    //  Update the selected contract types
    // this.selectedContractType = event
    //   .filter(item => item.isSelected)
    //   .map(item => item.typeName);

    // this.objContractService.setContractType(this.selectedContractType);
    // this.save(this.selectedContractType);
  }
  //#endregion
  filterFunction() {
    const now = new Date();
    const Datesdata = {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      end: now
    };
    let RequestData = {
      vendorList: [
        // "V0006", "V0007"
      ],
      StartDate: Datesdata.start,
      EndDate: Datesdata.end,
      billtypeList: [
        // "1"
      ],
      statusList: [
        // "1"
      ]
    }
    const dialogRef = this.matDialog.open(VendorBillFilterComponent, {
      data: { DefaultData: RequestData },
      width: "60%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        let vndData = []
        let stsData = []
        result.vendorNamesupport.forEach(data => {
          vndData.push(data.name);
        });
        result.statussupport.forEach(data => {
          stsData.push(data.name);
        });
        result.vndData = vndData;
        result.stsData = stsData;
        this.filterRequest = result;
        this.getVendorBill()
      }
    });
  }
  BalanceFunction(event) {
    console.log('BalanceFunction', event)
    this.router.navigate(['/Finance/VendorPayment/VendorBillPaymentDetails'], {
      state: {
        data: event
      },
    });

  }
  // #region to retrieve vendor bill data
  async getVendorBill() {
    // Get the current date
    const now = new Date();

    // Set up date range for the last 10 days
    const Datesdata = {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      end: now
    };

    // Prepare the request object with default values and filterRequest overrides
    const req = {
      companyCode: this.companyCode,
      startdate: this.filterRequest?.StartDate || Datesdata.start,
      enddate: this.filterRequest?.EndDate || Datesdata.end,
      StatusNames: this.filterRequest?.stsData || [],
      vendorNames: this.filterRequest?.vndData || []
    };

    try {
      // Call the vendor bill service to get the data
      const data = await this.objVendorBillService.getVendorBillList(req);

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