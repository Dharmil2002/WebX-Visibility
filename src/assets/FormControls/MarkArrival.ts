import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class MarkArrivalControl {
    private MarkArrivalsertControlArray: FormControls[];
    constructor() {
        this.MarkArrivalsertControlArray = [
            {
                name: 'Vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle No is required"
                    }
                ],
                functions: {
                    // onChange: 'GetVehicleDetails',
                },
                generatecontrol: true,
                disable: true
            },

            {
                name: 'ETA',
                label: 'ETA',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'Route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "TripID",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'ArrivalTime',
                label: 'Arrival Time',
                placeholder: '',
                type: 'time',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'AssignDock',
                label: 'Assign Dock',
                placeholder: '',
                type: 'number',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Assign Dock is required"
                }],
                generatecontrol: true, disable: false
            },

            {
                name: "Sealno",
                label: "Enter Seal No",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Seal No is required"
                    },
                    {
                        name: "pattern",
                        message: "Please enter a Seal No. consisting of 1 to 7 alphanumeric characters.",
                        pattern: "^[a-zA-Z 0-9]{1,7}$",
                    }
                ],
                generatecontrol: true,
                disable: false,
                functions: {
                    onChange: 'checkSealNumber',
                },
            },

            {
                name: 'SealStatus',
                label: 'Seal Status',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
            {
                name: 'LateReason',
                label: 'Late Reason',
                placeholder: '',
                type: 'dropdown',
                value: '',
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Upload',
                label: 'Image Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [],
                additionalData: {
                    multiple: true
                },
                functions: {
                    onChange: 'GetFileList',
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Reason',
                label: 'Seal Change Reason',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
        ];
    }
    getMarkArrivalsertFormControls() {
        return this.MarkArrivalsertControlArray;
    }

}