import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RouteLocationControl {
    routeLocationControlArray: FormControls[];
    constructor(routeLocationData) {
        this.routeLocationControlArray = [
            {
                name: 'routeId',
                label: 'Route Code',
                placeholder: 'Route Code',
                type: 'text',
                value: routeLocationData?.routeId ? routeLocationData.routeId : "System Generated",
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'routeMode',
                label: "Route Mode",
                placeholder: "Select Mode",
                type: 'Staticdropdown',
                value: [
                    { value: 'AIR', name: 'AIR' },
                    { value: 'RAIL', name: 'RAIL' },
                    { value: 'ROAD', name: 'ROAD' },
                    { value: 'SEA/RIVER', name: 'SEA/RIVER' }
                ],
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Route Mode is required.."
                    },
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'routeCat',
                label: "Route Category",
                placeholder: "Select Category",
                type: 'Staticdropdown',
                value: [
                    { value: 'LONG HAUL', name: 'LONG HAUL' },
                    { value: 'SHORT HAUL', name: 'SHORT HAUL' },
                ],
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Route Category is required.."
                    },
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'routeKm',
                label: 'Route KM',
                placeholder: 'Route KM',
                type: 'text',
                value: routeLocationData?.routeKm ? routeLocationData.routeKm : "",
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'departureTime',
                label: 'Departure time from starting Location',
                placeholder: '',
                type: 'time',
                value: new Date(2023, 6, 18, 13, 14),
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'controlLoc', label: "Controlling Location", placeholder: "Select Location", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Controlling Location is required.."
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
                name: 'routeType',
                label: 'Route Type',
                placeholder: 'Route Type',
                type: 'Staticdropdown',
                value: [
                    { value: 'Loop', name: 'Loop' },
                    { value: 'One Way', name: 'One Way' },
                    { value: 'Return', name: 'Return' }
                ],
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [
                ],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: routeLocationData?.isActive,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'id',
                label: '',
                placeholder: '',
                type: 'text',
                value: routeLocationData?.id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false

            }
        ]
    }
    getFormControls() {
        return this.routeLocationControlArray;
    }

}