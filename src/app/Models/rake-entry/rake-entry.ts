import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
    providedIn: "root",
})

export class RakeEntryModel implements IFieldDefinition {
    constructor() { }
    public jobHeader = {
        jobNo: {
            Title: "Job No",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        jobDate: {
            Title: "Job Date",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
        noOfPkg: {
            Title: "No Of Pkts",
            class: "matcolumncenter",
            Style: "min-width:150px",
        },
        weight: {
            Title: "Weight",
            class: "matcolumncenter",
            Style: "min-width:100px",
        },
        fCity: {
            Title: "From City",
            class: "matcolumnleft",
            Style: "max-width:150px",
        },
        tCity: {
            Title: "To City",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        billingParty: {
            Title: "Billing Party",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:150px",
        }
    };
    public cnoteHeader = {
        cnNo: {
            Title: "CNNo",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        cnDate: {
            Title: "CNDate",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
        noOfPkg: {
            Title: "No Of Pkts",
            class: "matcolumncenter",
            Style: "min-width:150px",
        },
        weight: {
            Title: "Weight",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        fCity: {
            Title: "From City",
            class: "matcolumnleft",
            Style: "max-width:150px",
        },
        tCity: {
            Title: "To City",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        billingParty: {
            Title: "Billing Party",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:150px",
        }
    };
    public columnHeader:{}=this.jobHeader;
    public staticField = [
        "cnNo",
        "cnDate",
        "jobNo",
        "jobDate",
        "noOfPkg",
        "weight",
        "fCity",
        "tCity",
        "billingParty",
    ];

    public menuItems = [{ label: "Edit" }, { label: "Remove" }]
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
