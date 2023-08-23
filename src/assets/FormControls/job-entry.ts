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
                    minDate: new Date(),
                },
            },
            {
                name: "weight",
                label: "Weight (KGs)",
                placeholder: "Enter weight",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: []
            }, {
                name: 'billingParty', label: "Billing Party", placeholder: "Select Billing Party", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: 'vehicleSize', label: "Vehicle Size (MTs)", placeholder: "Select Vehicle Size", type: 'Staticdropdown',
                value: [
                    { value: '1-MT', name: '1-MT' },
                    { value: '9-MT', name: '9-MT' },
                    { value: '16-MT', name: '16-MT' },
                    { value: '32-MT', name: '32-MT' }
                ],
                filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
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
            }, {
                name: 'fromCity', label: "From City", placeholder: "Enter From City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    //     {
                    //     name: "autocomplete",
                    // },
                    // {
                    //     name: "invalidAutocompleteObject",
                    //     message: "Choose proper value",
                    // }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: 'toCity', label: "To City", placeholder: "Enter To City", type: 'dropdown', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    //     {
                    //     name: "autocomplete",
                    // },
                    // {
                    //     name: "invalidAutocompleteObject",
                    //     message: "Choose proper value",
                    // }
                ],
                additionalData: {
                    showNameAndValue: false
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
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: "noOfPKts",
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
                ]
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
                generatecontrol: true,
                disable: false
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                placeholder: "Enter Vendor Name",
                type: "text",//dropdown
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: 'jobLocation', label: "Job Location", placeholder: "Select Job Location", type: 'text',
                value: localStorage.getItem('Branch'), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
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
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: "poNumber",
                label: "PO Number",
                placeholder: "Enter PO Number",
                type: "text",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: 'isUpdate',
                label: 'IsUpdate',
                placeholder: 'IsUpdate',
                type: 'text',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            },

        ];
    }

    getJobFormControls() {
        return this.jobControlArray;
    }
}
