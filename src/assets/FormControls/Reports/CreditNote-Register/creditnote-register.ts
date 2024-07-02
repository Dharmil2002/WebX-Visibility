import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditNoteRegister {
    creditnoteRegisterControlArray: FormControls[];
    constructor() {
        this.creditnoteRegisterControlArray = [
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
                     }
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
               name: 'Branch',
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
                    showNameAndValue: true,
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
               name: 'DocStatus',
               label: 'Document Status',
               placeholder: '',
               type: 'Staticdropdown',
               value: [
                    { value: "All", name: "All" },
                    { value: "1", name: "Generated" },
                    { value: "2", name: "Approved" },
                    { value: "3", name: "Rejected" },
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
               generatecontrol: true, disable: false
          },
          {
               name: 'custnmcd',
               label: 'Customer Code',
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
                    showNameAndValue: true,
               },
               functions: {
                    onToggleAll: "toggleSelectAll",
               },
               generatecontrol: true, disable: false
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
               name: "DocNo",
               label: "Document No",
               placeholder: "",
               type: "text",
               value: '',
               generatecontrol: true,
               disable: false,
               Validations: []
          },
          {
               name: "VoucherNo",
               label: "Voucher Number",
               placeholder: "",
               type: "text",
               value: '',
               generatecontrol: true,
               disable: false,
               Validations: [],
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
        ];
    }
}
