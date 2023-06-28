import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ManifestGeneratedControl {
    private ManifestGeneratedControlArray: FormControls[];
    constructor() {
        this.ManifestGeneratedControlArray = [
            {
                name: 'Vehicle',
                label: 'Vehicle',
                placeholder: '',
                type: 'text',
                value:'',
                Validations: [],
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
                generatecontrol: true, disable: true
            },
            {
                name: "TripId",
                label: "Trip ID",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true, disable: true
            },

            {
                name: 'LoadingLoc',
                label: 'Loading Loacation',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },

            {
                name: "LoadingSheet",
                label: "Loading Sheet",
                placeholder: '',
                type: "text",
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },

            {
                name: 'Leg',
                label: 'Leg',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
        ];
    }
    getManifestGeneratedFormControls() {
        return this.ManifestGeneratedControlArray;
    }

}