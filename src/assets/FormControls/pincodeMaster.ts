import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";

export class PincodeControl {
    private PincodeControlArray: FormControls[];
    constructor(PincodeTable: PincodeMaster, isUpdate: boolean) {
        this.PincodeControlArray = [
            {
                name: 'state',
                label: 'State',
                placeholder: 'Search State',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    },
                    {
                        name: "required",
                        message: "State is required"
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'ChangedMethod',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'city',
                label: 'City',
                placeholder: 'Search City',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    },
                    {
                        name: "required",
                        message: "City is required"
                    }
                ], additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'pincode',
                label: 'Pin Code',
                placeholder: 'Search Pin Code',
                type: 'text',
                value: PincodeTable.pincode,
                Validations: [
                    {
                        name: "minlength",
                        message: "Pin code should be of 6 digit number",
                        minLength: '6',
                    },
                    {
                        name: "maxlength",
                        message: "Pin code should be of 6 digit number",
                        maxLength: '6',
                    },
                    {
                        name: "required",
                        message: "PinCode is required"
                    }],
                functions: {
                    onChange: 'GetPincodeExist',
                },
                generatecontrol: true,
                disable: false
            },
            {
                name: 'area',
                label: 'Area/Region',
                placeholder: 'Area',
                type: 'text',
                value: PincodeTable.area,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'pincodeCategory',
                label: 'Pincode Category',
                placeholder: 'Search Pincode Category',
                type: 'Staticdropdown',
                value:  [
                    { value: "Serviceable - With ODA", name: 'Serviceable - With ODA' },
                    { value: "Serviceable - Non ODA", name: 'Serviceable - Non ODA' }
                  ],
                  Validations: [
                    {
                      name: "required"
                    }
                   ],
                generatecontrol: true, disable: false
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value:PincodeTable.isActive,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'serviceable',
                label: 'Serviceable/Non-ODA',
                placeholder: 'Serviceable',
                type: 'toggle',
                value: PincodeTable.serviceable,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'entryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: '',
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'isUpdate',
                label: 'Update By',
                placeholder: 'Update By',
                type: '',
                value: [false],
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'companyCode',
                label: 'Company Code',
                placeholder: 'Company Code',
                type: '',
                value: localStorage.getItem("CompanyCode"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
              name: 'id',
              label: '',
              placeholder: '',
              type: 'text',
              value: PincodeTable.id,
              filterOptions: '',
              autocomplete: '',
              displaywith: '',
              Validations: [],
              generatecontrol: false,
              disable: false
            },
        ]
    }
    getPincodeFormControls() {
        return this.PincodeControlArray;
    }
}

export class PincodeListControl {
    private PincodeControlListArray: FormControls[];
    constructor(PincodeTable: PincodeMaster) {
        this.PincodeControlListArray = [
            {
                name: 'state',
                label: 'State',
                placeholder: 'Search State',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'ChangedMethod',
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'city',
                label: 'City',
                placeholder: 'Search City',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: "OR", label: "", placeholder: '', type: "OR", value: '',
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'pincode',
                label: 'Pin Code',
                placeholder: 'Search Pin Code',
                type: 'dropdown',
                value: '',
                Validations: [
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "Please Select Proper Option",
                    }
                ], additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
        ]
    }
    getPincodeListFormControls() {
        return this.PincodeControlListArray;
    }
}