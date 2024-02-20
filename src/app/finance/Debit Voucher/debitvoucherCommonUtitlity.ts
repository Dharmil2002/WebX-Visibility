export function GetLedgercolumnHeader() {
    return {
        Ledger: {
            Title: "Ledger",
            class: "matcolumnfirst",
            Style: "min-width:200px",
        },
        SACCode: {
            Title: "SACCode",
            class: "matcolumncenter",
            Style: "min-width:200px",
        },
        DebitAmount: {
            Title: "Debit Amount ₹",
            class: "matcolumncenter",
            Style: "max-width:120px",
        },
        GSTRate: {
            Title: "GST Rate %",
            class: "matcolumncenter",
            Style: "max-width:100px",
        },
        GSTAmount: {
            Title: "GST Amount ₹",
            class: "matcolumncenter",
            Style: "max-width:120px",
        },
        Total: {
            Title: "Total ₹",
            class: "matcolumncenter",
            Style: "max-width:100px",
        },
        TDSApplicable: {
            Title: "TDS Applicable",
            class: "matcolumncenter",
            Style: "max-width:100px",
        },
        Narration: {
            Title: "Narration",
            class: "matcolumncenter",
            Style: "min-width:170px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:100px",
        }
    }
}


export function GetLedgerDocument() {

    return {
        DocumentType: {
            Title: "DocumentType",
            class: "matcolumncenter",
            Style: "min-width:200px",
        },
        Document: {
            Title: "Document",
            class: "matcolumnfirst",
            Style: "min-width:200px",
        },

        DebitAmountAgaintsDocument: {
            Title: "DebitAmount ₹",
            class: "matcolumncenter",
            Style: "min-width:170px",
        },
        actionsItems: {
            Title: "Action",
            class: "matcolumnleft",
            Style: "max-width:100px",
        }
    }
}


export function GetDebitLedgerPreviewcolumnHeader() {
    return {
        // Instance: {
        //     Title: "Instance",
        //     class: "matcolumnfirst",
        //     Style: "min-width:100px",
        // },
        // Value: {
        //     Title: "Value",
        //     class: "matcolumncenter",
        //     Style: "min-width:100px",
        // },
        Ledgercode: {
            Title: "Ledger code",
            class: "matcolumncenter",
            Style: "max-width:200px",
        },
        Ledgername: {
            Title: "Ledger name",
            class: "matcolumncenter",
            Style: "max-width:200px",
        },
        SubLedger: {
            Title: "Sub Ledger",
            class: "matcolumncenter",
            Style: "max-width:150px",
        },
        Dr: {
            Title: "Dr. ₹",
            class: "matcolumncenter",
            Style: "max-width:100px",
        },
        Cr: {
            Title: "Cr. ₹",
            class: "matcolumncenter",
            Style: "max-width:100px",
        },
        Location: {
            Title: "Location",
            class: "matcolumncenter",
            Style: "min-width:100px",
        },
        Narration: {
            Title: "Narration",
            class: "matcolumncenter",
            Style: "min-width:200px",
        },
        // DocumentReference: {
        //     Title: "Document Reference",
        //     class: "matcolumncenter",
        //     Style: "min-width:150px",
        // },

    }
}
