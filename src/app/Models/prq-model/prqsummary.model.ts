import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import * as StorageService from 'src/app/core/service/storage.service';
import { StoreKeys } from "src/app/config/myconstants";

@Injectable({
  providedIn: "root",
})
export class PrqSummaryModel implements IFieldDefinition {
  constructor() {}

  public columnHeader = {   
    prqNo: {
      Title: "PRQ No",
      class: "matcolumnleft",
      Style: "min-width:18%",
      type: "windowLink",
      functionName: "OpenPrq",
      sticky: true,
    },
    size: {
      Title: "Veh/Cont-Size",
      class: "matcolumncenter",
      Style: "min-width:6%",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:8%",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:10%",
    },
    pickUpDate: {
      Title: "Pickup Date & Time",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "datetime",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:6%",
    },
    createdDate: {
      Title: "Created Date",
      class: "matcolumncenter",
      Style: "min-width:10%",
      datatype: "datetime",
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
    "pickUpDate",
    "billingParty",
    "fromToCity",
    "status",
    "createdDate",
    "size",
  ];

  public menuItems = [
    { label: "Confirm", route: null, tabIndex: 6, status: "1" },
    { label: "Reject", route: null, tabIndex: 6, status: "5" },
    { label: "Assign Vehicle", route: "/Operation/AssignVehicle" },
    { label: "Add Docket", route: "/Operation/ConsignmentEntry" },
    { label: "Modify", route: "/Operation/PRQEntry" },
    { label: "Create THC", route: "/Operation/thc-create" },
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
export class prqUpload {
    _id:string;
    pRQNO: string;
    bPARTY: string;
    pICKDT: Date;
    cARTYP:number;
    cNTYP: number;
    cNTSIZE: number;
    vEHSIZE: number;
    pHNO: number;
    pADD: string;
    fCITY: string;
    tCITY: string;
    bRCD: string;
    pAYTYP: string;
    cONTRAMT:number;
    oDRNO: string;
    oDRDT:  Date;
    oDRBY: string;
    rMKS: string;
    sIZE: number;
    cID: number;
    bPARTYNM: string;
    pADDNM: string;
    cARTYPNM: string;
    vEHSIZENM:string;
    pAYTYPNM: string;
    cNTYPNM:string;
    sTS: number;
    sTSNM: string;
    docNo: string;
    eNTDT: Date;
    eNTLOC:string;
    eNTBY: string;
    constructor() {
      this.eNTBY = StorageService.getItem(StoreKeys.UserId);
      this.eNTLOC = StorageService.getItem(StoreKeys.Branch);
      this.eNTDT = new Date();
      this.cID = parseInt(StorageService.getItem(StoreKeys.CompanyCode));
    }
}
