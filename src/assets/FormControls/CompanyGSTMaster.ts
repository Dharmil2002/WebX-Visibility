import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CompanyGSTControl {
    private CompanyGSTControlArray: FormControls[];
    constructor() {
        this.CompanyGSTControlArray = [
            {
                name: 'CompanyName',
                label: 'Company Name',
                placeholder: '',
                type: 'text',
                value: '',
                Validations: [],
                generatecontrol: true,
                disable: true
            },
        ];
    }
    getCompanyGSTFormControls() {
        return this.CompanyGSTControlArray;
    }

}