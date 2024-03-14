import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ChequeRegister {
    chequeRegisterControlArray: FormControls[];
    constructor() {
        this.chequeRegisterControlArray = [
            {
                name: 'DateType',
                label: 'Date Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "ChequeDate", name: "Cheque  Date" },
                    { value: "EntryDate ", name: "Entry Date " },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "start",
                label: "Date Range ",
                placeholder: "Select Date ",
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
                name: 'ChequeType',
                label: 'Cheque Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "Issued", name: "Issued" },
                    { value: "Received ", name: "Received" },
                    { value: "All ", name: "All" },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'ReconcileStatus',
            //     label: 'Select Reconcile Status',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: "Reconciled", name: "Reconciled" },
            //         { value: "Non Reconciled", name: "Non Reconciled" },
            //     ],
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'ChequeBounceStatus',
            //     label: 'Select Cheque Bounce Status',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: "Bounced", name: "Bounced" },
            //         { value: "Non Bounced ", name: "Non Bounced" },
            //         { value: "All ", name: "All" },
            //     ],
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'issuingBank',
                label: 'Select Issuing Bank',
                placeholder: 'Search & Select Issuing Bank',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "issuingBankHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            {
                name: "vendor",
                label: "Select Vendor",
                placeholder: "Select Vendor",
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "vendorHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'ChequeDepositStatus',
            //     label: 'Select Cheque Deposit Status',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: "Deposited", name: "Deposited" },
            //         { value: "Non Deposited ", name: "Non Deposited" },
            //         { value: "All ", name: "All" },
            //     ],
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'customer',
                label: 'Select Customer',
                placeholder: '',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "custnmcdHandler",
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
                    }
                ],
                additionalData: {
                    showNameAndValue: false,
                },

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
                name: 'DisplayOnAccount',
                label: 'Display On Account',
                placeholder: '',
                type: 'checkbox',
                value: false,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: 'OR',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'ChequeNo',
                label: "Cheque No",
                placeholder: "Please Enter Cheque Number comma(,) separated",
                type: 'text',
                value: [],
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'ChequeAmountRange',
                label: "Search by Cheque Amount Range",
                placeholder: "Please Enter Cheque Amount Range dash(-) separated",
                type: 'text',
                value: [],
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
            // {
            //     name: 'accountHandler',
            //     label: 'accountHandler',
            //     placeholder: ' ',
            //     type: '',
            //     value: '',
            //     Validations: [],
            //     generatecontrol: false, disable: false
            // },
            {
                name: 'issuingBankHandler',
                label: 'issuingBankHandler',
                placeholder: ' ',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'custnmcdHandler',
                label: 'custnmcdHandler',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'vendorHandler',
                label: 'vendorHandler',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
        ]
    }
}
