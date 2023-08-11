import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class TripRouteControl {
    tripRouteControlArray: FormControls[];
    constructor(tripRouteTable, isUpdate: boolean) {
        this.tripRouteControlArray = [
            {
                name: 'tripRouteId',
                label: 'Route Code',
                placeholder: 'Route Code',
                type: 'text',
                value: tripRouteTable?.tripRouteId ? tripRouteTable.tripRouteId : "System Generated",
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'routeDescription',
                label: 'Route Description',
                placeholder: 'Route Description',
                type: 'text',
                value: tripRouteTable?.routeDescription,
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
                ],
                generatecontrol: true, disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onSelection: 'getAllMastersData'
                },
            },
            {
                name: 'distKm',
                label: 'Distance(KM)',
                placeholder: 'Enter Distance(KM)',
                type: 'text',
                value: tripRouteTable?.totalDistance,
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'transitTime',
                label: 'Transit Time',
                placeholder: 'Enter Transit Time',
                type: 'text',
                value: tripRouteTable?.totalTransitTime,
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'controlLoc',
                label: "Controlling Location",
                placeholder: "Select Location",
                type: 'dropdown',
                value: '',
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Controlling Location is required.."
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
                name: 'departTime',
                label: 'Departure time from starting Location (24 Hour Format) ',
                placeholder: '',
                type: 'time',
                value: new Date(),
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Time is required.."
                    },
                ],
            },
            {
                name: 'roundTrip',
                label: 'Round Trip',
                placeholder: '',
                type: 'toggle',
                value: tripRouteTable?.roundTrip,
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: '',
                type: 'toggle',
                value: tripRouteTable?.isActive,
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'id',
                label: '',
                placeholder: '',
                type: 'text',
                value: tripRouteTable?.id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            },

        ]
    }
    getTripRouteFormControls() {
        return this.tripRouteControlArray;
    }
}