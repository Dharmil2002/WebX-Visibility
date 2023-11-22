import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { VendorTERModalComponent } from './vendor-termodal/vendor-termodal.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-vendor-terdetail',
  templateUrl: './vendor-terdetail.component.html'
})
export class VendorTERDetailComponent implements OnInit {
  @Input() contractData: any;

  TErouteBasedTableData: any[]

  // = RouteBasedTableData
  columnHeaderTErouteBased = {
    rTNM: {
      Title: "Route",
      class: "matcolumnleft",
      Style: "max-width:250px",
    },
    rTTNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    cPCTNM: {
      Title: "Capacity(Ton)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    rT: {
      Title: "Rate (₹)",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mIN: { 
      Title: "Min (₹)",
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
    //{ label: 'Remove' }
  ]
  staticFieldTErouteBased = ['mIN', 'rT', 'cPCTNM', 'rTNM', 'rTTNM', 'mAX']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  constructor(private dialog: MatDialog,
    private masterService: MasterService,
  ) { }

  ngOnInit(): void {
    this.getXpressDetail()
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);

    const data = changes.contractData?.currentValue
    //this.initializeFormControl(data);
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
      TERList: this.TErouteBasedTableData,
      Details: event,
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorTERModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getXpressDetail();
      this.tableLoad = true;
    });
  }
  //#endregion
  //#region to get tableData
  async getXpressDetail() {
    try {
      const collectionName = "vendor_contract_xprs_rt";

      const request = {
        companyCode: this.companyCode,
        collectionName: collectionName,
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