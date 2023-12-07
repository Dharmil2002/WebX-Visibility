import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountControls {
  AccountArray: FormControls[];
  constructor(isUpdate ,UpdateData) {
    this.AccountArray = [
      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "System Genreted",
        type: "text",
        value: isUpdate? UpdateData.AcLedgerCode:"System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "AcGroupCategory",
        label: "Account Group Category",
        placeholder: "Account Group Category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Account Group Category is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect:'getAcGroupDropdown'
        },
      },

      
      {
        name: "AcGroup",
        label: "Account Group",
        placeholder: "Account Group",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Group is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          
        },
      },
      {
        name: "BalanceSheet",
        label: "Balance Sheet category",
        placeholder: "Balance Sheet category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Balance Sheet category is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {},
      },
      {
        name: "AcLedger",
        label: "Account Ledger ",
        placeholder: "Account Ledger ",
        type: "text",
        value: isUpdate? UpdateData.AcLedger:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Ledger  is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric length 4 to 200",
            pattern: "^[a-zA-Z0-9 ]{4,200}$",
          },
        ],
        functions: {
        },
      },
      {
        name: "isSystemledger",
        label: "System ledger",
        placeholder: "",
        type: "toggle",
        value: isUpdate? UpdateData.isSystemledger:false,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "isTDSapplicable",
        label: "TDS applicable",
        placeholder: "",
        type: "toggle",
        value: isUpdate? UpdateData.isTDSapplicable:false,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "toggleTDSExempted",
        },
      },
      {
        name: "TDSsection",
        label: "TDS section category",
        placeholder: "TDS section category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "TDS section category is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {},
      },
    ];
  }

  getAccountArray() {
    return this.AccountArray;
  }
}
