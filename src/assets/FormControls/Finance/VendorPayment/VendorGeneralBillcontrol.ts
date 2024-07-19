import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { StoreKeys } from "src/app/config/myconstants";
import * as StorageService from "src/app/core/service/storage.service";

export class VendorGeneralBillControl {
  VendorBillSummaryArray: FormControls[];
  VendorBillDetailsArray: FormControls[];
  DebitAgainstDocumentArray: FormControls[];
  VendorBillTaxationTDSArray: FormControls[];
  VendorBillTaxationGSTArray: FormControls[];
  constructor(FormValues) {
    this.VendorBillSummaryArray = [

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
        name: "VendorBillDate",
        label: "Vendor Bill Date",
        placeholder: "Vendor Bill Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          //minDate: new Date(),
        },
      },
      {
        name: "DueDate",
        label: "Due Date",
        placeholder: "Due Date",
        type: "date",
        value: new Date(Math.min(Date.now() + (15 * 24 * 60 * 60 * 1000), new Date().getTime())),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(), // Set the minimum date to the current date
        },
      },
      {
        name: "VendorName",
        label: "VendorName",
        placeholder: "Vendor Name",
        type: "text",
        value: `${FormValues.VendorCode}:${FormValues.VendorName}`,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "VendorPANNumber",
        label: "Vendor PAN Number",
        placeholder: "Vendor PAN Number",
        type: "text",
        value: FormValues.VendorPan,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "VendorManualBillNo",
        label: "Vendor Manual Bill No",
        placeholder: "Vendor Manual Bill No",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

      {
        name: "VendorManualBillDate",
        label: "Vendor Manual Bill Date",
        placeholder: "Vendor Manual Bill Date",
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
        name: "DocumentSelection",
        label: "Document Selection",
        placeholder: "Document Selection",
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
            message: "Document Selection is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onSelection: "OnDocumentSelectionChange"
        },
      },


    ];

    this.VendorBillDetailsArray = [
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
        name: "Amount",
        label: "Amount ₹",
        placeholder: "Amount ₹",
        type: "number",
        value: FormValues?.Amount,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Amount is required!",
          },
          {
            name: "pattern",
            message: "Please Enter Valid Amount",
            pattern: '^[^-]+$'
          },
        ],
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
        name: "SubCategoryName",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
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
    this.VendorBillTaxationTDSArray = [
      {
        name: "TDSExempted",
        label: "TDS Exempted",
        placeholder: "TDS Exempted",
        type: "toggle",
        value: false,
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
    this.VendorBillTaxationGSTArray = [
      {
        name: "VendorGSTRegistered",
        label: "Vendor GST Registered",
        placeholder: "Vendor GST Registered",
        type: "toggle",
        value: FormValues?.VendorGSTRegistered == "Yes" ? true : false,
        generatecontrol: true,
        disable: false,
        functions: {
          onChange: "toggleVendorGSTRegistered",
        },
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
          // {
          //   name: "required",
          //   message: "GST SAC code is required",
          // },
          // {
          //   name: "invalidAutocompleteObject",
          //   message: "Choose proper value",
          // },
          // {
          //   name: "autocomplete",
          // },
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
          // {
          //   name: "required",
          //   message: "Bill booking state is required",
          // },
          // {
          //   name: "invalidAutocompleteObject",
          //   message: "Choose proper value",
          // },
          // {
          //   name: "autocomplete",
          // },
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
          // {
          //   name: "required",
          //   message: "Vendor bill state is required",
          // },
          // {
          //   name: "invalidAutocompleteObject",
          //   message: "Choose proper value",
          // },
          // {
          //   name: "autocomplete",
          // },
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


  }

  getVendorBillSummaryArrayControls() {
    return this.VendorBillSummaryArray;
  }

  getVendorBillDetailsArrayControls() {
    return this.VendorBillDetailsArray;
  }

  getVendorBillTaxationTDSArrayControls() {
    return this.VendorBillTaxationTDSArray;
  }
  getVendorBillTaxationGSTArrayControls() {
    return this.VendorBillTaxationGSTArray;
  }
}
