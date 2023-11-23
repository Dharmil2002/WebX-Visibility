import { Component, OnInit } from '@angular/core';
import { VendorBusiAssocModalComponent } from './vendor-busi-assoc-modal/vendor-busi-assoc-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-vendor-busi-assoc-detail',
  templateUrl: './vendor-busi-assoc-detail.component.html'
})
export class VendorBusiAssocDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData: any[]
  columnHeaderTErouteBased = {
    cT: {
      Title: "City",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    oPNM: {
      Title: "Operation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rTNM: {
      Title: "Rate Type",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mDNM: {
      Title: "Transport Mode",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    rT: {
      Title: "Rate(₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mIN: {
      Title: "Min(₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mAX: {
      Title: "Max (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    }
  }
  tableLoad: boolean = true;
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
    { label: 'Edit' },
    // { label: 'Remove' }
  ]
  staticFieldTErouteBased = ['cT', 'oPNM', 'rTNM', 'mDNM', , 'rT', 'mIN', 'mAX']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  constructor(private dialog: MatDialog,
    private masterService: MasterService,
  ) { }
  ngOnInit(): void {
    this.getTableDetail();
  }
  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    const terDetails = this.TErouteBasedTableData.find(x => x._id == data.data._id);
    this.addDetails(terDetails)
  }
  //#endregion 
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      List: this.TErouteBasedTableData,
      Details: event,
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorBusiAssocModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTableDetail();
      this.tableLoad = true;
    });
  }
  //#endregion
  //#region to get tableData
  async getTableDetail() {
    try {

      const request = {
        companyCode: this.companyCode,
        collectionName: "vendor_contract_ba",
        filter: {}
      };

      const response = await this.masterService.masterPost("generic/get", request).toPromise();

      this.TErouteBasedTableData = response.data;
      this.TErouteBasedTableData.forEach(item => {
        item.actions = ['Edit', 'Remove'];
      });

    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);

    }
  }
  //#endregion

}
