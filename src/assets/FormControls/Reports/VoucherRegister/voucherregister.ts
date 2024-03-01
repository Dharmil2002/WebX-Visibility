import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class vouchRegControl {
     vouchRegControlArray: FormControls[];
     constructor() {
          this.vouchRegControlArray = [
               {
                    name: "start",
                    label: "Voucher Date",
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
               // {
               //      name: 'loc',
               //      label: 'Location',
               //      placeholder: '',
               //      type: 'multiselect',
               //      value: [],
               //      filterOptions: "",
               //      autocomplete: "",
               //      displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "locHandler",
               //           showNameAndValue: true,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
               {
                    name: 'vouchTp',
                    label: 'Voucher Type',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "vouchtpHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'transTp',
                    label: 'Transaction Type',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "transtpHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'partyTp',
                    label: 'Party Type',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "partytpHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'partyNm',
                    label: 'Party Name',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "partynmHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: "cheq",
                    label: "Cheque/ UTR No",
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
               {
                    name: "vAmt",
                    label: "Voucher Amount",
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
                    name: "vNo",
                    label: "Voucher Number",
                    placeholder: "",
                    type: "text",
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {},
               },
               {
                    name: "docNo",
                    label: "Document No",
                    placeholder: "",
                    type: "text",
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {},
               },
               {
                    name: 'partynmHandler',
                    label: 'partynmHandler',
                    placeholder: 'partynmHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'partytpHandler',
                    label: 'partytpHandler',
                    placeholder: 'partytpHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'transtpHandler',
                    label: 'transtpHandler',
                    placeholder: 'transtpHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'vouchtpHandler',
                    label: 'vouchtpHandler',
                    placeholder: 'vouchtpHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               // {
               //      name: 'locHandler',
               //      label: 'locHandler',
               //      placeholder: 'locHandler',
               //      type: '',
               //      value: '',
               //      Validations: [],
               //      generatecontrol: false, disable: false
               // },
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