import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ChaEntryControl {
    chaEntryControlArray: FormControls[];
    chaTableFormControlArray: FormControls[];
    constructor() {
        this.chaEntryControlArray = [
            {
                name: "chaId",
                label: "CHA ID",
                placeholder: "Enter CHA ID",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: "documentType",
                label: " Document Type",
                placeholder: 'Document Type',
                type: "Staticdropdown",
                value: [],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'billingParty', label: "Billing Party", placeholder: "Select Billing Party", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true,disable: true,
                Validations: [
                    {
                        name: "required",
                        message: "Billing Party is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    }
                ],
                functions: {
                    onModel: "getCustomer"
                },
                additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'jobNo', label: "Job No/CN No", placeholder: "", type: 'text', value: "",
                generatecontrol: true, disable: true,
                Validations: [],
                functions: {
                    onChange: 'selectHandleFileSelection',
                }
            },
            {
                name: "jobType",
                label: "Job Type",
                placeholder: 'Job Type',
                type: "Staticdropdown",
                value: [],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: "transportedBy",
                label: "Transported By",
                placeholder: 'Transported By',
                type: "Staticdropdown",
                value: [],
                Validations: [
                ],
                functions: {
                    onSelection: ""
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'isUpdate',
                label: 'IsUpdate',
                placeholder: 'IsUpdate',
                type: 'text',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: '_id',
                label: 'id',
                placeholder: 'id',
                type: '',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryBy',
                label: 'entryBy',
                placeholder: 'entryBy',
                type: '',
                value: localStorage.getItem("Username"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryDate',
                label: 'entryDate',
                placeholder: 'entryDate',
                type: '',
                value: new Date(),
                Validations: [],
                generatecontrol: false, disable: false
            },

        ];
        this.chaTableFormControlArray = [
            {
                name: "docName",
                label: "Name of Document",
                placeholder: "Name of Document",
                type: "Staticdropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "clrChrg",
                label: "Clearance Charge (₹)",
                placeholder: "Clearance Charge (₹)",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                functions:{
                    onChange: 'calculateTotalAmount'
                },
                Validations: [
                ]
            },
            {
                name: "gstRate",
                label: "GST Rate",
                placeholder: "GST Rate",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                functions:{
                    onChange: 'calculateTotalAmount'
                },
                Validations: [
                ]
            },
            {
                name: "gstAmt",
                label: "GST Amount (₹)",
                placeholder: "GST Amount (₹)",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: "totalAmt",
                label: "Total Amount (₹)",
                placeholder: "Total Amount (₹)",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
        ]
    }
    getChaEntryFormControls() {
        return this.chaEntryControlArray;
    }
    getChaTableFormControls() {
        return this.chaTableFormControlArray
    }
}
