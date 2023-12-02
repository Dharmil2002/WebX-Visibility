import { Component, OnInit } from '@angular/core';
import { VendorTableData } from '../../VendorStaticData';
import { VendorBillFilterComponent } from './vendor-bill-filter/vendor-bill-filter.component';
import { MatDialog } from '@angular/material/dialog';

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
  tableData = VendorTableData
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    vendor: {
      Title: "Vendor",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    billType: {
      Title: "Bill Type",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    billNo: {
      Title: "Bill No",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    Date: {
      Title: "Date",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    billAmount: {
      Title: "Bill Amount",
      class: "matcolumnright",
      //Style: "max-width:115px",
    },
    pendingAmount: {
      Title: "Pending Amount",
      class: "matcolumnright",
      //Style: "max-width:100px",
    },
    Status: {
      Title: "Status",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },

    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
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
  
  staticField = ['Status', 'pendingAmount', 'billAmount', 'billNo', 'Date', 'billType', 'vendor']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
 
  EventButton = {
    functionName: "filterFunction",
    name: "Filter",
    iconName: "filter_alt",
  };
  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
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
    let RequestData = {
      vendorList: [
        "V0006", "V0007"
      ],
      StartDate: "2023-11-21T18:30:00.000Z",
      EndDate: "2023-11-23T18:30:00.000Z"

    }
    const dialogRef = this.matDialog.open(VendorBillFilterComponent, {
      data: { DefaultData: RequestData },
      width: "30%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result)
      }
    });
  }
}
