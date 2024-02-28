import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class UpdateloadingRunControl {
    private updaterunsheetControlArray: FormControls[];
    constructor() {
        this.updaterunsheetControlArray = [
            {
                name: 'Vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }, {
                name: 'Cluster',
                label: 'Cluster',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "Runsheet",
                label: "Run sheet ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'LoadingLocation',
                label: 'Loading Location',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: "Startkm",
                label: "Start Km",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [{
                    name: "required",
                    message: "Start Km is required"
                }],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Departuretime',
                label: 'Departure Time',
                placeholder: '',
                type: 'time',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Departure Time is required"
                }],
                generatecontrol: true,
                disable: false
            },
        ];
    }
    getupdaterunsheetFormControls() {
        return this.updaterunsheetControlArray;
    }

}
