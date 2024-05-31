import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class TDSRegisterControl {
     TDSRegisterControlArray: FormControls[];
     constructor() {
          this.TDSRegisterControlArray = [
               {
                    name: 'Fyear',
                    label: 'Financial Year',
                    placeholder: 'Financial Year',
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
                    label: "Date Range",
                    placeholder: "Date Range is within financial year",
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
                         name: "autocomplete",
                    },
                    {
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
                    name: 'tdsType',
                    label: 'TDS Type',
                    placeholder: 'TDS Type',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Receivable", name: "Receivable" },
                         { value: "Payable", name: "Payable" },
                         { value: "Both", name: "Both" }
                    ],
                    Validations: [],
                    generatecontrol: true, disable: false,
                    functions: {
                         onSelection: "PreparedforFieldChanged"
                    },
               },
               {
                    name: "customerName",
                    label: "Party as",
                    placeholder: "Customer Name",
                    type: "multiselect",
                    value: "",
                    filterOptions: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "custHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                         onOptionSelect: "PartyNameFieldChanged",
                         onChange: "PartyNameFieldChanged"
                    },
               },
               {
                    name: "TDSSection",
                    label: "TDS Section",
                    placeholder: "TDS Section",
                    type: "multiselect",
                    value: "",
                    filterOptions: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "tdsSectionHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
               },
               {
                    name: 'tdsPayStatus',
                    label: 'TDS Payment Status',
                    placeholder: 'TDS Payment Status',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Paid", name: "Paid" },
                         { value: "Pending", name: "Pending" }
                    ],
                    Validations: [],
                    generatecontrol: true, disable: false
               },
               {
                    name: "msmeRegistered",
                    label: "MSME Registered",
                    placeholder: "MSME Registered",
                    type: "toggle",
                    value: "",
                    Validations: [],
                    functions: {},
                    generatecontrol: true,
                    disable: false,
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
                    name: 'docNo',
                    label: "Search by Document No",
                    placeholder: "Please Enter Document No comma(,) separated",
                    type: 'text',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'voucherNo',
                    label: "Search by Voucher No",
                    placeholder: "Please Enter Voucher No comma(,) separated",
                    type: 'text',
                    value: '',
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
                    functions: { onDate: "validateDateRange" }
               },
               {
                    name: 'tdsSectionHandler',
                    label: 'tdsSectionHandler',
                    placeholder: 'tdsSectionHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'custHandler',
                    label: 'custHandler',
                    placeholder: 'custHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
          ]
     }
}