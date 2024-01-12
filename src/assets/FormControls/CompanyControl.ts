import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CompanyControl {
    CompanyControlArray: FormControls[];
    BankControlArray: FormControls[];
    constructor(CompanyDetailsResponse) {
        this.CompanyControlArray = [
            {
                name: 'brand', label: 'Brand', placeholder: 'Brand', type: 'radiobutton',
                value: [{ value: 'V', name: 'Velocity', "checked": true }, { value: 'K', name: 'Kale' }],
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'company_Code', label: 'Company Code', placeholder: 'Company Code', type: 'text',
                value: CompanyDetailsResponse?.company_Code, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Company Code is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text with 1-20 alphabets",
                        pattern: '^[a-zA-Z ]{1,20}$'
                    }
                ],
                functions: {
                    onChange: 'OnCompanyCodeChange',
                }
            },

            {
                name: 'company_Name', label: 'Company Name', placeholder: 'Company Name', type: 'text',
                value: CompanyDetailsResponse?.company_Name, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Company Name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text with 1-100 alphabets",
                        pattern: '^[a-zA-Z ]{1,100}$'
                    }
                ]
            },

            {
                name: 'contact_Person_Name', label: 'Contact Person Name', placeholder: 'Contact Person Name', type: 'text',
                value: CompanyDetailsResponse?.contact_Person_Name, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Contact Person Name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text with 3-25 alphabets",
                        pattern: '^[a-zA-Z0-9 ]{3,25}$'
                    }
                ]
            },

            {
                name: 'contact_No', label: "Contact Number", placeholder: "Contact Number", type: 'text',
                value: CompanyDetailsResponse?.contact_No, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 6 to 15 digit mobile number",
                        pattern: "^[0-9]{6,15}$",
                    },
                    {
                        name: "required"
                    }
                ]
            },

            {
                name: 'branch_Code', label: 'Branch Code', placeholder: 'Branch Code', type: 'text',
                value: CompanyDetailsResponse?.branch_Code, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Branch Code is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text",
                        pattern: '^[a-zA-Z ]*$',
                    }
                ]
            },

            {
                name: 'telephone_No', label: "Telephone No", placeholder: "Telephone No", type: 'number',
                value: CompanyDetailsResponse?.telephone_No, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 4 to 10 digit telephone number",
                        pattern: "^[0-9]{4,10}$",
                    }
                ]
            },

            {
                name: 'company_Address', label: 'Company Address', placeholder: 'Company Address', type: 'text',
                value: CompanyDetailsResponse?.company_Address, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Company Address is required"
                    }
                ]
            },

            {
                name: 'service_Tax_No', label: 'Service Tax No', placeholder: 'Service Tax No', type: 'text',
                value: CompanyDetailsResponse?.service_Tax_No, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                    }
                ]
            },

            {
                name: 'pan_N0', label: 'PAN No', placeholder: 'PAN No', type: 'text', value: CompanyDetailsResponse?.pan_N0,
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$"
                    }
                ]
            },

            {
                name: 'tan_No', label: 'TAN No', placeholder: 'TAN No', type: 'text', value: CompanyDetailsResponse?.tan_No,
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$"
                    }
                ]
            },

            {
                name: 'fax_No', label: 'FAX No', placeholder: 'FAX No', type: 'text', value: CompanyDetailsResponse?.fax_No,
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9-()+s]+$"
                    }
                ]
            },

            {
                name: 'help_Line_No', label: 'Help Line No', placeholder: 'Help Line No', type: 'text',
                value: CompanyDetailsResponse?.help_Line_No, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9-()+s]+$"
                    }
                ]
            },

            {
                name: 'registration_No', label: 'Registration No', placeholder: 'Registration No', type: 'text',
                value: CompanyDetailsResponse?.registration_No, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[a-zA-Z0-9-.]+$"
                    }
                ]
            },

            {
                name: 'punch_Line', label: 'Punch Line', placeholder: 'Punch Line', type: 'text',
                value: CompanyDetailsResponse?.punch_Line, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[a-zA-Z0-9,.!?'s]+$"
                    }
                ]
            },

            {
                name: 'company_Image', label: "Company Image", placeholder: "", type: 'file', value: "",
                generatecontrol: true, disable: false,
                Validations: [],
                functions: {
                    onChange: 'selectedFile',
                }
            },

            {
                name: 'activeFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: CompanyDetailsResponse?.activeFlag, generatecontrol: true, disable: false,
                Validations: []
            },
        ],
            this.BankControlArray = [
                {
                    name: 'beneficiary_Name', label: 'Beneficiary Name', placeholder: 'Beneficiary Name ', type: 'text',
                    value: CompanyDetailsResponse?.beneficiary_Name, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.']+([s][a-zA-Z.']+)*$"
                        }
                    ]
                },

                {
                    name: 'barcode_Header_Name', label: 'Barcode Header Name', placeholder: 'Barcode Header Name', type: 'text',
                    value: CompanyDetailsResponse?.barcode_Header_Name, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.']+([s][a-zA-Z.']+)*$"
                        }
                    ]
                },

                {
                    name: 'bank_Account_No', label: 'Bank Account No', placeholder: 'Bank Account No', type: 'text',
                    value: CompanyDetailsResponse?.bank_Account_No, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^d{9,18}$"
                        }
                    ]
                },

                {
                    name: 'bank_Name', label: ' Bank Account No', placeholder: ' Bank Account No', type: 'text',
                    value: CompanyDetailsResponse?.bank_Name, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.'&]+([s][a-zA-Z.'&]+)*$"
                        }
                    ]
                },

                {
                    name: 'rtgs_Code', label: 'RTGS Code', placeholder: 'RTGS Code', type: 'text',
                    value: CompanyDetailsResponse?.rtgs_Code, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Za-z]{4}d{7}$"
                        }
                    ]
                },

                {
                    name: 'micr_Code', label: 'MICR Code', placeholder: 'MICR Code', type: 'text',
                    value: CompanyDetailsResponse?.micr_Code, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[0-9]{1,9}$"
                        }
                    ]
                },

                {
                    name: 'ifsc_Code', label: 'IFSC Code', placeholder: 'IFSC Code', type: 'text',
                    value: CompanyDetailsResponse?.ifsc_Code, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Za-z]{4}d{7}$"
                        }
                    ]
                },

                {
                    name: 'swift_Code', label: 'SWIFT Code', placeholder: 'SWIFT Code', type: 'text',
                    value: CompanyDetailsResponse?.swift_Code, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$"
                        }
                    ]
                },

                {
                    name: 'account_Type', label: 'Account Type', placeholder: 'Account Type', type: 'text',
                    value: CompanyDetailsResponse?.account_Type, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'branch_Name', label: 'Branch Name', placeholder: 'Branch Name', type: 'text',
                    value: CompanyDetailsResponse?.branch_Name, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'terms_And_Conditions', label: ' Terms and Conditions', placeholder: ' Terms and Conditions',
                    type: 'text', value: CompanyDetailsResponse?.terms_And_Conditions, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'timeZone', label: "Time Zone", placeholder: "Time Zone", type: 'dropdown',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [{
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }],
                    additionalData: {
                        showNameAndValue: true
                    }
                },

                {
                    name: 'lr_Terms_And_Conditions', label: 'LR Terms and Conditions', placeholder: 'LR Terms and Conditions',
                    type: 'text', value: CompanyDetailsResponse?.lr_Terms_And_Conditions, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z0-9 ]*$"
                        }
                    ]
                },

                {
                    name: 'po_Terms_and_Conditions', label: 'PO Terms and Conditions', placeholder: 'PO Terms and Conditions',
                    type: 'text', value: CompanyDetailsResponse?.po_Terms_and_Conditions, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z0-9 ]*$"
                        }
                    ]
                },

                {
                    name: 'download_Icon', label: 'Default Chart Of Account',
                    placeholder: 'Default Chart Of Account', type: 'Icon',
                    value: '', generatecontrol: true, disable: false,
                    Validations: [],
                    functions: {
                        onClick: 'downloadfile',
                    },
                },

                {
                    name: 'color_Theme', label: "Select Theme", placeholder: "Select Theme", type: 'dropdown', value: CompanyDetailsResponse?.color_Theme,
                    generatecontrol: true,
                    disable: false,
                    Validations: [{
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    }],
                    additionalData: {
                        showNameAndValue: true
                    }
                },

                {
                    name: 'multi_Currency_Flag', label: 'Multi Currency', placeholder: 'Multi Currency Flag', type: 'toggle',
                    value: CompanyDetailsResponse?.multi_Currency_Flag, generatecontrol: true, disable: false,
                    Validations: []
                },
                {
                    name: '_id',
                    label: '',
                    placeholder: '',
                    type: 'text',
                    value: CompanyDetailsResponse?._id,
                    filterOptions: '',
                    autocomplete: '',
                    displaywith: '',
                    Validations: [],
                    generatecontrol: false,
                    disable: false

                }
            ]

    }

    getFormControlsC() {
        return this.CompanyControlArray;
    }

    getFormControlB() {
        return this.BankControlArray;
    }
}