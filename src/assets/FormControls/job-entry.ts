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
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: "weight",
                label: "Weight",
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
                name: 'fleetSize', label: "Fleet Size", placeholder: "Select Fleet Size", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, {
                name: "contactNo",
                label: "Contact No",
                placeholder: "Enter Contact No",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
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
            }, {
                name: "weightInMt",
                label: "Weight in (MT)",
                placeholder: "Enter Weight in (MT)",
                type: "number",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "noOfPKts",
                label: "No of Pakets",
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
                    { value: 'I', name: 'By Party' },
                    { value: 'E', name: 'Own' }
                ],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'jobLocation', label: "Job Location", placeholder: "Select Job Location", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'transportMode', label: "Transport Mode", placeholder: "Select Transport Mode", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
