import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorBillFilterComponent } from './vendor-bill-filter/vendor-bill-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { VendorBillService } from '../../../vendor-bill.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { StorageService } from '../../../../../core/service/storage.service';

@Component({
  selector: 'app-vendor-bill-list',
  templateUrl: './vendor-bill-list.component.html'
})
export class VendorBillListComponent implements OnInit {
  IsUniqData: boolean = false;
  tableLoad = true; // flag , indicates if data is still loaded or not , used to show loading animation
  tableData: any[]
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
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
      // functionName: "VendorBillPaymentFunction"
    },
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    TotalTHCAmount: {
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

  staticField = ['billNo', 'Status', 'pendingAmount', 'TotalTHCAmount', 'Date', 'billType', 'vendor']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  FilterButton = {
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
  menuActionsItems = [
    // { label: 'Approve Bill', id: 1, type: 'Action' },
    // { label: 'Bill Payment', id: 2, type: 'Action' },
    // { label: 'Hold Payment', id: 3, type: 'Action' },
    // { label: 'Unhold Payment', id: 4, type: 'Action' },
    // { label: 'Cancel Bill', id: 5, type: 'Action' },
    // { label: 'Modify', id: 6, type: 'Action' },
  ]
  filterRequest = {
    companyCode: this.companyCode,
    vendorNames: [],
    StatusNames: [],
    StatusCode: [],
    startdate: new Date(),
    enddate: new Date()
  }
  constructor(private matDialog: MatDialog,
    private route: Router,
    public StorageService: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private objVendorBillService: VendorBillService,
    private masterService: MasterService) {
    this.filterRequest.startdate.setDate(new Date().getDate() - 30);
  }

  ngOnInit(): void {
    this.getVendorBill()
  }
  // #region to retrieve vendor bill data
  async getVendorBill() {
    this.tableLoad = true;
    try {
      // Call the vendor bill service to get the data
      let data = await this.objVendorBillService.getVendorBillList(this.filterRequest);
      data.forEach((element, i) => {
        element.isSelected = false;
        if (element.StatusCode === 1) {
          element.actions = [
            'Approve Bill',
            'Hold Payment',
            'Cancel Bill',
            'Modify'
          ]
        }
        if (element.StatusCode === 2) {
          element.actions = [
            'Bill Payment',
            'Cancel Bill',
            // 'Modify'
          ]
        }
        if (element.StatusCode === 4) {
          element.actions = ['Bill Payment']
        }
        if (element.StatusCode === 5) {
          element.actions = ['Unhold Payment']
        }


      });
      this.tableData = data;

      this.tableLoad = false;
    } catch (error) {
      // Log the error to the console
      console.error('Error fetching vendor bill:', error);
    }
  }
  //#endregion 
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
        this.filterRequest.StatusCode = result.statussupport.map(item => +item.value)
        this.filterRequest.vendorNames = result.vendorNamesupport.map(item => item.name)
        this.filterRequest.startdate = result.StartDate,
          this.filterRequest.enddate = result.EndDate,
          this.getVendorBill()
      }
    });
  }

  VendorBillPaymentFunction(event) {
    this.route.navigate(['/Finance/VendorPayment/VendorBillPaymentDetails'], {
      state: {
        data: event
      },
    });
  }
  functionCallHandler(event) {
    try {
      this[event.functionName](event.data);
    } catch (error) {
      console.log("failed");
    }
  }
  //#region to handle actions
  async handleMenuItemClick(data) {
    if (data?.data?.type === 'Action') {
      const SelectedData = this.tableData.filter((x) => x.isSelected == true);


      switch (data?.data?.id) {
        case 1:
          this.handleAction(1, "Approved", "Status is Approved Successful");
          break;
        case 2:
          this.route.navigate(["/Finance/VendorPayment/VendorBillPaymentDetails"], {
            state: { data: SelectedData },
          });
          break;
        case 5:
          this.handleAction(5, "Payment On Hold", "Status is On Hold Successful");
          break;
        case 6:
          this.handleAction(6, "Awaiting Approval", "Status is On Un Hold Successful");
          break;
        case 7:
          this.handleAction(7, "Cancelled", "Status Cancelled Successful");
          break;
      }

    } else {

      const id = data.data._id;
      let updateData: any = {};

      switch (data.label.label) {
        case 'Approve Bill':
          updateData = this.createUpdateData("Approved");
          break;
        case 'Modify':
          this.route.navigate(["/Finance/VendorPayment/BalancePayment"], {
            state: { data: data.data, Type: "Modify", },
          });
          break;
        case 'Bill Payment':
          this.route.navigate(["/Finance/VendorPayment/VendorBillPaymentDetails"], {
            state: { data: [data.data] },
          });
          break;
        case 'Hold Payment':
          updateData = this.createUpdateData("Payment On Hold");
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
          this.getVendorBill();
        }
      }


    }
  }
  async handleAction(id, updateType, successMessage) {
    const req = {
      companyCode: this.companyCode,
      filter: { _id: { D$in: this.tableData.filter((x) => x.isSelected == true).map(item => item._id) } },
      collectionName: "vend_bill_summary",
      update: this.createUpdateData(updateType)
    };

    const res = await firstValueFrom(this.masterService.masterPut("generic/updateAll", req));

    if (res.success == true) {
      this.snackBarUtilityService.ShowCommonSwal("success", successMessage);
      this.getVendorBill();
    } else {
      this.snackBarUtilityService.ShowCommonSwal("error", res?.message);
    }
  }
  private createUpdateData(status: string) {
    let bSTAT: number;

    switch (status) {
      case "Awaiting Approval":
        bSTAT = 1;
        break;
      case "Approved":
        bSTAT = 2;
        break;
      case "Payment On Hold":
        bSTAT = 5;
        break;
      // case "Unhold Payment":
      //   bSTAT = 6;
      //   break;
      case "Cancelled":
        bSTAT = 7;
        break;
      default:
        break;
    }


    return {
      bSTATNM: status,
      bSTAT: bSTAT,
      mODDT: new Date(),
      mODBY: this.StorageService.userName,
      mODLOC: this.StorageService.branch,
    };
  }



  TableSelectionsChange(event) {
    const uniqueItems = event
      .filter(item => item.isSelected)
      .reduce((uniqueItems, item) => {
        const itemKey = `${item.isSelected}_${item.Status}_${item.vendor}`;
        if (!uniqueItems[itemKey]) {
          uniqueItems[itemKey] = item;
        }
        return uniqueItems;
      }, {});
    // Convert the unique vendor objects back to an array
    const resultArray: any[] = Object.values(uniqueItems);

    if (resultArray.length == 1) {
      switch (resultArray[0].StatusCode) {
        case 1:
          this.menuActionsItems = [
            { label: 'Approve Bill', id: 1, type: 'Action' },
            { label: 'Hold Payment', id: 5, type: 'Action' },
            { label: 'Cancel Bill', id: 7, type: 'Action' },
            // { label: 'Modify', id: 6, type: 'Action' },
          ]
          break;
        case 2:
          this.menuActionsItems = [
            { label: 'Bill Payment', id: 2, type: 'Action' },
            { label: 'Cancel Bill', id: 7, type: 'Action' },
            // { label: 'Modify', id: 6, type: 'Action' },
          ]
          break;
        case 4:
          this.menuActionsItems = [
            { label: 'Bill Payment', id: 2, type: 'Action' },
          ]
          break;
        case 5:
          this.menuActionsItems = [
            { label: 'Un Hold Payment', id: 6, type: 'Action' },
          ]
          break;
      }
      this.IsUniqData = true;
    }
    else if (resultArray.filter(item => item.StatusCode === 2 || item.StatusCode == 4).length == 2 && resultArray.length == 2) {
      this.menuActionsItems = [
        { label: 'Bill Payment', id: 2, type: 'Action' },
        { label: 'Cancel Bill', id: 7, type: 'Action' },
      ]
      this.IsUniqData = true;
    }
    else if (resultArray.length > 1) {
      this.IsUniqData = false;
      this.snackBarUtilityService.ShowCommonSwal(
        "error",
        "Please Select Unique Vendor Bill Vendor And Status Wise"
      );
    }
  }

  //   else {
  //     this.IsUniqData = false;
  //     this.snackBarUtilityService.ShowCommonSwal(
  //       "error",
  //       "Please Select Unique Vendor Bill VendorWise"
  //     );
  //   }
  // }
}

// const BillSystmeStatusList = [
//   { "id": 1, "status": "Awaiting Approval" },
//   { "id": 2, "status": "Approved" },
//   { "id": 3, "status": "Paid" },
//   { "id": 4, "status": "Partially Paid" },
//   { "id": 5, "status": "Payment On Hold" },
//   { "id": 6, "status": "Payment Unhold" },
//   { "id": 7, "status": "Cancelled" }
// ]

