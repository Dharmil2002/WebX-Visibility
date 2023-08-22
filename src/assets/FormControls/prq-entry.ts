import { FormControls } from "src/app/Models/FormControl/formcontrol";

/* here i create class for the bind controls in formGrop */
export class PrqEntryControls {
    private fieldMapping: FormControls[];
    constructor() {
        this.fieldMapping = [
            {
                name: "prqId",
                label: "PRQ ID",
                placeholder: "PRQ ID",
                type: "text",
                value: "System Generated",
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "prqDate",
                label: "PRQ Date",
                placeholder: "PRQ Date",
                type: "date",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "PRQ Date is required",
                    },
                ],
                additionalData: {
                    minDate: new Date(),
                },
            },
            {
                name: "weight",
                label: "Weight",
                placeholder: "Weight",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Weight is required",
                    },
                ],
            },
            {
                name: "billingParty",
                label: "Billing Party",
                placeholder: "Billing Party",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Billing Party is required",
                    },
                    {
                        name: "autocomplete"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: true,
                }

            },
            {
                name: "fleetSize",
                label: "Fleet Size",
                placeholder: "Fleet Size",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Fleet Size is required",
                    },
                    // {
                    //     name: "autocomplete"
                    // },
                    // {
                    //     name: "invalidAutocompleteObject",
                    //     message: "Choose proper value",
                    // }
                ],
                additionalData: {
                    showNameAndValue: true,
                }

            },
            {
                name: "contactNo",
                label: "Contact No",
                placeholder: "Contact No",
                type: "number",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Contact No is required",
                    },
                ],
                functions: {
                    change: "",
                },
            },
            {
                name: "fromCity",
                label: "From City",
                placeholder: "From City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "From City is required",
                    },
                    // {
                    //     name: "autocomplete"
                    // },
                    // {
                    //     name: "invalidAutocompleteObject",
                    //     message: "Choose proper value",
                    // }
                ],
                additionalData: {
                    showNameAndValue: false,
                },
            },
            {
                name: "toCity",
                label: "To City",
                placeholder: "To City",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "To City is required",
                    },
                    // {
                    //     name: "autocomplete"
                    // },
                    // {
                    //     name: "invalidAutocompleteObject",
                    //     message: "Choose proper value",
                    // }
                ],
                additionalData: {
                    showNameAndValue: false,
                },
            },
            {
                name: "ftlType",
                label: "FTL Type",
                placeholder: "FTL Type",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                },
            },
            {
                name: 'pickUpTime',
                label: 'Pickup Date & Time',
                placeholder: '',
                type: 'time',
                value: new Date(),
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: "prqBranch",
                label: "PRQ Branch",
                placeholder: "PRQ Branch",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                },
            },
            {
                name: "transMode",
                label: "Transport Mode",
                placeholder: "Transport Mode",
                type: "dropdown",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    showNameAndValue: false,
                },
            },

        ];
    }
    getPrqEntryFieldControls() {
        return this.fieldMapping;
    }
}
