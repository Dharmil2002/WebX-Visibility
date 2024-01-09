import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
  providedIn: "root",
})

export class ChaEntryModel implements IFieldDefinition {
  constructor() {}
  public columnHeader = {
    docName: {
      Title: "Name of Document",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    clrChrg: {
      Title:"Clearance Charge (₹)",
      class: "matcolumnleft",
      Style: "min-width:200px"
    },
    gstRate: {
      Title:  "GST Rate",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    gstAmt: {
      Title: "GST Amount (₹)",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    totalAmt: {
      Title:"Total Amount (₹)",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    },
  };

  public staticField = [
    "docName",
    "clrChrg",
    "gstRate",
    "gstAmt",
    "totalAmt"
  ];
public  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
};
public menuItems = [{ label: "Edit" }, { label: "Remove" }];
  getColumn(columnName: string): any | undefined {
    return this.columnHeader[columnName] ?? undefined;
  }

  getColumnDetails(columnName: string, field: string): any | undefined {
    const columnInfo = this.columnHeader[columnName];
    return columnInfo ? columnInfo[field] : undefined;
  }

  getColumnTitle(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "Title");
  }

  getColumnClass(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "class");
  }

  getColumnStyle(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "Style");
  }
}
