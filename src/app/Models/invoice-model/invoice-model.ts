import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
    providedIn: "root",
})

export class invoiceModel implements IFieldDefinition {
    constructor() { }

    /*below Block are Job Details Block*/
    public columnShipmentDetail = {
        shipment: {
            Title: "Shipment",
            class: "matcolumncenter",
            Style: "min-width:180px",
        },
        bookingdate: {
            Title: "Booking Date",
            class: "matcolumncenter",
            Style: "min-width:80px",
        },
        location: {
            Title: "Location",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        state: {
            Title: "State",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        vehicleNo: {
            Title: "Vehicle No",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        amount: {
            Title: "Amount(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        gst: {
            Title: "Gst(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        total: {
            Title: "Total   (₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:90px",
        },
    };
    public staticField =
        [
            "shipment",
            "bookingdate",
            "location",
            "state",
            "vehicleNo",
            "amount",
            "gst",
            "total"
        ]
    /*below Block are fo edit shipment Selection*/
    public columnShipmentSelection = {
    checkBoxRequired: {
            Title: "",
            class: "matcolumncenter",
            Style: "max-width:100px",
          },
        shipment: {
            Title: "Shipment",
            class: "matcolumncenter",
            Style: "min-width:180px",
        },
        bookingdate: {
            Title: "Booking Date",
            class: "matcolumncenter",
            Style: "min-width:80px",
        },
        location: {
            Title: "Location",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        state: {
            Title: "State",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        vehicleNo: {
            Title: "Vehicle No",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        amount: {
            Title: "Amount(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        gst: {
            Title: "Gst(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        },
        total: {
            Title: "Total(₹)",
            class: "matcolumncenter",
            Style: "min-width:2px",
        }
    };
    public staticSelectField =
        [
            "shipment",
            "bookingdate",
            "location",
            "state",
            "vehicleNo",
            "amount",
            "gst",
            "total"
        ]
    /* End */

    getColumn(columnName: string): any | undefined {
        return this.columnShipmentDetail[columnName] ?? undefined;
    }

    getColumnDetails(columnName: string, field: string): any | undefined {
        const columnInfo = this.columnShipmentDetail[columnName];
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
