import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ChaEntryControl {
    chaEntryControlArray: FormControls[];
    constructor() {
        this.chaEntryControlArray = [
            {
                name: "chaId",
                label: "CHA ID",
                placeholder: "Enter CHA ID",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                Validations: [
                ]
            }, 
            {
                name: " documentType",
                label: " Document Type",
                placeholder: 'Document Type',
                type: "Staticdropdown",
                value: [
                    { value: 'jobNo', name: 'Job No' },
                    { value: 'cnNo', name: 'CN No' }
                ],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'billingParty', label: "Billing Party", placeholder: "Select Billing Party", type: 'dropdown',
                value: "", filterOptions: "", autocomplete: "", displaywith: "", generatecontrol: true, disable: false,
                Validations: [
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }, 
            {
                name: 'selectDocument ', label: "Job No/CN No", placeholder: "", type: 'text', value:"",
                generatecontrol: true, disable: false,
                Validations: [],
                functions: {
                    onChange: 'selectHandleFileSelection',
                }
            },
            {
                name: "jobType",
                label: "Job Type",
                placeholder: 'Job Type',
                type: "Staticdropdown",
                value: [
                    { value: 'I', name: 'Import' },
                    { value: 'E', name: 'Export' }
                ],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: "transportedBy",
                label: "Transported By",
                placeholder: 'Transported By',
                type: "Staticdropdown",
                value: [
                    { value: 'I', name: 'By Party' },
                    { value: 'E', name: 'Own' }
                ],
                Validations: [
                ],
                generatecontrol: true,
                disable: false
            },
            {
                name: 'isUpdate',
                label: 'IsUpdate',
                placeholder: 'IsUpdate',
                type: 'text',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            },

        ];
    }
    getChaEntryFormControls() {
        return this.chaEntryControlArray;
    }
}
