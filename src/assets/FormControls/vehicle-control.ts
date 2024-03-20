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
                            pattern: '^[A-Z0-9 ]+$'
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
                    name: 'vendorType',
                    label: 'Vendor Type',
                    placeholder: 'Search Vendor Type',
                    type: 'dropdown',
                    value: isUpdate ? vehicleTable.vendorType : "",
                    Validations: [
                        {
                            name: "required",
                            message: "Vendor Type is required"
                        },
                        {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "autocomplete",
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                    functions: {
                        onOptionSelect: "vendorFieldChanged"
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'vendorName', label: "Vendor Name", placeholder: "Search and select Vendor Name", type: 'dropdown',
                    value: vehicleTable.vendorName, filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "required",
                        //     message: "Vendor Name is required.."
                        // },
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
                    type: 'number',
                    value: vehicleTable.lengthinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only positive numbers with up to two decimal places",
                            pattern: '^\\d+(\\.\\d{1,2})?$'
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
                    type: 'number',
                    value: vehicleTable.widthinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only positive numbers with up to two decimal places",
                            pattern: '^\\d+(\\.\\d{1,2})?$'
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
                    type: 'number',
                    value: vehicleTable.heightinFeet,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only positive numbers with up to two decimal places",
                            pattern: '^\\d+(\\.\\d{1,2})?$'
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
                    Validations: [{
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
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
                    Validations: [{
                        name: "pattern",
                        message: "Please Enter only positive numbers with up to two decimal places",
                        pattern: '^\\d+(\\.\\d{1,2})?$'
                    }],
                },
                {
                    name: 'gpsDeviceEnabled', label: 'GPS Device Enabled', placeholder: '', type: 'toggle', value: vehicleTable.gpsDeviceEnabled, generatecontrol: true, disable: false,
                    Validations: [], functions: {
                        onChange: "enableGpsProvider"
                    }
                },
                {
                    name: 'gpsDeviceId', label: 'Device Id', placeholder: '', type: 'text', value: vehicleTable.gpsDeviceId, generatecontrol: true, disable: false,
                    Validations: [
                        // {
                        //     name: "pattern",
                        //     message: "Please Enter Min 1 & Max. 30 Character",
                        //     pattern: '.{1,30}',
                        // }
                    ]
                },
                {
                    name: 'gpsProvider',
                    label: "GPS Provider",
                    placeholder: "Select GPS Provider",
                    type: 'dropdown',
                    value: vehicleTable.gpsProvider,
                    generatecontrol: true,
                    disable: false,
                    Validations: [
                        {
                            name: "autocomplete",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: true
                    },
                },
                {
                    name: 'isActive',
                    label: 'Active Flag',
                    placeholder: '',
                    type: 'toggle',
                    value: vehicleTable.isActive,
                    generatecontrol: false,
                    disable: false,
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
                    name: 'companyCode', label: 'companyCode', placeholder: '', type: 'text', value: localStorage.getItem("companyCode"), generatecontrol: false, disable: false,
                    Validations: []
                },
                {
                    name: 'eNTBY', label: 'Entry By', placeholder: 'Entry By', type: 'text', value: localStorage.getItem("UserName"), Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'vendorCode', label: '', placeholder: '', type: 'text', value: '', Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'vehicleTypeCode', label: '', placeholder: '', type: 'text', value: '', Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'vendorTypeCode', label: '', placeholder: '', type: 'text', value: '', Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'gpsProviderCode', label: '', placeholder: '', type: 'text', value: '', Validations: [],
                    generatecontrol: false, disable: false
                },
            ]
    }
    getFormControlsD() {
        return this.vehicleDetailsControl;
    }
}
