import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditDebitVoucherControl {
  CreditDebitVoucherSummaryArray: FormControls[];
  CreditDebitVoucherTaxationTDSArray: FormControls[];
  CreditDebitVoucherTaxationTCSArray: FormControls[];
  CreditDebitVoucherTaxationGSTArray: FormControls[];
  CreditDebitVoucherTaxationPaymentSummaryArray: FormControls[];
  CreditDebitVoucherTaxationPaymentDetailsArray: FormControls[];
  CreditDebitVoucherDocumentDebitsArray: FormControls[];
  CreditDebitVoucherDetailsArray: FormControls[];
  constructor(FormValues) {
    this.CreditDebitVoucherSummaryArray = [

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
        functions: {
          onSelection: "PreparedforFieldChanged"
        },
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
        functions: {
          onOptionSelect: "PartyNameFieldChanged"
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
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "StateChange"
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
          showNameAndValue: false,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "StateChange"
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
        name: "EntryDateandtime",
        label: "Entry Date and time",
        placeholder: "Entry Date and time",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: true,
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
        name: 'TDSRate', label: 'TDS Rate %', placeholder: 'TDS Rate', type: 'dayhour',
        value: "",
        Validations: [
          {
            name: "pattern",
            message: "Please Enter Valid TDS Rate",
            pattern: '^(100|[0-9]{1,2})$'
          },
        ],
        functions: {
          onChange: "calculateTDSAndTotal"
        },
        generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'TDS Deduction',
          fieldName: "TDSDeduction",
          disable: true,
        },
      },

      // {
      //   name: "TDSRate",
      //   label: "TDS Rate %",
      //   placeholder: "TDS Rate",
      //   type: "number",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "pattern",
      //       message: "Please Enter Valid TDS Rate",
      //       pattern: '^(100|[0-9]{1,2})$'
      //     },
      //   ],
      //   functions: {
      //     onChange: "calculateTDSAndTotal"
      //   },
      // },

      {
        name: "TDSDeduction",
        label: "TDS Deduction",
        placeholder: "TDS Deduction",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
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
          fieldName: "TCSDeduction",
          disable: true,
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

      {
        name: "TCSDeduction",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },

    ];
    this.CreditDebitVoucherTaxationGSTArray = [

      {
        name: "IGST",
        label: "IGST",
        placeholder: "IGST",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "UGST",
        label: "UGST",
        placeholder: "UGST",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: 'SGST', label: 'SGST', placeholder: 'SGST', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: false,
        additionalData: {
          metaData: "Basic",
          label: 'CGST',
          fieldName: "CGST",
          disable: true,
        },
      },
      {
        name: 'CGST',
        label: '',
        placeholder: '',
        type: '',
        value: "",
        Validations: [],
        generatecontrol: false, disable: false,
        additionalData: {
          metaData: "CGST"
        }
      }
    ];
    this.CreditDebitVoucherTaxationPaymentSummaryArray = [


      {
        name: 'PaymentAmount', label: 'Payment Amount', placeholder: 'Payment Amount', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: true,
        additionalData: {
          metaData: "Basic",
          label: 'Net Payable',
          fieldName: "NetPayable",
          disable: false,
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
        type: 'number',
        value: "",
        Validations: [],
        generatecontrol: false, disable: true,
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
        type: "Staticdropdown",
        value: [
          {
            value: "Bank",
            name: "Bank",
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
    this.CreditDebitVoucherDetailsArray = [
      {
        name: "Ledger",
        label: "Ledger",
        placeholder: "Ledger",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Ledger is required"
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
        name: "SACCode",
        label: "SAC Code",
        placeholder: "SAC Code",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "SAC Code is required"
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
        name: "DebitAmount",
        label: "Debit Amount",
        placeholder: "Debit Amount",
        type: "number",
        value: FormValues?.DebitAmount,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Debit Amount is required!",
          },
          // {
          //   name: "pattern",
          //   message: "Please Enter Valid Debit Amount",
          //   pattern: '^\d+(\.\d{1,2})?$'
          // },
        ],
        functions: {
          onChange: "calculateGSTAndTotal"
        },
      },
      {
        name: "GSTRate",
        label: "GST Rate",
        placeholder: "GST Rate",
        type: "number",
        value: FormValues?.GSTRate,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST Rate is required!",
          },
          {
            name: "pattern",
            message: "Please Enter Valid GST Rate",
            pattern: '^(100|[0-9]{1,2})$'
          },
        ],
        functions: {
          onChange: "calculateGSTAndTotal"
        },
      },
      {
        name: "GSTAmount",
        label: "GST Amount",
        placeholder: "GST Amount",
        type: "number",
        value: FormValues?.GSTAmount,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Total",
        label: "Total",
        placeholder: "Total",
        type: "number",
        value: FormValues?.Total,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      // {
      //   name: "TDSApplicable",
      //   label: "TDS Applicable",
      //   placeholder: "TDS Applicable",
      //   type: "toggle",
      //   value: FormValues?.TDSApplicable == "Yes" ? true : false,
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      {
        name: "Narration",
        label: "Narration",
        placeholder: "Narration",
        type: "text",
        value: FormValues?.Narration,
        generatecontrol: true,
        disable: false,
        Validations: [],
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
  getCreditDebitVoucherDetailsArrayControls() {
    return this.CreditDebitVoucherDetailsArray;
  }
}
