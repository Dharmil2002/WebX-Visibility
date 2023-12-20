import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class cNoteGSTControl {
     cnoteGSTControlArray: FormControls[];
     constructor() {
          this.cnoteGSTControlArray = [
               {
                    name: "start",
                    label: "Booking Date",
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
                    name: 'flowType',
                    label: 'Flow Type',
                    placeholder: 'Flow Type',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Incoming", name: "Incoming" },
                         { value: "Outgoing", name: "Outgoing", }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "flowTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: "payType",
                    label: "Payment Basic",
                    placeholder: "Payment Basic",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "payTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: 'origin',
                    label: 'From Location',
                    placeholder: 'From Location',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "fromlocHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'destination',
                    label: 'To Location',
                    placeholder: 'To Location',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "tolocHandler",
                         showNameAndValue: false,
                         Validations: [{
                              name: "",
                              message: ""
                         }]
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'fromCity',
                    label: 'From City',
                    placeholder: 'From City',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "fromCityHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                         onModel: "getPincodeDetail"
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'toCity',
                    label: 'To City',
                    placeholder: 'Search and Select To City',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "toCityHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                         onModel: "getPincodeDetail"
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: "transMode",
                    label: "Transit Mode",
                    placeholder: "Transit Mode",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "transModeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: 'busType',
                    label: 'Business Type',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "busiTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'loadType',
                    label: 'Load Type',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "LTL", name: "LTL" },
                         { value: "FTL", name: "FTL" }
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "loadTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'status',
                    label: 'Status',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "statusHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: "cust",
                    label: "Customer",
                    placeholder: "",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "custHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
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
               {
                    name: 'tolocHandler',
                    label: 'tolocHandler',
                    placeholder: 'tolocHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'fromlocHandler',
                    label: 'fromlocHandler',
                    placeholder: 'fromlocHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'fromCityHandler',
                    label: 'fromCityHandler',
                    placeholder: 'fromCityHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'toCityHandler',
                    label: 'toCityHandler',
                    placeholder: 'toCityHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'payTypeHandler',
                    label: 'payTypeHandler',
                    placeholder: 'payTypeHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'transModeHandler',
                    label: 'transModeHandler',
                    placeholder: 'transModeHandler',
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
               },
               {
                    name: 'flowTypeHandler',
                    label: 'flowTypeHandler',
                    placeholder: 'flowTypeHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'busiTypeHandler',
                    label: 'busiTypeHandler',
                    placeholder: 'busiTypeHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'Load Type',
                    label: 'Load Type',
                    placeholder: 'Load Type',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'statusHandler',
                    label: 'statusHandler',
                    placeholder: 'statusHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
          ]
     }
}