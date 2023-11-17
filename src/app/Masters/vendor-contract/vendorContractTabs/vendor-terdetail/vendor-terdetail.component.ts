import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';
import { VendorTERModalComponent } from './vendor-termodal/vendor-termodal.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-terdetail',
  templateUrl: './vendor-terdetail.component.html'
})
export class VendorTERDetailComponent implements OnInit {
  @Input() contractData: any;

  TErouteBasedTableData: any[]

  // = RouteBasedTableData
  columnHeaderTErouteBased = {
    rtTpNM: {
      Title: "Route",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rtNM: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    cpctyNM: {
      Title: "Capacity",
      class: "matcolumnleft",
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
    { label: 'Remove' }
  ]
  staticFieldTErouteBased = ['min', 'rate', 'cpctyNM', 'rtNM', 'rtTpNM', 'max']
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  constructor(private dialog: MatDialog,
    private masterService: MasterService,
    private route: Router,) { }

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
    if (data.label.label === 'Remove') {
      this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== data.data.id);
    } else {
      const terDetails = this.TErouteBasedTableData.find(x => x.id == data.data.id);
      this.addDetails(terDetails)
    }
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
    dialogRef.afterClosed().subscribe((result) => {
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