import { FormControls } from 'src/app/Models/FormControl/formcontrol';
export class ProfitAndLossReport {
     ProfitAndLossControlArray: FormControls[];
     constructor() {
          this.ProfitAndLossControlArray = [
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
                    label: "Select Date Range",
                    placeholder: "Select Date Range",
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
                    name: 'branch',
                    label: 'Select Branch',
                    placeholder: '',
                    type: "dropdown",
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [{
                         name: "invalidAutocomplete",
                         message: "Choose proper value",
                    },],
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
               }
          ]
     }
}