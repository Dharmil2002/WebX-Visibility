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
                name: "documentType",
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
                name: 'jobNo', label: "Job No/CN No", placeholder: "", type: 'text', value:"",
                generatecontrol: true, disable: true,
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
                type: "text",
                value:'',
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
            {
                name: '_id',
                label: 'id',
                placeholder: 'id',
                type: '',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            },
              {
                name: 'entryBy',
                label: 'entryBy',
                placeholder: 'entryBy',
                type: '',
                value: localStorage.getItem("Username"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'entryDate',
                label: 'entryDate',
                placeholder: 'entryDate',
                type: '',
                value: new Date().toUTCString(),
                Validations: [],
                generatecontrol: false, disable: false
            },

        ];
    }
    getChaEntryFormControls() {
        return this.chaEntryControlArray;
    }
}
