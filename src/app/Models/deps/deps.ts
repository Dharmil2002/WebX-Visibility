import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import * as StorageService from 'src/app/core/service/storage.service';
import { StoreKeys } from "src/app/config/myconstants";

@Injectable({
  providedIn: "root",
})
export class DepsModel implements IFieldDefinition {
  constructor() {}
  public columnHeader = {
    dEPSNO: {
      Title: "DEPS No",
      class: "matcolumnleft",
      Style: "min-width:18%",
      functionName: "OpenPrq",
      sticky: true,
    },
    dEPSDT: {
      Title: "DEPS Date",
      class: "matcolumncenter",
      Style: "min-width:6%",
      datatype: "datetime",
    },
    dKTNO: {
      Title: "GCN No:",
      class: "matcolumnleft",
      Style: "min-width:8%",
    },
    pKGS: {
      Title: "No of Pks",
      class: "matcolumncenter",
      Style: "min-width:8%",
      datatype:"string",
    },
    dEPIMG: {
      Title: "Image",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "datetime",
    },
    Reason: {
      Title: "Reason",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumncenter",
      //iconClass: "tbl-fav-edit",
      Style: "max-width:6%",
      stickyEnd: true,
    }
  };

  public staticField = [
    // "prqNo",
    "dEPSNO",
    "dEPSDT",
    "dKTNO",
    "pKGS",
    "dEPIMG",
    "Reason",
  ];

  public menuItems = [
    { label: "Update Deps", route: "/Operation/AssignVehicle" },
    { label: "Close Deps", route: "/Operation/ConsignmentEntry" }
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
