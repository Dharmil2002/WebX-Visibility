import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class BeneficiaryControl {
    beneficiaryHeaderControlArray: FormControls[]
    beneficiaryDetailControlArray: FormControls[]
    constructor(
        uploadKYC: any, isEditable: boolean
    ) {
        this.beneficiaryHeaderControlArray = [
            {
                name: "beneficiaryType",
                label: "Beneficiary Type",
                placeholder: 'Search And Select Beneficiary Type',
                type: "Staticdropdown",
                value: [
                    { value: "customer_detail", name: "Customer" },
                    { value: "vendor_detail", name: "Vendor", },
                    { value: "driver_detail", name: "Driver", },
                    { value: "user_master", name: "Employee", }
                ],
                Validations: [
                    {
                        name: "required",
                        message: "Beneficiary Type is required"
                    }

                ],
                functions: {
                    onSelection: 'getBeneficiaryData',
                },
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'beneficiary',
                label: 'Beneficiary',
                placeholder: 'Search and select Beneficiary',
                type: 'dropdown',
                value: "",
                Validations: [
                    {
                        name: "required",
                        message: "Beneficiary is required"
                    },
                    {
                        name: "invalidAutocompleteObject",
                        message: "Choose proper value",
                    },
                    {
                        name: "autocomplete",
                    },
                ],
                additionalData: {
                    showNameAndValue: false
                },
                functions: {
                    onOptionSelect: 'checkDuplicate'
                },
                generatecontrol: true, disable: false
            },
            {
                name: '_id',
                label: 'id',
                placeholder: 'id',
                type: '',
                value: false,
                Validations: [],
                generatecontrol: false, disable: false
            }                     
        ];
        this.beneficiaryDetailControlArray = [
            {
                name: 'accountCode',
                label: 'Account code',
                placeholder: 'Enter Account code',
                type: 'number',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Account code is required"
                },
                {
                    name: "pattern",
                    message: "Please enter valid Account code of length 10 to 15.",
                    pattern: "^[0-9]{10,15}$",
                },
                ], functions: {
                    onChange: 'OnAccountChange'
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'IFSCcode',
                label: 'IFSC code',
                placeholder: 'Enter IFSC code',
                type: 'government-id',
                value: '',
                Validations: [{
                    name: "required",
                    message: "IFSC code is required"
                },
                {
                    name: "pattern",
                    message: "Please enter IFSC code Ex: SBIN0123456",
                    pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
                },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'bankName',
                label: 'Bank name',
                placeholder: 'Enter Bank name',
                type: 'text',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Bank name is required"
                },
                {
                    name: "pattern",
                    message: "Please enter upto 200 Alpha numeric Bank name.",
                    pattern: "^[a-zA-Z 0-9]{1,200}$",
                },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'branchName',
                label: 'Bank branch name',
                placeholder: 'Enter Bank branch name',
                type: 'text',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Bank branch name is required"
                },
                {
                    name: "pattern",
                    message: "Please enter upto 200 Alpha numeric Bank branch name.",
                    pattern: "^[a-zA-Z 0-9]{1,200}$",
                },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'city',
                label: 'Bank City',
                placeholder: 'Enter Bank City',
                type: 'text',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Bank branch City is required"
                },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'UPIId',
                label: 'UPI Id',
                placeholder: 'Enter UPI Id',
                type: 'text',
                value: '',
                Validations: [
                    {
                        name: "pattern",
                        message: "Please enter upto 100 Alpha numeric UPI Id.",
                        pattern: "^[a-z0-9@]{1,100}$",
                    },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'uploadKYC',
                label: 'Upload KYC',
                placeholder: 'select Upload KYC',
                type: 'file',
                value: isEditable ? uploadKYC : "",
                Validations: [{
                    name: "required",
                    message: "Upload KYC is required"
                },],
                functions: {
                    onChange: 'uploadKYC',
                },
                additionalData: {
                    isFileSelected: true
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'contactPerson',
                label: 'Contact person',
                placeholder: 'Enter Contact person',
                type: 'text',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Contact person is required"
                },
                {
                    name: "pattern",
                    message: "Please enter upto 200 Alpha numeric Contact person.",
                    pattern: "^[a-zA-Z 0-9]{1,200}$",
                },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: "mobileNo",
                label: "Mobile",
                placeholder: "Enter mobileno",
                type: "mobile-number",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Mobile Number is required!",
                    },
                    {
                        name: "pattern",
                        message: "Please enter 10 digit mobile number",
                        pattern: "^[0-9]{10}$",
                    },
                ],
            },
            {
                name: "emailId",
                label: "Email ID",
                placeholder: "Enter Email ID",
                type: "text",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Email is required",
                    },
                    {
                        name: "email",
                        message: "Enter Valid Email ID!",
                    },
                ],
                functions: {
                    onChange: "GetEmailDetails",
                },
            },
        ];
    }
    getHeaderControl() {
        return this.beneficiaryHeaderControlArray;
    }
    getDetailContol() {
        return this.beneficiaryDetailControlArray;
    }
}