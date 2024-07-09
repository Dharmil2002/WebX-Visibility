import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class VendorTdsPaymentReportControl {
    tdspaymentReportControlArray: FormControls[];
    constructor() {
        this.tdspaymentReportControlArray = [
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
                    {
                        name: "required",
                        message: "Financial is required",
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
                label: "Select Date Range",
                placeholder: "",
                type: "daterangpicker",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    support: "end",
                }
            },
            {
                name: 'Location',
                label: 'Select Location',
                placeholder: '',
                type: 'dropdown',
                value: '',
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: true,
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'DocumentStatus',
            //     label: 'Document Status ',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: 1, name: "Generated" },
            //         { value: 2, name: "Update" },
            //         { value: 3, name: "Cancelled" },
            //         // { value: 4, name: "Closed" },
            //         { value: 5, name: "All" },
            //     ],
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'ReportType',
                label: ' ',
                placeholder: '',
                type: 'radiobutton',
                value: [
                    { value: "Individual", name: "Individual" },
                    { value: "Cumulative", name: "Cumulative" }
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'vennmcd',
                label: 'Vendor Name &  Code',
                placeholder: '',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "vennmcdHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: "msmeRegistered",
            //     label: "MSME Registered",
            //     placeholder: "MSME Registered",
            //     type: "toggle",
            //     value: "",
            //     Validations: [],
            //     functions: {},
            //     generatecontrol: true,
            //     disable: false,
            // },
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
                name: 'DocumentNo',
                label: "Search by Document No",
                placeholder: "Please Enter Document No comma(,) separated",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'voucherNo',
                label: "Search by Voucher No",
                placeholder: "Please Enter Voucher No comma(,) separated",
                type: 'text',
                value: '',
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
                name: 'vennmcdHandler',
                label: 'vennmcdHandler',
                placeholder: 'vennmcdHandler',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
           },
        ]
    }
    getVendTdsPayRegFormControls() {
        return this.tdspaymentReportControlArray;
    }
}