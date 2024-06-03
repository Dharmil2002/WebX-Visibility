import { FormControls } from 'src/app/Models/FormControl/formcontrol';
export class BalanceSheetReport {
     BalanceSheetControlArray: FormControls[];
     constructor() {
          this.BalanceSheetControlArray = [
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
                         showNameAndValue: true,
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'dateType',
                    label: 'Date Type',
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
                    },
                    {
                         name: "required",
                         message: "Date Type is required",
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