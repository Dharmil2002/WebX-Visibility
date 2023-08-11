import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class RouteScheduleControl {
    routeScheduleControlArray: FormControls[];
    constructor(routeScheduleTable, isUpdate: boolean) {
        this.routeScheduleControlArray = [
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
                generatecontrol: true, disable: isUpdate ? true : false,
                Validations: [
                    {
                        name: "required",
                        message: "Route Mode is required.."
                    },
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onSelection: 'getAllMastersData'
                },
            },
            {
                name: 'routeName',
                label: 'Route Name',
                placeholder: 'Search Route Name',
                type: 'dropdown',
                value: routeScheduleTable?.routeName ? routeScheduleTable.routeName : "",
                Validations: [
                    {
                        name: "required",
                        message: "Route is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'setScheduleType',
                },
                generatecontrol: true, disable: isUpdate ? true : false
            },

            {
                name: 'applyFrom', label: 'Apply From', placeholder: '', type: 'date', value: new Date("01 Jan 2022"), generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Date is required.."
                    },
                ],
                additionalData: {
                    maxDate: new Date(),
                    minDate: new Date("01 Jan 2022"),
                }
            },
            {
                name: 'scheduleType',
                label: 'Schedule Type',
                placeholder: 'Search Schedule Type',
                type: 'text',
                value: "",
                Validations: [],
                generatecontrol: true,
                disable: true,
                additionalData: {
                    showNameAndValue: false
                },
            },
            {
                name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: routeScheduleTable?.isActive, generatecontrol: true, disable: false,
                Validations: []
            },
            {
                name: 'id',
                label: '',
                placeholder: '',
                type: 'text',
                value: routeScheduleTable?.id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            },

        ]
    }
    getRouteScheduleFormControls() {
        return this.routeScheduleControlArray;
    }
}