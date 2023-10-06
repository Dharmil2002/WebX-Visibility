import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ThcUpdateControls {
    private  thcUpdateControlArray: FormControls[];
    constructor() {
        this.thcUpdateControlArray = [
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
                name: 'podUpload',
                label: 'POD Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [],
                additionalData: {
                    multiple: true
                },
                functions: {
                    onChange: 'getFilePod',
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
                name: 'shipment',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            }
        ];
    }
    getThcFormControls() {
        return this.thcUpdateControlArray;
    }

}