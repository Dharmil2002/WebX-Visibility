import { Component, OnInit } from '@angular/core';
import { LastMileData } from '../../vendor-contract-list/VendorStaticData';
import { VendorLMDModalComponent } from './vendor-lmdmodal/vendor-lmdmodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-lmddetail',
  templateUrl: './vendor-lmddetail.component.html'
})
export class VendorLMDDetailComponent implements OnInit {
  TErouteBasedTableData = LastMileData
  columnHeaderTErouteBased = {
    location: {
      Title: "Location",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    rateType: {
      Title: "Rate Type",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    timeFrame: {
      Title: "Time Frame",
      class: "matcolumnleft",
      //Style: "max-width:100px",
    },
    capacity: {
      Title: "Capacity",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    minCharge: {
      Title: "Min Change",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    committedKm: {
      Title: "CommittedKm",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    additionalKm: {
      Title: "Additional KM",
      class: "matcolumncenter",
      //Style: "max-width:100px",
    },
    maxCharges: {
      Title: "Max Change",
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
  staticFieldTErouteBased = ['location', 'rateType', 'timeFrame', 'capacity', 'minCharge', 'committedKm', 'additionalKm', 'maxCharges']
  className = "col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-2";

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
    const dialogRef = this.dialog.open(VendorLMDModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);

      if (result != undefined) {
        if (EditableId) {
          this.TErouteBasedTableData = this.TErouteBasedTableData.filter((x) => x.id !== EditableId);
        }
        const json = {
          id: this.TErouteBasedTableData.length + 1,
          location: result.location.value,
          rateType: result.rateType.name,
          timeFrame: result.timeFrame,
          committedKm: result.committedKm,
          additionalKm: result.additionalKm,
          capacity: result.capacity.name,
          minCharge: result.minCharge,
          maxCharges: result.maxCharges,
          actions: ['Edit', 'Remove']
        }
        this.TErouteBasedTableData.push(json);
        this.tableLoad = true

      }
      this.tableLoad = true;
    });
  }
  //#endregion
  Submit() {
    console.log(this.TErouteBasedTableData);
  }
}
