import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class cashbankbookReport {
     cashbankbookControlArray: FormControls[];
     constructor() {
          this.cashbankbookControlArray = [
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
                    name: 'account',
                    label: 'Select Account',
                    placeholder: 'Search & Select Account',
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
                    name: "Amtrange",
                    label: "Amount Search Range",
                    placeholder: "",
                    type: "text",
                    value: "",
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {},
               },
               // {
               //      name: 'report',
               //      label: 'Select Report',
               //      placeholder: '',
               //      type: 'Staticdropdown',
               //      value: [
               //           { value: "1", name: "Detail" },
               //           { value: "2", name: "Branch Wise Summary" },
               //      ],
               //      filterOptions: "",
               //      autocomplete: "",
               //      displaywith: "",
               //      Validations: [
               //      ],
               //      generatecontrol: true, disable: false
               // },
               {
                    name: "report",
                    label: "",
                    placeholder: "",
                    type: "radiobutton",
                    value: [
                         { value: "D", name: "Month Wise Summary", checked: true },
                         { value: "B", name: "Branch Wise Summary" },
                    ],
                    generatecontrol: true,
                    disable: false,
                    Validations: []
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