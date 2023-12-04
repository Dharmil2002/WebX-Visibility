import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class vendorBillPaymentControl {
    billPaymentHeaderArray: FormControls[];
    constructor(FormValues) {
        this.billPaymentHeaderArray = [
            {
                name: "VendorPANNumber",
                label: "Vendor PAN Number",
                placeholder: "Vendor PAN Number",
                type: "text",
                value: FormValues?.VendorPANNumber,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "VendorPANNumberVerify",
                label: "Verify",
                placeholder: "Verify",
                type: "filelink",
                value: FormValues?.VendorPANNumberVerify,
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
            {
                name: "Beneficiarydetails",
                label: "Beneficiary details",
                placeholder: "Beneficiary details",
                type: "text",
                value: FormValues?.Beneficiarydetails,
                generatecontrol: true,
                disable: true,
                Validations: [],
            },
            {
                name: "BeneficiarydetailsView",
                label: "View",
                placeholder: "View",
                type: "filelink",
                value: FormValues?.BeneficiarydetailsView,
                generatecontrol: true,
                disable: false,
                Validations: [],
            },
        ]
    }
    getbillPaymentHeaderArrayControl() {
        return this.billPaymentHeaderArray;
    }
}