import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { AddressMaster } from "src/app/core/models/Masters/address-master";

export class AddressControl {
    addressControlArray: FormControls[];
    constructor(addressGroupTable: AddressMaster, IsUpdate: boolean) {
        this.addressControlArray = [
            {
                name: 'addressCode', label: "Address Code",
                placeholder: "",
                type: 'text',
                value: addressGroupTable.addressCode,
                generatecontrol: true, disable: false,
                Validations: [
                ]
            },
            {
                name: 'manualCode', label: "Manual Code",
                placeholder: "Enter Manual Code",
                type: 'text',
                value: addressGroupTable.manualCode,
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Group Name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter alphanumeric Manual Code of length 4 to 10",
                        pattern: '^[a-zA-Z0-9]{4,10}$',
                    }
                ]
            },
            {
                name: 'phone', label: "Phone Number", placeholder: "Phone Number", type: 'number',
                value: addressGroupTable.phone, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 10  digit Telephone number",
                        pattern: "^[0-9]{10}$",
                    },
                ],

            },
            {
                name: 'email', label: "Email Id", placeholder: "Enter Email Id", type: 'text', value: addressGroupTable.email, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Email Id  is required"
                    },
                    {
                        name: "email",
                        message: "Enter Valid Email ID!",
                    },

                ]
            },
            {
                name: 'address', label: "Address",
                placeholder: "Enter Address",
                type: 'text',
                value: addressGroupTable.address,
                generatecontrol: true, disable: false,
                Validations: [
                ]
            },
            {
                name: 'cityName', label: "City",
                placeholder: "Select City",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ]
            },
            {
                name: 'stateName', label: "State",
                placeholder: "Select State",
                type: 'dropdown',
                value: addressGroupTable.state,
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ]
            },
            {
                name: 'pincode', label: "Pincode",
                placeholder: "Select Pincode",
                type: 'dropdown',
                value: '',
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ]
              
            },
            {
                name: 'activeFlag', label: 'Active Flag', placeholder: 'Active', type: 'toggle', value: addressGroupTable.activeFlag, generatecontrol: true, disable: false,
                Validations: []
            },
            {
                name: 'id',
                label: '',
                placeholder: '',
                type: 'text',
                value: addressGroupTable.id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            }
        ]
    }
    getFormControls() {
        return this.addressControlArray;
    }

}