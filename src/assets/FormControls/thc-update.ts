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
                Validations: [
                    {
                        name: "required",
                        message: "Vehicle No is required"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'Upload',
                label: 'POD Upload',
                placeholder: '',
                type: 'file',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "POD  is required"
                    }
                ],
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
                Validations: [
                    {
                        name: "required",
                        message: "Remarks is required"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'Pod',
                label: 'Pod',
                placeholder: '',
                type: 'toggle',
                value:true,
                Validations: [
                    {
                        name: "required",
                        message: "Pod is required"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'receivedBy',
                label: 'Received By',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [ {
                    name: "required",
                    message: "Received By is required"
                }],
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'link',
            //     label: 'pod',
            //     placeholder: '',
            //     type: 'filelink',
            //     value: '',
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'shipment',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: false, disable: false
            },
             {
                name: 'podUpload',
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