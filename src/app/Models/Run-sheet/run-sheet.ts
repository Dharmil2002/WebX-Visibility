import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import { EditShipmentDetailsComponent } from "src/app/operation/vehicle-update-upload/edit-shipment-details/edit-shipment-details.component";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";
import { EditRunsheetShipmentsComponent } from "src/app/operation/update-run-sheet/edit-runsheet-shipments/edit-runsheet-shipments.component";


@Injectable({
  providedIn: "root",
})
export class RunSheet implements IFieldDefinition {
  constructor() { }
  public columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:80px",
    },
    shipment: {
      Title: `${DocCalledAs.Docket} No`,
      class: "matcolumnleft",
      Style: "min-width:18%",
    },
    packages: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "number",
      sticky: true
    },
    loaded: {
      Title: "Loaded",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "number",
    },
    pending: {
      Title: "Pending",
      class: "matcolumncenter",
      Style: "min-width:16%",
      datatype: "number",
    },
    // loadedWT: {
    //   Title: "Wt",
    //   datatype: "number",
    //   class: "matcolumncenter",
    //   Style: "min-width:16%",
    // },
    // pendPkg: {
    //   Title: "Pkgs",
    //   datatype: "number",
    //   class: "matcolumnleft",
    //   Style: "min-width:6%",
    // },
    // pendWt: {
    //   Title: "Wt",
    //   datatype: "number",
    //   class: "matcolumncenter",
    //   Style: "min-width:10%",
    // },
    // // Leg: {
    // //     Title: "Leg",
    // //     class: "matcolumncenter",
    // //     Style: "min-width:10%",
    // //   },
    // actionsItems: {
    //   Title: "Action",
    //   class: "matcolumncenter",
    //   Style: "max-width:6%",
    //   stickyEnd: true,
    // }
  };
  // summaryGroup = [{
  //   Name: "Docket Details",
  //   Title: "",
  //   class: "matcolumncenter",
  //   ColSpan: 2,
  //   sticky: true
  // },
  // {
  //   Name: "Booked",
  //   Title: "Booked",
  //   class: "matcolumncenter",
  //   ColSpan: 2,
  //   sticky: true
  // },
  // {
  //   Name: "Loaded",
  //   Title: "Loaded",
  //   class: "matcolumncenter",
  //   ColSpan: 2,
  //   sticky: true
  // },
  // {
  //   Name: "Pending",
  //   Title: "Pending",
  //   class: "matcolumncenter",
  //   ColSpan: 2,
  //   sticky: true
  // },
  // {
  //   Name: "action",
  //   Title: "",
  //   class: "matcolumncenter",
  //   ColSpan: 2,
  //   sticky: true
  // }
  // ];
  public staticField = [
    "shipment",
    "packages",
    "aCTWT",
    "loaded",
    "pending"
  ];
  menuItems = [
    { label: 'Edit', componentDetails: EditRunsheetShipmentsComponent, function: "GeneralMultipleView" },
    // Add more menu items as needed
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
