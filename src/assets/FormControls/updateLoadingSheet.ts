import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class UpdateloadingControl {
    private updateloadingSheetControlArray: FormControls[];
    constructor() {
        this.updateloadingSheetControlArray = [
            {
                name: 'vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            }, {
                name: 'Route',
                label: 'Route',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "tripID",
                label: "Trip ID",
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
                name: "LoadingSheet",
                label: "Loading Sheet",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'Leg',
                label: 'Leg',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: false
            },
        ];
    }
    getupdatelsFormControls() {
        return this.updateloadingSheetControlArray;
    }

}