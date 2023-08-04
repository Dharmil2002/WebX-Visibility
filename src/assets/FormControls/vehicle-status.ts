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
                name: 'status', label: 'status', placeholder: '', type: '', value: "available", generatecontrol: false, disable: false,
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
                name: 'entryDate', label: 'entryDate', placeholder: '', type: '', value: currentDate, generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'entryBy', label: 'entryDate', placeholder: '', type: '', value: localStorage.getItem("Username"), generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'id', label: 'id', placeholder: '', type: '', value:"", generatecontrol: false, disable: false,
                Validations: [],
            }

        ]
    }
    getFormControls() {
        return this.vehicleStatus;
    }
}