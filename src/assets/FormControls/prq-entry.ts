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
                name: "pickupDate",
                label: "PickUp Date",
                placeholder: "PickUp Date",
                type: "date",
                value: new Date(),
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Pickup Date is required",
                    },
                ],
                additionalData: {
                    minDate: new Date(),
                },
            },
            {
                name: 'pickUpTime',
                label: 'Pickup Time',
                placeholder: '',
                type: 'time',
                value: new Date(),
                Validations: [],
                generatecontrol: true, disable: false
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
                        name: "pattern",
                        message: "Please enter 10 digit mobile number",
                        pattern: "^[0-9]{10}$",
                    },
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
                name: "vehicleSize",
                label: "Vehicle Size",
                placeholder: "Vehicle Size",
                type: "Staticdropdown",
                value: [
                    { value: '1-MT', name: '1-MT' },
                    { value: '9-MT', name: '9-MT' },
                    { value: '16-MT', name: '16-MT' },
                    { value: '32-MT', name: '32-MT' }
                ],
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
                name: "prqBranch",
                label: "PRQ Branch",
                placeholder: "PRQ Branch",
                type: "Staticdropdown",
                value: [
                    { value: 'MUMBAI', name: 'MUMBAI' },
                    { value: 'DELHI', name: 'DELHI' },
                    { value: 'KOLKATA', name: 'KOLKATA' }
                ],
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
                type: "Staticdropdown",
                value: [
                    { value: 'Air', name: 'Air' },
                    { value: 'Road', name: 'Road' },
                    { value: 'Rail', name: 'Rail' }

                ],
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
                name: '_id',
                label: '',
                placeholder: '',
                type: '',
                value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'status',
                label: '',
                placeholder: '',
                type: '',
                value: '0',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'entryBy',
                label: '',
                placeholder: '',
                type: '',
                value: localStorage.getItem("Username"),
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'entryDate',
                label: '',
                placeholder: '',
                type: '',
                value: new Date(),
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'status',
                label: '',
                placeholder: '',
                type: '',
                value: '0',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'vehicleNo',
                label: '',
                placeholder: '',
                type: '',
                value: '0',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'dktNo',
                label: '',
                placeholder: '',
                type: '',
                value: '0',
                Validations: [],
                generatecontrol: true, disable: false
            },

        ];
    }
    getPrqEntryFieldControls() {
        return this.fieldMapping;
    }
}
