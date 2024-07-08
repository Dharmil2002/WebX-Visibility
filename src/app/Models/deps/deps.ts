import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import * as StorageService from 'src/app/core/service/storage.service';
import { StoreKeys } from "src/app/config/myconstants";
import { DataType } from "@generic-ui/ngx-grid/core/structure/field/domain/field/data/data-type";

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
      datatype:"string"
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
       datatype:"string"
    },
    pKGS: {
      Title: "No of Pks",
      class: "matcolumncenter",
      Style: "min-width:8%",
      datatype:"string",
    },
    pod: {
      Title: "Image",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "datetime",
      type:"view"
    },
    rES: {
      Title: "Reason",
      class: "matcolumnleft",
      Style: "min-width:10%",
       datatype:"string"
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
    "rES",
    "dEPIMG",

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
