import { Component, OnInit } from '@angular/core';
import { LastMileData } from '../../vendor-contract-list/VendorStaticData';
import { VendorLMDModalComponent } from './vendor-lmdmodal/vendor-lmdmodal.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-vendor-lmddetail',
  templateUrl: './vendor-lmddetail.component.html'
})
export class VendorLMDDetailComponent implements OnInit {
  TErouteBasedTableData: any[];
  columnHeaderTErouteBased = {
    lOCNM: {
      Title: "Location",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rTTNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    tMFRM: {
      Title: "Time Frame",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    cPCTNM: {
      Title: "Capacity(Ton)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mIN: {
      Title: "Min Charge (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    cMTKM: {
      Title: "Committed Km",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    aDDKM: {
      Title: "Additional KM",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mAX: {
      Title: "Max Charge (₹)",
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
  staticFieldTErouteBased = ['lOCNM', 'rTTNM', 'tMFRM', 'cPCTNM', 'mIN', 'cMTKM', 'aDDKM', 'mAX']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));

  constructor(private dialog: MatDialog,
    private masterService: MasterService,
  ) { }

  ngOnInit(): void {
    this.getTableDetail();
  }
  //#region  to fill or remove data form table to controls
  handleMenuItemClick(data) {
    // if (data.label.label === 'Remove') {
    //   this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== data.data.id);
    // } else {

    const terDetails = this.TErouteBasedTableData.find(x => x._id == data.data._id);
    this.addDetails(terDetails)
    // }
  }
  //#endregion 
  //#region to Add a new item to the table or edit
  addDetails(event) {
     const request = {
      TERList: this.TErouteBasedTableData,
      Details: event,
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorLMDModalComponent, {
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
        collectionName: "vendor_contract_lmd_rt",
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
