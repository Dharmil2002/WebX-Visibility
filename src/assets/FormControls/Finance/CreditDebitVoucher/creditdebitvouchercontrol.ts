import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditDebitVoucherControl {
  CreditDebitVoucherSummaryArray: FormControls[];
  CreditDebitVoucherTaxationTDSArray: FormControls[];
  CreditDebitVoucherTaxationTCSArray: FormControls[];
  CreditDebitVoucherTaxationGSTArray: FormControls[];
  constructor() {
    this.CreditDebitVoucherSummaryArray = [
      {
        name: "VoucherType",
        label: "               Voucher Type",
        placeholder: "Voucher Type",
        type: "radiobutton",
        value: [
          { value: "Y", name: "Debit Voucher", checked: true },
          { value: "N", name: "Credit Voucher" },
        ],
        Validations: [],
        functions: {
          onChange: "displayAppointment",
        },
        generatecontrol: true,
        disable: false,
      },
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
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Preparedby",
        label: "Prepared by",
        placeholder: "Prepared by",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Accountinglocation",
        label: "Accounting location",
        placeholder: "Accounting location",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "EntryLocation",
        label: "Entry Location",
        placeholder: "Entry Location",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "PartyName",
        label: "Party Name",
        placeholder: "Party Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "Partystate",
        label: "Party state",
        placeholder: "Party state",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
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
        name: "TDSRate",
        label: "TDS Rate",
        placeholder: "TDS Rate",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "TDSDeduction",
        label: "TDS Deduction",
        placeholder: "TDS Deduction",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
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
        name: "TCSRate",
        label: "TCS Rate",
        placeholder: "TCS Rate",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "TCSDeduction",
        label: "TCS Deduction",
        placeholder: "TCS Deduction",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

    ];
    this.CreditDebitVoucherTaxationGSTArray = [

      {
        name: "IGST",
        label: "IGST",
        placeholder: "IGST",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "UGST",
        label: "UGST",
        placeholder: "UGST",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "SGST",
        label: "SGST",
        placeholder: "SGST",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "UGST",
        label: "CGST",
        placeholder: "CGST",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },



    ];
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

}
