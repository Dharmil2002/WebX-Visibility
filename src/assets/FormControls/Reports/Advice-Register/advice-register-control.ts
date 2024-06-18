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
            }, {
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
                type: 'text',
                value: [],
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'AdviceNo',
                label: "Advice No",
                placeholder: "Please Enter MR. NO. comma(,) separated",
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