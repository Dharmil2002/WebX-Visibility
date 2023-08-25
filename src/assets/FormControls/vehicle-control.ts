import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";

export class VehicleControls {
    private vehicleDetailsControl: FormControls[];
    private registrationDetailsControls: FormControls[];
    private dimensionControls: FormControls[];
    constructor(vehicleTable: vehicleModel, isUpdate: boolean
    ) {
        const currentDate = new Date();
        this.vehicleDetailsControl =
            [
                {
                    name: 'vehicleNo', label: "Vehicle Number", placeholder: "Enter Vehicle Number", type: 'text', value: vehicleTable.vehicleNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: isUpdate ? true : false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vehicle Number is required.."
                        }
                        ,
                        {
                            name: "pattern",
                            message: "Please enter a valid Vehicle Number (e.g., KA01AB1234)",
                            pattern: '^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}',
                        }

                    ],
                    functions: {
                        onChange: 'checkVehicleNumberExist',
                    }
                },
                {
                    name: 'vehicleType', label: "Vehicle Type", placeholder: "Search And Select Vehicle Type", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Type is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'controllBranch', label: "Controlling Branch", placeholder: "Search and select Controlling Branch", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Controlling Branch is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'assetName', label: "Assets Type", placeholder: "Search and select Assets Type", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Assets Type is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'vendorType', label: "Vendor Type", placeholder: "Search and select Vendor Type", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Type is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'vendorName', label: "Vendor Name", placeholder: "Search and select Vendor Name", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Name is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'route',
                    label: 'Routes',
                    placeholder: 'Select Route',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "routeLocation",
                        showNameAndValue: false,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'noOfDrivers', label: 'No. Of Drivers', placeholder: 'Enter No. Of Drivers', type: 'number', value: vehicleTable.noOfDrivers, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter min 1 & max 3 character",
                            pattern: '[0-9]{1,3}',
                        }
                    ]
                },
                {
                    name: 'gpsDeviceEnabled', label: 'GPS Device Enabled', placeholder: '', type: 'toggle', value: vehicleTable.gpsDeviceEnabled, generatecontrol: true, disable: false,
                    Validations: [], functions: {
                        onChange: "enableGpsProvider"
                    }
                },
                {
                    name: 'gpsProvider', label: 'GPS Provider', placeholder: 'Search and select GPS Provider', type: 'dropdown', value: '',
                    generatecontrol: true, disable: true,
                    Validations: [
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'permitState',
                    label: 'Permit States',
                    placeholder: 'Select Permit States',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "permitStateDropdown",
                        showNameAndValue: false,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'ftlTypeDesc', label: "FTL Type", placeholder: "Search and select FTL Type", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "FTL Type is required.."
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
                        showNameAndValue: false
                    }
                },
                {
                    name: 'gpsDeviceId', label: 'Device Id', placeholder: '', type: 'number', value: vehicleTable.gpsDeviceId, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Min 1 & Max. 30 Character",
                            pattern: '.{1,30}',
                        }
                    ]
                },
                {
                    name: 'tyreAttached', label: 'No of Tyre Attached with Vehicle', placeholder: 'Enter No of Tyre Attached with Vehicle', type: 'number', value: vehicleTable.tyreAttached, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter min 1 & max 3 character",
                            pattern: '[0-9]{1,3}',
                        }
                    ]
                },
                {
                    name: 'tankCapacity',
                    label: 'Tank Capacity',
                    placeholder: 'Enter Tank Capacity',
                    type: 'number',
                    value: isUpdate ? vehicleTable.tankCapacity : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Tank Capacity(1-1000)",
                            pattern: '^(?:[1-9]|[1-9][0-9]{1,2}|1000)$'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'modelNo',
                    label: 'Model No.',
                    placeholder: 'Enter Model No.',
                    type: 'text', value: isUpdate ? vehicleTable.modelNo : 0,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Model No(1-25 character)",
                            pattern: '.{1,25}'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: vehicleTable.activeflag, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: vehicleTable.id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false

                },

                {
                    name: 'permitStateDropdown',
                    label: 'Permit States',
                    placeholder: 'Select Permit States',
                    type: '',
                    value: '',
                    Validations: [
                    ],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'routeLocation',
                    label: 'Routes',
                    placeholder: 'Select Routes',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'isUpdate', label: 'IsUpdate', placeholder: '', type: 'text', value: false, generatecontrol: false, disable: false,
                    Validations: []
                },
                {
                    name: 'CompanyCode', label: 'CompanyCode', placeholder: '', type: 'text', value: localStorage.getItem("CompanyCode"), generatecontrol: false, disable: false,
                    Validations: []
                },

            ],
            this.registrationDetailsControls =
            [
                {
                    name: 'vehicleRCBookNo', label: "RC Book No", placeholder: "Enter RC Book Number", type: 'text', value: vehicleTable.vehicleRCBookNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "RC Book Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter a valid RC Book Number (e.g., AB12-34CD-56EF-GH78)",
                            pattern: '^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}',
                        }
                    ],
                    functions: {
                    }
                },
                {
                    name: 'regNo', label: 'Registration No', placeholder: 'Enter Registration Number', type: 'text', value: vehicleTable.regNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Registration Book Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please Enter Max. 30 Character",
                            pattern: '.{1,30}',
                        }
                    ],
                },
                {
                    name: 'regDate', label: 'Registration Date', placeholder: '', type: 'date', value: isUpdate ? vehicleTable.regDate : Date(), generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        maxDate: new Date(),

                        minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'permitValidityDate', label: "Vehicle Permit Valdity Date", placeholder: "", type: 'date', value: isUpdate ? vehicleTable.permitValidityDate : Date(), generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        maxDate: new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()),

                        minDate: new Date()
                    }
                },
                {
                    name: 'insuranceValidityDate', label: 'Vehicle Insurance Valdity Date', placeholder: '', type: 'date', value: isUpdate ? vehicleTable.insuranceValidityDate : Date(), generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                    }
                },
                {
                    name: 'fitnessValidityDate', label: 'Fitness Cericate Date', placeholder: '', type: 'date', value: isUpdate ? vehicleTable.fitnessValidityDate : Date(), generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                    }
                },
                {
                    name: 'attachedDate', label: 'Date of Attaching', placeholder: '', type: 'date', value: isUpdate ? vehicleTable.attachedDate : Date(), generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                    }
                },
                {
                    name: 'vehicleChasisNo', label: "Chasis Number", placeholder: "Enter Chasis Number", type: 'text', value: vehicleTable.vehicleChasisNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Chasis Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter a valid Chasis Number",
                            pattern: '^[A-Z0-9\-]*$',
                        }
                    ],
                    functions: {
                    }
                },
                {
                    name: 'engineNo', label: "Engine Number", placeholder: "Enter Engine Number", type: 'text', value: vehicleTable.engineNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Engine Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter a valid Engine Number",
                            pattern: '^[A-Z0-9\-]*$',
                        }
                    ],
                    functions: {
                    }
                },
                {
                    name: 'certificateNo', label: "Certificate Number", placeholder: "Enter Certificate Number", type: 'text', value: vehicleTable.certificateNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Certificate Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter a valid Certificate Number",
                            pattern: '^[A-Z0-9\-]*$',
                        }
                    ],
                    functions: {
                    }
                },
                {
                    name: 'vehicleInsurenceNo', label: "Insurance Number", placeholder: "Enter Insurance Number", type: 'text', value: vehicleTable.vehicleInsurenceNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Insurance Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter a valid Insurance Number",
                            pattern: '^[A-Z0-9\-]*$',
                        }
                    ],
                    functions: {
                    }
                },
                {
                    name: 'rtoNo', label: "RTO Number", placeholder: "Enter RTO Number", type: 'text', value: vehicleTable.rtoNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "RTO Number is required.."
                        },
                    ],
                    functions: {
                    }
                }
            ],
            this.dimensionControls = [
                {
                    name: '', label: 'Inner Dimension', placeholder: '', type: 'Title', value: "", generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: '', label: 'Outer Dimension', placeholder: '', type: 'Title', value: "", generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: '', label: 'Other Details', placeholder: '', type: 'Title', value: "", generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: 'innerLength', label: 'Inner Length(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerLength == 0 ? 0 : vehicleTable.innerLength, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Length(Max 100)",
                            pattern: '^([1-9][0-9]?|100)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },
                {
                    name: 'outerLength', label: 'Outer Length(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerLength == 0 ? 0 : vehicleTable.outerLength, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Length(Max 100)",
                            pattern: '^([1-9][0-9]?|100)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },
                {
                    name: 'gvw', label: 'GVW', placeholder: 'Enter GVW', type: 'number', value: vehicleTable.gvw, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "GVW is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                            pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                        }
                    ],
                    functions: {
                        onChange: 'calCapacity'
                    }
                },
                {
                    name: 'innerHeight', label: 'Inner Height(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerHeight == 0 ? 0 : vehicleTable.innerHeight, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },
                {
                    name: 'outerHeight', label: 'Outer Height(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerHeight == 0 ? 0 : vehicleTable.outerHeight, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },
                {
                    name: 'unldWt', label: 'Unladen Weight', placeholder: 'Enter Outer Unlade', type: 'number', value: vehicleTable.unldWt, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Unladen Weight is required"
                        },
                        {
                            name: "pattern",
                            message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                            pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                        }
                    ],
                    functions: {
                        onChange: 'calCapacity'
                    }
                },
                {
                    name: 'innerWidth', label: 'Inner Width(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerWidth == 0 ? 0 : vehicleTable.innerWidth, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Width(Max 25)",
                            pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },

                {
                    name: 'outerWidth', label: 'Outer Width(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerWidth == 0 ? 0 : vehicleTable.outerWidth, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Width(Max 25)",
                            pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    }
                },
                {
                    name: 'capacity', label: 'Capacity(In Tons)', placeholder: 'Enter Payload Capacity', type: 'number', value: vehicleTable.capacity, generatecontrol: true, disable: false,
                    Validations: [],
                },
                {
                    name: 'cft', label: 'Inner Volume CFT', placeholder: '', type: 'number', value: vehicleTable.cft, generatecontrol: true, disable: true,
                    Validations: [],

                },
                {
                    name: 'outerCft', label: 'Outer Volume CFT', placeholder: '', type: 'number', value: vehicleTable.outerCft, generatecontrol: true, disable: true,
                    Validations: [],

                },
                {
                    name: 'entryBy',
                    label: 'Entry By',
                    placeholder: 'Entry By',
                    type: 'text',
                    value: localStorage.getItem("Username"),
                    Validations: [],
                    generatecontrol: false, disable: false
                },
            ]
    }
    getFormControlsD() {
        return this.vehicleDetailsControl;
    }
    getFormControlsL() {
        return this.registrationDetailsControls;
    }
    getDimensionControl() {
        return this.dimensionControls;
    }
}

