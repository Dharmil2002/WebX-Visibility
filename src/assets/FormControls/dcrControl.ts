import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DCRControl {
    dcrControlArray: FormControls[];
    dcrDetailControlArray: FormControls[];
    dcrReallocateControlArray: FormControls[];
    dcrSplitControlArray: FormControls[];
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
                Validations: []
            },

        ],
            this.dcrDetailControlArray = [
                {
                    name: 'documentType',
                    label: 'Document Type',
                    placeholder: 'Document Type',
                    type: 'dropdown',
                    value: "",
                    Validations: [],
                    additionalData: {
                        showNameAndValue: false
                    },
                    generatecontrol: true,
                    disable: true
                },
                {
                    name: 'queryNumber',
                    label: 'Query Number',
                    placeholder: 'Query Number',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'bookNumber',
                    label: 'Book Number',
                    placeholder: 'Book Number',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'seriesStartEnd',
                    label: 'Series Start-End',
                    placeholder: 'Series Start-End',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'totalLeaves',
                    label: 'Total Leaves',
                    placeholder: 'Total Leaves',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'usedLeaves',
                    label: 'Used Leaves',
                    placeholder: 'Used Leaves',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'location',
                    label: 'Allocated to Location',
                    placeholder: 'Allocated to Location',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'person',
                    label: 'Allocated to Person',
                    placeholder: 'Allocated to Person',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'personCat',
                    label: 'Allocated to Person Category',
                    placeholder: 'Allocated to Person Category',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'locationHierarchy',
                    label: 'Hierarchy of that Location',
                    placeholder: 'Hierarchy of that Location',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'status',
                    label: 'Status',
                    placeholder: 'Status',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'action',
                    label: 'Select Action',
                    placeholder: 'Select Action',
                    type: 'Staticdropdown',
                    value: [
                        { value: 'S', name: 'Split' },
                        { value: 'R', name: 'ReAllocate' }
                    ],
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                    generatecontrol: false,
                    disable: true
                },

            ],
            this.dcrReallocateControlArray = [
                {
                    name: 'newLocation',
                    label: 'New Allocation Location',
                    placeholder: 'New Allocation Location',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Location is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: true
                },
                {
                    name: 'newCategory',
                    label: 'New Allocation Category',
                    placeholder: 'New Allocation Category',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Category is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: true
                },
                {
                    name: 'newPerson',
                    label: 'Person to be Assigned Series',
                    placeholder: 'Person to be Assigned Series',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Person to be Assigned is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: true
                },

            ],
            this.dcrSplitControlArray = [
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
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Document Type is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: true
                },
                {
                    name: 'bookCode',
                    label: 'Book Code',
                    placeholder: 'Book Code',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: [{
                        name: "required",
                        message: "Book Code is required"
                    },]
                },
                {
                    name: 'seriesFrom',
                    label: 'Series From',
                    placeholder: 'Series From',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: [{
                        name: "required",
                        message: "Series From is required"
                    },]
                },
                {
                    name: 'seriesTo',
                    label: 'Series To',
                    placeholder: 'Series To',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: false,
                    Validations: [{
                        name: "required",
                        message: "Series To is required"
                    },],
                    functions: {
                        onChange: 'getSeriesValidation',
                    }
                },
                {
                    name: 'totalLeaf',
                    label: 'Total BC Leaf',
                    placeholder: 'Total BC Leaf',
                    type: 'text',
                    value: "",
                    generatecontrol: true,
                    disable: true,
                    Validations: []
                },
                {
                    name: 'newLocation',
                    label: 'New Allocation Location',
                    placeholder: 'New Allocation Location',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Location is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: false
                },
                {
                    name: 'newCategory',
                    label: 'New Allocation Category',
                    placeholder: 'New Allocation Category',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Category is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: false
                },
                {
                    name: 'newPerson',
                    label: 'Person to be Assigned Series',
                    placeholder: 'Person to be Assigned Series',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocomplete",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Person to be Assigned is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    }, generatecontrol: true,
                    disable: false
                },
            ]
    }

    getFormControls() {
        return this.dcrControlArray;
    }
    getDcrDetailsFormControls() {
        return this.dcrDetailControlArray;
    }
    getReallocateDcrFormControls() {
        return this.dcrReallocateControlArray;
    }
    getSplitDcrFormControls() {
        return this.dcrSplitControlArray;
    }
}