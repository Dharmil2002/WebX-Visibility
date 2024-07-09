import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class GCNFlow {
    GCNFlowControlArray: FormControls[];
    constructor() {
        this.GCNFlowControlArray = [
            {
                name: "start",
                label: "Date Range ",
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
                name: 'Location',
                label: 'Select Location',
                placeholder: '',
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
                name: 'ReportType',
                label: ' ',
                placeholder: '',
                type: 'radiobutton',
                value: [
                    { value: "Cumulative", name: "Cumulative" },
                    { value: "Individual", name: "Individual" }

                ],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'OR',
                label: "",
                placeholder: "",
                type: 'OR',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: '',
                label: "",
                placeholder: "",
                type: '',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
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
                name: 'loadType',
                label: 'Load Type',
                placeholder: '',
                type: 'Staticdropdown',
                value: [
                     { value: "LTL", name: "LTL" },
                     { value: "FTL", name: "FTL" },
                     { value: "All", name: "Both" },
                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                ],
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
                name: 'fromlocHandler',
                label: 'Location',
                placeholder: 'fromlocHandler',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },

            {
                name: 'payTypeHandler',
                label: 'Paytype',
                placeholder: 'payTypeHandler',
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
                name: 'movTypeHandler',
                label: 'movTypeHandler',
                placeholder: 'movTypeHandler',
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
