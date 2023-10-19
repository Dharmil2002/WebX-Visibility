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
                    { value: "dkt", name: "CNote" },
                    { value: "dmr", name: "Delivery MR", },
                    { value: "ubis", name: "UBI Series", }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Document Type is required"
                    }

                ],
                functions: {
                    onSelection: "getPattern",
                },
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
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Business Type is required"
                    // }
                ]
            },
            {
                name: 'bookCode',
                label: "Book Code",
                placeholder: "Please Enter BookCode",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Book Code is required"
                    }
                ], functions: {
                    onChange: "isBookCodeUnique",
                },
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
                        message: 'Length should be 7 and pattern should be: ZZZ9999',
                        pattern: ''
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
                Validations: [
                    {
                        name: "required",
                        message: "Total Leaf is required"
                    }
                ],
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
                Validations: [{
                    name: "required",
                    message: "Series To is required"
                }]
            },
            {
                name: 'allotTo',
                label: "Allot To",
                placeholder: "search and select",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: true
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Allot To is required"
                    }
                ],
                functions: {
                    onOptionSelect: "getAllMastersData"
                },
            },
            {
                name: 'allocateTo',
                label: "Allocate To",
                placeholder: "search and select",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: true
                },
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Allocate To is required"
                    }
                ]
            },
        ]
    }
    getAddDcrFormControls() {
        return this.addDcrSeriesArray;
    }
}