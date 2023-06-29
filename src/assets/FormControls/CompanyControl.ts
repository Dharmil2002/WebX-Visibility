import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CompanyControl {
    CompanyControlArray: FormControls[];
    BankControlArray: FormControls[];
    constructor(CompanyDetailsResponse) {
        this.CompanyControlArray = [
            {
                name: 'Brand', label: 'Brand', placeholder: 'Brand', type: 'radiobutton',
                value: [{ value: 'V', name: 'Velocity', "checked": true }, { value: 'K', name: 'Kale' }], 
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'Company_Code', label: 'Company Code', placeholder: 'Company Code', type: 'text', 
                value: CompanyDetailsResponse?.COMPANY_CODE, generatecontrol: true, disable: false,
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
                name: 'Company_Name', label: 'Company Name', placeholder: 'Company Name', type: 'text', 
                value: CompanyDetailsResponse?.COMPANY_NAME, generatecontrol: true, disable: false,
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
                name: 'Contact_Person_Name', label: 'Contact Person Name', placeholder: 'Contact Person Name', type: 'text', 
                value: CompanyDetailsResponse?.CONTACT_PERSON, generatecontrol: true, disable: false,
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
                name: 'Contact_No', label: "Contact Number", placeholder: "Contact Number", type: 'text', 
                value: CompanyDetailsResponse?.CONTACTNO, generatecontrol: true, disable: false,
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
                name: 'Branch_Code', label: 'Branch Code', placeholder: 'Branch Code', type: 'text', 
                value: CompanyDetailsResponse?.BRCD, generatecontrol: true, disable: false,
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
                name: 'Telephone_No', label: "Telephone No", placeholder: "Telephone No", type: 'number', 
                value: CompanyDetailsResponse?.TelephoneNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter 4 to 10 digit telephone number",
                        pattern: "^[0-9]{4,10}$",
                    }
                ]
            },

            {
                name: 'Company_Address', label: 'Company Address', placeholder: 'Company Address', type: 'text', 
                value: CompanyDetailsResponse?.ADDRESS, generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Company Address is required"
                    }
                ]
            },

            {
                name: 'Servise_Tax_No', label: 'Servise Tax No', placeholder: 'Servise Tax No', type: 'text', 
                value: CompanyDetailsResponse?.ServicetaxNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                    }
                ]
            },

            {
                name: 'PAN_No', label: 'PAN No', placeholder: 'PAN No', type: 'text', value: CompanyDetailsResponse?.PANNo, 
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$"
                    }
                ]
            },

            {
                name: 'TAN_No', label: 'TAN No', placeholder: 'TAN No', type: 'text', value: CompanyDetailsResponse?.TANNo, 
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$"
                    }
                ]
            },

            {
                name: 'Fax_No', label: 'FAX No', placeholder: 'FAX No', type: 'text', value: CompanyDetailsResponse?.FAXNo, 
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9-()+s]+$"
                    }
                ]
            },

            {
                name: 'Help_Line_No', label: 'Help Line No', placeholder: 'Help Line No', type: 'text', 
                value: CompanyDetailsResponse?.HelpLineNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[0-9-()+s]+$"
                    }
                ]
            },

            {
                name: 'Registration_No', label: 'Registration No', placeholder: 'Registration No', type: 'text', 
                value: CompanyDetailsResponse?.RegistrationNo, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[a-zA-Z0-9-.]+$"
                    }
                ]
            },

            {
                name: 'Punch_Line', label: 'Punch Line', placeholder: 'Punch Line', type: 'text', 
                value: CompanyDetailsResponse?.PunchLine, generatecontrol: true, disable: false,
                Validations: [
                    {
                        pattern: "^[a-zA-Z0-9,.!?'s]+$"
                    }
                ]
            },

            {
                name: 'Company_Image', label: "Company Image", placeholder: "", type: 'file', value: "", 
                generatecontrol: true, disable: false,
                Validations: [],
                functions: {
                    onChange: 'selectedFile',
                }
            },

            {
                name: 'ActiveFlag', label: 'Active Flag', placeholder: '', type: 'toggle', value: CompanyDetailsResponse?.ACTIVEFLAG, generatecontrol: true, disable: false,
                Validations: []
            },
        ],
            this.BankControlArray = [
                {
                    name: 'Beneficiary_Name', label: 'Beneficiary Name', placeholder: 'Beneficiary Name ', type: 'text', 
                    value: CompanyDetailsResponse?.BeneficiaryName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.']+([s][a-zA-Z.']+)*$"
                        }
                    ]
                },

                {
                    name: 'Barcode_Header_Name', label: 'Barcode Header Name', placeholder: 'Barcode Header Name', type: 'text', 
                    value: CompanyDetailsResponse?.BarcodeName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.']+([s][a-zA-Z.']+)*$"
                        }
                    ]
                },

                {
                    name: 'Bank_Account_No', label: 'Bank Account No', placeholder: 'Bank Account No', type: 'text', 
                    value: CompanyDetailsResponse?.BankAccountNo, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^d{9,18}$"
                        }
                    ]
                },

                {
                    name: 'Bank_Name', label: ' Bank Account No', placeholder: ' Bank Account No', type: 'text', 
                    value: CompanyDetailsResponse?.BankName, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z.'&]+([s][a-zA-Z.'&]+)*$"
                        }
                    ]
                },

                {
                    name: 'RTGS_Code', label: 'RTGS Code', placeholder: 'RTGS Code', type: 'text', 
                    value: CompanyDetailsResponse?.RTGS_NEFTcode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Za-z]{4}d{7}$"
                        }
                    ]
                },

                {
                    name: 'MICR_Code', label: 'MICR Code', placeholder: 'MICR Code', type: 'text', 
                    value: CompanyDetailsResponse?.MICRCode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[0-9]{1,9}$"
                        }
                    ]
                },

                {
                    name: 'IFSC_Code', label: 'IFSC Code', placeholder: 'IFSC Code', type: 'text', 
                    value: CompanyDetailsResponse?.IFSCCode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Za-z]{4}d{7}$"
                        }
                    ]
                },

                {
                    name: 'SWIFT_Code', label: 'SWIFT Code', placeholder: 'SWIFT Code', type: 'text', 
                    value: CompanyDetailsResponse?.SWIFTcode, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$"
                        }
                    ]
                },

                {
                    name: 'account_Type', label: 'Account Type', placeholder: 'Account Type', type: 'text', 
                    value: CompanyDetailsResponse?.AccountType, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'Branch_Name', label: 'Branch Name', placeholder: 'Branch Name', type: 'text',
                    value: CompanyDetailsResponse?.BankBranch, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'Terms_and_Conditions', label: ' Terms and Conditions', placeholder: ' Terms and Conditions', 
                    type: 'text', value: CompanyDetailsResponse?.TermsCondition, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z]+$"
                        }
                    ]
                },

                {
                    name: 'TimezoneId', label: "Time Zone", placeholder: "Time Zone", type: 'dropdown',
                    value: '',
                    generatecontrol: true,
                    disable: false,
                    Validations: [],
                    additionalData: {
                        showNameAndValue: true
                    }
                },

                {
                    name: 'LR_Terms_and_Conditions', label: 'LR Terms and Conditions', placeholder: 'LR Terms and Conditions', 
                    type: 'text', value: CompanyDetailsResponse?.LRTermsCondition, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z0-9 ]*$"
                        }
                    ]
                },

                {
                    name: 'PO_Terms_and_Conditions', label: 'PO Terms and Conditions', placeholder: 'PO Terms and Conditions', 
                    type: 'text', value: CompanyDetailsResponse?.POTermsCondition, generatecontrol: true, disable: false,
                    Validations: [
                        {
                            pattern: "^[a-zA-Z0-9 ]*$"
                        }
                    ]
                },

                {
                    name: 'Download_Icon', label: 'Default Chart Of Account',
                    placeholder: 'Default Chart Of Account', type: 'Icon',
                    value: '', generatecontrol: true, disable: false,
                    Validations: [],
                    functions: {
                        onClick: 'downloadfile',
                    },
                },

                {
                    name: 'Color_Theme', label: "Select Theme", placeholder: "Select Theme", type: 'dropdown', value: CompanyDetailsResponse?.CompanyTheme,
                    generatecontrol: true,
                    disable: false,
                    Validations: [ ],
                    additionalData: {
                        showNameAndValue: true
                    }
                },

                {
                    name: 'Multi_Currency_Flag', label: 'Multi Currency', placeholder: 'Multi Currency Flag', type: 'toggle', 
                    value: CompanyDetailsResponse?.EnableMultiCurrency, generatecontrol: true, disable: false,
                    Validations: []
                },
            ]

    }

    getFormControlsC() {
        return this.CompanyControlArray;
    }

    getFormControlB() {
        return this.BankControlArray;
    }
}