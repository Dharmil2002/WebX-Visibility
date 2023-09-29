import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { VendorMaster } from "src/app/core/models/Masters/vendor-master";

export class VendorControl {
    vendorControlArray: FormControls[];
    vendorOtherInfoArray: FormControls[];
    constructor(vendorMasterTable: VendorMaster, isUpdate: boolean) {
        this.vendorControlArray = [
            {
                name: 'vendorCode',
                label: 'Vendor Code',
                placeholder: 'Vendor Code',
                type: 'text',
                value: isUpdate ? vendorMasterTable.vendorCode : "System Generated",
                Validations: [],
                generatecontrol: true, disable: true
            },
            {
                name: 'vendorName',
                label: 'Vendor Name',
                placeholder: 'Vendor Name',
                type: 'text',
                value: vendorMasterTable.vendorName,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text of length 3 to 25 characters",
                        pattern: '^[a-zA-Z - a-zA-Z]{3,25}$',
                    }
                ],
                functions: {
                    onChange: "CheckVendorName",
                },
                generatecontrol: true, disable: isUpdate ? true : false
            },
            {
                name: 'vendorType',
                label: 'Vendor Type',
                placeholder: 'Search Vendor Type',
                type: 'dropdown',
                value: isUpdate ? vendorMasterTable.vendorType : "",
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Type is required"
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
                generatecontrol: true, disable: false
            },
            {
                name: 'vendorAddress',
                label: 'Vendor Address',
                placeholder: 'Vendor Address',
                type: 'text',
                value: vendorMasterTable.vendorAddress,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Address is required"
                    },
                    {
                        name: "pattern",
                        message: "Please enter upto 250 characters.",
                        pattern: "^[a-zA-Z 0-9 -,.'()#/]{1,250}$",
                    },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'vendorLocation',
                label: 'Vendor Location',
                placeholder: 'Select Vendor location',
                type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
                Validations: [
                ],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "vendorLocationDropdown",
                    showNameAndValue: false,
                    Validations: [{
                    }]
                },
                functions: {
                    onToggleAll: 'toggleSelectAll'
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'vendorPinCode',
                label: 'Vendor Pincode',
                placeholder: 'Search Pincode',
                type: 'dropdown',
                value: vendorMasterTable.vendorPinCode,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Pincode is required"
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
                    onModel: "getPincode",
                    onOptionSelect: "setStateCityData"
                },
                generatecontrol: true, disable: false
            },
            {
                name: 'vendorCity',
                label: 'Vendor City',
                placeholder: 'Vendor City',
                type: 'text',
                value: vendorMasterTable.vendorCity,
                Validations: [{
                    name: "required",
                    message: "Vendor city is required"
                },],
                generatecontrol: true, disable: true
            },
            {
                name: 'vendorState',
                label: 'Vendor State',
                placeholder: 'Vendor State',
                type: 'text',
                value: vendorMasterTable.vendorState,
                Validations: [{
                    name: "required",
                    message: "Vendor state is required"
                },],
                generatecontrol: true, disable: true
            },
            {
                name: 'vendorCountry',
                label: 'Country',
                placeholder: 'Country',
                type: 'text',
                value: vendorMasterTable.vendorCountry,
                Validations: [{
                    name: "required",
                    message: "Vendor Country is required"
                },],
                generatecontrol: true, disable: true
            },
            {
                name: 'vendorPhoneNo',
                label: 'Vendor Phone No',
                placeholder: 'Vendor Phone No',
                type: 'number', value: vendorMasterTable.vendorPhoneNo,
                Validations: [
                    {
                        name: "required",
                        message: "Vendor Phone No is required"
                    },
                    {
                        name: "pattern",
                        pattern: "^[0-9]{10}$",
                        message: "Please enter a valid 10-digit phone number"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'emailId',
                label: 'Vendor E-mail',
                placeholder: 'Vendor E-mail',
                type: 'text', value: vendorMasterTable.emailId,
                Validations: [
                    {
                        name: "required",
                        message: " Email ID is required",
                    },
                    {
                        name: "email",
                        pattern: "^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$",
                        message: "Please enter a valid email address"
                    }

                ],
                generatecontrol: true, disable: false
            },
            {
                name: '',
                label: '',
                placeholder: '',
                type: '', value: "",
                Validations: [
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'panNo',
                label: 'PAN NO',
                placeholder: 'PAN NO',
                type: 'text',
                value: vendorMasterTable.panNo,
                Validations: [
                    {
                        name: "required",
                        message: "PAN NO is required"
                    },
                    {
                        name: "pattern",
                        pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
                        message: "Please enter a valid PAN NO (e.g., ABCDE1234F)"
                    }
                ],
                functions: {
                    onChange: "CheckPANNo",
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'noPANRegistration',
            //     label: 'No PAN registration',
            //     placeholder: ' ',
            //     type: 'toggle',
            //     value: vendorMasterTable.noPANRegistration,
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'panCardScan', label: "PAN card scan", placeholder: "select PAN card to scan", type: 'file', value: isUpdate ? vendorMasterTable.panCardScan : "",
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "PAN card scan is required"
                    },
                ],
                functions: {
                    onChange: 'selectHandleFileSelection',
                }
            },
            {
                name: 'cinNumber',
                label: 'CIN number',
                placeholder: 'Enter CIN number',
                type: 'text',
                value: vendorMasterTable.cinNumber,
                Validations: [

                    {
                        name: "pattern",
                        pattern: '^[A-Za-z0-9 ]{0,100}$',
                        message: "Please enter a valid CIN number upto 100 alphanumeric characters"
                    }
                ],
                functions: {
                    onChange: "CheckCINnumber",
                },
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'msmeRegistered',
            //     label: 'MSME registered',
            //     placeholder: 'Enter MSME registered',
            //     type: 'toggle',
            //     value: vendorMasterTable.msmeRegistered,
            //     Validations: [],
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'msmeNumber',
                label: 'MSME Number',
                placeholder: 'Enter MSME Number',
                type: 'text',
                value: vendorMasterTable.msmeNumber,
                Validations: [
                    {
                        name: "required",
                        message: "MSME Number is required"
                    },
                    {
                        name: "pattern",
                        pattern: '^[A-Za-z0-9 ]{0,100}$',
                        message: "Please enter a valid MSME Number upto 100 alphanumeric characters"
                    }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'msmeScan', label: "MSME scan", placeholder: "select MSME scan", type: 'file', value: isUpdate ? vendorMasterTable.msmeScan : "",
                generatecontrol: true, disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "MSME scan is required"
                    },
                ],
                functions: {
                    onChange: 'selectHandleFileSelection',
                }
            },
            {
                name: 'isActive', label: 'Active Flag', placeholder: 'Active Flag', type: 'toggle', value: vendorMasterTable.isActive, Validations: [],
                generatecontrol: true, disable: false
            },

            {
                name: 'isBlackListed', label: 'Black Listed', placeholder: 'Active Flag', type: 'toggle', value: vendorMasterTable.isBlackListed, Validations: [],
                generatecontrol: true, disable: false
            },

            {
                name: '',
                label: '',
                placeholder: '',
                type: '', value: "",
                Validations: [
                ],
                generatecontrol: true, disable: false
            },
            {
                name: '',
                label: '',
                placeholder: '',
                type: '', value: "",
                Validations: [
                ],
                generatecontrol: true, disable: false
            },

            {
                name: 'gstNumber',
                label: 'GST Number',
                placeholder: 'Enter GST Number',
                type: 'text',
                value: vendorMasterTable.gstNumber,
                Validations: [{
                    name: "required",
                    message: "GST Number is required"
                },
                {
                    name: "pattern",
                    pattern: '^[A-Za-z0-9 ]{1,100}$',
                    message: "Please enter a valid GST Number upto 100 alphanumeric characters"
                }
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'gstState',
                label: 'GST State',
                placeholder: 'GST State',
                type: 'text',
                value: vendorMasterTable.gstState,
                Validations: [{
                    name: "required",
                    message: "GST state is required"
                },],
                generatecontrol: true, disable: false
            },
            {
                name: 'gstAddress',
                label: 'GST Address',
                placeholder: 'GST Address',
                type: 'text',
                value: vendorMasterTable.gstState,
                Validations: [{
                    name: "required",
                    message: "GST Address is required"
                },],
                generatecontrol: true, disable: false
            },
            {
                name: 'gstCity',
                label: 'GST City',
                placeholder: 'GST City',
                type: 'text',
                value: vendorMasterTable.gstCity,
                Validations: [{
                    name: "required",
                    message: "GST City is required"
                },],
                generatecontrol: true, disable: false
            },
            {
                name: 'gstPincode',
                label: 'GST Pincode',
                placeholder: 'search and Select GST Pincode',
                type: 'text',
                value: vendorMasterTable.gstPincode,
                Validations: [{
                    name: "required",
                    message: "GST Pincode is required"
                },],
                generatecontrol: true, disable: false
            },
            {
                name: 'vendorLocationDropdown',
                label: 'Vendor Location',
                placeholder: 'Select Vendor Location',
                type: '',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Location is Required...!",
                }
                ],
                generatecontrol: false, disable: false
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: vendorMasterTable._id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: 'entryDate',
                label: 'Entry Date',
                placeholder: 'Select Entry Date',
                type: 'date',
                value: new Date(), // Set the value to the current date
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: 'entryBy', label: 'Entry By', placeholder: 'Entry By', type: 'text', value: localStorage.getItem("Username"), Validations: [],
                generatecontrol: false, disable: false
            },
            {
                name: "updateBy",
                label: "Update By",
                placeholder: "Update By",
                type: "text",
                value: localStorage.getItem("UserName"),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
        ];
        this.vendorOtherInfoArray = [
            // {
            //     name: 'accountNumber',
            //     label: 'Account Number',
            //     placeholder: 'Account Number',
            //     type: 'number', value: vendorMasterTable.accountNumber,
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "Account Number is required"
            //         },
            //         {
            //             name: "pattern",
            //             message: "Please enter Bank Account No of length 14 digits",
            //             pattern: "^[0-9]{14}$",
            //         }
            //     ],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'ifscNumber',
            //     label: 'IFSC Number',
            //     placeholder: 'IFSC Number',
            //     type: 'text', value: vendorMasterTable.ifscNumber,
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "IFSC Number is required"
            //         },
            //         {
            //             name: "pattern",
            //             pattern: "^[A-Z]{4}[0-9]{7}$",
            //             message: "Please enter a valid IFSC number (4 letters followed by 7 digits)"
            //         }
            //     ],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'bankName',
            //     label: 'Bank Name',
            //     placeholder: 'Bank Name',
            //     type: 'text', value: vendorMasterTable.bankName,
            //     Validations: [
            //         {
            //             name: "required",
            //             message: "Bank Name is required"
            //         },
            //         {
            //             name: "pattern",
            //             pattern: "^[A-Za-z, ]+$",
            //             message: "Bank Name must contain only letters (alphabetic characters)"
            //         }
            //     ],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'ownerName',
            //     label: 'Owner Name',
            //     placeholder: 'Owner Name',
            //     type: 'text', value: isUpdate ? vendorMasterTable.ownerName : "",
            //     Validations: [
            //     ],
            //     generatecontrol: true, disable: false
            // },

            // {
            //     name: 'remark',
            //     label: 'Remark',
            //     placeholder: 'Remark',
            //     type: 'text', value: vendorMasterTable.remark,
            //     Validations: [
            //     ],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'lspName',
            //     label: 'LSP Name',
            //     placeholder: 'Search LSP Name',
            //     type: 'dropdown',
            //     value: vendorMasterTable.lspName,
            //     Validations: [{
            //         name: "invalidAutocompleteObject",
            //         message: "Choose proper value",
            //     },
            //     {
            //         name: "autocomplete",
            //     },
            //     ],
            //     additionalData: {
            //         showNameAndValue: false
            //     },
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'dueDays',
            //     label: 'Due Days',
            //     placeholder: 'Due Days',
            //     type: 'number', value: isUpdate ? vendorMasterTable.dueDays : 0,
            //     Validations: [
            //     ],
            //     generatecontrol: true, disable: false
            // },

            // {
            //     name: 'gstNo',
            //     label: 'GST No',
            //     placeholder: 'GST No',
            //     type: 'text', value: isUpdate ? vendorMasterTable.gstNo : "",
            //     Validations: [{
            //         name: "pattern",
            //         message: "Invalid GST Number format.",
            //         pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]\dZ\d$/,
            //     },
            //     ],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'tdsDocument', label: "TDS Document", placeholder: "", type: 'file', value: isUpdate ? vendorMasterTable.tdsDocument : "",
            //     generatecontrol: true, disable: false,
            //     Validations: [],
            //     functions: {
            //         onChange: 'selectHandleFileSelection',
            //     }
            // },
            // // {
            // //     name: 'cancelCheque', label: "Cancel Cheque", placeholder: "", type: 'file', value: isUpdate ? vendorMasterTable.cancelCheque : "",
            // //     generatecontrol: true, disable: false,
            // //     Validations: [],
            // //     functions: {
            // //         onChange: 'selectHandleFileSelection',
            // //     }
            // // },

            // {
            //     name: 'reliableDocument', label: "Reliable Document", placeholder: "", type: 'file', value: isUpdate ? vendorMasterTable.reliableDocument : "",
            //     generatecontrol: true, disable: false,
            //     Validations: [],
            //     functions: {
            //         onChange: 'selectHandleFileSelection',
            //     }
            // },
            // {
            //     name: 'select',
            //     label: 'Select',
            //     placeholder: 'Select',
            //     type: 'Staticdropdown',
            //     value: [
            //         { value: 'CP', name: 'CP' },
            //         { value: 'NCP', name: 'Non-CP' }
            //     ],
            //     Validations: [

            //     ],
            //     additionalData: {
            //         showNameAndValue: true
            //     },
            //     functions: {
            //         onSelection: 'displayCp'
            //     },
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'cpCode',
            //     label: 'CP Code',
            //     placeholder: 'CP Code',
            //     type: 'text', value: isUpdate ? vendorMasterTable.cpCode : "",
            //     Validations: [
            //     ],
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: 'entryBy', label: 'Entry By', placeholder: 'Entry By', type: 'text', value: localStorage.getItem("Username"), Validations: [],
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: 'isGstCharged', label: 'Is GST Charged', placeholder: 'Is GST Charged', type: 'toggle', value: isUpdate ? vendorMasterTable.isGstCharged : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'paymentEmail',
            //     label: 'Payment Email',
            //     placeholder: 'Payment Email',
            //     type: 'toggle',
            //     value: isUpdate ? vendorMasterTable.paymentEmail : "",
            //     Validations: [],
            //     functions: {
            //         onChange: 'onChange',
            //     },
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'logicloudLSP', label: 'Logicloud LSP', placeholder: 'Logicloud LSP', type: 'toggle', value: isUpdate ? vendorMasterTable.logicloudLSP : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'deliveryPartner', label: 'Delivery Partner', placeholder: 'Delivery Partner', type: 'toggle', value: isUpdate ? vendorMasterTable.deliveryPartner : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'audited', label: 'Audit', placeholder: 'Audit', type: 'toggle', value: isUpdate ? vendorMasterTable.audited : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'msme',
            //     label: 'MSME',
            //     placeholder: 'MSME',
            //     type: 'toggle',
            //     value: isUpdate ? vendorMasterTable.msme : false,
            //     Validations: [],
            //     functions: {
            //         onChange: 'onMsmeChange',
            //     },
            //     generatecontrol: true, disable: false
            // },

            // {
            //     name: 'franchise', label: 'Franchise', placeholder: 'Franchise', type: 'toggle', value: isUpdate ? vendorMasterTable.franchise : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'integrateWithFinSystem', label: 'Integrate With Fin System', placeholder: 'Integrate With Fin System', type: 'toggle', value: isUpdate ? vendorMasterTable.integrateWithFinSystem : false, Validations: [],
            //     generatecontrol: true, disable: false
            // },

            // {
            //     name: 'tdsApplicable',
            //     label: 'TDS Applicable',
            //     placeholder: 'Vendor Sub Type',
            //     type: 'toggle',
            //     value: isUpdate ? vendorMasterTable.tdsApplicable : false,
            //     Validations: [],
            //     functions: {
            //         onChange: 'displayTds',
            //     },
            //     generatecontrol: true, disable: false
            // },
            // {
            //     name: 'tdsSection',
            //     label: 'TDS Section',
            //     placeholder: 'Select TDS Section',
            //     type: 'multiselect', value: '', filterOptions: "", autocomplete: "", displaywith: "",
            //     Validations: [
            //     ],
            //     additionalData: {
            //         isIndeterminate: false,
            //         isChecked: false,
            //         support: "tdsSectionDropdown",
            //         showNameAndValue: false,
            //         Validations: [{
            //         }]
            //     },
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: 'tdsType',
            //     label: 'TDS Type',
            //     placeholder: 'Search TDS Type',
            //     type: 'dropdown',
            //     value: '',
            //     Validations: [
            //     ],
            //     additionalData: {
            //         showNameAndValue: false
            //     },
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: 'tdsRate',
            //     label: 'TDS Rate',
            //     placeholder: 'TDS Rate',
            //     type: 'number', value: vendorMasterTable.tdsRate,
            //     Validations: [
            //     ],
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: '_id',
            //     label: '',
            //     placeholder: '',
            //     type: 'text',
            //     value: vendorMasterTable._id,
            //     filterOptions: '',
            //     autocomplete: '',
            //     displaywith: '',
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false
            // },
            // {
            //     name: 'entryDate',
            //     label: 'Entry Date',
            //     placeholder: 'Select Entry Date',
            //     type: 'date',
            //     value: new Date(), // Set the value to the current date
            //     filterOptions: '',
            //     autocomplete: '',
            //     displaywith: '',
            //     Validations: [],
            //     generatecontrol: false,
            //     disable: false
            // },

            // {
            //     name: 'tdsSectionDropdown',
            //     label: 'TDS Section',
            //     placeholder: 'Select TDS Section',
            //     type: '',
            //     value: '',
            //     Validations: [
            //     ],
            //     generatecontrol: false, disable: false
            // },
        ];
    }
    getVendorFormControls() {
        return this.vendorControlArray;
    }
    getVendorOtherInfoFormControls() {
        return this.vendorOtherInfoArray;
    }
}