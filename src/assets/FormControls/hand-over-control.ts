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
                disable: false,
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
                name: "containerFor",
                label: "Container For",
                placeholder: "Location",
                type: "Staticdropdown",
                value:[
                {name:"Diverted for Export",value:"DE"},
                {name:"Empty Container Return to Origin",value:"EC"},
                {name:"Handover to Liner",value:"HL"}
                ],
                functions: {
                    onSelection: "getContainerData",
                },
                generatecontrol: true,
                disable: false,
                Validations: [{
                        name: "required",
                        message: "Container For is required",
                }]
            }

        ];
    }

    getHandOverArrayControls() {
        return this.handOverArray;
    }
}
