import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { VehicleTypeMaster } from "src/app/core/models/Masters/vehicle-type-master/vehicle-type-master";

export class VehicleTypeControl {
    private vehicleTypeControlArray: FormControls[];
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
                value: vehicleTypeTable.vehicleTypeName,
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

        ]
    }
    getVehicleTypeFormControls() {
        return this.vehicleTypeControlArray;
    }
}