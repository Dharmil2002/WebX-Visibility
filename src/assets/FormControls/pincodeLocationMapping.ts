import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class PincodeLocationControl {
    PinLocControlArray: FormControls[];
    constructor(isUpdate: boolean) {
        this.PinLocControlArray = [
            {
                name: 'area',
                label: 'Destination Location',
                placeholder: 'Search Destination Location',
                type: 'dropdown',
                value: '',
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
                    showNameAndValue: true
                },
                functions: {
                    onOptionSelect: 'getData',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'pincode',
                label: 'Pincode',
                placeholder: 'Search Location PinCode',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "minlength",
                        message: "Pin code should be of 6 digit number",
                        minLength: '6',
                    },
                    {
                        name: "maxlength",
                        message: "Pin code should be of 6 digit number",
                        maxLength: '6',
                    }],
                functions:{
                    onOptionSelect: 'getData',
                },
                generatecontrol: true,
                disable: isUpdate ? true : false,
                additionalData: {
                    showNameAndValue: false
                },
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
            },{
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
    getPinLocFormControls() {
        return this.PinLocControlArray;
    }
}