import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class vendOutControl {
     VendOutControlArray: FormControls[];
     constructor() {
          this.VendOutControlArray = [
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
                    label: 'Report Based on',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "1", name: "Generation" },
                         { value: "2", name: "Finalization" },
                         { value: "4", name: "Payment" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "rptbasisHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'loc',
                    label: 'Location',
                    placeholder: '',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "locHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               // {
               //      name: 'vendtype',
               //      label: 'Vendor Type',
               //      placeholder: 'From Location',
               //      type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "vendtypeHandler",
               //           showNameAndValue: false,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
               {
                    name: 'vennmcd',
                    label: 'Vendor Name & Code',
                    placeholder: '',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "vendnmcdHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
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
               // {
               //      name: 'rpttype',
               //      label: 'Report Type',
               //      placeholder: '',
               //      type: 'Staticdropdown',
               //      value: [
               //           { value: "1", name: "Vendor Wise" },
               //           { value: "2", name: "Location Wise Vendor Wise" },
               //      ],
               //      filterOptions: "",
               //      autocomplete: "",
               //      displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "rptbasisHandler",
               //           showNameAndValue: false,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
               {
                    name: 'vendnmcdHandler',
                    label: 'vendnmcdHandler',
                    placeholder: 'vendnmcdHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'vendtypeHandler',
                    label: 'vendtypeHandler',
                    placeholder: 'vendtypeHandler',
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
