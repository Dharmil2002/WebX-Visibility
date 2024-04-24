import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import moment from "moment";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-view-tracking-popup",
  templateUrl: "./view-tracking-popup.component.html",
})
export class ViewTrackingPopupComponent implements OnInit {
  isTableLode = false;
  dynamicControls = {
    add: false,
    edit: false,
    csv: true,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add TDS",
    iconName: "add",
  };
  csvHeader = {
    Date:  "Date",
    AdditionalDetails: "Additional Details",
    Event: "Event",
    Location: "Current Location",
    DocNo: "Document Number",
    eNTDT: "Entry Date",
    eNTBY: "User"
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
    eNTDT: {
      Title: "Entry Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
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
    "eNTDT",
    "Event",
    "Location",
    "DocNo",
  ];
  CompanyCode = 0;
  TableData: any;
  FormTitle:any
  constructor(
    private storage: StorageService,
    public dialogRef: MatDialogRef<ViewTrackingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.CompanyCode = this.storage.companyCode;
    const sortByDate = (a, b) => {
      return new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime();
    };
    this.FormTitle = this.data.DokNo?this.data.DokNo:'C-Not Tracking List'
    this.TableData = this.data.TrackingList
      ?.map((x) => {
        return {
          ...x,
          Date: moment(x.eVNDT).format("DD MMM YY hh:mm"),
          eNTDT: moment(x.eNTDT).format("DD MMM YY hh:mm"),
          Location: x.lOC || x.eNTLOC,
          DocNo: x.dOCNO || x.dKTNO,
          AdditionalDetails: x.oPSSTS || x.oPSTS,
          Event: x.eVNDES,
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
