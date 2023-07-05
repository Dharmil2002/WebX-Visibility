import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { DriverMaster } from "src/app/core/models/Masters/Driver";

export class DriverControls {
    private DriverDetailsControl: FormControls[];
    private LicenseDetailsControls: FormControls[];
    private PermanentAddressControls: FormControls[];
    //private CurrentAddressControls: FormControls[];

    // formControlsArray
    constructor(DriverTable: DriverMaster, IsUpdate: boolean,
    ) {
        this.DriverDetailsControl =
            [
                {
                    name: 'Driver_Name', label: ' Driver Name', placeholder: 'Enter Driver Name', type: 'text', value: DriverTable.DriverName, generatecontrol: true, disable: false,
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
                    name: 'DFather_Name', label: "Driver's Father Name", placeholder: "Enter Driver's Father  Name", type: 'text', value: DriverTable.DriverFatherName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only text of length 3 to 10 characters",
                            pattern: '^[a-zA-Z ]{3,10}$',
                        }
                    ]
                },
                {
                    name: 'Manual_Driver_Code', label: "Manual Driver Code", placeholder: "Enter Manual Driver Code", type: 'text', value: DriverTable.ManualDriverCode, generatecontrol: true, disable: IsUpdate ? true : false,
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
                    name: 'Driver_Location', label: "Driver Location", placeholder: "Select location", type: 'select',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Driver Location is required.."
                        },
                        {
                            name: "autocomplete",
                        },
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },
                {
                    name: 'VEHNO', label: "Vehicle Number", placeholder: "Enter Vehicle Number", type: 'text', value: DriverTable.VehicleNumber, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Vehicle Number of length 6 to 15",
                            pattern: '^[a-zA-Z0-9]{6,15}$',
                        }
                    ],
                },
                {
                    name: 'VendorDriverCode', label: "Vendor Driver Code", placeholder: "Enter Vendor Driver Code", type: 'text', value: DriverTable.VendorDriverCode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric VendriverCode of length 4 to 10",
                            pattern: "^[a-zA-Z0-9]{4,10}$",
                        }
                    ]
                },
                {
                    name: 'Telno', label: "Contact Number", placeholder: "Enter Contact Number", type: 'number', value: DriverTable.ContactNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Contact Number is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter 6 to 10 digit mobile number",
                            pattern: "^[0-9]{6,10}$",
                        }
                    ]
                },
                {
                    name: 'D_DOB', label: "Date of Birth", placeholder: "select Date Of Birth", type: 'date', value: DriverTable.DateOfBirth, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
                        minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'Guarantor_Name', label: "Guarantor Name", placeholder: "Enter Guarantor Name", type: 'text', value: DriverTable.GuarantorName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only text of length 3 to 10 characters",
                            pattern: '^[a-zA-Z ]{3,10}$',
                        }
                    ]
                },
                {
                    name: 'GuarantorMobileNo', label: 'Guarantor Mobile No', placeholder: 'Enter Guarantor Mobile No', type: 'number', value: DriverTable.GuarantorMobileNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter 6 to 10 digit mobile number",
                            pattern: "^[0-9]{6,10}$",
                        }
                    ]
                },
                {
                    name: 'D_category', label: "Driver Category", placeholder: "", type: 'select', value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'JoiningDate', label: 'Joining Date', placeholder: 'Enter Joining Date', type: 'date', value: DriverTable.JoiningDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        minDate: new Date("01 Jan 1900")
                    }

                },
                {
                    name: 'ActiveFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: DriverTable.ActiveFlag, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'CompanyCode', label: 'CompanyCode', placeholder: '', type: 'text', value: +localStorage.getItem("CompanyCode"), generatecontrol: false, disable: false,
                    Validations: []

                },
                {
                    name: 'Driver_Id', label: 'Driver_Id', placeholder: '', type: 'text', value: DriverTable.DriverId, generatecontrol: false, disable: false,
                    Validations: []
                },
                {
                    name: 'IsUpdate', label: 'IsUpdate', placeholder: '', type: 'text', value: false, generatecontrol: false, disable: false,
                    Validations: []
                },
                {
                    name: 'UpdatedBy', label: 'UpdatedBy', placeholder: '', type: 'text', value: '', generatecontrol: false, disable: false,
                    Validations: []
                },
                {
                    name: 'EntryBy', label: 'EntryBy', placeholder: '', type: 'text', value: '', generatecontrol: false, disable: false,
                    Validations: []
                },
            ],
            this.LicenseDetailsControls =
            [
                {
                    name: 'License_No', label: 'License No', placeholder: 'Enter License No', type: 'text', value: DriverTable.LicenseNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric License No of length 4 to 15",
                            pattern: "^[a-zA-Z0-9]{4,15}$",
                        }
                    ]
                },
                {
                    name: 'Issue_By_RTO', label: 'Issue By RTO', placeholder: 'Enter Issue By RTO', type: 'text', value: DriverTable.IssueByRTO, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Issue by RTO of length 3 to 10 characters",
                            pattern: "^[a-zA-Z]{3,10}$",
                        }
                    ]
                },
                {
                    name: 'Valdity_dt', label: "Valdity Date", placeholder: "select Valdity Date", type: 'date', value: DriverTable.ValidityDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'BlackListedReason', label: 'BlackListed Reason', placeholder: 'Enter BlackListed Reason', type: 'text', value: DriverTable.blackListedReason, generatecontrol: true, disable: false,
                    Validations: [{
                        name: "pattern",
                        message: "Please enter BlackListed Reason of length 2 to 50 characters",
                        pattern: "^[a-zA-Z ]{2,50}$",
                    }]
                },
                {
                    name: 'IsBlackListed', label: 'IsBlackListed', placeholder: '', type: 'toggle', value: DriverTable.IsBlackListed, generatecontrol: true, disable: false,
                    Validations: []
                }
            ],
            this.PermanentAddressControls = [
                {
                    name: 'P_Address', label: 'Permanent Address', placeholder: 'Enter Permanent Address', type: 'text', value: DriverTable.PermanentAddress, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Permanent address is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter Permanennt Address of length 5 to 50 characters",
                            pattern: "^[a-zA-Z ]{5,50}$",
                        }
                    ]
                },
                {
                    name: 'P_City', label: 'Permanent City', placeholder: 'Enter Permanent City', type: 'text', value: DriverTable.PermanentCity, generatecontrol: true, disable: false,
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
                    name: 'P_Pincode', label: 'Permanent Pincode', placeholder: 'Enter Permanent Pincode', type: 'text', value: DriverTable.PermanentPincode, generatecontrol: true, disable: false,
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
}