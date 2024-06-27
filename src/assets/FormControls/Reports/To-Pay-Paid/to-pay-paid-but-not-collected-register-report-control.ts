import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ToPayPaidReportControl {
    toPayPaidReportControlArray: FormControls[];
    constructor() {
        this.toPayPaidReportControlArray = [
            {
                name: 'DateType',
                label: 'Date Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "Bookingdate", name: "Booking date" },
                    { value: "BillDate", name: "Bill date" },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "start",
                label: "From Date",
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
                },
            },
            {
                name: 'Paybasis',
                label: 'Pay basis',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "P03", name: "To Pay" },
                    { value: "P01", name: "Paid" },
                    { value: ["P01", "P03"], name: "Both" },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'StatusAson',
                label: 'Status As on ',
                placeholder: '',
                type: 'date',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'location',
                label: 'Select Location',
                placeholder: '',
                type: "dropdown",
                value: [],
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocomplete",
                    message: "Choose proper value",
                },],
                additionalData: {
                    showNameAndValue: true,
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
                name: 'OR',
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
                name: 'Transitmode',
                label: 'Transit mode',
                placeholder: '',
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
            {
                name: 'ServiceType',
                label: 'Service Type',
                placeholder: ' ',
                type: 'Staticdropdown',
                value: [
                    { value: "FTL", name: "FTL" },
                    { value: "LTL", name: "LTL" },
                    { value: "Both", name: "Both" }],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "end",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: "",
                generatecontrol: false,
                disable: true,
                Validations: [],
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
        ]
    }
}