import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorLHLModalComponent } from './vendor-lhlmodal/vendor-lhlmodal.component';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-vendor-lhldetail',
  templateUrl: './vendor-lhldetail.component.html'
})
export class VendorLHLDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData: any[]
  columnHeaderTErouteBased = {
    rtTpNM: {
      Title: "Route",
      class: "matcolumnleft",
      Style: "max-width:250px",
    },
    rtNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    cpctyNM: {
      Title: "Capacity",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    rate: {
      Title: "Rate",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    min: {
      Title: "Min",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    max: {
      Title: "Max",
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
  staticFieldTErouteBased = ['min', 'rate', 'cpctyNM', 'rtNM', 'rtTpNM', 'max']
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
    const EditableId = event?.id
    const request = {
      TERList: this.TErouteBasedTableData,
      Details: event,
    }
    this.tableLoad = false;
    const dialogRef = this.dialog.open(VendorLHLModalComponent, {
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
      const collectionName = "vendor_contract_lhl_rt";

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