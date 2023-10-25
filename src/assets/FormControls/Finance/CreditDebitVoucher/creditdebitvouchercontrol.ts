import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditDebitVoucherControl {
  CreditDebitVoucherSummaryArray: FormControls[];
  CreditDebitVoucherTaxationTDSArray: FormControls[];
  CreditDebitVoucherTaxationTCSArray: FormControls[];
  CreditDebitVoucherTaxationGSTArray: FormControls[];
  CreditDebitVoucherTaxationPaymentSummaryArray: FormControls[];
  CreditDebitVoucherTaxationPaymentDetailsArray: FormControls[];
  CreditDebitVoucherDocumentDebitsArray: FormControls[];
  constructor() {
    this.CreditDebitVoucherSummaryArray = [
      // {
      //   name: "VoucherType",
      //   label: "               Voucher Type",
      //   placeholder: "Voucher Type",
      //   type: "radiobutton",
      //   value: [
      //     { value: "Y", name: "Debit Voucher", checked: true },
      //     { value: "N", name: "Credit Voucher" },
      //   ],
      //   Validations: [],
      //   functions: {
      //     onChange: "displayAppointment",
      //   },
      //   generatecontrol: true,
      //   disable: false,
      // },
      {
        name: "VoucherNumber",
        label: "Voucher Number",
        placeholder: "Voucher Number",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "TransactionDate",
        label: "Transaction Date",
        placeholder: "Transaction Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "Preparedfor",
        label: "Prepared for",
        placeholder: "Prepared for",
        type: "Staticdropdown",
        value: [
          {
            value: "Customer",
            name: "Customer",
          },
          {
            value: "Vendor",
            name: "Vendor",
          },
          {
            value: "Employee",
            name: "Employee",
          },
          {
            value: "Driver",
            name: "Driver",
          },
          {
            value: "General",
            name: "General",
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
            message: "Prepared for is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "Paymentstate",
        label: "Payment state",
        placeholder: "Payment state",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Payment state is required"
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
        name: "Preparedby",
        label: "Prepared by",
        placeholder: "Prepared by",
        type: "text",
        value: localStorage.getItem('UserName'),
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Accountinglocation",
        label: "Accounting location",
        placeholder: "Accounting location",
        type: "text",
        value: localStorage.getItem('Branch'),
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        name: "EntryLocation",
        label: "Entry Location",
        placeholder: "Entry Location",
        type: "text",
        value: localStorage.getItem('Branch'),
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "PartyName",
        label: "Party Name",
        placeholder: "Party Name",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Party is required"
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
        name: "Partystate",
        label: "Party state",
        placeholder: "Party state",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Party state is required"
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
        name: "EntryDateandtime",
        label: "Entry Date and time",
        placeholder: "Entry Date and time",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },

    ];
    this.CreditDebitVoucherTaxationTDSArray = [

      {
        name: "TDSSection",
        label: "TDS Section",
        placeholder: "TDS Section",
        type: "Staticdropdown",
        value: [
          {
            value: "Test1",
            name: "Test1",
          },
          {
            value: "Test2",
            name: "Test2",
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
            message: "TDS Section is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: 'TDSRate', label: 'TDS Rate', placeholder: 'TDS Rate', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'TDS Deduction',
          fieldName: "TDSDeduction"
        },
      },


    ];
    this.CreditDebitVoucherTaxationTCSArray = [

      {
        name: "TCSSection",
        label: "TCS Section",
        placeholder: "TCS Section",
        type: "Staticdropdown",
        value: [
          {
            value: "Test1",
            name: "Test1",
          },
          {
            value: "Test2",
            name: "Test2",
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
            message: "TDS Section is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: 'TCSRate', label: 'TCS Rate', placeholder: 'TCS Rate', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'TCS Deduction',
          fieldName: "TCSDeduction"
        },
      },

      // {
      //   name: "TCSRate",
      //   label: "TCS Rate",
      //   placeholder: "TCS Rate",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },

      // {
      //   name: "TCSDeduction",
      //   label: "TCS Deduction",
      //   placeholder: "TCS Deduction",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },

    ];
    this.CreditDebitVoucherTaxationGSTArray = [

      {
        name: 'IGST', label: 'IGST', placeholder: 'IGST', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'UGST',
          fieldName: "UGST"
        },
      },
      {
        name: 'SGST', label: 'SGST', placeholder: 'SGST', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'UGST',
          fieldName: "UGST"
        },
      },

    ];
    this.CreditDebitVoucherTaxationPaymentSummaryArray = [

      {
        name: "PaymentAmount",
        label: "Payment Amount",
        placeholder: "Payment Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: 'Roundoff', label: 'Round off', placeholder: 'Round off', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'Net Payable',
          fieldName: "NetPayable"
        },
      },

      {
        name: "Debitagainstdocument",
        label: "Debit against document",
        placeholder: "Debit against document",
        type: "showhidebutton",
        value: "Click",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: 'NetPayable',
        label: '',
        placeholder: '',
        type: '',
        value: "",
        Validations: [],
        generatecontrol: false, disable: false,
        additionalData: {
          metaData: "NetPayable"
        }
      }

    ];
    this.CreditDebitVoucherTaxationPaymentDetailsArray = [

      {
        name: "PaymentMode",
        label: "Payment Mode",
        placeholder: "Payment Mode",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "Cheque/RefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Bank",
        label: "Bank",
        placeholder: "Bank",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
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
      {
        name: "ScanSupportingdocument",
        label: "Scan Supporting document",
        placeholder: "Scan Supporting document",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "onFileSelected",
        },
      },

    ];

    this.CreditDebitVoucherDocumentDebitsArray = [
      {
        name: "TotalDebit",
        label: "Total Debit",
        placeholder: "Total Debit",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "DocumentType",
        label: "Document Type",
        placeholder: "Document Type",
        type: "Staticdropdown",
        value: [
          {
            value: "Test1",
            name: "Test1",
          },
          {
            value: "Test2",
            name: "Test2",
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
            message: "Document Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },

    ]
  }

  getCreditDebitVoucherSummaryArrayControls() {
    return this.CreditDebitVoucherSummaryArray;
  }
  getCreditDebitVoucherTaxationTDSArrayControls() {
    return this.CreditDebitVoucherTaxationTDSArray;
  }
  getCreditDebitVoucherTaxationTCSArrayControls() {
    return this.CreditDebitVoucherTaxationTCSArray;
  }
  getCreditDebitVoucherTaxationGSTArrayControls() {
    return this.CreditDebitVoucherTaxationGSTArray;
  }
  getCreditDebitVoucherTaxationPaymentSummaryArrayControls() {
    return this.CreditDebitVoucherTaxationPaymentSummaryArray;
  }
  getCreditDebitVoucherTaxationPaymentDetailsArrayControls() {
    return this.CreditDebitVoucherTaxationPaymentDetailsArray;
  }
  getCreditDebitVoucherDocumentDebitsArrayControls() {
    return this.CreditDebitVoucherDocumentDebitsArray;
  }

}
