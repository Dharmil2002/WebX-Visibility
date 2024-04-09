import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class StockReport {
    StockReportControlArray: FormControls[];
    constructor() {
        this.StockReportControlArray = [
            {
                name: 'DateType',
                label: 'Date Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "BookingDate", name: "Booking  Date" },
                    { value: "ArrivedDate", name: "Arrived Date " },
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
                name: 'StockType',
                label: 'Stock Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "0", name: "All Stock"},
                    { value: "1", name: "Booking Stock" },      
                    { value: "2", name: "In Transit Stock" },
                    { value: "3", name: "Transhipment Stock" },
                    { value: "4", name: "Delivery Stock" },
                    { value: "5", name: "Gone for Delivery" },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'LocationType',
                label: 'Select Location Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "CurrentLocation", name: "Stock Location" },
                    { value: "OriginLocation", name: "Origin Location" }
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'fromLocation',
                label: 'Select From Location',
                placeholder: 'Select From Location',
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
                name: 'toLocation',
                label: 'Select To Location',
                placeholder: 'Select To Location',
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
                name: 'paybasis',
                label: 'Select Paybasis',
                placeholder: 'Search & Select Paybasis',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "paybasisHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'mode',
                label: 'Select Mode',
                placeholder: 'Search & Select Mode',
                type: 'multiselect',
                value: [],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
                additionalData: {
                    support: "modeHandler",
                    showNameAndValue: true,
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'BookingType',
            //     label: 'BookingType',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         // { value: "ALL", name: "ALL" },
            //         { value: "LTL", name: "LTL" },
            //         { value: "FTL", name: "FTL" },
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
                    { value: "Register", name: "Register" },
                    { value: "Summary", name: "Summary" }
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'paybasisHandler',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'modeHandler',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
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
        ]
    }
}
