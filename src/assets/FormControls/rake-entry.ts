import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RakeEntryControl {
    rakeEntryArray: FormControls[];
    constructor() {
        this.rakeEntryArray = [
            {
                name: "rakeId",
                label: "Rake ID",
                placeholder: "Enter Rake ID",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: 'transportMode', label: "Transport Mode", placeholder: "Select Transport Mode", type: 'text',
                value: 'Rail', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: "destination",
                label: "Destination",
                placeholder: "Enter destination",
                type: "dropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocompleteObject",
                    message: "Choose proper value",
                }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: 'vendorType', label: "Vendor Type", placeholder: "Select Vendor Type", type: 'Staticdropdown',
                value: [
                    { value: "Own", name: "Own" },
                    { value: "Attached", name: "Attached" },
                    { value: "Rail", name: "Rail" },
                    { value: "Market", name: "Market" },
                    { value: "Service Provider", name: "Service Provider" }
                ], filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                functions: {
                    onSelection: "vendorFieldChanged"
                },
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'vendorName', label: "Vendor Name", placeholder: "Select Vendor Name", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Name is required",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                      },
                      {
                        name: "autocomplete",
                      }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'fromCity', label: "From City", placeholder: "Enter From City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocompleteObject",
                    message: "Choose proper value",
                }
                ],
                functions: {
                    onOptionSelect: "cityMapping"
                },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'toCity', label: "To City", placeholder: "Enter To City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocompleteObject",
                    message: "Choose proper value",
                }
                ],
                functions: {
                    onOptionSelect: "cityMapping"
                },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'via', label: "Via", placeholder: "Multiselect via", type: 'multiselect',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "viaControlHandler",
                    showNameAndValue: false,
                    Validations: [{
                        name: "",
                        message: ""
                    }]
                },
            }, {
                name: "documentType",
                label: "Document Type",
                placeholder: 'Select Document Type',
                type: "Staticdropdown",
                value: [{ value: "CN", name: "CN Wise"},
                { value: "JOB", name: "Job Wise" }],
                Validations: [
                ], functions: {
                    onSelection: "cityMapping"
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'loadType', label: "Load Type", placeholder: "Enter Load Type", type: 'Staticdropdown',
                value: [
                    { name: "Container", value: "container" },
                    { name: "Wagon", value: "wagon" }
                ],
                generatecontrol: true,
                disable: false,
                Validations: [],
                // functions: {
                //     onOptionSelect: "cityMapping"
                // },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'movementType', label: "Movement Type", placeholder: "Enter Movement Type", type: 'Staticdropdown',
                value: [
                    { name: "Exim", value: "exim" },
                    { name: "Domestic", value: "domestic" }
                ],
                generatecontrol: true,
                disable: false,
                Validations: [],
                // functions: {
                //     onOptionSelect: "cityMapping"
                // },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: "NFC",
                label: "No of Container",
                placeholder: "Enter No of Container",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "fnrNo",
                label: "FNR No",
                placeholder: "Enter FNR No",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "rrNo",
                label: "RR No",
                placeholder: "Enter RR No",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: 'rrDate', label: 'RR Date', placeholder: 'RR Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
                generatecontrol: true, disable: false, Validations: [],
                additionalData: {
                }
            },
            {
                name: "contractAmount",
                label: "Contract Amount (₹)",
                placeholder: "Enter Contract Amount",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            }, {
                name: "advancedAmount",
                label: "Advanced Amount (₹)",
                placeholder: "Enter Advanced Amount",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            }, {
                name: "balanceAmount",
                label: "Balance Amount (₹)",
                placeholder: "Enter Balance Amount",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            }, {
                name: 'advancedLocation', label: "Advanced Location", placeholder: "Select Advanced Location", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: 'balanceLocation', label: "Balance Location", placeholder: "Select Balance Location", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                }
            },
            // {
            //     name: 'mappingMode',
            //     label: '',
            //     placeholder: '',
            //     type: 'radiobutton',
            //     value: [{ value: "L", name: "Location - City", checked: true },
            //     { value: "C", name: "City - Location" }],
            //     Validations: [
            //         {
            //             name: "autocomplete",
            //         },
            //         {
            //             name: "invalidAutocomplete",
            //             message: "Please Select Proper Option",
            //         },
            //         {
            //             name: "required",
            //             message: "State is required"
            //         }
            //     ],
            //     additionalData: {
            //         showNameAndValue: false
            //     },
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: '', generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: 'text',
                value: localStorage.getItem('Username'),
                Validations: [],
                generatecontrol: false, disable: true
            },
            {
                name: 'entryDate',
                label: 'Entry Date',
                placeholder: 'Select Entry Date',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            }, {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: '',
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            },
            {
                name: 'status',
                label: '',
                placeholder: '',
                type: 'text',
                value: 0,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            }, {
                name: "viaControlHandler",
                label: "Multi Via Location",
                placeholder: "Multi Via Location",
                type: "",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: false,
                disable: false,
                Validations: [

                ],
                functions: {
                    onToggleAll: 'toggleSelectAll',
                },
            },
            {
                name: 'companyCode',
                label: 'Company Code',
                placeholder: 'Company Code',
                type: 'text',
                value: localStorage.getItem("companyCode"),
                Validations: [],
                generatecontrol: false, disable: false
            },
        ]
    }

    getRakeEntryFormControls() {
        return this.rakeEntryArray;
    }
}
