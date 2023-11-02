import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountMasterControls {
  AccountQureyArray: FormControls[];
  AccountAddArray: FormControls[];
  AccountGroupAddArray: FormControls[];

  BankFormArray: FormControls[];
  ExpenseFormArray: FormControls[];
  TCSFormArray: FormControls[];
  TDSFormArray: FormControls[];

  constructor(isUpdate) {
    this.AccountQureyArray = [
      // {
      //   name: "RadioAccountCode",
      //   label: "",
      //   placeholder: "",
      //   type: "radiobutton",
      //   value: [
      //     {
      //       value: "CompanyAccount",
      //       name: "Company Account Code",
      //       checked: true,
      //     },
      //     { value: "SystemAccount", name: "System Account Code" },
      //   ],
      //   Validations: [],
      //   generatecontrol: true,
      //   disable: false,
      //   functions: {
      //       onChange:'SelectAccountCode'
      //   },
      // },
      // {
      //   name: "temp",
      //   label: "",
      //   placeholder: "",
      //   type: "",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      {
        name: "AccountCode",
        label: "Company Account Code",
        placeholder: "Please Enter Company Account Code",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      // {
      //   name: "temp",
      //   label: "",
      //   placeholder: "",
      //   type: "",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      // {
      //   name: "temp",
      //   label: "",
      //   placeholder: "",
      //   type: "OR",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
      // {
      //   name: "temp",
      //   label: "",
      //   placeholder: "",
      //   type: "",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },

      {
        name: "MainCategory",
        label: "Main Category",
        placeholder: "Main Category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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
          onOptionSelect: "getGroupCodeDropdown",
        },
      },
      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "Group Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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

    this.AccountAddArray = [
      {
        name: "AccountCode",
        label: "Account Code",
        placeholder: "System Genreted",
        type: "text",
        value: "System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "MainCategory",
        label: "Main Category",
        placeholder: "Main Category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Main Category is required",
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
          onOptionSelect: "getGroupCodeDropdown",
        },
      },

      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "Group Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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

      {
        name: "Locations",
        label: "Applicable Accounting Locations",
        placeholder: "Search and select Locations",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "LocationsDrop",
          showNameAndValue: true,
          Validations: [],
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },

      {
        name: "AccountDescription",
        label: "Account Description",
        placeholder: "Account Description",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Description is required",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onChange: "getAccountDescription",
        },
      },

      {
        name: "AccountCategory",
        label: "Account Category",
        placeholder: "Account Category",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Category is required",
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
          onOptionSelect: "HandlAccountCategory",
        },
      },

      {
        name: "PartySelection",
        label: "Party Selection",
        placeholder: "Party Selection",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Party Selection is required",
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
        name: "ActiveFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: false,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "LocationsDrop",
        label: "Locations",
        placeholder: "Select CustomerLocations",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];

    this.AccountGroupAddArray = [
      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "System Genreted",
        type: "text",
        value: "System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "CategoryCode",
        label: "Category Code",
        placeholder: "Category Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Category Code is required",
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
          onOptionSelect: "getGroupCodeTypeDropdown",
        },
      },

      {
        name: "GroupCodeType",
        label: "Perent Group Code",
        placeholder: "Perent Group Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Perent Group Code is required",
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
      {
        name: "GroupName",
        label: "Group Name",
        placeholder: "Group Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Group Name is required",
          },
        ],
        functions: {
          onChange: "GetGroupName",
        },
      },
    ];

    this.BankFormArray = [
      {
        name: "AccountNumber",
        label: "Account Number",
        placeholder: "Account Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Number is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric length 8",
            pattern: '^[0-9]{8}$',
        }
        ],
        functions: {},
      },
      {
        name: "AccountLocations",
        label: "Applicable to Locations",
        placeholder: "Applicable to Locations",
        type: "multiselect",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "AccountLocationsDrop",
          showNameAndValue: true,
          Validations: [],
        },
        functions: {
          onToggleAll: "toggleSelectAccountLocationsAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "AccountLocationsDrop",
        label: "AccountLocations",
        placeholder: "Select CustomerLocations",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];
    this.ExpenseFormArray = [
      {
        name: "isTDSApplicable",
        label: "TDS Applicable",
        placeholder: "",
        type: "toggle",
        value: false,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "isTDSMapping",
        label: "TDSLedger Mapping",
        placeholder: "",
        type: "toggle",
        value: false,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "HandleisTDSMapping",
      },
      },
      {
        name: "Ddl_TDS_Mapping",
        label: "DdlTDS Ledger Mapping",
        placeholder: "DdlTDS Ledger Mapping",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "DdlTDS Ledger Mapping is required",
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
      },
    ];
    this.TCSFormArray = [
      {
        name: "NonCorporateTCS",
        label: "Non Corporate TCS Rate",
        placeholder: "Non Corporate TCS Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Non Corporate TCS Rate is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Ex: 00.00",
            pattern: "^[0-9]{1,2}(.[0-9]{2})?$",
          },
        ],
        functions: {
        },
      },
      {
        name: "CorporateTCS",
        label: "Corporate TCS Rate",
        placeholder: "Corporate TCS Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Corporate TCS Rate is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Ex: 00.00",
            pattern: "^[0-9]{1,2}(.[0-9]{2})?$",
          },
        ],
        functions: {
        },
      },
    ];
    this.TDSFormArray = [
      {
        name: "NonCorporateTDS",
        label: "Non Corporate TDS Rate",
        placeholder: "Non Corporate TDS Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Non Corporate TDS Rate is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Ex: 00.00",
            pattern: "^[0-9]{1,2}(.[0-9]{2})?$",
          },
        ],
        functions: {
        },
      },
      {
        name: "CorporateTDS",
        label: "Corporate TDS Rate",
        placeholder: "Corporate TDS Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Corporate TDS Rate is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric Ex: 00.00",
            pattern: "^[0-9]{1,2}(.[0-9]{2})?$",
          },
        ],
        functions: {
        },
      },
    ];
  }
  getAccountQureyArray() {
    return this.AccountQureyArray;
  }
  getAccountAddArray() {
    return this.AccountAddArray;
  }
  getAccountGroupAddArray() {
    return this.AccountGroupAddArray;
  }

  getAccountCategoryArray(name) {
    if (name == "BANK") {
      return this.BankFormArray;
    } else if (name == "EXPENSE") {
      return this.ExpenseFormArray;
    } else if (name == "TCS") {
      return this.TCSFormArray;
    } else if (name == "TDS") {
      return this.TDSFormArray;
    }
  }
}
