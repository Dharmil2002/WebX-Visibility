import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import { GenericViewTableComponent } from "src/app/shared-components/generic-view-table/generic-view-table.component";

@Injectable({
    providedIn: "root",
})

export class rakeUpdationModel implements IFieldDefinition {
    public billingPartyDetails = {
        code: {
            Title: "Billing Party Code",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        name: {
            Title: "Billing Party Name",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
    };
    public cnNos = {
        code: {
            Title: "Billing Party",
            class: "matcolumnleft",
            Style: "min-width:100px",
        },
        name: {
            Title: "Consignment No",
            class: "matcolumnleft",
            Style: "min-width:200px",
        },
    };

    constructor() { }

    getcolumnHeader(title){
        return this[title];
    }
    getColumn(columnName: string): any | undefined {
        return this.billingPartyDetails[columnName] ?? undefined;
    }

    getColumnDetails(columnName: string, field: string): any | undefined {
        const columnInfo = this.billingPartyDetails[columnName];
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
