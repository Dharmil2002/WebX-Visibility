import { Component, OnInit } from '@angular/core';
import { RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';
import { MatDialog } from '@angular/material/dialog';
import { VendorLHLModalComponent } from './vendor-lhlmodal/vendor-lhlmodal.component';

@Component({
  selector: 'app-vendor-lhldetail',
  templateUrl: './vendor-lhldetail.component.html'
})
export class VendorLHLDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData = RouteBasedTableData
  columnHeaderTErouteBased = {
    route: {
      Title: "Route",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    capacity: {
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
  staticFieldTErouteBased = ['min', 'rate', 'capacity', 'route', 'rateType', 'max']
  constructor(private dialog: MatDialog,) { }

  ngOnInit(): void {
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (EditableId) {
          this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.TErouteBasedTableData.length + 1,
          route: result.route.name,
          rateType: result.rateType.name,
          capacity: result.capacity.name,
          rate: result.rate,
          min: result.min,
          max: result.max,
          actions: ['Edit', 'Remove']
        }
        this.TErouteBasedTableData.push(json);
        this.tableLoad = true

      }
      this.tableLoad = true;
    });
  }
  //#endregion
}
