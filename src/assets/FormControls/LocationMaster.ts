import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { LocationMaster } from "src/app/core/models/Masters/LocationMaster";

export class LocationControl {
    LocationDetailControl: FormControls[];
    OtherDetailsControls: FormControls[];

    constructor(LocationTable: LocationMaster, IsUpdate: boolean) 
    {
        this.LocationDetailControl = 
        [
            {
                name: 'locLevel', label: "Location Hierarchy", placeholder: "Select location Hierarchy", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Location Hierarchy is required"
                    // },
                ],
                additionalData: {
                    showNameAndValue: false
                },
               
            },
            {
                name: 'reportLevel', label: "Reporting To", placeholder: "Select Reporting To", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Reporting To is required"
                    // }  
                ],
                additionalData: {
                    showNameAndValue: false
                },
            },
            {
                name: 'reportLoc', label: "Reporting Location", placeholder: "Select Reporting Location", type: 'dropdown',
                value:'', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Reporting Location is required"
                    // }  
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'locCode', label: 'Location Code', placeholder: 'Enter Location Code', type: 'text', value: LocationTable.locCode, generatecontrol: true, disable: IsUpdate ? true : false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Code is required"
                    }
                    , {
                        name: "pattern",
                        message: "Please Enter A-Z Char Or 0-9 with no Space and Location Code should be limited to 5 characters",
                        pattern: "^[.a-zA-Z0-9,-]{0,5}$",
                    }
                ],
            },
            {
                name: 'locName', label: 'Location Name', placeholder: 'Enter Location Name', type: 'text', value:LocationTable.locName, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Name is required"
                    }
                    , {
                        name: "pattern",
                        message: "Please Enter only text of length 3 to 25 characters",
                        pattern: '^[a-zA-Z ]{3,25}$',
                    }
                ],
               
            },
            {
                name: 'locPincode', label: 'Pincode', placeholder: 'Enter Pincode', type: 'dropdown', value: '', generatecontrol: true, disable: false,
                Validations: [
                    
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'locState', label: "State", placeholder: "Select State", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "State is required"
                    // }
                ],
                additionalData: {
                    showNameAndValue: false
                },
            },
            {
                name: 'locCity', label: "City", placeholder: "Select City", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                        // {
                        //     name: "required",
                        //     message: "City is required"
                        // }
                    
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'locAddr', label: 'Address', placeholder: 'Enter Location Address', type: 'text', value: LocationTable.locAddr, generatecontrol: true, disable: IsUpdate ? true : false,
                Validations: [
                    {
                        name: "required",
                        message: "Location Address is required"
                    }, {
                        name: "pattern",
                        message: "Please Enter alphanumeric Address of length 4 to 100",
                        pattern: '^[a-zA-Z0-9]{4,100}$',
                    }

                ],

            },
            {
                name: 'locTelno', label: "Telephone Number", placeholder: "Enter Telephone Number", type: 'number', value: LocationTable.locTelno, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 10 to 12 digit mobile number",
                        pattern: "^[0-9]{8,12}$",
                    },
                    {
                        name: "required",
                        message: "Telephone No is required"
                    }
                ]
            },
            {
                name: 'locMobile', label: "Mobile No", placeholder: "Enter Mobile Number", type: 'number', value: LocationTable.locMobile, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 6 to 15 digit mobile number",
                        pattern: "^[0-9]{10,12}$",
                    }
                ]
            },
           
            {
                name: 'locEmail', label: "Email Id", placeholder: "Enter Email Id", type: 'text', value: LocationTable.locEmail, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Email Id  is required"
                    },
                    {
                        name: "email",
                        message: "Enter Valid Email ID!",
                    },
                    
                ]
            },
            {
                name: 'endMile', label: 'End Mile Serviceability', placeholder: '', type: 'toggle', value:LocationTable.locEndmile, generatecontrol: true, disable: false,
                Validations: []
            },
        ],
	
	  this.OtherDetailsControls =
            [
                {
                    name: 'locRegion', label: "Zone", placeholder: "Select zone", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "required",
                        //     message: "Zone is required"
                        // },
                        // {
                        //     name: "autocomplete",
                        // },
                        
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'acctLoc', label: "Accounting Location", placeholder: "Select Accounting Location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'dataLoc', label: "Data Entry Location", placeholder: "Select Data Entry Location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'locStartDt', label: 'Location Start Date', placeholder: 'Enter Location Start Date', type: 'date', value:LocationTable.locStartDt, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Location Start Date is required"
                        },
                    ],
                    additionalData: {
                        minDate: new Date("01 Jan 1900")
                    }
                    
                },
                {
                    name: 'locEndDt', label: 'Location End Date', placeholder: 'Enter Location End Date', type: 'date', value: LocationTable.locEndDt, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        minDate: ''
                    },
                },
                {
                    name: 'ctbs', label: 'CTBS Location', placeholder: 'CTBS Location', type: 'text', value:LocationTable.ctbs, generatecontrol: true, disable: false,
                    Validations: [
                    ]
                },
                {
                    name: 'computerised', label: 'Computerised', placeholder: '', type: 'toggle', value:LocationTable.computerised, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'cutoff', label: 'Cutoff Time Flag', placeholder: '', type: 'toggle', value: LocationTable.cutOff, generatecontrol: true, disable: false,
                    Validations: []
                },
              
                {
                    name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value:LocationTable.activeFlag, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'nextLoc', label: "Default Next Location", placeholder: "Select Default Next Location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "autocomplete",
                        // },
                        // {
                        //     name: "invalidAutocomplete",
                        //     message: "Choose proper value",
                        // }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'prevLoc', label: "Nearest Previous Location", placeholder: "Select Nearest Previous Location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "autocomplete",
                        // },
                        // {
                        //     name: "invalidAutocomplete",
                        //     message: "Choose proper value",
                        // }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'ownership', label: "Location Ownership", placeholder: "Select Location Ownership", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                      
                        // {
                        //     name: "required",
                        //     message: "Location Ownership is required"
                        // },
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'contLoc', label: "Delivery Control Location", placeholder: "Select Delivery Control Location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "autocomplete",
                        // },
                        // {
                        //     name: "invalidAutocomplete",
                        //     message: "Choose proper value",
                        // }
                    ],
                    additionalData: {
                        showNameAndValue: false,
                    }
                },
                {
                    name: 'paid', label: 'Paid SAP Code', placeholder: 'Paid SAP Code', type: 'text', value: LocationTable.paid, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Paid SAP Code of length 4 to 10",
                            pattern: '^[a-zA-Z0-9]{4,10}$',
                        }
                    ]
                },
                {
                    name: 'pay', label: 'To Pay SAP Code', placeholder: 'To Pay SAP Code', type: 'text', value: LocationTable.pay, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric To Pay SAP Code of length 4 to 10",
                            pattern: '^[a-zA-Z0-9]{4,10}$',
                        }
                    ]
                },
                {
                    name: 'profit', label: 'Profit Centre Code', placeholder: 'Profit Centre Code', type: 'text', value:LocationTable.profit, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Profit Centre Code of length 4 to 10",
                            pattern: '^[a-zA-Z0-9]{4,10}$',
                        }
                    ]
                },
                {
                    name: 'id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: LocationTable.id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false
                  },
            ]
    }
    getFormControlsLocation() {
        return this.LocationDetailControl;
    }
    getFormControlsOther() {
        return this.OtherDetailsControls;
    }
}
