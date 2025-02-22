import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class driverstatusRegister {
     driverstatusRegisterControlArray: FormControls[];
     constructor() {
          this.driverstatusRegisterControlArray = [
               {
                    name: "drivLoc",
                    label: "Driver Location",
                    placeholder: "All",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "driverLocHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "OR",
                    label: "",
                    placeholder: "",
                    type: "OR",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "vehNo",
                    label: "Vehicle No",
                    placeholder: "All",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "vehNoHandler",
                         showNameAndValue: false,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "OR",
                    label: "",
                    placeholder: "",
                    type: "OR",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "driverNm",
                    label: "Driver Name",
                    placeholder: "All",
                    type: "multiselect",
                    value: '',
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                         support: "driverNMHandler",
                         showNameAndValue: true,
                    },
                    functions: {
                         onToggleAll: "toggleSelectAll"
                    },
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "OR",
                    label: "",
                    placeholder: "",
                    type: "OR",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: "",
                    label: "",
                    placeholder: "",
                    type: "",
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
               },
               {
                    name: 'sts',
                    label: 'Driver Status',
                    placeholder: '',
                    type: 'Staticdropdown',
                    value: [
                         { value: "1", name: "Active" },
                         { value: "2", name: "Inactive" },
                         { value: "3", name: "In transit" },
                         { value: "4", name: "Available" },
                    ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    Validations: [
                    ],
                    generatecontrol: true, disable: false
               },
               {
                    name: 'driverLocHandler',
                    label: '',
                    placeholder: 'driverLocHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'vehNoHandler',
                    label: '',
                    placeholder: 'vehNoHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
               {
                    name: 'driverNMHandler',
                    label: '',
                    placeholder: 'driverNMHandler',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
               },
          ]
     }
}