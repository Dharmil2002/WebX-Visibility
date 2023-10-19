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
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }, generatecontrol: true,
                disable: false
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
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        }
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                    generatecontrol: false,
                    disable: false
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
                            name: "invalidAutocompleteObject",
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
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Category is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                    functions: {
                        onOptionSelect: 'getAllMastersData'
                    },
                    generatecontrol: true,
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
                            name: "invalidAutocompleteObject",
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
                            name: "invalidAutocompleteObjectObject",
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
                    name: 'allotTo',
                    label: 'New Allocation Location',
                    placeholder: 'New Allocation Location',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocompleteObject",
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
                    name: 'type',
                    label: 'New Allocation Category',
                    placeholder: 'New Allocation Category',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocompleteObject",
                            message: "Choose proper value",
                        },
                        {
                            name: "required",
                            message: "Category is required"
                        },
                    ],
                    additionalData: {
                        showNameAndValue: false
                    },
                    functions: {
                        onOptionSelect: 'getAllMastersData'
                    },
                    generatecontrol: true,
                    disable: false
                },
                {
                    name: 'allocateTo',
                    label: 'Person to be Assigned Series',
                    placeholder: 'Person to be Assigned Series',
                    type: 'dropdown',
                    value: "",
                    Validations: [
                        {
                            name: "invalidAutocompleteObject",
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
                {
                    name: 'entryBy',
                    label: 'Entry By',
                    placeholder: 'Entry By',
                    type: 'text',
                    value: localStorage.getItem("UserName"),
                    Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'entryDate',
                    label: 'Entry Date',
                    placeholder: 'Entry Date',
                    type: 'text',
                    value: new Date().toISOString(),
                    Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: '_id',
                    label: 'Id',
                    placeholder: 'Id',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'action',
                    label: 'Action',
                    placeholder: 'Action',
                    type: 'text',
                    value: '',
                    Validations: [],
                    generatecontrol: false, disable: false
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