import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class vendorWiseOutstandingRegister {
     vendorOutstandingControlArray: FormControls[];
     constructor() {
          this.vendorOutstandingControlArray = [
               {
                    name: "start",
                    label: "Select Data Range",
                    placeholder: "Select Date ",
                    type: "daterangpicker",
                    value: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                      support: "end",
                    },
               },
               {
                    name: 'branch',
                    label: 'Select Branch',
                    placeholder: 'Select Branch',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                         isIndeterminate: false,
                         isChecked: false,
                         support: "locHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
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
               {
                    name: 'locHandler',
                    label: 'locHandler',
                    placeholder: 'locHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },

          ];
     }
}
