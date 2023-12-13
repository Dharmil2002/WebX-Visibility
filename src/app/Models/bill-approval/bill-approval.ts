import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
    providedIn: "root",
})

export class BillApproval implements IFieldDefinition {
    constructor() { }
    menuItems = [{ label: "Approve Bill" }, { label: "Cancel Bill" }, { label: "Submission Bill" }];
    menuItemflag: boolean = true;

    /*below Block are Job Details Block*/
    public columnBillDetail = {
        customerName: {
            Title: "Customer Name",
            class: "matcolumncenter",
            Style: "min-width:180px",
        },
        bILLNO: {
            Title: "Bill No",
            class: "matcolumncenter",
            Style: "min-width:80px",
        },
        bGNDT: {
            Title: "Bill Date",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        aMT: {
            Title: "Bill Amount(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        pendingAmt: {
            Title: "Pending Bill Amount(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        status: {
            Title: "Status",
            class: "matcolumnleft",
            Style: "max-width:90px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:90px",
        },
    };
    public staticField =
        [
            "customerName",
            "bILLNO",
            "bGNDT",
            "aMT",
            "pendingAmt",
            "status",
            "action"
        ]

    getColumn(columnName: string): any | undefined {
        return this.columnBillDetail[columnName] ?? undefined;
    }

    getColumnDetails(columnName: string, field: string): any | undefined {
        const columnInfo = this.columnBillDetail[columnName];
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
