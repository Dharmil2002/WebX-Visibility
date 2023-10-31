import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';

@Component({
  selector: 'app-prq-list',
  templateUrl: './prq-list.component.html'
})
export class PrqListComponent implements OnInit {
  tableLoad = true;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  //Here the header which is Used to the displayed in html
  columnHeader = {
    checkBoxRequired: {
      Title: "Select",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    prqNo: {
      Title: "PRQ No",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    size: {
      Title: "Veh/Cont-Size",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    pickUpDate: {
      Title: "Pick Up Date Time",
      class: "matcolumnleft",
      Style: "min-width:200px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    createdDate: {
      Title: "Created Date",
      class: "matcolumnleft",
      Style: "min-width:100px",
    }
  };
  staticField = [
    "prqNo",
    "pickUpDate",
    "billingParty",
    "fromToCity",
    "status",
    "createdDate",
    "size"
  ];
  menuItemflag: boolean = false;
  addAndEditPath: string;
  tableData: any[];
  linkArray = [{ Row: "", Path: "" }];
  items: any;
  constructor(public dialogRef: MatDialogRef<GenericTableComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any) {
    if (item) {
      this.items=item;     
    }
  }

  ngOnInit(): void {
    this.getShipment();
  }
  getShipment() {
    this.tableData = this.items.map((x) => {
      x.isSelected = false;
      x.size=x.vehicleSize?x.vehicleSize : x.containerSize?x.containerSize:""
      return x;
    });

    this.tableLoad = false;
  }

  IsActiveFuntion(event) {
    if (event.length > 0) {
     this.dialogRef.close(event);
    }
  }
  close(){
    this.dialogRef.close();
  }
}
