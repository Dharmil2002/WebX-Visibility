import { on } from "events";
import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class GeneralLedgerReport {
    generalLedgerControlArray: FormControls[];
    constructor() {
        this.generalLedgerControlArray = [
            {
                name: 'Fyear',
                label: 'Financial Year ',
                placeholder: 'Financial Year ',
                type: 'dropdown',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                functions: {
                    onOptionSelect: "resetDateRange"
                },
                generatecontrol: true, disable: false
            },
            {
                name: "start",
                label: "Select Document Date ",
                placeholder: "Select Document Date ",
                type: "daterangpicker",
                value: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    support: "end",
                },
                functions: { onDate: "validateDateRange" }
            },
            {
                name: 'reportTyp',
                label: 'Select Report Type ',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "General Ledger", name: "General Ledger" },
                    { value: "Sub Ledger", name: "Sub Ledger" },
                    { value: "Document/Cheque No  ", name: "Document/Cheque No  " },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'reportSubType',
                label: 'Report Sub Type',
                placeholder: 'Report Sub Type',
                type: 'Staticdropdown',
                value: [
                    { value: "Location", name: "Location" },
                    { value: "Customer", name: "Customer" },
                    { value: "Vendor", name: "Vendor" },
                    { value: "Employee", name: "Employee" },
                    { value: "Driver", name: "Driver" },
                    { value: "Vehicle", name: "Vehicle" },
                ],
                functions: {
                    onSelection: "reportSubTypeChanged"
                },
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'subLedger',
                label: 'Sub Ledger',
                placeholder: 'Sub Ledger',
                type: 'multiselect',
                value: [],
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocomplete",
                    message: "Choose proper value",
                },],
                additionalData: {
                    support: "subLedgerHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'category',
                label: 'Select Category',
                placeholder: 'Select Category',
                type: 'dropdown',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    },
                ],
                additionalData: {
                    showNameAndValue: false,
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'aCCONTCD',
                label: 'Select Account Code ',
                placeholder: 'Search & Select Account Code',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "accountHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'branch',
                label: 'Select Branch',
                placeholder: '',
                type: "dropdown",
                // type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocomplete",
                    message: "Choose proper value",
                },],
                additionalData: {
                    // support: "branchHandler",
                    showNameAndValue: true,
                },
                // functions: {
                //     onToggleAll: "toggleSelectAll",
                // },
                generatecontrol: true, disable: false
            },


            {
                name: "Individual",
                label: "",
                placeholder: "Individual",
                type: "radiobutton",
                value: [
                    { value: "Y", name: "Individual", checked: true },
                    { value: "N", name: "Cumulative" },
                ],
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: "end",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: "",
                filterOptions: "",
                autocomplete: "",
                generatecontrol: false,
                disable: true,
                Validations: [],
                functions: { onDate: "validateDateRange" }
            },
            {
                name: 'accountHandler',
                label: 'accountHandler',
                placeholder: ' ',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'branchHandler',
                label: 'branchHandler',
                placeholder: ' ',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'subLedgerHandler',
                label: '',
                placeholder: ' ',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
        ]
    }
}
