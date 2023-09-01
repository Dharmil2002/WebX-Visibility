import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CityLocationMappingControl {
    CityLocationArray: FormControls[];
    constructor(isUpdate: boolean) {
        this.CityLocationArray = [
            {
                name: 'mappingMode',
                label: '',
                placeholder: '',
                type: 'radiobutton',
                value: [{ value: "L", name: "Location - City", checked: true },
                { value: "C", name: "City - Location" }],
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    },
                    {
                        name: "required",
                        message: "State is required"
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onChange: "display"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'city',
                label: 'Search City',
                placeholder: 'Search City',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "City is required.."
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }],
                functions: {
                    onOptionSelect: 'getCityAndLocationDetails',
                },
                generatecontrol: false,
                disable: false,
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'location',
                label: 'Search Location',
                placeholder: 'Search Location',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Location is required.."
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }],
                functions: {
                    onOptionSelect: 'getLocationAndCityDetails',
                },
                generatecontrol: true,
                disable: false,
                additionalData: {
                    showNameAndValue: true
                }
            },
            {
                name: 'isActive', label: 'Active Flag', placeholder: '', type: 'toggle', value: '', generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: 'text',
                value: localStorage.getItem('Username'),
                Validations: [],
                generatecontrol: false, disable: true
            },
            {
                name: 'entryDate',
                label: 'Entry Date',
                placeholder: 'Select Entry Date',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            }, {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: '',
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: true
            },
        ]
    }

    getCityLocationFormControls() {
        return this.CityLocationArray;
    }
}
