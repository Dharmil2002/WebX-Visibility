import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class MRRegister {
    mrRegisterControlArray: FormControls[];
    constructor() {
        this.mrRegisterControlArray = [
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
                name: 'branch',
                label: 'Branch Office',
                placeholder: '',
                type: "dropdown",
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
                    showNameAndValue: true,
                },

                generatecontrol: true, disable: false
            },
            // {
            //     name: 'division',
            //     label: 'Select Division',
            //     placeholder: 'Select Division',
            //     type: "dropdown",
            //     value: [],
            //     filterOptions: "",
            //     autocomplete: "",
            //     displaywith: "",
            //     Validations: [
            //         {
            //             name: "autocomplete",
            //         },
            //         {
            //             name: "invalidAutocomplete",
            //             message: "Choose proper value",
            //         }
            //     ],
            //     additionalData: {
            //         showNameAndValue: false,
            //     },

            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'MRType',
            //     label: 'Select MR Type',
            //     placeholder: '',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: "Paid", name: "Paid" },
            //         { value: "DeliveryBillMR", name: "Delivery Bill MR" },
            //         { value: "DeliveryMR", name: "Delivery MR" },
            //         { value: "DemurrageMR", name: "Demurrage MR" },
            //         { value: "TBB", name: "TBB" },
            //         { value: "Topay", name: "Topay" },
            //     ],
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'customer',
                label: 'Select Customer',
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
                name: 'MRNO',
                label: "MR. NO.",
                placeholder: "Please Enter MR. NO. comma(,) separated",
                type: 'text',
                value: [],
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            // {
            //     name: 'OR',
            //     label: "",
            //     placeholder: "",
            //     type: 'OR',
            //     value: '',
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: []
            // },
            {
                name: 'Cnote',
                label: "Cnote No.",
                placeholder: "Please Enter Cnote Number comma(,) separated",
                type: 'text',
                value: [],
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'custnmcdHandler',
                label: 'custnmcdHandler',
                placeholder: '',
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
