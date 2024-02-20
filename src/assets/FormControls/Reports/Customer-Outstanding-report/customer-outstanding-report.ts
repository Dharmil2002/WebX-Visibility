import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class custOutControl {
     CustOutControlArray: FormControls[];
     constructor() {
          this.CustOutControlArray = [
               {
                    name: "start",
                    label: "Invoice Date",
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
                    name: "asondate",
                    label: "As on Date",
                    placeholder: "",
                    type: "date",
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
                    name: 'rptbasis',
                    label: 'Report Basis on',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "1", name: "Invoice Generation" },
                         { value: "3", name: "Invoice Submission" },
                         { value: "4", name: "Invoice Collection" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    // additionalData: {
                    //      support: "rptbasisHandler",
                    //      showNameAndValue: false,
                    // },
                    // functions: {
                    //      onToggleAll: "toggleSelectAll"
                    // },
                    generatecontrol: true, disable: false
               },
               // {
               //      name: 'gststate',
               //      label: 'GST State',
               //      placeholder: '',
               //      type: 'Staticdropdown',
               //      value: [],
               //      filterOptions: "",
               //      autocomplete: "",
               //      displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "gststateHandler",
               //           showNameAndValue: false,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
               {
                    name: 'gststate',
                    label: 'GST State',
                    placeholder: 'GST State',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "gstStHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'loc',
                    label: 'From Location',
                    placeholder: 'From Location',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "locHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               // {
               //      name: 'rpttype',
               //      label: 'Report Type',
               //      placeholder: '',
               //      type: 'Staticdropdown',
               //      value: [
               //           { value: "1", name: "Customer Wise" },
               //           { value: "2", name: "Customer Wise Location Wise" },
               //           { value: "3", name: "Location Wise Customer Wise" },
               //           // { value: "4", name: "Customer Group Wise" }
               //      ],
               //      filterOptions: "",
               //      autocomplete: "",
               //      displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "rpttypeHandler",
               //           showNameAndValue: false,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
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
                    name: 'custgp',
                    label: 'Customer Group',
                    placeholder: '',
                    type: 'multiselect',
                    value: [],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "custgroupHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'custgroupHandler',
                    label: 'custgroupHandler',
                    placeholder: 'custgroupHandler',
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
                    name: 'rpttypeHandler',
                    label: 'rpttypeHandler',
                    placeholder: 'rpttypeHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'gstStHandler',
                    label: 'gstStHandler',
                    placeholder: 'gstStHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'locHandler',
                    label: 'locHandler',
                    placeholder: 'locHandler',
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
                    name: 'rptbasisHandler',
                    label: 'rptbasisHandler',
                    placeholder: 'rptbasisHandler',
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
