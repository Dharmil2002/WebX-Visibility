import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
  providedIn: "root",
})

export class PendingBillingModel implements IFieldDefinition{
    constructor() {}
    getColumn(columnName: string) {
        throw new Error("Method not implemented.");
    }
    getColumnDetails(columnName: string, field: string) {
        throw new Error("Method not implemented.");
    }
    getColumnTitle(columnName: string): string {
        throw new Error("Method not implemented.");
    }
    getColumnClass(columnName: string): string {
        throw new Error("Method not implemented.");
    }
    getColumnStyle(columnName: string): string {
        throw new Error("Method not implemented.");
    }

}