import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class salesRegisterControl {
     salesRegisterControlArray: FormControls[];
     constructor() {
          this.salesRegisterControlArray = [
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
                    name: 'origin',
                    label: 'From Location',
                    placeholder: 'From Location',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
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
                    name: 'flowType',
                    label: 'Flow Type',
                    placeholder: 'Flow Type',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Outgoing", name: "Outgoing" },
                         { value: "Incoming", name: "Incoming" },
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
                    name: "pAYBAS",
                    label: "Payment Basis",
                    placeholder: "Payment Basis",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "payTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: "bookType",
                    label: "Booking Type",
                    placeholder: "Booking Type",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "bookTypeHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: 'cnote',
                    label: 'CNote Number',
                    placeholder: '',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "cnoteHandler",
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
                         { value: "Frozen", name: "Frozen" },
                         { value: "Chiller", name: "Chiller" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [],
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
                    name: "tranmode",
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
                         support: "transitHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: 'status',
                    label: 'Status',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "Billed", name: "Billed" },
                         { value: "Unbilled", name: "Unbilled" },
                         { value: "Delivered", name: "Delivered" },
                         { value: "Undelivered", name: "Undelivered" },
                         { value: "Cancelled", name: "Cancelled" },
                         { value: "Finalized", name: "Finalized" },
                         { value: "Quick", name: "Quick" },
                         { value: "Quick not completed", name: "Quick not completed" },
                         { value: "Quick Completed", name: "Quick Completed" },
                         { value: "POD Scanned", name: "POD Scanned" },
                         { value: "POD Not Scanned", name: "POD Not Scanned" },
                         { value: "POD scanned but not billed", name: "POD scanned but not billed" },
                    ],
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
                    name: "billAt",
                    label: "Billed At",
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
                         support: "billHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: 'billHandler',
                    label: 'billHandler',
                    placeholder: 'billHandler',
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
               {
                    name: 'transitHandler',
                    label: 'transitHandler',
                    placeholder: 'transitHandler',
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
                    name: 'cnoteHandler',
                    label: 'cnoteHandler',
                    placeholder: 'cnoteHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'bookTypeHandler',
                    label: 'bookTypeHandler',
                    placeholder: 'bookTypeHandler',
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
                    name: 'flowTypeHandler',
                    label: 'flowTypeHandler',
                    placeholder: 'flowTypeHandler',
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