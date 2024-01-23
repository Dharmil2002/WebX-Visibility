import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RakeEntryControl {
    rakeEntryArray: FormControls[];
    ContainerDetail: FormControls[];
    rakeDetails: FormControls[];
    invDetails: FormControls[];
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
                functions:{
                    onModel:"getDestLocation"
                },
                Validations: [
                    {
                        name: "required",
                        message: "Destination is required",
                    },{
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
                value: [], filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                functions: {
                    onSelection: "vendorFieldChanged"
                },
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Type is required",
                    }
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
                functions:{
                    onModel:"getVendors",
                },
                additionalData: {
                    showNameAndValue: true
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
                },
                {
                    name: "required",
                    message: "From City is required",
                }
                ],
                functions: {
                    onModel:"getCityDetail",
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
                },
                {
                    name: "required",
                    message: "To City is required",
                }
                ],
                functions: {
                    onModel:"getCityDetail",
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
                functions: {
                    onModel:"getCityDetail"
                },
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
            },
            {
                name: "documentType",
                label: "Document Type",
                placeholder: 'Select Document Type',
                type: "text",
                value: 'CN',
                Validations: [
                ], functions: {
                    onSelection: ""
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'loadType', label: "Load Type", placeholder: "Enter Load Type", type: 'Staticdropdown',
                value: [
                    // { name: "Container", value: "container" },
                    // { name: "Wagon", value: "wagon" }
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
                name: 'movementType', label: "Cargo Type", placeholder: "Cargo Type", type: 'Staticdropdown',
                value: [],
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
                name: "branch",
                label: "branch",
                placeholder: "branch",
                type: "",
                value:localStorage.getItem("Branch"),
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            },
            // {
            //     name: "contractAmount",
            //     label: "Contract Amount (₹)",
            //     placeholder: "Enter Contract Amount",
            //     type: "number",
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //     ]
            // }, {
            //     name: "advancedAmount",
            //     label: "Advanced Amount (₹)",
            //     placeholder: "Enter Advanced Amount",
            //     type: "number",
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //     ]
            // }, {
            //     name: "balanceAmount",
            //     label: "Balance Amount (₹)",
            //     placeholder: "Enter Balance Amount",
            //     type: "number",
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //     ]
            // }, {
            //     name: 'advancedLocation', label: "Advanced Location", placeholder: "Select Advanced Location", type: 'dropdown',
            //     value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
            //     Validations: [],
            //     additionalData: {
            //         showNameAndValue: false
            //     }
            // }, {
            //     name: 'balanceLocation', label: "Balance Location", placeholder: "Select Balance Location", type: 'dropdown',
            //     value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
            //     Validations: [],
            //     additionalData: {
            //         showNameAndValue: false
            //     }
            // },
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
        this.ContainerDetail = [
            {
                name: "cnNo",
                label: "CNNO",
                placeholder: "CNNO",
                type: "dropdown",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [ {
                    name: "required",
                    message: "CNNO is required",
                }],
                functions: {
                    onModel: "getShipment",
                    onOptionSelect: "getCnoteDetails"
                },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: "cnDate",
                label: "CN Date",
                placeholder: "CN Date",
                type: "date",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "noOfContainer",
                label: "Containers",
                placeholder: "Containers",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            // {
            //     name: "jobNo",
            //     label: "Job No",
            //     placeholder: "Job No",
            //     type: "dropdown",
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [],
            //     functions: {
            //         onOptionSelect:"getJobDetails"
            //     },
            //     additionalData: {
            //         showNameAndValue: false
            //     }
            // },
            // {
            //     name: "jobDate",
            //     label: "Job Date",
            //     placeholder: "Job Date",
            //     type: "date",
            //     value: "",
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [
            //     ]
            // },
            {
                name: "noOfPkg",
                label: "No Of Package",
                placeholder: "No Of Package",
                type: "mobile-number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "weight",
                label: "Weight",
                placeholder: "Weight",
                type: "mobile-number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "fCity",
                label: "From City",
                placeholder: "From City",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: "tCity",
                label: "To City",
                placeholder: "To City",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: "billingParty",
                label: "Billing Party",
                placeholder: "Billing Party",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            },
            {
                name: 'contDtl',
                label: "contDtl",
                placeholder: "contDtl",
                type: "",
                value: "",
                generatecontrol: false,
                disable: false,
                Validations: []
            },
            {
                name: 'billingPartyCode',
                label: "billingPartyCode",
                placeholder: "billingPartyCode",
                type: "",
                value: "",
                generatecontrol: false,
                disable: false,
                Validations: []
            }
        ]
        this.rakeDetails = [{
            name: "rrNo",
            label: "RR No",
            placeholder: "Enter RR No",
            type: "text",
            value: "",
            generatecontrol: true,
            disable: false,
            Validations: [
                {
                    name: "required",
                    message: "RR No is required",
                }
            ]
        },
        {
            name: 'rrDate', label: 'RR Date', placeholder: 'RR Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
            generatecontrol: true, disable: false, Validations: [  {
                name: "required",
                message: "RR Date is required",
            }],
            additionalData: {
                maxDate: new Date(),
              },
        }],
            this.invDetails = [{
                name: "invNum",
                label: "Inv No",
                placeholder: "Enter Inv No",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Enter Inv No is required"
                    }
                ]
            },
            {
                name: 'invDate', label: 'Inv Date', placeholder: 'Inv Date', type: 'date', value: "", filterOptions: '', autocomplete: '', displaywith: '',
                generatecontrol: true, disable: false, Validations: [   {
                    name: "required",
                    message: "Enter Inv Date is required",
                }],
                additionalData: {
                maxDate: new Date(),
              },
            },
            {
                name: "invAmt",
                label: "Inv Amount(₹)",
                placeholder: "Enter Inv No",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Enter Inv Amount is required",
                    }
                ]
            },
        ]
    }

    getRakeEntryFormControls() {
        return this.rakeEntryArray;
    }
    getRakeContainerDetail() {
        return this.ContainerDetail;
    }
    getrakeDetailsControls() {
        return this.rakeDetails;
    }
    getInvoiceDetails() {
        return this.invDetails;
    }
}
