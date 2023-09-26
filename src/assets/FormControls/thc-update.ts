import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ThcUpdateControls {
    private  thcUpdateControlArray: FormControls[];
    constructor() {
        this.thcUpdateControlArray = [
            {
                name: "tripId",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                ],
                functions: {
                    // onChange: 'GetVehicleDetails',
                },
                generatecontrol: true,
                disable: true
            },
            {
                name: 'route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'arrivalTime',
                label: 'Arrival Time',
                placeholder: '',
                type: 'time',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'Upload',
                label: 'POD Upload',
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
                name: 'remarks',
                label: 'Remarks',
                placeholder: '',
                type: 'textarea',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'status',
                label: 'status',
                placeholder: '',
                type: '',
                value: '2',
                Validations: [],
                generatecontrol: true, disable: false
            }
        ];
    }
    getThcFormControls() {
        return this.thcUpdateControlArray;
    }

}