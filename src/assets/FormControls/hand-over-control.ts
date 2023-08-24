import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class HandoverControl {
    handOverArray: FormControls[];
    constructor() {
        this.handOverArray = [
           {
                name: "dateTime",
                label: "Job Date",
                placeholder: "select Job Date",
                type: "date",
                value: new Date(),
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date(),
                },
            },
            {
                name: "linerName",
                label: "Location Code",
                placeholder: "Location Code ",
                type: "text",
                value:localStorage.getItem("Branch"),
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
