import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ShipmentEditControls {
    private  shipmentEdit: FormControls[];
    constructor() {
        this.shipmentEdit = [
            {
                name: 'actualWeight',
                label: 'Weight',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Weight is required"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'pkgs',
                label: 'Packages',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [ {
                    name: "required",
                    message: "Packages is required"
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
        ];
    }
    getshipmentFormControls() {
        return this.shipmentEdit;
    }

}