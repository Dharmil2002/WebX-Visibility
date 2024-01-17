import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import { GenericViewTableComponent } from "src/app/shared-components/generic-view-table/generic-view-table.component";

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
            Style: "min-width:180px",
        },
        cnDate: {
            Title: "CNDate",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
        contCnt: {
            Title: "Containers",
            class: "matcolumnleft",
            Style: "max-width:100px",
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
    public rakeHeader = {
        rrNo: {
            Title: "RR No",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        rrDate: {
            Title: "RR Date",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:150px",
        }
    }
    public invDetails = {
        invNum: {
            Title: "InvNo",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        invDate: {
            Title: "InvDate",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        invAmt: {
            Title: "Inv Amount(Rs)",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:150px",
        }
    }
    public columnHeader: {} = this.jobHeader;
    public rakeStaticField =
        [
            "rrNo",
            "rrDate"
        ]
    public staticField = [
        "cnNo",
        "cnDate",
        "noOfPkg",
        "weight",
        "fCity",
        "tCity",
        "billingParty",
        "contDtl"
    ];
    public staticInvField =
        [
            'invNum',
            'invDate',
            'invAmt'
        ]
    public menuItems = [{ label: "Edit" }, { label: "Remove" }]
    public linkArray = [
        { Row: 'contCnt', Path: '', componentDetails: GenericViewTableComponent },
    ]
    public jsonColumn = {
        cNID: {
            Title: "Container No",
            class: "matcolumnleft",
            Style: "min-width:250px",
        },
        cNTYP: {
            Title: "Container Type",
            class: "matcolumnleft",
            Style: "min-width:250px",
        }

    }
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
