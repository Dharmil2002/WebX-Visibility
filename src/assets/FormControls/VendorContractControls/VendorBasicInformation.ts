import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class VendorInformationDataControl {
    private VendorInformationDataControlArray: FormControls[];
    constructor(vendorInformationData) {
        this.VendorInformationDataControlArray = [
            {
                name: "Vendor",
                label: "Vendor",
                placeholder: "Vendor",
                type: "text",
                value: vendorInformationData.Vendor,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "ContractID",
                label: "ContractID",
                placeholder: "ContractID",
                type: "text",
                value: vendorInformationData.ContractID,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "VendorScan",
                label: "Upload Vendor Scan",
                placeholder: "Upload Vendor Scan",
                type: "file",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {
                    onChange: "onFileSelected",
                },
                additionalData: {
                    isFileSelected: true
                },
            },
            {
                name: "VendorScanView",
                label: "View Vendor Scan",
                placeholder: "View Vendor Scan",
                type: "filelink",
                value: "test",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "Product",
                label: "Product",
                placeholder: "Product",
                type: "Staticdropdown",
                value: [
                    {
                        value: "Express",
                        name: "Express",
                    },
                    {
                        value: "Air",
                        name: "Air",
                    },
                    {
                        value: "Rail",
                        name: "Rail",
                    },
                    {
                        value: "Road",
                        name: "Road",
                    },

                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Product is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                },
            },
            {
                name: "PayBasis",
                label: "Pay Basis",
                placeholder: "Pay Basis",
                type: "Staticdropdown",
                value: [
                    {
                        value: "All",
                        name: "All",
                    },
                    {
                        value: "TBB",
                        name: "TBB",
                    },
                    {
                        value: "LTL",
                        name: "LTL",
                    },
                    {
                        value: "FTL",
                        name: "FTL",
                    },

                ],
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                generatecontrol: true,
                disable: false,
                Validations: [
                    {
                        name: "required",
                        message: "Product is required",
                    },
                ],
                additionalData: {
                    showNameAndValue: true,
                },
            },
            {
                name: "AccountManager",
                label: "Account Manager",
                placeholder: "Account Manager",
                type: "text",
                value: vendorInformationData.AccountManager,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },

            {
                name: "VendorStartDate",
                label: "Vendor Start Date",
                placeholder: "Vendor Start Date",
                type: "date",
                value: vendorInformationData.EffectiveDateFrom,
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date("01 Jan 2000"),
                },
            },
            {
                name: "Expirydate",
                label: "Expiry Date",
                placeholder: "Expiry Date",
                type: "date",
                value: vendorInformationData.ValidUntil,
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date("01 Jan 2000"),
                },
            },
            {
                name: "Pendingdays",
                label: "Pending days",
                placeholder: "Pending days",
                type: "text",
                value: vendorInformationData.pendingdays,
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "VendorPONo",
                label: "Vendor PO No",
                placeholder: "Vendor PO No",
                type: "text",
                value: vendorInformationData.pendingdays,
                generatecontrol: true,
                disable: false,
                Validations: [],
            }, {
                name: "POValiditydate",
                label: "PO Validity date",
                placeholder: "POValiditydate",
                type: "date",
                value: vendorInformationData.ValidUntil,
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    minDate: new Date("01 Jan 2000"),
                },
            },
            {
                name: "VendorPOScan",
                label: "Upload Vendor PO Scan",
                placeholder: "Upload Vendor PO Scan",
                type: "file",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                functions: {
                    onChange: "onFileSelected",
                },
                additionalData: {
                    isFileSelected: true
                },
            },
            {
                name: "VendorPOScanView",
                label: "View Vendor PO Scan",
                placeholder: "View Vendor PO Scan",
                type: "filelink",
                value: "test",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "UpdateHistory",
                label: "View Update History",
                placeholder: "Update History",
                type: "filelink",
                value: "test",
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
        ];
    }
    getVendorInformationDataControls(CurrentAccess: string[]) {
        return this.VendorInformationDataControlArray;
    }
}