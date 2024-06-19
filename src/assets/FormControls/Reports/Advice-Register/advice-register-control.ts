import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdviceRegisterControl {
    adviceRegisterControlArray: FormControls[];
    constructor() {
        this.adviceRegisterControlArray = [
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
            }, {
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
                name: 'Advicetype',
                label: 'Advice type ',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: "C", name: "Credit" },
                    { value: "D", name: "Debt" },
                    { value: ["C", "D"], name: "Both" },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'Status',
                label: 'Status',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                    { value: 1, name: "Generated" },
                    { value: 2, name: "Acknowledge" },
                ],
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
                name: 'PaymentMode',
                label: "Payment Mode",
                placeholder: "Please select Payment Mode",
                type: 'Staticdropdown',
                value: [
                    { value: ["Cash", "Cheque", "RTGS/UTR"], name: "All" },
                    { value: "Cash", name: "Cash" },
                    { value: "Cheque", name: "Bank" },
                    { value: "RTGS/UTR", name: "NEFT RTGS " },
                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'AdviceNo',
                label: "Advice No",
                placeholder: "Please Enter Advice. NO. comma(,) separated",
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
        ];
    }
}