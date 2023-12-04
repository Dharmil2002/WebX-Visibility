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
                    name: "payType",
                    label: "Payment Mode",
                    placeholder: "Payment Mode",
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
                    placeholder: 'Search and Select From Location',
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
                    placeholder: 'Search and Select To Location',
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
                    placeholder: 'Search and Select From City',
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
                    label: "Transport Mode",
                    placeholder: "Transport Mode",
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
          ]
     }
}