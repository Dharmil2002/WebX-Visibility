import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { VehicleTypeMaster } from "src/app/core/models/Masters/vehicle-type-master/vehicle-type-master";

export class VehicleTypeControl {
    private vehicleTypeControlArray: FormControls[];
    private capacityInfoArray: FormControls[];
    constructor(vehicleTypeTable: VehicleTypeMaster, isUpdate: boolean) {
        this.vehicleTypeControlArray = [
            {
                name: 'vehicleTypeCode',
                label: 'Vehicle Type Code',
                placeholder: 'Vehicle Type Code',
                type: 'text',
                value: isUpdate ? vehicleTypeTable.vehicleTypeCode : "System Generated",
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'vehicleTypeName',
                label: 'Vehicle Type Name',
                placeholder: 'Enter Vehicle Type Name',
                type: 'text',
                value: isUpdate ? vehicleTypeTable.vehicleTypeName : "",
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Type name is required"
                    }
                ],
                functions: {
                    onChange: 'checkVehicleTypeExist',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'vehicleManufacturerName',
                label: 'Vehicle Manufacturer Name',
                placeholder: 'Enter Vehicle Manufacturer Name',
                type: 'text', value: isUpdate ? vehicleTypeTable.vehicleManufacturerName : "",
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Manufacturer Name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter Proper value(1-25 character)",
                        pattern: '.{1,25}'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'modelNo',
                label: 'Model No.',
                placeholder: 'Enter Model No.',
                type: 'text', value: isUpdate ? vehicleTypeTable.modelNo : "",
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
                name: 'vehicleTypeCategory',
                label: 'Truck/Trailer',
                placeholder: 'Search And Select Vehicle Type Category',
                type: 'dropdown', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'tyreRotationatKm',
                label: 'Tyre Rotation at Km',
                placeholder: 'Enter KM',
                type: 'number',
                value: isUpdate ? vehicleTypeTable.tyreRotationatKm : "",
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter Proper Average Speed(1-200)",
                        pattern: '^(?:[1-9]|[1-9][0-9]|1[0-9]{2}|200)$'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'typeDescription',
                label: 'Type Description',
                placeholder: 'Enter Type Description',
                type: 'text', value: isUpdate ? vehicleTypeTable.typeDescription : "",
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter Proper Type Description(1-25 Character)",
                        pattern: '.{1,25}'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: "vehicleSize",
                label: "Vehicle Size",
                placeholder: 'Search And Select Vehicle Size',
                type: "Staticdropdown",
                value: [
                    { value: 'HeavyVehicle', name: 'Heavy Vehicle' },
                    { value: 'LightVehicle', name: 'Light Vehicle' }
                ],
                Validations: [],
                additionalData: {
                    showNameAndValue: true
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'tankCapacity',
                label: 'Tank Capacity(Liters)',
                placeholder: 'Enter Tank Capacity in Liters',
                type: 'number',
                value: isUpdate ? vehicleTypeTable.tankCapacity : "",
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
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: isUpdate ? vehicleTypeTable.isActive : "",
                Validations: [],
                generatecontrol: true, disable: false
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
            {
                name: 'updateBy',
                label: 'Update By',
                placeholder: 'Update By',
                type: 'text',
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'companyCode',
                label: 'Company Code',
                placeholder: 'Company Code',
                type: 'text',
                value: localStorage.getItem("companyCode"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'isUpdate', label: 'isUpdate', placeholder: 'isUpdate', type: 'text', value: false, Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: vehicleTypeTable._id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false

            }
        ],
            this.capacityInfoArray = [
                {
                    name: 'grossVehicleWeight',
                    label: 'Gross Vehicle Weight(Tons)',
                    placeholder: 'Enter Gross Vehicle Weight in Tons',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.grossVehicleWeight : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                            pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                        }
                    ],
                    functions: {
                        onChange: 'calCapacity',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'unladenWeight',
                    label: 'Unladen Weight(Tons)',
                    placeholder: 'Enter Unladen Weight in Tons',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.unladenWeight : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                            pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                        }
                    ],
                    functions: {
                        onChange: 'calCapacity',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'capacity',
                    label: 'Weight Capacity(Tons)',
                    placeholder: 'Enter Capacity in Tons',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.capacity : "",
                    Validations: [],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'length',
                    label: 'Length(Ft)',
                    placeholder: 'Enter Length',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.length : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Length(Max 100)",
                            pattern: '^([1-9][0-9]?|100)$'
                        }
                    ],
                    functions: {
                        onClick: 'getData',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'width',
                    label: 'Width(Ft)',
                    placeholder: 'Enter Width',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.width : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Width(Max 50)",
                            pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                        }
                    ],
                    functions: {
                        onClick: 'getData',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'height',
                    label: 'Height(Ft)',
                    placeholder: 'Enter Height',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.height : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Height(Max 25)",
                            pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                        }
                    ],
                    functions: {
                        onClick: 'getData',
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'capacityDiscount',
                    label: 'Total Volume (CFT)',
                    placeholder: 'Enter Total Volume',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.capacityDiscount : "",
                    Validations: [],
                    generatecontrol: true, disable: true
                },
                {
                    name: 'ratePerKM',
                    label: 'Rate per KM(Rs)',
                    placeholder: 'Enter Rate per KM',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.ratePerKM : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Packages(1-100000)",
                            pattern: '[0-9]{1,5}'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'fuelType',
                    label: 'Fuel Type',
                    placeholder: 'Enter Fuel Type',
                    type: 'text',
                    value: isUpdate ? vehicleTypeTable.fuelType : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Fuel Type(1-25 Character)",
                            pattern: '.{1,25}'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'tyreRotationAlertKMs',
                    label: 'Tyre Rotation Alert KMs',
                    placeholder: 'Enter KM',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.tyreRotationAlertKMs : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Tyre Rotation Alert KMs(1-200)",
                            pattern: '^(?:[1-9]|[1-9][0-9]|1[0-9]{2}|200)$'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'noOfPackages',
                    label: 'No. Of Packages',
                    placeholder: 'Enter No. Of Packages',
                    type: 'number',
                    value: isUpdate ? vehicleTypeTable.noOfPackages : "",
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter Proper Packages(1-6 Digit)",
                            pattern: '[0-9]{1,6}'
                        }
                    ],
                    generatecontrol: true, disable: false
                },
                {
                    name: 'isUpdate', label: 'isUpdate', placeholder: 'isUpdate', type: 'text', value: false, Validations: [],
                    generatecontrol: false, disable: false
                }
            ]
    }
    getVehicleTypeFormControls() {
        return this.vehicleTypeControlArray;
    }
    getCapacityInfoFormControl() {
        return this.capacityInfoArray;
    }
}
