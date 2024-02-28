import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class UpdateDeliveryControl {
    private updatedeliveryControlArray: FormControls[];
    constructor() {
        this.updatedeliveryControlArray = [
            {
                name: 'Vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "tripid",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            }
        ];
    }
    getupdatedeliveryFormControls() {
        return this.updatedeliveryControlArray;
    }

}
