import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RouteLocationControl {
    routeLocationControlArray: FormControls[];
    RouteDetailControlArray: FormControls[];
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
                value: routeLocationData?.routeKm,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'departureTime',
                label: 'Departure time from starting Location',
                placeholder: '',
                type: 'datetimerpicker',
                value: new Date(),
                Validations: [],
                generatecontrol: true, disable: false,
                additionalData: {
                    minDate: new Date(),
                  },
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
                        name: "invalidAutocompleteObject",
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
                disable: false
            },
            {
                name: 'scheduleType',
                label: 'Schedule Type',
                placeholder: 'Search Schedule Type',
                type: 'Staticdropdown',
                value: [
                    { value: 'Daily', name: 'Daily' },
                    { value: '2 Days', name: '2 Days' },
                    { value: '3 Days', name: '3 Days' },
                    { value: '4 Days', name: '4 Days' },
                    { value: '5 Days', name: '5 Days' },
                    { value: '6 Days', name: '6 Days' },
                    { value: 'Alternate', name: 'Alternate' }
                ],
                Validations: [
                ],
                generatecontrol: true,
                disable: false,
                additionalData: {
                    showNameAndValue: false
                },
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: routeLocationData?.isActive,
                Validations: [],
                generatecontrol: false, disable: false
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
            },
            {
                name: "entryBy",
                label: "Entry By",
                placeholder: "Entry By",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "companyCode",
                label: "Company Code",
                placeholder: "Company Code",
                type: "text",
                value: parseInt(localStorage.getItem("companyCode")),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
        ]

        this.RouteDetailControlArray = [
            // {
            //     name: "loccd",
            //     label: "Branch Name",
            //     placeholder: "Branch Name",
            //     type: "text",
            //     value: routeLocationData?.loccd,
            //     generatecontrol: true,
            //     disable: false,
            //     Validations: [],

            // },
            {
                name: 'loccd', label: "Branch Name", placeholder: "Branch Name", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Branch Name is required.."
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                functions: {
                   // onModel: 'getLocation'

                },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: "distKm",
                label: "Distance (In Km)",
                placeholder: "",
                type: "text",
                value: routeLocationData?.distKm,
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Distance is required.."
                    }
                ],
                functions: {
                    'onChange': "calRouteKm" // Function to be called on change event
                },

            },
            {
                name: "trtimeHr",
                label: "Transit (Hours)",
                placeholder: "",
                type: "text",
                value: routeLocationData?.trtimeHr,
                generatecontrol: true,
                disable: false,
                Validations: [ {
                    name: "required",
                    message: "Transit is required.."
                }],

            },
            {
                name: "sttimeHr",
                label: "Stoppage (Hours)",
                placeholder: "",
                type: "text",
                value: routeLocationData?.sttimeHr,
                generatecontrol: true,
                disable: false,
                Validations: [ {
                    name: "required",
                    message: "Stoppage is required.."
                }],

            },
            {
                name: "speedLightVeh",
                label: "Speed-Light Veh.",
                placeholder: "",
                type: "text",
                value: routeLocationData?.speedLightVeh,
                generatecontrol: true,
                disable: false,
                Validations: [],

            },
            {
                name: "speedHeavyVeh",
                label: "Speed-Heavy Veh.",
                placeholder: "",
                type: "text",
                value: routeLocationData?.speedHeavyVeh,
                generatecontrol: true,
                disable: false,
                Validations: [],

            },
            {
                name: "nightDrivingRestricted",
                label: "Night Driving Restricted",
                placeholder: "",
                type: "text",
                value: routeLocationData?.nightDrivingRestricted,
                generatecontrol: true,
                disable: false,
                Validations: [],

            },
            {
                name: "restrictedHoursFrom",
                label: "Restricted Hrs (From)",
                placeholder: "",
                type: "text",
                value: routeLocationData?.restrictedHoursFrom,
                generatecontrol: true,
                disable: false,
                Validations: [],

            },
            {
                name: "restrictedHoursTo",
                label: "Restricted Hrs (To)",
                placeholder: "",
                type: "text",
                value: routeLocationData?.restrictedHoursTo,
                generatecontrol: true,
                disable: false,
                Validations: [],

            },

        ];
    }
    getFormControls() {
        return this.routeLocationControlArray;
    }
    getFormControlsR() {
        return this.RouteDetailControlArray;
    }

}