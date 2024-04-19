import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import * as StorageService from 'src/app/core/service/storage.service';
import { StoreKeys } from "src/app/config/myconstants";

@Injectable({
  providedIn: "root",
})
export class Menifest implements IFieldDefinition {
  constructor() {}
  public columnHeader = {   
    shipment: {
      Title: "GCN NO",
      class: "matcolumnleft",
      Style: "min-width:18%",
      type: "windowLink",
      functionName: "OpenPrq",
      sticky: true,
    },
    suffix: {
      Title: "Suffix",
      class: "matcolumncenter",
      Style: "min-width:6%",
    },
    origin: {
      Title: "Origin",
      class: "matcolumnleft",
      Style: "min-width:8%",
    },
    dest: {
      Title: "Destination",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    bookPkg: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "datetime",
    },
    bookWT: {
        Title: "Wt",
        class: "matcolumncenter",
        Style: "min-width:16%",
        datatype: "datetime",
      },
    loadedPkg: {
        Title: "Pkgs",
        class: "matcolumncenter",
        Style: "min-width:16%",
        datatype: "datetime",
      },
    loadedWT: {
          Title: "Wt",
          class: "matcolumncenter",
          Style: "min-width:16%",
          datatype: "datetime",
        },
    pendPkg: {
      Title: "Pkgs",
      class: "matcolumnleft",
      Style: "min-width:6%",
    },
    pendWt: {
      Title: "Wt",
      class: "matcolumncenter",
      Style: "min-width:10%",
      datatype: "datetime",
    },
    leg: {
        Title: "Leg",
        class: "matcolumncenter",
        Style: "min-width:10%",
        datatype: "datetime",
      },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width:6%",
      stickyEnd: true,
    }
  };
  public staticField = [
    "shipment",
    "suffix",
    "origin",
    "dest",
    "bookPkg",
    "bookWT",
    "loadedPkg",
    "loadedWT",
    "pendPkg",
    "pendWt",
    "leg"
  ];
  
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
