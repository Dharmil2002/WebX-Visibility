import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-view-tracking-popup",
  templateUrl: "./view-tracking-popup.component.html",
})
export class ViewTrackingPopupComponent implements OnInit {
  isTableLode = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add TDS",
    iconName: "add",
  };
  columnHeader = {
    Date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    Details: {
      Title: "Additional Details",
      class: "matcolumncenter",
      Style: "min-width:30%",
    },
    User: {
      Title: "User",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    EDD: {
      Title: "Entry Date",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    CurrentLocation: {
      Title: "Current Location",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
    DocNo: {
      Title: "Document Number",
      class: "matcolumncenter",
      Style: "min-width:15%",
    },
  };
  staticField = ["Date", "Details", "User", "EDD", "CurrentLocation", "DocNo"];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any = [
    {
      Date: "Date",
      Details: "Additional Details",
      User: "User",
      EDD: "Entry Date",
      CurrentLocation: "Current Location",
      DocNo: "Document Number",
    },
    {
      Date: "Date",
      Details: "Additional Details",
      User: "User",
      EDD: "Entry Date",
      CurrentLocation: "Current Location",
      DocNo: "Document Number",
    },
    {
      Date: "Date",
      Details: "Additional Details",
      User: "User",
      EDD: "Entry Date",
      CurrentLocation: "Current Location",
      DocNo: "Document Number",
    },
    {
      Date: "Date",
      Details: "Additional Details",
      User: "User",
      EDD: "Entry Date",
      CurrentLocation: "Current Location",
      DocNo: "Document Number",
    },
  ];
  constructor(
    public dialogRef: MatDialogRef<ViewTrackingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
