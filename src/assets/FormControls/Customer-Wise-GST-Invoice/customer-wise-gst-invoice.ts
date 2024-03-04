import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class customerWiseGSTInvControl {
     custWiseGSTInvControlArray: FormControls[];
     constructor() {
          this.custWiseGSTInvControlArray = [
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
                    name: 'docType',
                    label: 'Document Type',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Transaction", name: "Transaction" },
                         { value: "General", name: "General" },
                         { value: "Debit Note", name: "Debit Note" }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "docTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'gststate',
                    label: 'GST State',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "gststateHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'taxnon',
                    label: 'Taxable/Non Taxable',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Taxable", name: "Taxable" },
                         { value: "Non-Taxable", name: "Non-Taxable" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "taxnonHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'cannon',
                    label: 'Cancel / Non -Cancel',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Cancelled", name: "Cancelled" },
                         { value: "Non-Cancelled", name: "Non-Cancelled" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "cannonHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'custnmcd',
                    label: 'Customer Name &  Code',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "custnmcdHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'saccd',
                    label: 'SAC Code',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "saccdHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'docNo',
                    label: "Document Number",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'docNo',
                    label: "Document Number",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'docNo',
                    label: "Document Number",
                    placeholder: "",
                    type: '',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'docNo',
                    label: "",
                    placeholder: "",
                    type: 'OR',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'docNo',
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
                    label: "Document Number",
                    placeholder: "Please Enter Document Number comma(,) separated",
                    type: 'text',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: []
               },
               {
                    name: 'saccdHandler',
                    label: 'saccdHandler',
                    placeholder: 'saccdHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'custnmcdHandler',
                    label: 'custnmcdHandler',
                    placeholder: 'custnmcdHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'custnmcd',
                    label: 'custnmcd',
                    placeholder: 'custnmcd',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'cannonHandler',
                    label: 'cannonHandler',
                    placeholder: 'cannonHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'taxnonHandler',
                    label: 'taxnonHandler',
                    placeholder: 'taxnonHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'gststateHandler',
                    label: 'gststateHandler',
                    placeholder: 'gststateHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'docTypeHandler',
                    label: 'docTypeHandler',
                    placeholder: 'docTypeHandler',
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
