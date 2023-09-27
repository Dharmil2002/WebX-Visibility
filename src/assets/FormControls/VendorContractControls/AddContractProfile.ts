import { FormControls } from "src/app/core/models/FormControl/formcontrol";

export class AddContractProfile {
    AddContractProfileArray: FormControls[];
    constructor(AddContractProfile, IsUpdate) {
        this.AddContractProfileArray = [
            { name: 'ContractCode', label: 'Contract Code', placeholder: 'Contract Code', type: 'text', value: IsUpdate ? AddContractProfile.ContractCode : "System Generated", generatecontrol: true, disable: true, Validations: [] }
            , { name: 'VendorCode', label: 'Vendor Code', placeholder: 'Vendor Code', type: 'text', value: AddContractProfile.VendorCode, generatecontrol: true, disable: true, Validations: [] }
            , { name: 'VendorName', label: 'Vendor Name', placeholder: 'Vendor Name', type: 'text', value: AddContractProfile.VendorName, generatecontrol: true, disable: true, Validations: [] }
            , {
                name: 'ContractBranchCode', label: 'Contract Signing Location', placeholder: 'Contract Signing Location', type: 'dropdown', value: AddContractProfile.ContractSigningLocation, generatecontrol: true, disable: false,   Validations: [
                    {
                        name: "required",
                        message: "Please select signing location"
                    },
                    {
                        name: "autocomplete",
                    },
                    {
                        name: "invalidAutocomplete",
                        message: "please select values from list only",
                    }
                ],
                additionalData: {
                    showNameAndValue: false
                }
            }
            ,{ name: 'ContractDate', label: 'Contract Date', placeholder: 'Contract Date', type: 'date', value: AddContractProfile.ContractDate, generatecontrol: true, disable: false, Validations: [],
            additionalData: {
                minDate: new Date("01 Jan 2000")
            } }
            , { name: 'ContractStartDate', label: 'Contract Start Date', placeholder: 'Contract Start Date', type: 'date', value: AddContractProfile.EffectiveDateFrom, generatecontrol: true, disable: false, Validations: [],
            additionalData: {
                minDate: new Date("01 Jan 2000")
            }  }
            , { name: 'ValidUptoDate', label: 'Valid Upto Date', placeholder: 'Valid Upto Date', type: 'date', value: AddContractProfile.ValidUntil, generatecontrol: true, disable: false, Validations: [],
            additionalData: {
                minDate: new Date("01 Jan 2000")
            }  }
            , { name: 'ContractCopy', label: 'Upload Contract Copy', placeholder: 'Upload Contract Copy', type: 'file', value: '', generatecontrol: true, disable: false, Validations: [], 
            functions: {
                onChange: 'onFileSelected',
            } }
            ,{ name: 'ContractCopyView', label: 'View Contract Copy', placeholder: 'View Contract Copy', type: 'link', value: AddContractProfile.DocUrl, generatecontrol: true, disable: false, Validations: [] }
            , { name: 'CompanyCode', label: 'CompanyCode', placeholder: 'CompanyCode', type: 'text', value: localStorage.getItem('CompanyCode'), generatecontrol: false, disable: true, Validations: [] }
            , { name: 'ActionType', label: 'ActionType', placeholder: 'CompanyCode', type: 'text', value: 'BASIC', generatecontrol: false, disable: true, Validations: [] }
            , { name: 'VendorType', label: 'VendorType', placeholder: 'ContractTypeDescription', type: 'text', value: AddContractProfile.VendorType, generatecontrol: false, disable: true, Validations: [] }
            , { name: 'VendorTypeCode', label: 'VendorTypeCode', placeholder: 'VendorTypeCode', type: 'text', value: AddContractProfile.VendorTypeCode, generatecontrol: false, disable: true, Validations: [] }
            , { name: 'Status', label: 'Status', placeholder: 'Status', type: 'text', value: 'N', generatecontrol: false, disable: true, Validations: [] }
        ]
    }
}
