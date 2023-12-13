import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class vendorBillPaymentControl {
    billPaymentHeaderArray: FormControls[];
    PaymentSummaryFilterArray: FormControls[];
    constructor() {
        this.billPaymentHeaderArray = [
            {
                name: "VendorPANNumber",
                label: "Vendor PAN Number",
                placeholder: "Vendor PAN Number",
                type: "textwithbutton",
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    buttonIcon: "check",
                    functionName: 'VendorPANNumberview'
                },
            },
            {
                name: "BeneficiarydetailsView",
                label: "Beneficiary details View",
                placeholder: "",
                type: "button",
                value: "",
                generatecontrol: true,
                disable: false,
                Validations: [],
                additionalData: {
                    buttonIcon: "book-open"
                },
                functions: {
                    onClick: "getBeneficiaryData",
                },
            },
        ]
        this.PaymentSummaryFilterArray = [
            {
              name: "PaymentMode",
              label: "Payment Mode",
              placeholder: "Payment Mode",
              type: "Staticdropdown",
              value: [
                {
                  value: "Cheque",
                  name: "Cheque",
                },
                {
                  value: "Cash",
                  name: "Cash",
                },
                {
                  value: "RTGS/UTR",
                  name: "RTGS/UTR",
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
                  message: "Payment Mode is required",
                },
              ],
              additionalData: {
                showNameAndValue: true,
              },
              functions: {
                onSelection: "OnPaymentModeChange"
              },
            },
      
            {
              name: "ChequeOrRefNo",
              label: "Cheque/Ref No.",
              placeholder: "Cheque/Ref No.",
              type: "text",
              value: "",
              generatecontrol: true,
              disable: false,
              Validations: [
                {
                  name: "required",
                  message: "Cheque/Ref No is required"
                },],
            },
            {
              name: "Bank",
              label: "Select Bank",
              placeholder: "Select Bank",
              type: "dropdown",
              value: "",
              filterOptions: "",
              displaywith: "",
              generatecontrol: true,
              disable: false,
              Validations: [
                {
                  name: "required",
                  message: "Bank is required"
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
                showNameAndValue: true,
                metaData: "Basic"
              },
            },
      
            {
              name: "CashAccount",
              label: "Cash Account",
              placeholder: "Cash Account",
              type: "dropdown",
              value: "",
              filterOptions: "",
              displaywith: "",
              generatecontrol: true,
              disable: false,
              Validations: [
                {
                  name: "required",
                  message: "Account is required"
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
                showNameAndValue: true,
                metaData: "Basic"
              },
            },
            {
              name: "Date",
              label: "Date",
              placeholder: "Date",
              type: "date",
              value: new Date(),
              generatecontrol: true,
              disable: false,
              Validations: [],
              additionalData: {
                // minDate: new Date(),
              },
            },
          ]
    }
    getbillPaymentHeaderArrayControl() {
        return this.billPaymentHeaderArray;
    }
    getPaymentSummaryControl() {
        return this.PaymentSummaryFilterArray;
    }
}