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
    maxlength?: number;
    Validations: any[];

    additionalData?: any;
    functions?: any;
    accessallowed?: boolean = true;
    visible?: boolean = true;

    constructor(FormControlcc) {
        {
            this.generatecontrol = FormControlcc.generatecontrol || false;
            this.disable = FormControlcc.disable || false;
            this.visible = FormControlcc.visible || true;
        }
    }
}
