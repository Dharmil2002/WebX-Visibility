import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class HandoverControl {
    handOverArray: FormControls[];
    constructor() {
        this.handOverArray = [
           {
                name: "rktUptDt",
                label: "Rake Update Date",
                placeholder: "Rake Update Date",
                type: "date",
                value: new Date(),
                generatecontrol: true,
                disable: true,
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                },
            },
            {
                name: "locationCode",
                label: "Location Code",
                placeholder: "Location Code ",
                type: "text",
                value:"",
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: "location",
                label: "Location",
                placeholder: "Location",
                type: "text",
                value:"",
                generatecontrol: true,
                disable: true,
                Validations: []
            }

        ];
    }

    getHandOverArrayControls() {
        return this.handOverArray;
    }
}
