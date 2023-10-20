import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";

export class VehicleControls {
    private vehicleDetailsControl: FormControls[];

    constructor(vehicleTable: vehicleModel, isUpdate: boolean
    ) {
        const currentDate = new Date();
        this.vehicleDetailsControl =
            [
                {
                    name: 'vehicleNo', label: "Vehicle Number", placeholder: "Enter Vehicle Number", type: 'government-id', value: vehicleTable.vehicleNo, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: isUpdate ? true : false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vehicle Number is required.."
                        },
                        {
                            name: "pattern",
                            message: "Please enter ",
                            pattern: '^[A-Z][A-Z0-9]+$'
                        }
                    ],
                    functions: {
                        onChange: 'checkVehicleNumberExist',
                    }
                },
                {
                    name: 'vehicleType',
                    label: "Vehicle Type",
                    placeholder: "Select Vehicle Type",
                    type: 'dropdown',
                    value: vehicleTable.vehicleType,
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vehicle Type is required"
                        },
                        {
                            name: "autocomplete",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                },
                {
                    name: 'controllBranch',
                    label: 'Controlling Branch',
                    placeholder: 'Search and select Controlling Branch',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "controllBranchDrop",
                        showNameAndValue: true,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    functions: {
                        onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'division',
                    label: 'Division',
                    placeholder: 'Division',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "DivisionDrop",
                        showNameAndValue: true,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    functions: {
                        onToggleAll: "toggleSelectAll",
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: "vendorType",
                    label: "Vendor Type",
                    placeholder: "VehicleType",
                    type:'Staticdropdown',
                    value: [
                        { value: "Own", name: "Own" },
                        { value: "Attached", name: "Attached" },
                        { value: "Service Provider", name: "Service Provider" }
                      ],
                    filterOptions: "",
                    autocomplete: "",
                    displaywith: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Type  is required",
                        }],
                        functions: {
                            onSelection: "vendorFieldChanged"
                          },
                    additionalData: { }
                },
                {
                    name: 'vendorName', label: "Vendor Name", placeholder: "Search and select Vendor Name", type: 'dropdown',
                    value: vehicleTable.vendorName, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
                    name: 'route', label: "Routes", placeholder: "Search and select route", type: 'dropdown',
                    value: vehicleTable.route, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
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
                    name: 'ftlTypeDesc', label: "FTL Type", placeholder: "Search and select FTL Type", type: 'dropdown',
                    value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: false
                    }
                },
                {
                    name: 'lengthinFeet',
                    label: 'Length in Feet',
                    placeholder: 'Enter Length in Feet',
                    type: 'text',
                    value: vehicleTable.lengthinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'widthinFeet',
                    label: 'Width in Feet',
                    placeholder: 'Enter Width in Feet',
                    type: 'text',
                    value: vehicleTable.widthinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'heightinFeet',
                    label: 'Height in Feet',
                    placeholder: 'Enter Height in Feet',
                    type: 'text',
                    value: vehicleTable.heightinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onChange: 'getDataForInnerOuter',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'cft',
                    label: 'Capacity in CFT',
                    placeholder: '',
                    type: 'number',
                    value: vehicleTable.cft,
                    generatecontrol: true,
                    disable: true,
                    Validations: [],
                },
                {
                    name: 'gvw', label: 'GVW(Ton)', placeholder: 'Enter GVW', type: 'number', value: vehicleTable.gvw, generatecontrol: true, disable: false,
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
                    name: 'unldWt', label: 'Unladen Weight(Ton)', placeholder: 'Enter Outer Unlade', type: 'number', value: vehicleTable.unldWt, generatecontrol: true, disable: false,
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
                    name: 'capacity', label: 'Capacity(In Tons)', placeholder: 'Enter Payload Capacity', type: 'number', value: vehicleTable.capacity, generatecontrol: true, disable: true,
                    Validations: [],
                },
                {
                    name: 'gpsDeviceEnabled', label: 'GPS Device Enabled', placeholder: '', type: 'toggle', value: vehicleTable.gpsDeviceEnabled, generatecontrol: true, disable: false,
                    Validations: [], functions: {
                        onChange: "enableGpsProvider"
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
                    name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: vehicleTable.isActive, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: '_id',
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
                    name: 'controllBranchDrop',
                    label: 'Controlling Branch',
                    placeholder: 'Select Controlling Branch',
                    type: '',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'DivisionDrop',
                    label: 'Division',
                    placeholder: 'Select Division',
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
                    name: 'companyCode', label: 'companyCode', placeholder: '', type: 'text', value: localStorage.getItem("companyCode"), generatecontrol: false, disable: false,
                    Validations: []
                },
            ]
    }
    getFormControlsD() {
        return this.vehicleDetailsControl;
    }
}
