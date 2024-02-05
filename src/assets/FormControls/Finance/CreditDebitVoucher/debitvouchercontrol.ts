import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DebitVoucherControl {
  DebitVoucherSummaryArray: FormControls[];
  DebitVoucherTaxationTDSArray: FormControls[];
  DebitVoucherTaxationTCSArray: FormControls[];
  DebitVoucherTaxationGSTArray: FormControls[];
  DebitVoucherTaxationPaymentSummaryArray: FormControls[];
  DebitVoucherTaxationPaymentDetailsArray: FormControls[];
  DebitVoucherDocumentDebitsArray: FormControls[];
  DebitVoucherDetailsArray: FormControls[];
  DebitAgainstDocumentArray: FormControls[];
  constructor(FormValues) {
    this.DebitVoucherSummaryArray = [

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
        disable: true,
        Validations: [],
      },

      {
        name: "Accountinglocation",
        label: "Accounting location",
        placeholder: "Accounting location",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Accounting location is required"
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
          onOptionSelect: "AccountinglocationFieldChanged"
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
          onOptionSelect: "PartyNameFieldChanged",
          onChange: "PartyNameFieldChanged"
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
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      // {
      //   name: "Paymentstate",
      //   label: "Payment state",
      //   placeholder: "Payment state",
      //   type: "dropdown",
      //   value: "",
      //   filterOptions: "",
      //   displaywith: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "Payment state is required"
      //     },
      //     {
      //       name: "invalidAutocompleteObject",
      //       message: "Choose proper value",
      //     },
      //     {
      //       name: "autocomplete",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: false,
      //     metaData: "Basic"
      //   },
      //   functions: {
      //     onOptionSelect: "StateChange"
      //   },
      // },



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
        type: "datetimerpicker",
        value: new Date(),
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "PANnumber",
        label: "PAN No",
        placeholder: "PAN No",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          },
        ],
      },

    ];
    this.DebitVoucherTaxationTDSArray = [

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
          onOptionSelect: "TDSSectionFieldChanged"
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
        generatecontrol: true,
        disable: true,
        additionalData: {
          metaData: "Basic",
          label: 'TDS Deduction ₹',
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
        label: "TDS Deduction ₹",
        placeholder: "TDS Deduction ₹",
        type: "number",
        value: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },




    ];
    this.DebitVoucherTaxationTCSArray = [

      {
        name: "TCSSection",
        label: "TCS Section",
        placeholder: "TCS Section",
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
          showNameAndValue: true,
          metaData: "Basic"
        },
        functions: {
          onOptionSelect: "TCSSectionFieldChanged"
        },
      },


      {
        name: 'TCSRate', label: 'TCS Rate %', placeholder: 'TCS Rate', type: 'dayhour',
        value: "",
        Validations: [], generatecontrol: true, disable: true,
        additionalData: {
          metaData: "Basic",
          label: 'TCS Deduction ₹',
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
    this.DebitVoucherTaxationGSTArray = [

      {
        name: "IGST",
        label: "IGST ₹",
        placeholder: "IGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "UGST",
        label: "UGST ₹",
        placeholder: "UGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "SGST",
        label: "SGST ₹",
        placeholder: "SGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "CGST",
        label: "CGST ₹",
        placeholder: "CGST ₹",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      // {
      //   name: 'SGST', label: 'SGST ₹', placeholder: 'SGST ₹', type: 'dayhour',
      //   value: "",
      //   Validations: [], generatecontrol: true, disable: false,
      //   additionalData: {
      //     metaData: "Basic",
      //     label: 'CGST ₹',
      //     fieldName: "CGST",
      //     disable: true,
      //   },
      // },
      // {
      //   name: 'CGST',
      //   label: '',
      //   placeholder: '',
      //   type: '',
      //   value: "",
      //   Validations: [],
      //   generatecontrol: false, disable: false,
      //   additionalData: {
      //     metaData: "CGST"
      //   }
      // }
    ];
    this.DebitVoucherTaxationPaymentSummaryArray = [



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


    ];
    this.DebitVoucherTaxationPaymentDetailsArray = [
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
      {
        name: "ScanSupportingdocument",
        label: "Scan Supporting document",
        placeholder: "",
        type: "file",
        value: "",
        Validations: [],
        additionalData: {
          isFileSelected: true
        },
        functions: {
          onChange: "selectFileScanDocument",
        },
        generatecontrol: true,
        disable: false,
      },
      // {
      //   name: "ScanSupportingdocument",
      //   label: "Scan Supporting document",
      //   placeholder: "Scan Supporting document",
      //   type: "file",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      //   functions: {
      //     onChange: "onFileSelected",
      //   },
      // },

    ];

    this.DebitVoucherDocumentDebitsArray = [

      {
        name: "DocumentType",
        label: "Document Type",
        placeholder: "Document Type",
        type: "dropdown",
        value: "",
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
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "DocumentFieldChanged"
        },
      },
      //{
      //   name: "TotalDebit",
      //   label: "Total Debit ₹",
      //   placeholder: "Total Debit ₹",
      //   type: "number",
      //   value: "",
      //   generatecontrol: true,
      //   disable: true,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "TotalDebit is required",
      //     },
      //   ],
      // },

    ]
    this.DebitVoucherDetailsArray = [
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
        functions: {
          onOptionSelect: "SACCodeFieldChanged"
        },
      },
      {
        name: "DebitAmount",
        label: "Debit Amount ₹",
        placeholder: "Debit Amount ₹",
        type: "number",
        value: FormValues?.DebitAmount,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Debit Amount is required!",
          },
          {
            name: "pattern",
            message: "Please Enter Valid Debit Amount",
            pattern: '^[^-]+$'
          },
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
        disable: true,
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
        label: "GST Amount ₹",
        placeholder: "GST Amount ₹",
        type: "number",
        value: FormValues?.GSTAmount,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Total",
        label: "Total ₹",
        placeholder: "Total ₹",
        type: "number",
        value: FormValues?.Total,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        name: "Narration",
        label: "Narration",
        placeholder: "Narration",
        type: "text",
        value: FormValues?.Narration,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Narration is required!",
          },
        ]

      },
      {
        name: "TDSApplicable",
        label: "TDS Applicable",
        placeholder: "TDS Applicable",
        type: "toggle",
        value: FormValues?.TDSApplicable == "Yes" ? true : false,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "LedgerHdn",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "SACCodeHdn",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
      {
        name: "SubCategoryName",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ]

    this.DebitAgainstDocumentArray = [
      {
        name: "DocumentType",
        label: "DocumentType",
        placeholder: "DocumentType",
        type: "text",
        value: FormValues?.DocumentType,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },

      {
        name: "Document",
        label: "Document",
        placeholder: "Document",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Document is required"
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
          onModel: 'SetDocumentOptions',
        },
      },
      {
        name: "DebitAmountAgaintsDocument",
        label: "DebitAmount ₹",
        placeholder: "DebitAmount ₹",
        type: "number",
        value: FormValues?.DebitAmountAgaintsDocument,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "DebitAmount is required",
          },
          {
            name: "max",
            message: "Value exceeds the maximum allowed amount.",
          },
        ],
        functions: {
          onModel: "DebitAmountAgaintsDocumentChange"
        },
      },
      {
        name: "DocumentHdn",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ]
  }

  getDebitVoucherSummaryArrayControls() {
    return this.DebitVoucherSummaryArray;
  }
  getDebitVoucherTaxationTDSArrayControls() {
    return this.DebitVoucherTaxationTDSArray;
  }
  getDebitVoucherTaxationTCSArrayControls() {
    return this.DebitVoucherTaxationTCSArray;
  }
  getDebitVoucherTaxationGSTArrayControls() {
    return this.DebitVoucherTaxationGSTArray;
  }
  getDebitVoucherTaxationPaymentSummaryArrayControls() {
    return this.DebitVoucherTaxationPaymentSummaryArray;
  }
  getDebitVoucherTaxationPaymentDetailsArrayControls() {
    return this.DebitVoucherTaxationPaymentDetailsArray;
  }
  getDebitVoucherDocumentDebitsArrayControls() {
    return this.DebitVoucherDocumentDebitsArray;
  }
  getDebitVoucherDetailsArrayControls() {
    return this.DebitVoucherDetailsArray;
  }
  getDebitAgainstDocumentArrayControls() {
    return this.DebitAgainstDocumentArray;
  }
}
