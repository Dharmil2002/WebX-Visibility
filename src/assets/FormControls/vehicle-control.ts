import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";

export class VehicleControls {
    private vehicleDetailsControl: FormControls[];
    private registrationDetailsControls: FormControls[];
    private otherDetailsControls: FormControls[];
    private innerDimensionControls: FormControls[];
    private outerDimensionControls: FormControls[];

    // formControlsArray
    constructor(vehicleTable: vehicleModel, isUpdate: boolean
    ) {
        const currentDate = new Date();
        this.vehicleDetailsControl =
            [
                {
                    name: 'vehicleNo', label: "Vehicle Number", placeholder: "Enter Vehicle Number", type: 'text', value: vehicleTable.vehicleNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vehicle Number is required.."
                        },
                    ],
                    functions: {
                        onChange: 'GetVehicleDetails',
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
                            name: "invalidAutocomplete",
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
                            name: "invalidAutocomplete",
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
                            name: "invalidAutocomplete",
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
                            name: "invalidAutocomplete",
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
                            name: "invalidAutocomplete",
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
                    Validations: [],
                    // functions: {
                    //     onChange: 'OnGpsDevice',
                    // },
                },
                {
                    name: 'gpsProvider', label: 'GPS Provider', placeholder: 'Search and select GPS Provider', type: 'dropdown', value: '', generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "required",
                        //     message: "GPS Provider is required.."
                        // },
                        // {
                        //     name: "autocomplete",
                        // },
                        // {
                        //     name: "invalidAutocomplete",
                        //     message: "Choose proper value",
                        // }
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
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'gpsDeviceId', label: 'Device Id', placeholder: '', type: 'text', value: vehicleTable.gpsDeviceId, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Min 1 & Max. 30 Character",
                            pattern: '.{1,30}',
                        }
                    ]
                },
                {
                    name: 'tyreAttached', label: 'No of Tyre Attached with Vehicle', placeholder: 'Enter No of Tyre Attached with Vehicle', type: 'number', value: 0, generatecontrol: true, disable: false,
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
                    value: isUpdate ? vehicleTable.capacity : "",
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
                    type: 'text', value: isUpdate ? vehicleTable.modelNo : "",
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
                    ],
                    functions: {
                        //onChange: 'GetVehicleDetails',
                    }
                },
                {
                    name: 'regNo', label: 'Registration No', placeholder: 'Enter Registration Number', type: 'text', value: vehicleTable.regNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Max. 30 Character",
                            pattern: '.{1,30}',
                        }
                    ],
                },
                {
                    name: 'regDate', label: 'Registration Date', placeholder: '', type: 'date', value: vehicleTable.regDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        // maxDate: new Date(),
                        // minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'permitValidityDate', label: "Vehicle Permit Valdity Date", placeholder: "", type: 'date', value: vehicleTable.permitValidityDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        // maxDate: new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()),
                        // minDate: new Date()
                    }
                },
                {
                    name: 'insuranceValidityDate', label: 'Vehicle Insurance Valdity Date', placeholder: '', type: 'date', value: vehicleTable.insuranceValidityDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        // maxDate: new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()),
                        // minDate: new Date()
                    }
                },
                {
                    name: 'fitnessValidityDate', label: 'Fitness Certificate Date', placeholder: '', type: 'date', value: vehicleTable.fitnessValidityDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        // maxDate: new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate()),
                        // minDate: new Date()
                    }
                },
                {
                    name: 'attachedDate', label: 'Date of Attaching', placeholder: '', type: 'date', value: vehicleTable.attachedDate, generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        // maxDate: new Date(),
                        // minDate: new Date("01 Jan 1900")
                    }
                },
                {
                    name: 'vehicleChasisNo', label: "Chasis Number", placeholder: "Enter Chasis Number", type: 'text', value: vehicleTable.vehicleChasisNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Chasis Number is required.."
                        },
                    ],
                    functions: {
                        //onChange: 'GetVehicleDetails',
                    }
                },
                {
                    name: 'engineNo', label: "Engine Number", placeholder: "Enter Engine Number", type: 'text', value: vehicleTable.engineNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Engine Number is required.."
                        },
                    ],
                    functions: {
                        //onChange: 'GetVehicleDetails',
                    }
                },
                {
                    name: 'certificateNo', label: "Certificate Number", placeholder: "Enter Certificate Number", type: 'text', value: vehicleTable.certificateNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Certificate Number is required.."
                        },
                    ],
                    functions: {
                        //onChange: 'GetVehicleDetails',
                    }
                },
                {
                    name: 'vehicleInsurenceNo', label: "Insurance Number", placeholder: "Enter Insurance Number", type: 'text', value: vehicleTable.vehicleInsurenceNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Insurance Number is required.."
                        },
                    ],
                    functions: {
                        //onChange: 'GetVehicleDetails',
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
                        //onChange: 'GetVehicleDetails',
                    }
                },
                {
                    name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: vehicleTable.isActive, generatecontrol: true, disable: false,
                    Validations: []
                }
                // ,
                // {
                //     name: 'blackListed', label: 'IsBlackListed', placeholder: '', type: 'toggle', value: VehicleTable.blackListed, generatecontrol: true, disable: false,
                //     Validations: []
                // }
            ],

            this.otherDetailsControls = [
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
                    name: 'capacity', label: 'Capacity(In Tons)', placeholder: 'Enter Payload Capacity', type: 'number', value: vehicleTable.capacity, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            // name: "required",
                            // message: "Capacity is required"
                        }
                    ],
                }
            ],
            this.innerDimensionControls = [
                {
                    name: 'innerLength', label: 'Length(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerLength == 0 ? 1 : vehicleTable.innerLength, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Length(Max 100)",
                            pattern: '^([1-9][0-9]?|100)$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'innerHeight', label: 'Height(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerHeight == 0 ? 1 : vehicleTable.innerHeight, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'innerWidth', label: 'Width(Feet)', placeholder: '', type: 'number', value: vehicleTable.innerWidth == 0 ? 1 : vehicleTable.innerWidth, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Width(Max 25)",
                            pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'cft', label: 'Volume CFT', placeholder: '', type: 'number', value: vehicleTable.cft == 0 ? 1.00 : vehicleTable.cft, generatecontrol: true, disable: true,
                    Validations: [],

                },
            ],
            this.outerDimensionControls = [
                {
                    name: 'outerLength', label: 'Length(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerLength == 0 ? 1 : vehicleTable.outerLength, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Length(Max 100)",
                            pattern: '^([1-9][0-9]?|100)$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'outerHeigth', label: 'Height(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerHeigth == 0 ? 1 : vehicleTable.outerHeigth, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'outerWidth', label: 'Width(Feet)', placeholder: '', type: 'number', value: vehicleTable.outerWidth == 0 ? 1 : vehicleTable.outerWidth, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Width(Max 25)",
                            pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                        }
                    ],
                    functions: {
                        onChange: 'getData',
                    }
                },
                {
                    name: 'outerCft', label: 'Volume CFT', placeholder: '', type: 'number', value: vehicleTable.outerCft == 0 ? 1.00 : vehicleTable.outerCft, generatecontrol: true, disable: true,
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
    getFormControlsP() {
        return this.otherDetailsControls;
    }
    getInnerDimensionControl() {
        return this.innerDimensionControls;
    }
    getOuterDimensionControl() {
        return this.outerDimensionControls;
    }
}

