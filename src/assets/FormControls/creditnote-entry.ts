import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CreditnoteGenerationControls {

  CreditnoteGenerationArray: FormControls[];
  CreditnoteGenerationFormArray:FormControls[];
  creditnotedetail:FormControls[];
    constructor() {
      this.CreditnoteGenerationArray = [
        {
          name: "CustomerName",
          label: "Select Customer",
          placeholder: "Select Customer",
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
            onOptionSelect: "PreparedforFieldChanged"
          },

        },
  
        {
          name: "InvoiceNumber",
          label: "Select Invoice ",
          placeholder: "Select Invoice ",
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
              message: "Invoice is required",
            },
          ],
          additionalData: {
            showNameAndValue: false,
          },
          functions: {
            onChange: "InvoiceNumberChange"
          },
        },

        // {
        //   name: "InvoiceNumber",
        //   label: "Main Category",
        //   placeholder: "Main Category",
        //   type: "dropdown",
        //   value: "",
        //   generatecontrol: true,
        //   disable: false,
        //   Validations: [
        //     {
        //       name: "autocomplete",
        //     },
        //     {
        //       name: "invalidAutocomplete",
        //       message: "Choose proper value",
        //     },
        //   ],
        //   additionalData: {
        //     showNameAndValue: false,
        //   },
        //   functions: {
        //   },
        // },
      ];
     this.CreditnoteGenerationFormArray = [
      // Form Data
      {
          name: "InvoiceDate",
          label: "Invoice Date",
          placeholder: "Invoice Date",
          type: "text",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "InvoiceBranch",
          label: "Invoice Branch",
          placeholder: "Invoice Branch",
          type: "text",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "GSTRate",
          label: "GST Rate",
          placeholder: "GST Rate",
          type: "text",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "InvoiceAmt",
          label: "Invoice Amt",
          placeholder: "Invoice Amt",
          type: "number",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "InvoiceType",
          label: "Invoice Type",
          placeholder: "Invoice Type",
          type: "text",
          value: "Freight Invoice ",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "GSTType",
          label: "GST Type",
          placeholder: "GST Type",
          type: "text",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "PendingAmt",
          label: "Pending Amt",
          placeholder: "Pending Amt",
          type: "number",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "InvoiceStatus",
          label: "Invoice Status",
          placeholder: "Invoice Status",
          type: "text",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "SACCode",
          label: "SAC Code",
          placeholder: "SAC Code",
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
              message: "SAC Code is required",
            },
          ],
          additionalData: {
            showNameAndValue: true,
          },
          functions: {
            onSelection: ""
          },
        },
  ];
  
  this.creditnotedetail  = [
  
      // Form Data 
  
      {
          name: "CreditNoteAmt",
          label: "Credit Note Amount",
          placeholder: "Credit Note Amount",
          type: "number",
          value: 0,
          generatecontrol: true,
          disable: false,
          Validations: [],
          functions: {
            onChange: "AddCrAmount",
        },
        },
        {
          name: "SGSTAmt",
          label: "SGST/UGST Amt ",
          placeholder: "SGST/UGST Amt ",
          type: "number",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "Reason",
          label: "Reason of Credit Note",
          placeholder: "Reason of Credit Note",
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
              message: "Reason of Credit Note is required",
            },
          ],
          additionalData: {
            showNameAndValue: false,
          },
          functions: {
            onSelection: ""
          },
        },
        {
          name: "TaxableAmt",
          label: "Taxable Amount ",
          placeholder: "Taxable Amount ",
          type: "number",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "IGSTAmt",
          label: "GCST/IGST Amt ",
          placeholder: "GCST/IGST Amt ",
          type: "number",
          value: "",
          generatecontrol: true,
          disable: true,
          Validations: [],
        },
        {
          name: "Ledgeraccount",
          label: "Ledger account Code",
          placeholder: "Ledger account Code",
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
              message: "Ledger account Code is required",
            },
          ],
          additionalData: {
            showNameAndValue: true,
          },
          functions: {
            onSelection: ""
          },
        },
        
  ];
    }
  
    getCreditnoteGenerationControls() {
      return this.CreditnoteGenerationArray;
    }
  
    getCreditnoteGenerationFromControls() {
      return this.CreditnoteGenerationFormArray;
    }
    getcreditnotedetailControls(){
      return this.creditnotedetail;
    }

}
