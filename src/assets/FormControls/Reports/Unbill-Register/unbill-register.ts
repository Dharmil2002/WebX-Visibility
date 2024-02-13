import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class billRegControl {
     billRegControlArray: FormControls[];
     constructor() {
          this.billRegControlArray = [
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
                    name: 'loc',
                    label: 'From Location',
                    placeholder: 'From Location',
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
