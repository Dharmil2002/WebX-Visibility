import { FormControls } from 'src/app/core/models/FormControl/formcontrol';

export class JournalVoucherControl {
  JournalVoucherSummaryArray: FormControls[];
  JournalVoucherDetailsArray: FormControls[];

  constructor(FormValues) {
    this.JournalVoucherSummaryArray = [

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
        name: "ManualNumber",
        label: "Manual Number",
        placeholder: "Manual Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          // {
          //   name: "pattern",
          //   pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
          //   message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          // },
        ],
      },
      {
        name: "ReferenceNumber",
        label: "Reference Number",
        placeholder: "Reference Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          // {
          //   name: "pattern",
          //   pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
          //   message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          // },
        ],
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
          maxDate: new Date(),
        },
      },
      {
        name: "PANnumber",
        label: "PAN No",
        placeholder: "PAN No",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [

        ],
      },

    ];
    this.JournalVoucherDetailsArray = [
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
          onChange: "onChangeAmount"
        },

      },
      {
        name: "CreditAmount",
        label: "Credit Amount ₹",
        placeholder: "Credit Amount ₹",
        type: "number",
        value: FormValues?.CreditAmount,
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
          onChange: "onChangeAmount"
        },
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
        name: "SubLedger",
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

  getJournalVoucherSummaryArrayControls() {
    return this.JournalVoucherSummaryArray;
  }
  getJournalVoucherDetailsArrayControls() {
    return this.JournalVoucherDetailsArray;
  }
}
