import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class VendorBalancePaymentControl {
  PaymenBalanceFilterArray: FormControls[];
  VendorBalanceTaxationTDSArray: FormControls[];
  VendorBalanceTaxationGSTArray: FormControls[];
  VendorBalanceSummaryArray: FormControls[];
  VendorBalanceTaxationPaymentDetailsArray: FormControls[];
  VendorBalanceTaxationPaymentSummaryArray: FormControls[];
  constructor(FormValues) {
    this.VendorBalanceTaxationTDSArray = [
      {
        name: "TDSExempted",
        label: "TDS Exempted",
        placeholder: "TDS Exempted",
        type: "toggle",
        value: true,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "toggleTDSExempted",
        },
      },
      {
        name: "TDSSection",
        label: "TDS Section",
        placeholder: "TDS Section",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "TDS Section is required",
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
          metaData: "Basic",
        },
        functions: {
          onOptionSelect: "TDSSectionFieldChanged",
        },
      },
      {
        name: "TDSRate",
        label: "TDS Rate %",
        placeholder: "TDS Rate",
        type: "number",
        value: "",
        Validations: [],

        generatecontrol: true,
        disable: true,
      },
      {
        name: "TDSAmount",
        label: "TDS Amount ₹",
        placeholder: "TDS Amount ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
    this.VendorBalanceTaxationGSTArray = [
      {
        name: "VendorGSTRegistered",
        label: "Vendor GST Registered",
        placeholder: "Vendor GST Registered",
        type: "toggle",
        value: FormValues?.VendorGSTRegistered == "Yes" ? true : false,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "GSTSACcode",
        label: "GST SAC code",
        placeholder: "GST SAC code",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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
          metaData: "Basic",
        },
        functions: {
          onOptionSelect: "StateChange",
        },
      },
      {
        name: "Billbookingstate",
        label: "Bill booking state",
        placeholder: "Bill booking state",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bill booking state is required",
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
          metaData: "Basic",
        },
        functions: {
          onOptionSelect: "StateChange",
        },
      },
      {
        name: "GSTNumber",
        label: "GST Number",
        placeholder: "GST Number",
        type: "government-id",
        value: FormValues?.GSTNumber,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            pattern:
              "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message: "Please enter a valid GST Number EX. (12ABCDE1234F5Z6)",
          },
        ],
        functions: {
          onChange: "ValidGSTNumber",
        },
      },
      {
        name: "Vendorbillstate",
        label: "Vendor bill state",
        placeholder: "Vendor bill state",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Vendor bill state is required",
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
          metaData: "Basic",
        },
        functions: {
          onOptionSelect: "StateChange",
        },
      },
      {
        name: "VGSTNumber",
        label: "GST Number",
        placeholder: "GST Number",
        type: "government-id",
        value: FormValues?.GSTNumber,
        generatecontrol: true,
        disable: false,
        Validations: [
          // {
          //   name: "required",
          //   message: "GST Number is required",
          // },
          {
            name: "pattern",
            pattern:
              "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
            message: "Please enter a valid GST Number EX. (12ABCDE1234F5Z6)",
          },
        ],
      },

      {
        name: "CGSTRate",
        label: "CGST Rate %",
        placeholder: "CGST Rate",
        type: "dayhour",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: "CGST Amount ₹",
          fieldName: "CGSTAmount",
          disable: true,
        },
      },
      {
        name: "SGSTRate",
        label: "SGST Rate %",
        placeholder: "SGST Rate",
        type: "dayhour",
        value: "",
        Validations: [],

        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: "SGST Amount ₹",
          fieldName: "SGSTAmount",
          disable: true,
        },
      },
      {
        name: "UGSTRate",
        label: "UGST Rate %",
        placeholder: "UGST Rate",
        type: "dayhour",
        value: "",
        Validations: [],

        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: "UGST Amount ₹",
          fieldName: "UGSTAmount",
          disable: true,
        },
      },
      {
        name: "IGSTRate",
        label: "IGST Rate %",
        placeholder: "IGST Rate",
        type: "dayhour",
        value: "",
        Validations: [],

        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: "IGST Amount ₹",
          fieldName: "IGSTAmount",
          disable: true,
        },
      },
      {
        name: "TotalGSTRate",
        label: "Total GST %",
        placeholder: "Total GST",
        type: "dayhour",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: "GST Amount ₹",
          fieldName: "GSTAmount",
          disable: true,
        },
      },
      {
        name: "CGSTAmount",
        label: "CGST Amount ₹",
        placeholder: "CGST Amount ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "SGSTAmount",
        label: "SGST Amount ₹",
        placeholder: "SGST Amount ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "UGSTAmount",
        label: "UGST Amount ₹",
        placeholder: "UGST Amount ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "IGSTAmount",
        label: "IGST Amount ₹",
        placeholder: "IGST Amount ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "GSTAmount",
        label: "GST Amount ₹",
        placeholder: "GST Amount ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
      {
        name: "GSTType",
        label: "",
        placeholder: "",
        type: "text",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
    ];
    this.VendorBalanceSummaryArray = [
      {
        name: "TotalTHCAmount",
        label: "Total THC Amount ₹",
        placeholder: "Total THC Amount ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "AddGST",
        label: "Add GST ₹",
        placeholder: "Add GST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "LessTDS",
        label: "Less TDS ₹",
        placeholder: "Less TDS ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "LessAdvancepaid",
        label: "Less Advance paid ₹",
        placeholder: "Less Advance paid ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "BalancePayable",
        label: "Balance Payable ₹",
        placeholder: "Balance Payable ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Roundoff",
        label: "Round off ₹",
        placeholder: "Round off ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
    this.VendorBalanceTaxationPaymentDetailsArray = [
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
          onSelection: "OnPaymentModeChange",
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
            message: "Cheque/Ref No is required",
          },
        ],
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
            message: "Bank is required",
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
          metaData: "Basic",
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
            message: "Account is required",
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
          metaData: "Basic",
        },
      },
      // {
      //   name: "ReceivedFromBank",
      //   label: "Received From Bank",
      //   placeholder: "Received From Bank",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
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
      //     isFileSelected: true,
      //   },
      //   functions: {
      //     onChange: "selectFileScanDocument",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      // },
      // {
      //   name: "ScanSupportingdocument",
      //   label: "Scan Supporting document",
      //   placeholder: "Scan Supporting document",
      //   type: "file",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // functions: {
      //   onChange: "onFileSelected",
      // },
      // },
    ];
    this.PaymenBalanceFilterArray = [
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
          functionName: "VendorPANNumberview",
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
          buttonIcon: "book-open",
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
          functionName: "vehiclesregisteredview",
        },
      },
    ];
    this.VendorBalanceTaxationPaymentSummaryArray = [
      {
        name: 'PaymentAmount',
        label: 'Payment Amount ₹',
        placeholder: 'Payment Amount ₹',
        type: 'number',
        value: "",
        Validations: [],
        generatecontrol: true, disable: true,
        additionalData: {
          metaData: "PaymentAmount"
        }
      },

      {
        name: 'NetPayable',
        label: 'Net Payable ₹',
        placeholder: 'Net Payable ₹',
        type: 'number',
        value: "",
        Validations: [],
        generatecontrol: true, disable: true,
        additionalData: {
          metaData: "NetPayable"
        }
      },
    ];
  }

  getVendorBalanceTaxationTDSArrayControls() {
    return this.VendorBalanceTaxationTDSArray;
  }
  getVendorBalanceTaxationGSTArrayControls() {
    return this.VendorBalanceTaxationGSTArray;
  }
  getVendorBalanceSummaryArrayControls() {
    return this.VendorBalanceSummaryArray;
  }
  getVendorBalanceTaxationPaymentDetailsArrayControls() {
    return this.VendorBalanceTaxationPaymentDetailsArray;
  }
  getTPaymentHeaderFilterArrayControls() {
    return this.PaymenBalanceFilterArray;
  }
  getVendorBalancePaymentSummaryArrayControls() {
    return this.VendorBalanceTaxationPaymentSummaryArray;
  }
}
