import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DebitNoteRegister {
    DebitNoteControlArray: FormControls[];
    constructor() {
        this.DebitNoteControlArray = [
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
                generatecontrol: true, disable: false
           },
           {
                name: "start",
                label: "Select Date Range",
                placeholder: "Select Date Range",
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
               name: 'documnetstatus',
               label: 'Documnet Status',
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
               },
               {
                    name: "required",
                    message: "Date Type is required",
               },],
               additionalData: {
                    showNameAndValue: false,
               },
               generatecontrol: true, disable: false
            },
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
               name: 'voucherNo',
               label: "Voucher Number",
               placeholder: "Please Enter Voucher Number comma(,) separated",
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
          },
          {
               name: 'vendnmcdHandler',
               label: 'vendnmcdHandler',
               placeholder: 'vendnmcdHandler',
               type: '',
               value: '',
               Validations: [],
               generatecontrol: false, disable: false
          },

        ];
    }
}
