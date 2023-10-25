import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class JobControl {
    jobControlArray: FormControls[];
    constructor() {
        this.jobControlArray = [
            {
                name: "jobId",
                label: "Job ID",
                placeholder: "Enter Job ID",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                additionalData: {
                    metaData: "jobControls"
                },
                Validations: [
                ]
            }, {
                name: "jobDate",
                label: "Job Date",
                placeholder: "select Job Date",
                type: "date",
                value: new Date(),
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    metaData: "jobControls",
                    minDate: new Date()
                }
            },
            {
                name: "weight",
                label: "Weight (KGs)",
                placeholder: "Enter weight",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                additionalData: {
                    metaData: "jobControls"
                },
                Validations: []
            }, {
                name: 'billingParty', label: "Billing Party", placeholder: "Select Billing Party", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Billing Party is required"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    metaData: "jobControls",
                    showNameAndValue: false
                }
            }, {
                name: 'vehicleSize', label: "Vehicle Size (MTs)", placeholder: "Select Vehicle Size", type: 'Staticdropdown',
                value: [
                    { value: '1', name: '1-MT' },
                    { value: '9', name: '9-MT' },
                    { value: '16', name: '16-MT' },
                    { value: '32', name: '32-MT' }
                ],
                filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                },
                Validations: [
                ],

            }, {
                name: "mobileNo",
                label: "Mobile No",
                placeholder: "Enter Mobile No",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 10 digit mobile number",
                        pattern: "^[0-9]{10}$",
                    },
                ],
                additionalData: {
                    metaData: "jobControls"
                },
            }, {
                name: 'fromCity', label: "From City", placeholder: "Enter From City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: true,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                },
            }, {
                name: 'toCity', label: "To City", placeholder: "Enter To City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                functions: {
                    onModel: "getPincodeDetail",
                    onOptionSelect:"getDocketBasedOnCity"
                },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                }
            },
            {
                name: "jobType",
                label: "Job Type",
                placeholder: 'Job Type',
                type: "Staticdropdown",
                value: [
                    { value: 'I', name: 'Import' },
                    { value: 'E', name: 'Export' }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Job Type is required"
                    }
                ],
                additionalData: {
                    metaData: "jobControls"
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: "noOfPkg",
                label: "No of Packets",
                placeholder: "Enter No of PKts",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "pattern",
                    message: "Please Enter Proper Packages(1-6 Digit)",
                    pattern: '[0-9]{1,6}'
                }
                ],
                additionalData: {
                    metaData: "jobControls"
                }
            },
            {
                name: "transportedBy",
                label: "Transported By",
                placeholder: 'Transported By',
                type: "Staticdropdown",
                value: [
                    { value: 'I', name: 'Third Party' },
                    { value: 'E', name: 'Own' }
                ],
                Validations: [
                ],
                functions: {
                    onSelection: "tranPortChanged"
                  },
                additionalData: {
                    metaData: "jobControls"
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                placeholder: "Enter Vendor Name",
                type: "dropdown",//dropdown
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Name is required"
                    }
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                }
            },
            {
                name: 'jobLocation', label: "Job Location", placeholder: "Select Job Location", type: 'text',
                value: localStorage.getItem('Branch'), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                }
            },
            {
                name: 'transportMode', label: "Transport Mode", placeholder: "Select Transport Mode", type: 'Staticdropdown',
                value: [
                    { value: 'Air', name: 'Air' },
                    { value: 'Road', name: 'Road' },
                    { value: 'Rail', name: 'Rail' }

                ], filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [],
                functions: {
                    onSelection: "tranPortChanged"
                  },
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                }
            },
            {
                name: "poNumber",
                label: "PO Number",
                placeholder: "Enter PO Number",
                type: "text",
                value: "",
                additionalData: {
                    metaData: "jobControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "contNo",
                label: "Containor Number",
                placeholder: "Containor Number",
                type: "text",
                value: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "containerType",
                label: "Container Type",
                placeholder: "Container Type",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [
                {
                    name: "autocomplete",
                },
                {
                    name: "invalidAutocompleteObject",
                    message: "Choose proper value",
                }
            ],
                additionalData: {
                  showNameAndValue: false,
                  metaData: "jobTableControls"
                },
                functions: {
                  onOptionSelect: 'getContainerType'
                },
                generatecontrol: true,
                disable: false,
              },
            {
                name: "cnoteNo",
                label: "Cnote Number",
                placeholder: "Cnote Number",
                type: "dropdown",
                value: "",
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobTableControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }

                ]
                ,
                functions: {
                  onChange: "getDocketDetail",
                  onOptionSelect: 'fillDocketDetail'
                  }
            },
            {
                name: "cnoteDate",
                label: "Cnote Date",
                placeholder: "Cnote Date",
                type: "date",
                value: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "noOfpkg",
                label: "No of Package",
                placeholder: "No of Package",
                type: "mobile-number",
                value: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "loadedWeight",
                label: "Loaded Weight",
                placeholder: "Loaded Weight",
                type: "text",
                value: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: 'isUpdate',
                label: 'IsUpdate',
                placeholder: 'IsUpdate',
                type: '',
                value: false,
                Validations: [],
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: false, disable: false
            },
            {
                name: "_id",
                label: "id",
                placeholder: "",
                type: "",
                value: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "entryBy",
                label: "Entry by",
                placeholder: "",
                type: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                value: localStorage.getItem("Username"),
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "entryDate",
                label: "Entry Date",
                placeholder: "",
                type: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                value: new Date().toUTCString(),
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "status",
                label: "Status",
                placeholder: "",
                type: "",
                value: "0",
                additionalData: {
                    metaData: "jobTableControls"
                },
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            },
        ];
    }

    getJobFormControls() {
        return this.jobControlArray;
    }
}
