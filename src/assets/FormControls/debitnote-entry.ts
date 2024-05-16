import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class debitNoteGenerationControls {

    debitNoteSeletion: FormControls[];
    debitNoteStDetails: FormControls[];

    debitNotesDetails: FormControls[];
    GenerateDebitNote: FormControls[];
    modifyDebitNote:FormControls[];
    filterDebitNote:FormControls[];
    constructor(FormValues=null) {

        // New one From Documnet

        this.GenerateDebitNote = [
            {
                name: "VendorName",
                label: "Select Vendor",
                placeholder: "Select Vendor",
                type: "dropdown",
                value: [],
                generatecontrol: true,
                disable: false,
                Validations: [
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
                functions: {
                    onOptionSelect: "getVendorList",
                    onModel:"PreparedforFieldChanged"
                },
            },
        
        {
            name: "BillNo",
            label: "Select Bill ",
            placeholder: "Select Bill ",
            type: "dropdown",
            value: "",
            filterOptions: "",
            autocomplete: "",
            displaywith: "",
            generatecontrol: true,
            disable: false,
            Validations: [
              {
                name: "required",
                message: "Invoice is required",
              },
            ],
            additionalData: {
              showNameAndValue: false,
            },
            functions: {
              onChange: "InvoiceNumberChange"
            },
          },
        // {
        //     name: "BillNo",
        //     label: "Enter Bill Number",
        //     placeholder: "Enter Bill Number",
        //     type: "text",
        //     value: "",
        //     generatecontrol: true,
        //     disable: false,
        //     Validations: [
        //     ],
        //     additionalData: {
        //         showNameAndValue: false,
        //     },
        //     functions: {},
        // }, 
        ];
        this.debitNotesDetails = [
            // Form Data 
            {
                name: "VendorName",
                label: "Vendor Name",
                placeholder: "Vendor Name",
                type: "text",
                value: "V001: Adarsh Roadways",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {

                },
            },
            {
                name: "DNdate",
                label: "Debit Note Date",
                placeholder: "Debit Note Date",
                type: "date",
                value: "18-Apr-2024",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "Location",
                label: "location",
                placeholder: "location",
                type: "text",
                value: "MUMB",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {

                },
            },
            {
                name: "Reason",
                label: "Reason of Debit Note",
                placeholder: "Reason of Debit Note",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Reason of Debit Note is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                functions: {
                    onSelection: ""
                },
            },
            {
                name: "Remarks",
                label: "Remarks",
                placeholder: "Remarks",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {

                },
            },

        ];
        this.modifyDebitNote = [
            {
                name: "AccountInfo",
                label: "Invoice Number",
                placeholder: "Invoice Number",
                type: "text",
                // value: FormValues?.value + ":" + FormValues?.name,
                value: FormValues?.docNo,
                generatecontrol: true,
                disable: true,
                Validations: []
            },

            {
                name: "DebitAmount",
                label: "Debit-Note Amount ₹",
                placeholder: "Debit-Note Amount ₹",
                type: "number",
                value: FormValues?.dNAMT,
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {
                    onChange: "onChangeAmount"
                },

            },
            {
                name: "GstRevAmount",
                label: "GST reversal Amount ₹",
                placeholder: "GST reversal Amount ₹",
                type: "number",
                value: FormValues?.gstRevlAmt,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "TdsRevAmount",
                label: "TDS reversal Amount ₹",
                placeholder: "TDS reversal Amount ₹",
                type: "number",
                value: FormValues?.tdsRevlAmt,
                generatecontrol: true,
                disable: false,
                Validations:[],

            },
            {
                name: "gstRate",
                label: "GST Rate​",
                placeholder: "GST Rate​",
                type: "number",
                value: FormValues?.gST1,
                generatecontrol: true,
                disable: true,
                Validations:[],
            },

        ]
        this.filterDebitNote=[
            
        ]

        //old
        this.debitNoteSeletion = [
            {
                name: "CustomerName",
                label: "Select Customer",
                placeholder: "Select Customer",
                type: "dropdown",
                value: "",
                filterOptions: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
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
                functions: {
                    onOptionSelect: "PreparedforFieldChanged"
                },

            },

            {
                name: "InvoiceNumber",
                label: "Select Invoice ",
                placeholder: "Select Invoice ",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Invoice is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                functions: {
                    onChange: "InvoiceNumberChange"
                },
            },
        ];
        this.debitNoteStDetails = [
            // Form Data
            {
                name: "InvoiceDate",
                label: "Invoice Date",
                placeholder: "Invoice Date",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "InvoiceBranch",
                label: "Invoice Branch",
                placeholder: "Invoice Branch",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "GSTRate",
                label: "GST Rate",
                placeholder: "GST Rate",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "InvoiceAmt",
                label: "Invoice Amt",
                placeholder: "Invoice Amt",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "InvoiceType",
                label: "Invoice Type",
                placeholder: "Invoice Type",
                type: "text",
                value: "Freight Invoice ",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "GSTType",
                label: "GST Type",
                placeholder: "GST Type",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "PendingAmt",
                label: "Pending Amt",
                placeholder: "Pending Amt",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "InvoiceStatus",
                label: "Invoice Status",
                placeholder: "Invoice Status",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "SACCode",
                label: "SAC Code",
                placeholder: "SAC Code",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "SAC Code is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                },
                functions: {
                    onSelection: ""
                },
            },
        ];

    }


    getGenerateDebitNote() {
        return this.GenerateDebitNote;
    }
    getModifydebitNote() {
        return this.modifyDebitNote;
    }
    getdebitNoteSeletion() {
        return this.debitNoteSeletion;
    }
    getdebitNoteStDetails() {
        return this.debitNoteStDetails;
    }
    getdebitNotesDetails() {
        return this.debitNotesDetails;
    }


}
