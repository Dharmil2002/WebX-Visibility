import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { PincodeMaster } from "src/app/core/models/Masters/PinCode Master/PinCode Master";

export class PincodeControl {
    private PincodeControlArray: FormControls[];
    constructor(PincodeTable: PincodeMaster, isUpdate: boolean) {
        this.PincodeControlArray = [
            {
                name: 'State',
                label: 'State',
                placeholder: 'Search State',
                type: 'dropdown',
                value: isUpdate ? PincodeTable.stateName : "",
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
                name: 'City',
                label: 'City',
                placeholder: 'Search City',
                type: 'dropdown',
                value: isUpdate ? PincodeTable.cityname : "",
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
                name: 'Pincode',
                label: 'Pin Code',
                placeholder: 'Search Pin Code',
                type: 'text',
                value: isUpdate ? PincodeTable.pincode : '',
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
                disable: isUpdate ? true : false
            },
            {
                name: 'Area',
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
                type: 'Staticdropdown',//'dropdown',
                value:  [
                    { value: 'WODA', name: 'Serviceable - With ODA' },
                    { value: 'WoODA', name: 'Serviceable - Non ODA' }
                  ],//IsUpdate ? PincodeTable.pincodeCategory : "",
                  Validations: [
                    {
                      name: "required"
                    }
                   ],
                // additionalData: {
                //     showNameAndValue: false
                // },
                generatecontrol: true, disable: false
            },
            {
                name: 'isActive',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value:PincodeTable.isActive,//PincodeTable.activeFlag == "Y" ? true : false,
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
                generatecontrol: true, disable:  isUpdate ? true : false
            },
            {
                name: 'EntryBy',
                label: 'Entry By',
                placeholder: 'Entry By',
                type: '',
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'IsUpdate',
                label: 'Update By',
                placeholder: 'Update By',
                type: '',
                value: [false],
                Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: 'CompanyCode',
                label: 'Company Code',
                placeholder: 'Company Code',
                type: '',
                value: localStorage.getItem("CompanyCode"),
                Validations: [],
                generatecontrol: false, disable: false
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
                name: 'State',
                label: 'State',
                placeholder: 'Search State',
                type: 'dropdown',
                value: "",
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
                name: 'City',
                label: 'City',
                placeholder: 'Search City',
                type: 'dropdown',
                value: "",
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
                name: 'Pincode',
                label: 'Pin Code',
                placeholder: 'Search Pin Code',
                type: 'dropdown',
                value: "",
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
                functions: {
                    onModel: 'PassPinValue',
                },
                generatecontrol: true, disable: false
            },
        ]
    }
    getPincodeListFormControls() {
        return this.PincodeControlListArray;
    }
}