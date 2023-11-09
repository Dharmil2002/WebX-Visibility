import { Component, OnInit } from '@angular/core';
import { BusinessAssociates, RouteBasedTableData } from '../../vendor-contract-list/VendorStaticData';
import { VendorBusiAssocModalComponent } from './vendor-busi-assoc-modal/vendor-busi-assoc-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-busi-assoc-detail',
  templateUrl: './vendor-busi-assoc-detail.component.html'
})
export class VendorBusiAssocDetailComponent implements OnInit {
  // @Input() contractData: any;

  TErouteBasedTableData = BusinessAssociates
  columnHeaderTErouteBased = {
    city: {
      Title: "City",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    controlLocation: {
      Title: "CtrllLocation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    operation: {
      Title: "Operation",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    mode: {
      Title: "Transport Mode",
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
    { label: 'Remove' }
  ]
  staticFieldTErouteBased = ['city', 'controlLocation', 'operation', 'rateType', 'mode', , 'rate', 'min', 'max']
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
      List: this.TErouteBasedTableData,
      Details: event,
      //url: this.url
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
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.TErouteBasedTableData.length + 1,
          city: result.city.name,
          controlLocation: result.city.value,
          mode: result.mode.name,
          rateType: result.rateType.name,
          min: result.min,
          max: result.max,
          rate: result.rate,
          operation: result.operation.name,
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
