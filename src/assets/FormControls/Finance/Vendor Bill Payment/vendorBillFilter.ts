import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class vendorBillFilterControl {
    vendorBillFilterArray: FormControls[];
    constructor(FormValues) {
        this.vendorBillFilterArray = [
            {
                name: "StartDate",
                label: "SelectDateRange",
                placeholder: "Select Date",
                type: "daterangpicker",
                value: FormValues?.startdate,
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    support: "EndDate",
                },
            },
            {
                name: "vendorName",
                label: "Vendor Name",
                placeholder: "Vendor Name",
                type: "multiselect",
                value: "",
                Validations: [],
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "vendorNamesupport",
                    showNameAndValue: true,
                    Validations: [],
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "billType",
                label: "Bill Type",
                placeholder: "Bill Type",
                type: "multiselect",
                value: "",
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "billTypesupport",
                    showNameAndValue: true,
                    Validations: [],
                },
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                generatecontrol: true,
                disable: false,
            },
            {
                name: "status",
                label: "Status",
                placeholder: "Bill Type",
                type: "multiselect",
                value: "",
                Validations: [],
                functions: {
                    onToggleAll: "toggleSelectAll",
                },
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "statussupport",
                    showNameAndValue: true,
                    Validations: [],
                },
                generatecontrol: true,
                disable: false,
            },

            {
                name: "vendorNamesupport",
                label: "Vendor",
                placeholder: "Select Vendor",
                type: '',
                value: "",// FormValues?.vendorNameList,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "billTypesupport",
                label: "Vendor",
                placeholder: "Select Bill Type",
                type: '',
                value: "",// FormValues?.vendorNameList,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "statussupport",
                label: "Vendor",
                placeholder: "Select Status",
                type: '',
                value: "",// FormValues?.vendorNameList,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "EndDate",
                label: "",
                placeholder: "Select Data Range",
                type: "",
                value: FormValues?.enddate,
                filterOptions: "",
                autocomplete: "",
                generatecontrol: false,
                disable: true,
                Validations: [
                    {
                        name: "Select Data Range",
                    },
                    {
                        name: "required",
                        message: "StartDateRange is Required...!",
                    },
                ],
            },

        ]
    }


    getVendorBillFilterArrayControls() {
        return this.vendorBillFilterArray;
    }
}