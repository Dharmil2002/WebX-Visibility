import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddDcrSeriesControl {
    addDcrSeriesArray: FormControls[];
    constructor() {
        this.addDcrSeriesArray = [
            {
                name: "documentType",
                label: "Document Type",
                placeholder: 'Search And Select Document Type',
                type: "Staticdropdown",
                value: [
                    { value: "1", name: "CNote" },
                    { value: "2", name: "Delivery MR", },
                    { value: "3", name: "UBI Series", }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Document Type is required"
                    }

                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'businessType',
                label: "Business Type",
                placeholder: "search and select",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'bookCode',
                label: "Book Code",
                placeholder: "Please Enter BookCode",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'seriesFrom',
                label: "Series From",
                placeholder: "Please Enter Series From",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Series From is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter alphanumeric Series From of length 12",
                        pattern: '^[a-zA-Z0-9]{12,30}$',
                    }
                ],

            },
            {
                name: 'totalLeaf',
                label: "Total Leaf",
                placeholder: "Please Enter Total Leaf",
                type: 'number',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {
                    onChange: "getSeriesTo",
                },

            },
            {
                name: 'seriesTo',
                label: "Series To",
                placeholder: "Please Enter Series To",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: true,
                Validations: []
            },
            {
                name: 'allotTo',
                label: "Allot To",
                placeholder: "search and select",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'updateDate',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "updateBy",
                label: "",
                placeholder: "",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: 'EntryDate',
                label: ' ',
                placeholder: ' ',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "EntryBy",
                label: "",
                placeholder: "",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
        ]
    }
    getAddDcrFormControls() {
        return this.addDcrSeriesArray;
    }
}