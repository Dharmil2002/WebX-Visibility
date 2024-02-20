import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditVoucherControl {
    creditVoucherSummaryArray: FormControls[];
    creditVoucherDetailsArray: FormControls[];
    constructor(FormValues) {
        this.creditVoucherSummaryArray = [

            {
                name: "VoucherNumber",
                label: "Voucher Number",
                placeholder: "Voucher Number",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },

            {
                name: "TransactionDate",
                label: "Transaction Date",
                placeholder: "Transaction Date",
                type: "date",
                value: new Date(),
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                },
            },
            {
                name: "EntryLocation",
                label: "Entry Location",
                placeholder: "Entry Location",
                type: "text",
                value: localStorage.getItem('Branch'),
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "Accountinglocation",
                label: "Accounting location",
                placeholder: "Accounting location",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Accounting location is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "Basic"
                }                
            },
            {
                name: "Receivedfrom",
                label: "Received From",
                placeholder: "Select Received from",
                type: "Staticdropdown",
                value: [
                    {
                        value: "Customer",
                        name: "Customer",
                    },
                    {
                        value: "Vendor",
                        name: "Vendor",
                    },
                    {
                        value: "Employee",
                        name: "Employee",
                    },
                    {
                        value: "Driver",
                        name: "Driver",
                    },
                    {
                        value: "General",
                        name: "General",
                    },
                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Prepared for is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                },
                functions: {
                    onSelection: "ReceivedfromFieldChanged"
                },
            },
            {
                name: "PartyName",
                label: "Party Name",
                placeholder: "Party Name",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Party is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                }                
            },
            {
                name: "Preparedby",
                label: "Prepared by",
                placeholder: "Prepared by",
                type: "text",
                value: localStorage.getItem('UserName'),
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "EntryDateandtime",
                label: "Entry Date and time",
                placeholder: "Entry Date and time",
                type: "datetimerpicker",
                value: new Date(),
                generatecontrol: true,
                disable: true,
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                },
            },

        ];
        this.creditVoucherDetailsArray = [
            {
                name: "Ledger",
                label: "Ledger",
                placeholder: "Ledger",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Ledger is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                    metaData: "Basic"
                },
            },
            {
                name: "CreditAmount",
                label: "Credit Amount ₹",
                placeholder: "Credit Amount ₹",
                type: "number",
                value: FormValues?.CreditAmount,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Credit Amount is required!",
                    },
                    {
                        name: "pattern",
                        message: "Please Enter Valid Credit Amount",
                        pattern: '^[^-]+$'
                    },
                ],

            },
            {
                name: "Narration",
                label: "Narration",
                placeholder: "Narration",
                type: "text",
                value: FormValues?.Narration,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Narration is required!",
                    },
                ]
            },
            {
                name: "LedgerHdn",
                label: "",
                placeholder: "",
                type: "",
                value: "",
                generatecontrol: false,
                disable: false,
                Validations: [],
            }
        ]
    }
    getCreditVoucherSummaryArrayControls() {
        return this.creditVoucherSummaryArray;
    }
    getCreditVoucherDetailArrayControls() {
        return this.creditVoucherDetailsArray;
    }
}
