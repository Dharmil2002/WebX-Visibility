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
            },
            {
                name: 'reportTyp',
                label: 'Select Report Type ',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "General Ledger", name: "General Ledger" },
                    { value: "Sub Ledger ", name: "Sub Ledger " },
                    { value: "Document/Cheque No  ", name: "Document/Cheque No  " },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'state',
                label: 'Select State',
                placeholder: 'Select State ',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "stateHandler",
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
                Validations: [ {
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocomplete",
                    message: "Choose proper value",
                },],
                additionalData: {
                    // support: "branchHandler",
                    showNameAndValue: false,
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
                name: 'stateHandler',
                label: 'stateHandler',
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
        ]
    }
}