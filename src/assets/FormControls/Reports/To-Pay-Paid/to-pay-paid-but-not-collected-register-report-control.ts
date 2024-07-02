import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ToPayPaidReportControl {
    toPayPaidReportControlArray: FormControls[];
    constructor() {
        this.toPayPaidReportControlArray = [
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
                },
            },
            {
                name: 'Paybasis',
                label: 'Pay basis',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: ["P03"], name: "To Pay" },
                    { value: ["P01"], name: "Paid" },
                    { value: "Both", name: "Both" },
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