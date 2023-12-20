import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class VendorPaymentControl {
  PaymentHeaderFilterArray: FormControls[];
  THCPaymentFilterArray: FormControls[];
  PayableSummaryFilterArray: FormControls[];
  PaymentSummaryFilterArray: FormControls[];
  constructor(FormValues) {
    this.THCPaymentFilterArray = [

      {
        name: "StartDate",
        label: "SelectDateRange",
        placeholder: "Select Date",
        type: "daterangpicker",
        value: FormValues?.StartDate,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          support: "EndDate",
        },
      },
      {
        name: "vendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "vendorNamesupport",
          showNameAndValue: true,
          Validations: [],
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "vendorNamesupport",
        label: "Vendor",
        placeholder: "Select Vendor",
        type: '',
        value: "",// FormValues?.vendorNameList,
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "EndDate",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: FormValues?.EndDate,
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "Select Data Range",
          },
          {
            name: "required",
            message: "StartDateRange is Required...!",
          },
        ],
      },

    ]
    this.PayableSummaryFilterArray = [
      {
        name: "TotalTHCAmount",
        label: "Total THC Amount ₹",
        placeholder: "Total THC Amount ₹",
        type: "number",
        value: FormValues?.TotalTHCAmount,
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "Total THC Amount ₹ is required"
        },],
      },
      {
        name: "AdvanceAmount",
        label: "Advance Amount ₹",
        placeholder: "Advance Amount ₹",
        type: "number",
        value: FormValues?.AdvanceAmount,
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "Advance Amount ₹ is required"
        },],
      },
      {
        name: "BalancePayable",
        label: "Balance Payable ₹",
        placeholder: "Balance Payable ₹",
        type: "number",
        value: FormValues?.BalancePayable,
        generatecontrol: true,
        disable: true,
        Validations: [{
          name: "required",
          message: "Balance Payable ₹ is required"
        },],
      },

      {
        name: "BalancePaymentlocation",
        label: "Balance Payment location",
        placeholder: "Balance Payment location",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Balance Payment location is required"
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
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "BalancePaymentlocationFieldChanged"
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
          minDate: new Date(),
        },
      },
      // {
      //   name: "ScanSupportingdocument",
      //   label: "Scan Supporting document",
      //   placeholder: "",
      //   type: "file",
      //   value: "",
      //   Validations: [],
      //   additionalData: {
      //     isFileSelected: true
      //   },
      //   functions: {
      //     onChange: "selectFileScanDocument",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      // },

    ]
    this.PaymentHeaderFilterArray = [
      {
        name: "VendorPANNumber",
        label: "Vendor PAN Number",
        placeholder: "Vendor PAN Number",
        type: "textwithbutton",
        value: FormValues?.VendorPANNumber,
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

      {
        name: "Numberofvehiclesregistered",
        label: "Number of vehicles registered",
        placeholder: "Number of vehicles registered",
        type: "textwithbutton",
        value: FormValues?.Numberofvehiclesregistered,
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          buttonIcon: "visibility",
          functionName: 'vehiclesregisteredview'
        },
      },
    ]
  }


  getTHCPaymentFilterArrayControls() {
    return this.THCPaymentFilterArray;
  }
  getTPayableSummaryFilterArrayControls() {
    return this.PayableSummaryFilterArray;
  }
  getTPaymentSummaryFilterArrayControls() {
    return this.PaymentSummaryFilterArray;
  }
  getTPaymentHeaderFilterArrayControls() {
    return this.PaymentHeaderFilterArray;
  }
}
