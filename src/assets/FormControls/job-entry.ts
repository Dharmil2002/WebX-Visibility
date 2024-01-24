import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class JobControl {
    jobControlArray: FormControls[];
    containordetail: FormControls[];
    blDetail: FormControls[];
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
                label: "Weight (MT)",
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
                functions: {
                    onModel: "getCustomer",
                    onOptionSelect: "getDocketBasedOnCity"
                },
                additionalData: {
                    metaData: "jobControls",
                    showNameAndValue: true
                }
            },
            //  {
            //     name: 'vehicleSize', label: "Vehicle Size (MTs)", placeholder: "Select Vehicle Size", type: 'Staticdropdown',
            //     value: [
            //         { value: '1', name: '1-MT' },
            //         { value: '9', name: '9-MT' },
            //         { value: '16', name: '16-MT' },
            //         { value: '32', name: '32-MT' }
            //     ],
            //     filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
            //     additionalData: {
            //         showNameAndValue: false,
            //         metaData: "jobControls"
            //     },
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "Vehicle Size  is required"
            //         }
            //     ],

            // }, 
            {
                name: "mobileNo",
                label: "Mobile No",
                placeholder: "Enter Mobile No",
                type: "mobile-number",
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
            },
            {
                name: "DestCountry",
                label: "Destination Country",
                placeholder: "Destination Country",
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
                name: 'fromCity', label: "PORT of Loading", placeholder: "PORT of Loading", type: 'text', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [{
                    name: "required",
                    message: "PORT of Loading  is required",
                },
                {
                    name: "pattern",
                    message: "Please enter only characters",
                    pattern: "^^[a-zA-Z]+$",
                },
                ],
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                },
            },
            {
                name: 'toCity', label: "PORT of Discharge", placeholder: "PORT of Discharge", type: 'text', value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "PORT of Discharge is required"
                    },
                    {
                        name: "pattern",
                        message: "Please enter only characters",
                        pattern: "^^[a-zA-Z]+$",
                    },
                ],
                functions: {
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
                value: [],
                Validations: [
                    {
                        name: "required",
                        message: "Job Type is required"
                    }
                ],
                additionalData: {
                    metaData: "jobControls"
                },
                functions: {
                    onSelection: 'onJobChanged'
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
                    // name: "pattern",
                    // message: "Please Enter Proper Packages(1-6 Digit)",
                    // pattern: '[0-9]{1,6}'
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
                value: [],
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
                name: "nOOFCONT",
                label: "No of Container",
                placeholder: "No of Container",
                type: "number",
                value: "",
                additionalData: {
                    metaData: ""
                },
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
                    showNameAndValue: false,
                    metaData: "jobControls"
                }
            },
            {
                name: 'transportMode', label: "Transport Mode", placeholder: "Select Transport Mode", type: 'dropdown',
                value: [], filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
                name: 'exportType', label: "Export Type", placeholder: "Export Type", type: 'Staticdropdown',
                value: [],
                filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                additionalData: {
                    showNameAndValue: false,
                    metaData: "jobControls"
                },
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Size  is required"
                    }
                ],

            },
            {
                name: "companyCode",
                label: "companyCode",
                placeholder: "company Code",
                type: "",
                value: localStorage.getItem("companyCode"),
                generatecontrol: false,
                disable: false,
                additionalData: {
                    metaData: "jobControls"
                },
                Validations: [
                ]
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
                value: localStorage.getItem("UserName"),
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
                value: new Date(),
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
            }
        ];

        this.containordetail = [
            {
                name: "Company_file",
                label: "Select File",
                placeholder: "",
                type: "file",
                value: "",
                generatecontrol: true,
                disable: false,
                additionalData: {
                    metaData: "jobTableControls"
                },
                Validations: [".xls, .xlsx, .csv"],
                functions: {
                    onChange: "selectedFile",
                },
            },
            {
                name: "Download_Icon",
                label: "Dowload Container Template",
                placeholder: "",
                type: "filelink",
                value: "assets/Download/job-container-temp.xlsx",
                generatecontrol: true,
                disable: false,
                additionalData: {
                    metaData: "jobTableControls"
                },
                Validations: [],
                functions: {
                },
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
                    },
                    {
                        name: "required",
                        message: "Cnote Number is required"
                    }
                ]
                ,
                functions: {
                    onModel: "getShipment",
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
                    {
                        name: "required",
                        message: "Cnote Date is required"
                    }
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
                    {
                        name: "required",
                        message: "No of Package is required"
                    }
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
                    {
                        name: "required",
                        message: "Loaded Weight is required"
                    }
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
                name: "entryBy",
                label: "Entry by",
                placeholder: "",
                type: "",
                additionalData: {
                    metaData: "jobTableControls"
                },
                value: localStorage.getItem("UserName"),
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
                value: new Date(),
                generatecontrol: false,
                disable: false,
                Validations: [
                ]
            }
        ];

        this.blDetail = [
            {
                name: "blNum",
                label: "BL Num",
                placeholder: "BL Num",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                   
                ]
            },
            {
                name: "blDate",
                label: "BL Date",
                placeholder: "BL Date",
                type: "date",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                  
                ]
            },
            {
                name: "beNum",
                label: "BE Num",
                placeholder: "BE Num",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                   
                ]
            },
            {
                name: "beDT",
                label: "BE Date",
                placeholder: "BE Date",
                type: "date",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "invNum",
                label: "Inv Num",
                placeholder: "Inv Num",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "invDate",
                label: "Inv Date",
                placeholder: "Inv Date",
                type: "date",
                value: "",
                additionalData: {
                    maxDate: new Date(),
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "sbNum",
                label: "SBNum",
                placeholder: "SBNum",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "sbDt",
                label: "SBDate",
                placeholder: "SBDate",
                type: "date",
                value: "",
                additionalData: {
                    maxDate: new Date(),
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "pod",
                label: "POD",
                placeholder: "POD",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
            {
                name: "cod",
                label: "COD",
                placeholder: "COD",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
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
                additionalData: {
                    showNameAndValue: false
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
            },
            {
                name: "containerNum",
                label: "Container Num",
                placeholder: "Container Num",
                type: "text",
                value: "",
                additionalData: {
                    metaData: ""
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                ]
            },
        ]
    }

    getJobFormControls() {
        return this.jobControlArray;
    }
    getContainorDetails() {
        return this.containordetail
    }
    getBlDetail() {
        return this.blDetail
    }

}
