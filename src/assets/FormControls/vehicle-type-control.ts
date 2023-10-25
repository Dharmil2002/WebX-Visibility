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
                    },
                    {
                        name: "pattern",
                        message: "Please Enter alphanumeric 3 to 200 digit! Vehicle Type name",
                        pattern: "^[a-zA-Z 0-9 ,-]{3,200}$",
                    },
                ],
                functions: {
                    onChange: 'checkVehicleTypeExist',
                },
                generatecontrol: true, disable: false
            },
            {
                name: "vehicleCategory",
                label: "Vehicle Category",
                placeholder: 'Search And Select Vehicle Category',
                type: "Staticdropdown",
                value: [
                    { value: 'HCV', name: 'HCV' },
                    { value: 'LCV', name: 'LCV' }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Category is required"
                    }

                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'fuelType',
                label: 'Fuel Type',
                placeholder: 'select Fuel Type',
                type: "Staticdropdown",
                value: [
                    { value: 'Diesel', name: 'Diesel' },
                    { value: 'Petrol', name: 'Petrol' },
                    { value: 'CNG', name: 'CNG' },
                    { value: 'EV', name: 'EV' }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Fuel Type name is required"
                    }

                ],
                generatecontrol: true, disable: false
            },
            {
                name: "oem",
                label: "OEM",
                placeholder: 'Search And Select OEM',
                type: "Staticdropdown",
                value: [
                    { value: 'Tata', name: 'Tata' },
                    { value: 'AshokLeyland', name: 'AshokLeyland' },
                    { value: 'Mahindra', name: 'Mahindra' },
                    { value: 'Eicher', name: 'Eicher' }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "OEM is required"
                    }

                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'oemmodel',
                label: 'OEM Model',
                placeholder: 'Enter OEM Model',
                type: 'text',
                value: vehicleTypeTable.oemmodel,
                Validations: [
                    {
                        name: "required",
                        message: "OEM Model is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter alphanumeric 100 digit! OEM Model",
                        pattern: "^[a-zA-Z 0-9 ]{0,100}$",
                    },
                ],

                generatecontrol: true, disable: false
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: vehicleTypeTable.isActive,
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: 'text',
                value: localStorage.getItem("UserName"),
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

            },
            {
                name: 'updatedDate',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
        ],
            this.capacityInfoArray = [
                // {
                //     name: 'grossVehicleWeight',
                //     label: 'Gross Vehicle Weight(Tons)',
                //     placeholder: 'Enter Gross Vehicle Weight in Tons',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.grossVehicleWeight : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                //             pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                //         }
                //     ],
                //     functions: {
                //         onChange: 'calCapacity',
                //     },
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'unladenWeight',
                //     label: 'Unladen Weight(Tons)',
                //     placeholder: 'Enter Unladen Weight in Tons',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.unladenWeight : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please enter a decimal value between 0.10 and 100.00 (up to 2 decimal places)",
                //             pattern: '^(?:0.[1-9][0-9]?|[1-9][0-9]?(?:.[0-9]{1,2})?|100(?:.0{1,2})?)$'
                //         }
                //     ],
                //     functions: {
                //         onChange: 'calCapacity',
                //     },
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'capacity',
                //     label: 'Weight Capacity(Tons)',
                //     placeholder: 'Enter Capacity in Tons',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.capacity : "",
                //     Validations: [],
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'length',
                //     label: 'Length(Ft)',
                //     placeholder: 'Enter Length',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.length : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Length(Max 100)",
                //             pattern: '^([1-9][0-9]?|100)$'
                //         }
                //     ],
                //     functions: {
                //         onClick: 'getData',
                //     },
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'width',
                //     label: 'Width(Ft)',
                //     placeholder: 'Enter Width',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.width : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Width(Max 50)",
                //             pattern: '^(?:[1-9]|[1-4][0-9]|50)$'
                //         }
                //     ],
                //     functions: {
                //         onClick: 'getData',
                //     },
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'height',
                //     label: 'Height(Ft)',
                //     placeholder: 'Enter Height',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.height : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Height(Max 25)",
                //             pattern: '^(?:[1-9]|1[0-9]|2[0-5])$'
                //         }
                //     ],
                //     functions: {
                //         onClick: 'getData',
                //     },
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'capacityDiscount',
                //     label: 'Total Volume (CFT)',
                //     placeholder: 'Enter Total Volume',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.capacityDiscount : "",
                //     Validations: [],
                //     generatecontrol: true, disable: true
                // },
                // {
                //     name: 'ratePerKM',
                //     label: 'Rate per KM(Rs)',
                //     placeholder: 'Enter Rate per KM',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.ratePerKM : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Packages(1-100000)",
                //             pattern: '[0-9]{1,5}'
                //         }
                //     ],
                //     generatecontrol: true, disable: false
                // },

                // {
                //     name: 'tyreRotationAlertKMs',
                //     label: 'Tyre Rotation Alert KMs',
                //     placeholder: 'Enter KM',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.tyreRotationAlertKMs : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Tyre Rotation Alert KMs(1-200)",
                //             pattern: '^(?:[1-9]|[1-9][0-9]|1[0-9]{2}|200)$'
                //         }
                //     ],
                //     generatecontrol: true, disable: false
                // },
                // {
                //     name: 'noOfPackages',
                //     label: 'No. Of Packages',
                //     placeholder: 'Enter No. Of Packages',
                //     type: 'number',
                //     value: isUpdate ? vehicleTypeTable.noOfPackages : "",
                //     Validations: [
                //         {
                //             name: "pattern",
                //             message: "Please Enter Proper Packages(1-6 Digit)",
                //             pattern: '[0-9]{1,6}'
                //         }
                //     ],
                //     generatecontrol: true, disable: false
                // },
                {
                    name: 'isUpdate', label: 'isUpdate', placeholder: 'isUpdate', type: 'text', value: false, Validations: [],
                    generatecontrol: false, disable: false
                }
            ]
    }
    getVehicleTypeFormControls() {
        return this.vehicleTypeControlArray;
    }
}
