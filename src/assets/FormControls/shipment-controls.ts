import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ShipmentEditControls {
    private  shipmentEditControlArray: FormControls[];
    constructor() {
        this.shipmentEditControlArray = [
            {
                name: 'actualWeight',
                label: 'Weight',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Weight is Required"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'noofPkts',
                label: 'Package',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "required",
                        message: "Package  is Required"
                    }
                ],
                additionalData: {
                },
                functions: {
                    onChange: '',
                },
                generatecontrol: true,
                disable: false
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
    getShipmentFormControls() {
        return this.shipmentEditControlArray;
    }

}