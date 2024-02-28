import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class InvoiceCollectionControl {
  CustomerGSTArray: FormControls[];
  CollectionSummaryArray: FormControls[];
  DebitVoucherTaxationPaymentSummaryArray: FormControls[];
  DebitVoucherTaxationPaymentDetailsArray: FormControls[];
  constructor() {
    this.CustomerGSTArray = [
      {
        name: "customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "collectionDate",
        label: "Collection Date",
        placeholder: "Collection Date",
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
      //   name: "onAccountbalance",
      //   label: "On Account balance",
      //   placeholder: "On Account balance",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: true,
      //   Validations: [],
      // },
    ];
    this.CollectionSummaryArray = [
      {
        name: "collectionMode",
        label: "Collection Mode",
        placeholder: "Collection Mode",
        type: "Staticdropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "bank",
        label: "Bank",
        placeholder: "Bank",
        type: "Staticdropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "chequeRefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "date",
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
      //   name: "onAccount",
      //   label: "On Account",
      //   placeholder: "On Account",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      // {
      //   name: "onAccountAmount",
      //   label: "On Account Amount",
      //   placeholder: "On Account Amount",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      {
        name: "collectionTotal",
        label: "Collection Total",
        placeholder: "Collection Total",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      // {
      //   name: "Onaccountbalance",
      //   label: "On Account Balance",
      //   placeholder: "On Account Balance",
      //   type: "text",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
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


    ];
  }

  getCustomerGSTArrayControls() {
    return this.CustomerGSTArray;
  }
  getCollectionSummaryArrayControls() {
    return this.CollectionSummaryArray;
  }
  getDebitVoucherTaxationPaymentSummaryArrayControls() {
    return this.DebitVoucherTaxationPaymentSummaryArray;
  }
  getDebitVoucherTaxationPaymentDetailsArrayControls() {
    return this.DebitVoucherTaxationPaymentDetailsArray;
  }
}
