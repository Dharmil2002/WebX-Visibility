import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class MenuAccessControl {
    private MenuAccess: FormControls[];
    constructor() {
    this.MenuAccess = [
        {
            name: 'Mode',
            label: 'Mode',
            placeholder: 'Mode',
            type: 'Staticdropdown',
            value: [
                {name:"LTL",value:"LTL"},
                {name:"FTL",value:"FTL"},
                {name:"Import",value:"Import"},
                {name:"Export",value:"Export"},
                {name:"EXIM",value:"EXIM"}
            ],
            Validations: [
                {
                    name: "required"
                }
            ],
            generatecontrol: true, disable: false
        },
    ]
    }
    getControls() {
        return this.MenuAccess;
    }
}