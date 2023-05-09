export class FormControls {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    value: any;
    filterOptions?: any;
    autocomplete?: string;
    displaywith?: any;
    generatecontrol: boolean
    disable: boolean
    mask?: string;
    suffix?: string;
    Validations: any[];

    additionalData ?: any;
    functions ?: any

    constructor(FormControlcc) {
        {
            this.generatecontrol = FormControlcc.generatecontrol || false;
            this.disable = FormControlcc.disable || false;
        }
    }
}
