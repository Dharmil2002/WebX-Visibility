import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { customerModel } from "src/app/core/models/Masters/customerMaster";
export class customerControl {
    customerControlArray: FormControls[];
    billKycControlArray: FormControls[];
    constructor(customerTable: customerModel, isUpdate: boolean,
    ) {
        this.customerControlArray = [

            {
                name: 'groupCode', label: 'Group Code', placeholder: 'Group Code', type: 'dropdown',
                value: '', generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Group Code is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: true
                }
            },

            {
                name: 'customerCode', label: 'Customer Code', placeholder: 'Customer Code', type: 'text',
                value: customerTable?.customerCode, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Customer Code is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter alphanumeric Customer Code of length 4 to 10",
                        pattern: '^[a-zA-Z0-9]{4,10}$',
                    }
                ],

            },

            {
                name: 'customerName', label: 'Customer Name', placeholder: 'Customer Name', type: 'text',
                value: customerTable?.customerName, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Customer Name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text of length 3 to 25 characters",
                        pattern: '^[a-zA-Z ]{3,25}$',
                    }
                ],

            },
            {
                name: 'customerPassword', label: 'Customer Password', placeholder: 'Customer Password', type: 'text',
                value: customerTable?.customerPassword, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Customer Password is required"
                    },
                ],

            },
            {
                name: 'customerAbbreviation', label: 'Customer Abbreviation', placeholder: 'Customer Abbreviation', type: 'text',
                value: customerTable?.customerAbbreviation, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Customer Abbreviation is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter A-Z Char Or 0-9 with no Space and Customer Abbreviation should be limited to 5 characters",
                        pattern: "^[.a-zA-Z0-9,-]{1,5}$",
                    }
                ],

            },
            {
                name: 'industry', label: 'Industry', placeholder: 'Industry', type: 'text',
                value: customerTable?.industry, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only text of length 3 to 25 characters",
                        pattern: '^[a-zA-Z ]{3,25}$',
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },

            {
                name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: customerTable?.activeFlag, generatecontrol: true, disable: false,
                Validations: [],

            },
            {
                name: 'mobileService', label: 'Mobile Service', placeholder: '', type: 'toggle', value: customerTable?.mobileService, generatecontrol: true, disable: false,
                Validations: [],

            },
            {
                name: 'mobile', label: 'Mobile Number', placeholder: 'Mobile Number', type: 'text',
                value: customerTable?.mobile, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Customer Password is required"
                    },
                    {
                        name: "pattern",
                        message: "Please enter 10 to 12 digit mobile number",
                        pattern: "^[0-9]{10,12}$",
                    },
                ],

            },

            {
                name: 'ownership', label: 'Type of Ownership', placeholder: 'Group Code', type: 'dropdown',
                value: '', generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            },

            {
                name: 'customerControllingLocation',
                label: 'Customer Controlling Locations',
                placeholder: 'Select Customer Controlling Locations',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "controllingDropdown",
                    showNameAndValue: false,
                    Validations: [{
                        name: "",
                        message: ""
                    }]
                },
                generatecontrol: true, disable: false
            },

            {
                name: 'customerLocation',
                label: 'Customer location',
                placeholder: 'Select Customer location',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "locationDropdown",
                    showNameAndValue: false,
                    Validations: [{
                        name: "",
                        message: ""
                    }]
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'nonOda',
                label: 'Customer Non-ODA Locations',
                placeholder: 'Select Customer Non-ODA Locations',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "nonOdaDropdown",
                    showNameAndValue: false,
                    Validations: [{
                        name: "",
                        message: ""
                    }]
                },
                generatecontrol: true, disable: false
            },

            {
                name: 'telephone', label: "Telephone Number", placeholder: "Contact Number", type: 'number',
                value: customerTable?.telephone, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 8 to 10 digit Telephone number",
                        pattern: "^[0-9]{8,10}$",
                    },
                    {
                        name: "required",
                        message: "Telephone Number is required"
                    }
                ],

            },
            {
                name: 'email', label: 'Email', placeholder: 'Email', type: 'text',
                value: customerTable?.email, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Email Id  is required"
                    },
                    {
                        name: "email",
                        message: "Enter Valid Email ID!",
                    },
                ],

            },

            {
                name: 'website', label: 'Website', placeholder: 'Website', type: 'text',
                value: customerTable?.website, generatecontrol: true, disable: false,
                Validations: [
                    // {
                    //     name: "required",
                    //     message: "Website is required"
                    // }
                ],
            },
            {
                name: 'partyType', label: 'Party Type', placeholder: 'Party Type', type: 'text',
                value: customerTable?.partyType, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please Enter only text of length 3 to 25 characters",
                        pattern: '^[a-zA-Z ]{3,25}$',
                    }
                ],

            },

            {
                name: 'controllingDropdown',
                label: 'Customer Controlling Locations',
                placeholder: 'Customer Controlling Locations',
                type: '',
                value: '',
                Validations: [
                ],
                generatecontrol: false, disable: false
            },
            {
                name: 'locationDropdown',
                label: 'Customer Locations',
                placeholder: 'Customer Locations',
                type: '',
                value: '',
                Validations: [
                ],
                generatecontrol: false, disable: false
            },
            {
                name: 'nonOdaDropdown',
                label: 'Non Oda',
                placeholder: 'Non Oda',
                type: '',
                value: '',
                Validations: [
                ],
                generatecontrol: false, disable: false
            },
        ],
            this.billKycControlArray = [
                {
                    name: 'gstNumber', label: 'GST Number', placeholder: 'GST Number ', type: 'text',
                    value: customerTable?.gstNumber, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric GST Number of length 15",
                            pattern: "^[a-zA-Z0-9]{15}$",
                        }
                    ],

                },

                {
                    name: 'custBillName', label: 'Customer Billing Name', placeholder: 'Customer Billing Name', type: 'text',
                    value: customerTable?.custBillName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only text of length 3 to 25 characters",
                            pattern: '^[a-zA-Z ]{3,25}$',
                        }
                    ],

                },

                {
                    name: 'billAddress', label: 'Billing Address', placeholder: 'Billing Address', type: 'text',
                    value: customerTable?.billAddress, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Billing Addressof length 15",
                            pattern: "^[a-zA-Z0-9]{3,15}$",
                        }
                    ],

                },

                {
                    name: 'billCity', label: 'Billing City', placeholder: 'Billing City', type: 'text',
                    value: customerTable?.billCity, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter only text of length 3 to 25 characters",
                            pattern: '^[a-zA-Z ]{3,25}$',
                        }
                    ],

                },

                {
                    name: 'billPincode', label: 'Billing Pincode', placeholder: 'Billing Pincode', type: 'text',
                    value: customerTable?.billPincode, generatecontrol: true, disable: false,
                    Validations: [],

                },

                {
                    name: 'sameAddres', label: 'Billing address same as customer address', placeholder: '', type: 'toggle', value: customerTable?.sameAddres, generatecontrol: true, disable: false,
                    Validations: [

                    ],

                },
                {
                    name: 'bankName', label: 'Bank Name', placeholder: 'Bank Name', type: 'text',
                    value: customerTable?.bankName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a Bank Name of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ],
                },

                {
                    name: 'branch', label: 'Bank Branch', placeholder: 'Branch', type: 'text',
                    value: customerTable?.branch, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a Branch Name of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ],

                },

                {
                    name: 'bankAcct', label: 'Bank Account Number', placeholder: 'Bank Account Number', type: 'text',
                    value: customerTable?.bankAcct, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter Bank Account Number of length 14 digits",
                            pattern: "^[0-9]{14}$",
                        }
                    ],
                },
                {
                    name: 'payBasis',
                    label: 'Pay basis',
                    placeholder: 'Select Pay basis',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "payBasisDropdown",
                        showNameAndValue: false,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    generatecontrol: true, disable: false
                },

                {
                    name: 'serviceOpted',
                    label: 'Service Opted Forn',
                    placeholder: 'Select Service Opted For',
                    type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                    Validations: [
                    ],
                    additionalData: {
                        isIndeterminate: false,
                        isChecked: false,
                        support: "serviceOptedDropdown",
                        showNameAndValue: false,
                        Validations: [{
                            name: "",
                            message: ""
                        }]
                    },
                    generatecontrol: true, disable: false
                },
                {
                    name: 'consignorSite', label: 'Consignor Site Code Mandatory', placeholder: '', type: 'toggle', value: customerTable?.consignorSite, generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'consigneeSite', label: 'Consignee Site Code Mandatory', placeholder: '', type: 'toggle', value: customerTable?.consigneeSite, generatecontrol: true, disable: false,
                    Validations: [],

                },
                {
                    name: 'pan', label: 'PAN Number', placeholder: 'PAN Number', type: 'text',
                    value: customerTable?.pan, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric PAN Number of length 10",
                            pattern: '^[a-zA-Z0-9]{10}$',
                        }
                    ],

                },

                {
                    name: 'address', label: 'Addresss', placeholder: 'Address', type: 'text',
                    value: customerTable?.address, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please Enter alphanumeric Addresss of length 4 to 100",
                            pattern: '^[a-zA-Z0-9]{4,100}$',
                        }
                    ],

                },

                {
                    name: 'city', label: 'City', placeholder: 'City', type: 'text',
                    value: customerTable?.city, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a City of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ],

                },
                {
                    name: 'state', label: 'State', placeholder: 'State', type: 'text',
                    value: customerTable?.state, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            name: "pattern",
                            message: "Please enter a State of length 3 to 15 characters",
                            pattern: '^[a-zA-Z ]{3,15}$',
                        }
                    ],

                },

                {
                    name: 'pincode', label: 'Pincode', placeholder: 'Pincode', type: 'number',
                    value: customerTable?.pincode, generatecontrol: true, disable: false,
                    Validations: [
                        {

                            name: "pattern",
                            message: "Please enter Bank Account No of length 6 digits",
                            pattern: "^[0-9]{6}$",

                        }
                    ],

                },
                {
                    name: 'id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: customerTable.id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false
                },
                {
                    name: 'payBasisDropdown',
                    label: 'Pay Basis',
                    placeholder: 'Pay Basis',
                    type: '',
                    value: '',
                    Validations: [
                    ],
                    generatecontrol: false, disable: false
                },
                {
                    name: 'serviceOptedDropdown',
                    label: 'Service Opted',
                    placeholder: 'Service Opted',
                    type: '',
                    value: '',
                    Validations: [
                    ],
                    generatecontrol: false, disable: false
                },

            ]

    }

    getFormControlsC() {
        return this.customerControlArray;
    }

    getFormControlB() {
        return this.billKycControlArray;
    }
}