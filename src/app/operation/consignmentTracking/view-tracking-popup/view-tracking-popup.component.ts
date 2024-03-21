import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import moment from "moment";

@Component({
  selector: "app-view-tracking-popup",
  templateUrl: "./view-tracking-popup.component.html",
})
export class ViewTrackingPopupComponent implements OnInit {
  isTableLode = false;
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
      Style: "min-width:12%",
    },
    oPSSTS: {
      Title: "Additional Details",
      class: "matcolumnleft",
      Style: "min-width:25%",
    },
    eVNID: {
      Title: "User",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    EDD: {
      Title: "Entry Date",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    Location: {
      Title: "Current Location",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    DocNo: {
      Title: "Document Number",
      class: "matcolumncenter",
      Style: "min-width:20%",
    },
  };
  staticField = ["Date", "oPSSTS", "eVNID", "EDD", "Location", "DocNo"];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any;
  constructor(
    public dialogRef: MatDialogRef<ViewTrackingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data" ,this.data)
    this.TableData = this.data?.map((x)=>{
      return {
        ...x,
        Date:moment(x.eVNDT).format("DD-MM-YYYY hh:mm"),
        EDD:moment(x.eNTDT).format("DD-MM-YYYY hh:mm"),
        Location: x.lOC || x.eNTLOC,
        DocNo:x.dOCNO || x.dKTNO
      }
    })
    this.isTableLode = true;
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
