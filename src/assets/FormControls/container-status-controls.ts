import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ContainerStatusControls {
    private containerStatus: FormControls[];
    constructor(
    ) {
        this.containerStatus = [
            {
                name: 'cNID', label: "Container No", placeholder: "Search and select Container No", type: 'dropdown',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Container No is required.."
                    },
                ],
                functions:{
                  onModel: 'getContainerNo',
                  onOptionSelect:"filterContainerDetails"
                },
                additionalData: {
                    showNameAndValue: false
                }
            },
            {
                name: 'cNTYPNM', label: "Container Type", placeholder: "Container Type", type: 'text',
                value: '', filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: true,
                Validations: [],
                additionalData: {
                    showNameAndValue: false
                }

            },
            {
                name: 'oRG', label: 'Location', placeholder: '', type: 'text', value: localStorage.getItem("Branch"), generatecontrol: true, disable: true,
                Validations: [],
            },
            {
                name: 'dEST', label: 'destination', placeholder: '', type: 'text', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'sTS', label: 'status', placeholder: '', type: '', value: 1, generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'sTSNM', label: 'status', placeholder: '', type: '', value: "Available", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'cNTYPCD', label: 'cNTYP', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'dKTNO', label: 'dKTNO', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'rAKENO', label: 'rAKENO', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: '_id', label: 'id', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'eNTBY', label: 'Entry By', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'eNTDT', label: 'Entry Date', placeholder: '', type: '', value:new Date(), generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'eNTLOC', label: 'Entry Location', placeholder: '', type: '', value:localStorage.getItem("Branch"), generatecontrol: false, disable: false,
                Validations: []
            },
            {
                name: 'vNTYP', label: 'Vendor Type', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },
            {
                name: 'vNTYPNM', label: 'Vendor Type', placeholder: '', type: '', value: "", generatecontrol: false, disable: false,
                Validations: [],
            },

        ]
    }
    getFormControls() {
        return this.containerStatus;
    }
}
