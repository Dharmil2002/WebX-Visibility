import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
  providedIn: "root",
})
export class ConsigmentLtlModel implements IFieldDefinition {
  constructor() {}
  columnInvoice = {
    ewayBillNo: {
      Title: "Eway Bill Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
      datatype: "string",
      sticky: true
    },
    ewayBillDate: {
      Title: "Eway Bill Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
      sticky: true
    },
    expiryDate: {
      Title: "Eway Bill Expiry Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
      sticky: true
    },
    invoiceNumber: {
      Title: "Invoice Number",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype: "string",
      sticky: true
    },
    invDt: {
      Title: "Invoice Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    invoiceAmount: {
      Title: "Invoice Amount",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    cubWT: {
      Title: "Cubic Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    noOfPackage: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialName: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    actualWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    chargedWeight: {
      Title: "Charged Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialDensity: {
      Title: "Material Density",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    pkgsTypeInvNM: {
      Title: "Packaging Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:100px",
      stickyEnd: true
    },
  };
  columnVolInvoice={
    ewayBillNo: {
      Title: "Eway Bill Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
      sticky: true
    },
    ewayBillDate: {
      Title: "Eway Bill Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
      sticky: true
    },
    expiryDate: {
      Title: "Eway Bill Expiry Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
      sticky: true
    },
    invoiceNumber: {
      Title: "Invoice Number",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
      sticky: true
    },
    invDt: {
      Title: "Invoice Date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    cftRation: {
      Title: "CFT Ratio",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    length: {
      Title: "Length",
      lable: "Length",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    breadth: {
      Title: "Breadth",
      lable: "Breadth",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    height: {
      Title: "Height",
      lable: "Height",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    invoiceAmount: {
      Title: "Invoice Amount",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    cubWT: {
      Title: "Cubic Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    noOfPackage: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    cft: {
      Title: "CFT Total",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialName: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    actualWeight: {
      Title: "Actual Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    chargedWeight: {
      Title: "Charged Weight (Kg)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialDensity: {
      Title: "Material Density",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    pkgsTypeInvNM: {
      Title: "Packaging Type",
      class: "matcolumncenter",
      Style: "min-width:2px",
      datatype:"string",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:100px",
      stickyEnd: true
    },
  };
  getColumn(columnName: string): any | undefined {
    return this.columnInvoice[columnName] ?? undefined;
  }

  getColumnDetails(columnName: string, field: string): any | undefined {
    const columnInfo = this.columnInvoice[columnName];
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
