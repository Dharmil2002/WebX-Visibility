import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ContainerControl {
    ContainerControlArray: FormControls[];
    constructor(containerMasterTable, isUpdate: boolean) {
        this.ContainerControlArray = [
            {
                name: 'containerCode',
                label: 'Container Code',
                placeholder: 'Container Code',
                type: 'text',
                value: isUpdate ? containerMasterTable?.containerCode : "System Generated",
                Validations: [
                    {
                        name: "required",
                        message: "Container Code is required"
                    },
                ],
                generatecontrol: true, disable: true
            },
            {
                name: 'containerType',
                label: "Container Type",
                placeholder: "Container Type",
                type: 'dropdown',
                value: '',
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Container Type is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }, {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: "checkIfContainerTypeExists",
                },
            },
            {
                name: 'loadCapacity',
                label: 'Load Capacity(Ton)',
                placeholder: 'Enter Load Capacity',
                type: 'number',
                value: containerMasterTable?.loadCapacity,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'length',
                label: 'Length(Ft)',
                placeholder: 'Enter Length',
                type: 'number',
                value: containerMasterTable?.length,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter Proper Length(Max 100)(up to 2 decimal places)",
                        pattern: '^([1-9][0-9]?(\.[0-9]{1,2})?|100(\.0{1,2})?)$'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'width',
                label: 'Width(Ft)',
                placeholder: 'Enter Width',
                type: 'number',
                value: containerMasterTable?.width,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter Proper Width(Max 50)(up to 2 decimal places)",
                        pattern: '^([1-9][0-9]?(\.[0-9]{1,2})?|50(\.0{1,2})?)$'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'height',
                label: 'Height(Ft)',
                placeholder: 'Enter Height',
                type: 'number',
                value: containerMasterTable?.height,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter Proper Height(Max 25)(up to 2 decimal places)",
                        pattern: '^([1-9][0-9]?(\.[0-9]{1,2})?|25(\.0{1,2})?)$'
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'activeFlag',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: isUpdate?containerMasterTable?.activeFlag:false,
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: containerMasterTable?._id,
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "entryDate",
                label: "Entry Date",
                placeholder: "Select Entry Date",
                type: "date",
                value: new Date(), // Set the value to the current date
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "companyCode",
                label: "Company Code",
                placeholder: "Company Code",
                type: "",
                value: parseInt(localStorage.getItem("companyCode")),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "containerName",
                label: "Container Name",
                placeholder: "Container Name",
                type: "",
                value: "",
                Validations: [],
                generatecontrol: false,
                disable: false,
            },

        ];
    }
    getContainerFormControls() {
        return this.ContainerControlArray;
    }
}
