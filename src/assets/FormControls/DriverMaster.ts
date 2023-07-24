import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DriverMaster } from "src/app/core/models/Masters/Driver";

export class DriverControls {
    private DriverDetailsControl: FormControls[];
    private LicenseDetailsControls: FormControls[];
    private PermanentAddressControls: FormControls[];
    private UploadsControls: FormControls[];
    private BankDetailsControls: FormControls[];
    // formControlsArray
    constructor(DriverTable: DriverMaster, IsUpdate: boolean,
    ) {
        this.DriverDetailsControl =
            [
                {
                    name: 'driverName', label: ' Driver Name', placeholder: 'Enter Driver Name', type: 'text', value: DriverTable.driverName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Driver Name is required"
                        }
                        , {
                            name: "pattern",
                            message: "Please Enter alphanumeric Driver Name of length 3 to 10",
                            pattern: '^[a-zA-Z0-9]{3,10}$',
                        }
                    ]
                },
                {
                    name: 'dFatherName', label: "Driver's Father Name", placeholder: "Enter Driver's Father  Name", type: 'text', value: DriverTable.dFatherName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only text of length 3 to 10 characters",
                            pattern: '^[a-zA-Z ]{3,10}$',
                        }
                    ]
                },
                {
                    name: 'manualDriverCode', label: "Manual Driver Code", placeholder: "Enter Manual Driver Code", type: 'text', value: DriverTable.manualDriverCode, generatecontrol: true, disable: IsUpdate ? true : false,
                    Validations: [
                        {
                            name: "required",
                            message: "Manual Driver Code is required"
                        },
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Manual Driver Code of length 4 to 10",
                            pattern: '^[a-zA-Z0-9]{4,10}$',
                        }

                    ],
                    functions: {
                        onChange: 'GetManualDriverCode',
                    }
                },
                {
                    name: 'driverLocation', label: "Driver Location", placeholder: "Select location", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'vehicleNo', label: "Vehicle Number", placeholder: "Enter Vehicle Number", type: 'text', value: DriverTable.vehicleNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Vehicle Number of length 10",
                            pattern: '^[a-zA-Z0-9]{10,10}$',
                        }
                    ],
                },
                {
                    name: 'vendorDriverCode', label: "Vendor Driver Code", placeholder: "Enter Vendor Driver Code", type: 'text', value: DriverTable.vendorDriverCode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric VendriverCode of length 4 to 10",
                            pattern: "^[a-zA-Z0-9]{4,10}$",
                        }
                    ]
                },
                {
                    name: 'telno', label: "Contact Number", placeholder: "Enter Contact Number", type: 'number', value: DriverTable.telno, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Contact Number is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter 6 to 10 digit mobile number",
                            pattern: "^[0-9]{10,12}$",
                        }
                    ]
                },
                {
                    name: 'dDob', label: "Date of Birth", placeholder: "select Date Of Birth", type: 'date', value: DriverTable.dDob, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
                        minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'dCategory', label: "Driver Category", placeholder: "", type: 'dropdown', value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'joiningDate', label: 'Joining Date', placeholder: 'Enter Joining Date', type: 'date', value: DriverTable.joiningDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: DriverTable.activeFlag, generatecontrol: true, disable: false,
                    Validations: []
                },
                
                // {
                //     name: 'driverId', label: 'Driver_Id', placeholder: '', type: 'text', value: DriverTable.driverId, generatecontrol: false, disable: false,
                //     Validations: []
                // },
               
            ],
            this.LicenseDetailsControls =
            [
                {
                    name: 'licenseNo', label: 'License No', placeholder: 'Enter License No', type: 'text', value: DriverTable.licenseNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric License No of length 4 to 15",
                            pattern: "^[a-zA-Z0-9]{4,15}$",
                        }
                    ]
                },
                {
                    name: 'valdityDt', label: "License Valdity Date", placeholder: "select Valdity Date", type: 'date', value: DriverTable.valdityDt, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        minDate: new Date("01 Jan 1900")
                    }
                },
               
            ],
            this.PermanentAddressControls = [
                {
                    name: 'address', label: 'Permanent Address', placeholder: 'Enter Permanent Address', type: 'text', value: DriverTable.address, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Permanent address is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter Permanennt Address of length 5 to 150 characters",
                            pattern: "^[a-zA-Z0-9]{5,150}$",
                        }
                    ]
                },
                {
                    name: 'city', label: 'Permanent City', placeholder: 'Enter Permanent City', type: 'text', value: DriverTable.city, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Permanent City is required"
                        }
                        , {
                            name: "pattern",
                            message: "Please enter a Permanent City of length 3 to 10 characters",
                            pattern: '^[a-zA-Z ]{3,10}$',
                        }
                    ]
                },
                {
                    name: 'pincode', label: 'Permanent Pincode', placeholder: 'Enter Permanent Pincode', type: 'text', value: DriverTable.pincode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Permanent Pincode is required"
                        }
                        , {
                            name: "pattern",
                            message: "Please enter 6 digit Pincode",
                            pattern: '^[1-9][0-9]{5}$',
                        }
                    ]
                },
            ],
            this.UploadsControls = [
                {
                    name: 'license',
                    label: 'Driving License',
                    placeholder: '',
                    type: 'file',
                    value: '',
                    Validations: [],
                    additionalData: {
                        multiple: true
                    },
                    functions: {
                        onChange: 'selectedFile',
                    },
                    generatecontrol: true,
                    disable: false
                },
              
                {
                    name: 'panCard',
                    label: 'PAN Card',
                    placeholder: '',
                    type: 'file',
                    value: '',
                    Validations: [],
                    additionalData: {
                        multiple: true
                    },
                    functions: {
                        onChange: 'selectedPngFile',
                    },
                    generatecontrol: true,
                    disable: false
                },
                {
                    name: 'aadhar',
                    label: 'Aadhar Card',
                    placeholder: '',
                    type: 'file',
                    value: '',
                    Validations: [],
                    additionalData: {
                        multiple: true
                    },
                    functions: {
                        onChange: 'selectedJpgFile',
                    },
                    generatecontrol: true,
                    disable: false
                },

            ],
            this.BankDetailsControls = [
                {
                    name: 'bName', label: 'Bank Name', placeholder: 'Enter Bank Name', type: 'text', value: DriverTable.bName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a Bank Name of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ]
                },
                {
                    name: 'bAcct', label: 'Bank Account No', placeholder: 'Enter Bank Account No', type: 'text', value: DriverTable.bAcct, generatecontrol: true, disable: false,
                    Validations: [ 
                        {
                            name: "pattern",
                            message: "Please enter Bank Account No of length 10 to 15 characters",
                            pattern: "^[a-zA-Z0-9]{10,15}$",
                        }
                ]
                },
                {
                    name: 'branch', label: 'Branch Name', placeholder: 'Enter Branch Name', type: 'text', value: DriverTable.branch, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a Branch  of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ]
                },
                {
                    name: 'acctName', label: 'Account Name', placeholder: 'Enter Account Name', type: 'text', value: DriverTable.acctName, generatecontrol: true, disable: false,
                    Validations: [ 
                        {
                        name: "pattern",
                        message: "Please enter a Permanent City of length 3 to 10 characters",
                        pattern: '^[a-zA-Z ]{3,10}$',
                    }
                ]
                },
                {
                    name: 'ifsc', label: 'IFSC Code', placeholder: 'Enter IFSC Code', type: 'text', value: DriverTable.ifsc, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: DriverTable.id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false
                  },
            ]
    }
    getFormControlsD() {
        return this.DriverDetailsControl;
    }
    getFormControlsL() {
        return this.LicenseDetailsControls;
    }
    getFormControlsP() {
        return this.PermanentAddressControls;
    }
    getFormControlsU() {
        return this.UploadsControls;
    }
    getFormControlsB() {
        return this.BankDetailsControls;
    }
}