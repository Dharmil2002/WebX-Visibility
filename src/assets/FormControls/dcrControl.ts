import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DCRControl {
    dcrControlArray: FormControls[];
    constructor() {
        this.dcrControlArray = [
            {
                name: 'documentType',
                label: 'Document Type',
                placeholder: 'Document Type',
                type: 'dropdown',
                value: "",
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [
                    {
                        name: "required",
                        message: "Document Type is required.."
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }, generatecontrol: true,
                disable: true
            },

            {
                name: 'documentNumber', label: 'Document Number', placeholder: 'Document Number', type: 'text',
                value: "", generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Document Number is required"
                    },
                ]
            },

        ]
    }

    getFormControls() {
        return this.dcrControlArray;
    }
}