import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class vehicleLoadingControl {
    private vehicleLoadingControlArray: FormControls[];
    constructor() {
        this.vehicleLoadingControlArray = [
            {
                name: 'Vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                functions: {
                    // onChange: 'GetVehicleDetails',
                },
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
                generatecontrol: true,
                disable: true
            },
            {
                name: 'TripID',
                label: 'Trip ID',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "LoadingLocation",
                label: "Loading Location",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            }
           
        ];
    }
    getvehiceLoadingFormControls() {
        return this.vehicleLoadingControlArray;
    }

}