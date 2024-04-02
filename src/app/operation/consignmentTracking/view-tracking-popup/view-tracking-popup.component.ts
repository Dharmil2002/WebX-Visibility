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
    AdditionalDetails: {
      Title: "Additional Details",
      class: "matcolumnleft",
      Style: "min-width:25%",
    },

    Event: {
      Title: "Event",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    EDD: {
      Title: "Entry Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    Location: {
      Title: "Current Location",
      class: "matcolumnleft",
      Style: "min-width:7%",
    },
    DocNo: {
      Title: "Document Number",
      class: "matcolumnleft",
      Style: "min-width:15%",
    },
    eNTBY: {
      Title: "User",
      class: "matcolumnleft",
      Style: "min-width:5%",
    },
  };
  staticField = [
    "Date",
    "AdditionalDetails",
    "eNTBY",
    "EDD",
    "Event",
    "Location",
    "DocNo",
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any;
  FormTitle:any
  constructor(
    public dialogRef: MatDialogRef<ViewTrackingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const sortByDate = (a, b) => {
      return new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime();
    };
    this.FormTitle = this.data.DokNo?this.data.DokNo:'C-Not Tracking List'
    this.TableData = this.data.TrackingList
      ?.map((x) => {
        return {
          ...x,
          Date: moment(x.eVNDT).format("DD-MM-YYYY hh:mm"),
          EDD: moment(x.eNTDT).format("DD-MM-YYYY hh:mm"),
          Location: x.lOC || x.eNTLOC,
          DocNo: x.dOCNO || x.dKTNO,
          AdditionalDetails: x.oPSSTS || x.oPSTS,
          Event: x.eVNID + " : " + x.eVNDES,
        };
      })
      .sort(sortByDate);

    
    this.isTableLode = true;
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
