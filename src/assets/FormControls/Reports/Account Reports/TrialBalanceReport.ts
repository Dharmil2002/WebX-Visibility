import { FormControls } from 'src/app/Models/FormControl/formcontrol';
export class TrialBalanceReport {
     TrialBalanceControlArray: FormControls[];
     constructor() {
          this.TrialBalanceControlArray = [
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
                    label: "Select Document Date ",
                    placeholder: "Select Document Date ",
                    type: "daterangpicker",
                    value: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                         {
                              name: "required",
                              message: "Date is required",
                         },
                    ],
                    additionalData: {
                         support: "end",
                         minDate: new Date(), // Set the minimum date to the current date
                         maxDate: new Date() // Allow selection of dates in the current year and future years

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
                    },
                    {
                         name: "required",
                         message: "Branch is required",
                    },],
                    additionalData: {
                         showNameAndValue: true,
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: "ReportType",
                    label: "Report Type",
                    placeholder: "Report Type",
                    type: "Staticdropdown",
                    value: [
                         { value: "G", name: "Group Wise" },
                         { value: "L", name: "Location Wise" },
                         { value: "C", name: "Customer Wise" },
                         { value: "V", name: "Vendor Wise" },
                         { value: "E", name: "Employee Wise" },
                         //{ value: "D", name: "Driver Wise" }
                    ],
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                         {
                              name: "required",
                              message: "Report Type is required",
                         },
                    ],
                    additionalData: {
                         showNameAndValue: false,
                    },
                    functions: {
                         onSelection: "ReportTypeFieldChanged"
                    },
               },
               {
                    name: 'reportSubType',
                    label: 'Report Sub Type',
                    placeholder: 'Report Sub Type',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Location", name: "Location" },
                         { value: "Customer", name: "Customer" },
                         { value: "Vendor", name: "Vendor" },
                         { value: "Employee", name: "Employee" },
                         { value: "Driver", name: "Driver" },
                         { value: "Vehicle", name: "Vehicle" },
                    ],
                    functions: {
                         onSelection: "reportSubTypeChanged"
                    },
                    Validations: [],
                    generatecontrol: true, disable: false
               },
               {
                    name: 'subLedger',
                    label: 'Sub Ledger',
                    placeholder: 'Sub Ledger',
                    type: 'multiselect',
                    value: [],
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
                         support: "subLedgerHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
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
                    name: 'aCCONTCD',
                    label: 'Select Account Code ',
                    placeholder: 'Search & Select Account Code',
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
                    additionalData: {
                         minDate: new Date(), // Set the minimum date to the current date
                         maxDate: new Date()
                    },
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
                    name: 'subLedgerHandler',
                    label: '',
                    placeholder: ' ',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
          ]
     }
}