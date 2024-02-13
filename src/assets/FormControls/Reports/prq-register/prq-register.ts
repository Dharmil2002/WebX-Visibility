import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class PrqReportControl {
     prqReportControlArray: FormControls[];
     constructor() {
          this.prqReportControlArray = [
               {
                    name: "start",
                    label: "Pick Date",
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
                    }
               },
               {
                    name: "prqNo",
                    label: "Enter PRQ No",
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
               // {
               //      name: 'prqNo',
               //      label: 'Select PRQ No',
               //      placeholder: 'PRQ No',
               //      type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
               //      Validations: [
               //      ],
               //      additionalData: {
               //           support: "prqNoHandler",
               //           showNameAndValue: false,
               //      },
               //      functions: {
               //           onToggleAll: "toggleSelectAll",
               //      },
               //      generatecontrol: true, disable: false
               // },
               {
                    name: 'billParty',
                    label: 'Select Billing Party',
                    placeholder: '',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         support: "bpartyHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
               },
               {
                    name: 'bpartyHandler',
                    label: 'bpartyHandler',
                    placeholder: 'bpartyHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'prqNoHandler',
                    label: 'prqNoHandler',
                    placeholder: 'prqNoHandler',
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