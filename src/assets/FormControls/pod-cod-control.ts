import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class PodCodControl {
    podCodControlArray: FormControls[];
    constructor() {
        this.podCodControlArray = [
            {
                name: 'type', label: 'Type', placeholder: 'Type', type: 'radiobutton',
                value: [{ value: 'P', name: 'POD' }, { value: 'C', name: 'COD' }],
                Validations: [],
                functions: {
                    onChange: "display"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'podStatus',
                label: 'POD Status',
                placeholder: 'POD Status',
                type: 'Staticdropdown',
                value: [
                    { value: 'A', name: 'Audit POD' },
                    { value: 'F', name: 'Forward POD' },
                    { value: 'AK', name: 'Acknowledge POD' },
                    { value: 'U', name: 'Upload POD' }
                ],
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [
                ],
                generatecontrol: true,
                disable: true
            },
        ]
    }
    getFormControls() {
        return this.podCodControlArray;
    }

}