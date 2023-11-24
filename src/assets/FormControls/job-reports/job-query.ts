import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class jobQueryControl {
    jobControlArray: FormControls[];
    constructor() {
        this.jobControlArray = [
            {
                name: 'locations',
                label: 'Select Locations',
                placeholder: 'Search and select Location',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "LocationsHandler",
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
                name: "start",
                label: "SelectDateRange",
                placeholder: "Select Date",
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
                name: 'jobNo',
                label: 'Select jobNo',
                placeholder: 'Search and select jobNo',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "jobNoHandler",
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
            // {
            //     name: 'OR', label: "OR ", placeholder: "OR", type: 'OR',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [],
            //     additionalData: {
            //         showNameAndValue: true
            //     }
            // },
            {
                name: 'cnote',
                label: 'Select Consignment Note Number',
                placeholder: 'Select Consignment Note Number',
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
                name: "end",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: "",
                filterOptions: "",
                autocomplete: "",
                generatecontrol: false,
                disable: true,
                Validations: [
                    {
                        name: "Select Data Range",
                    },
                    {
                        name: "required",
                        message: "StartDateRange is Required...!",
                    },
                ],
            },
            {
                name: 'LocationsHandler',
                label: 'LocationsHandler',
                placeholder: 'LocationsHandler',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'jobNoHandler',
                label: 'jobNoHandler',
                placeholder: 'jobNoHandler',
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
        ]
    }


}