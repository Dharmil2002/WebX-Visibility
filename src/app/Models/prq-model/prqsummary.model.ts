import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
  providedIn: "root",
})

export class PrqSummaryModel implements IFieldDefinition {
  constructor() {}

  public columnHeader = {
    createdDate: {
      Title: "Created Date",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    prqNo: {
      Title: "PRQ No",
      class: "matcolumnleft",
      Style: "min-width:200px",
      type:'windowLink',
      functionName:'OpenPrq'
    },
    size: {
      Title: "Veh/Cont-Size",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    pickUpDate: {
      Title: "Pk-Up Dt-Time",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    },
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
    { label: "Confirm", route: null, tabIndex: 6, status: "1", },
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
