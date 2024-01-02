import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { VehicleStatus } from "src/app/core/models/Masters/vehicle-status/vehicle-status";

export class VehicleStatusControls {
    private vehicleStatus: FormControls[];
    constructor(
    ) {
        const currentDate = new Date();
        this.vehicleStatus = [
            {
                name: 'vehNo', label: "Vehicle Number", placeholder: "Search and select Vehicle Number", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                functions: {
                    onOptionSelect: 'ValidationForVehno',
                },
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle Number is required.."
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
                name: 'currentLocation', label: "Location", placeholder: "Location", type: 'text',
                value: localStorage.getItem("Branch"), filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                }

            },
            {
                name: 'status', label: 'status', placeholder: '', type: '', value: "Available", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'tripId', label: 'tripId', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'route', label: 'route', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'updateDate', label: 'updateDate', placeholder: '', type: '', value: new Date(), generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'updateBy', label: 'updateBy', placeholder: '', type: '', value: localStorage.getItem("UserName"), generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: '_id', label: 'id', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'capacity', label: 'capacity', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'dMobNo', label: 'dMobNo', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'driver', label: 'driver', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'vMobNo', label: 'vMobNo', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'vendor', label: 'vendor', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'vendorType', label: 'vendorType', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'FromCity', label: 'FromCity', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'ToCity', label: 'ToCity', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'vendorTypeCode', label: 'vendorTypeCode', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'lcExpireDate', label: 'lcExpireDate', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'lcNo', label: 'lcNo', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'driverPan', label: 'driverPan', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: []
            },

        ]
    }
    getFormControls() {
        return this.vehicleStatus;
    }
}
