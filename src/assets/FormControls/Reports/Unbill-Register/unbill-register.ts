import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class billRegControl {
     billRegControlArray: FormControls[];
     constructor() {
          this.billRegControlArray = [
               {
                    name: "start",
                    label: "Invoice Generation Date",
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
                    name: "loc",
                    label: "Location",
                    placeholder: "Select Location",
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
                              name: "invalidAutocompleteObject",
                              message: "Choose proper value",
                         },
                    ],
                    additionalData: {
                         showNameAndValue: true,
                    },
                    generatecontrol: true,
                    disable: false,
               },
               {
                    name: "Individual",
                    label: "",
                    placeholder: "Individual",
                    type: "radiobutton",
                    value: [
                         { value: "Y", name: "Individual" },
                         { value: "N", name: "Cumulative" },
                    ],
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "CUST",
                    label: "Customer",
                    placeholder: "Select Customer",
                    type: "dropdown",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                         {
                              name: "autocomplete",
                         },
                         {
                              name: "invalidAutocompleteObject",
                              message: "Choose proper value",
                         },
                    ],
                    additionalData: {
                         showNameAndValue: true,
                    },
                    functions: {
                         onModel: "getCustomer",
                    },
               },
               {
                    name: "payType",
                    label: "Payment Type",
                    placeholder: "Payment Type",
                    type: "dropdown",
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    functions: {},
                    Validations: [
                         {
                              name: "autocomplete",
                         },
                         {
                              name: "invalidAutocompleteObject",
                              message: "Choose proper value",
                         },
                    ],
                    additionalData: {
                         showNameAndValue: true,
                    },
               },
               {
                    name: 'loadType',
                    label: 'Load Type',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "LTL", name: "LTL" },
                         { value: "FTL", name: "FTL" },
                         { value: "All", name: "Both" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [],
                    additionalData: {
                         showNameAndValue: false,
                    },
                    functions: {},
                    generatecontrol: true,
                    disable: false
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
