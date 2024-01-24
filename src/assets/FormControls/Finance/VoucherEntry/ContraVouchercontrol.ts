import { FormControls } from 'src/app/core/models/FormControl/formcontrol';

export class ContraVoucherControl {
  ContraVoucherSummaryArray: FormControls[];
  ContraVoucherPaymentArray: FormControls[];

  constructor(FormValues) {
    this.ContraVoucherSummaryArray = [

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
        name: "ManualNumber",
        label: "Manual Number",
        placeholder: "Manual Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [

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

        ],
      },
      {
        name: "Narration",
        label: "Narration",
        placeholder: "Narration",
        type: "text",
        value: "",
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


    ];
    this.ContraVoucherPaymentArray = [

      {
        name: "FromPaymentMode",
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
        name: "FromAccountCode",
        label: "Account Code ",
        placeholder: "Account Code ",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Code is required"
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
        name: "FromDebitAmount",
        label: "Debit Amount ₹",
        placeholder: "Debit Amount ₹",
        type: "number",
        value: 0,
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
        name: "FromCreditAmount",
        label: "Credit Amount ₹",
        placeholder: "Credit Amount ₹",
        type: "number",
        value: 0,
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
        name: "FromChequeOrRefNo",
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
        name: "FromDate",
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
        name: "ToPaymentMode",
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
        name: "ToAccountCode",
        label: "Account Code ",
        placeholder: "Account Code ",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Code is required"
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
        name: "ToDebitAmount",
        label: "Debit Amount ₹",
        placeholder: "Debit Amount ₹",
        type: "number",
        value: 0,
        generatecontrol: true,
        disable: true,
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

      },
      {
        name: "ToCreditAmount",
        label: "Credit Amount ₹",
        placeholder: "Credit Amount ₹",
        type: "number",
        value: 0,
        generatecontrol: true,
        disable: true,
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

      },
      {
        name: "ToChequeOrRefNo",
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
        name: "ToDate",
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
    ];


  }

  getContraVoucherSummaryArrayControls() {
    return this.ContraVoucherSummaryArray;
  }
  getContraVoucherPaymentArrayControls() {
    return this.ContraVoucherPaymentArray;
  }

}
