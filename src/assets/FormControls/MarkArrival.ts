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
                disable: false
            },

            {
                name: 'ETA',
                label: 'ETA',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
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
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },

            {
                name: "Sealno",
                label: "Enter Seal No",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },

            {
                name: 'SealStatus',
                label: 'Seal Status',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
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
                generatecontrol: true,
                disable: false
            },
            {
                name: 'LateReason',
                label: 'Late Reason',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
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
                generatecontrol: true,
                disable: false
            },
        ];
    }
    getMarkArrivalsertFormControls() {
        return this.MarkArrivalsertControlArray;
    }

}