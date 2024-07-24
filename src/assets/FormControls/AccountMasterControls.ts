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
          onOptionSelect: "GetBalanceCategoryDropdown",
        },
      },
      {
        name: "BalanceGategory",
        label: "Balance Category",
        placeholder: "Balance Category",
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
        functions: {
          onOptionSelect: "GetGroupCodeDropdown",
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
        functions: {
          onOptionSelect: "GetCategoryDropdown",
        },
      },
      {
        name: "Category",
        label: "Account Category",
        placeholder: "Account Category",
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
        functions: {
          onOptionSelect: "getAccountDropdown",
        },
      },
      {
        name: "AccountCode",
        label: "Account Code",
        placeholder: "Please Select Account Code",
        type: "multiselect",
        value: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "AccountCodeDropdown",
          showNameAndValue: true,
          Validations: [
          ],
        },
        functions: {
          onToggleAll: "toggleSelectAll",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "AccountCodeDropdown",
        label: "Account Code",
        placeholder: "Account Code",
        type: "",
        value: [],
        Validations: [
        ],
        generatecontrol: false,
        disable: false,
      },
    ];

    this.AccountAddArray = [
      {
        name: "AccountCode",
        label: "Account Code",
        placeholder: "System Generated",
        type: "text",
        value: "System Generated",
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
          onOptionSelect: "GetGroupCodeDropdown",
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
          showNameAndValue: true,
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
        name: "bank",
        label: "Bank Details",
        placeholder: "Select Bank",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,//isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Bank Details is required",
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
        // functions: {
        //   onOptionSelect: "GetGroupCodeDropdown",
        // },
      },
      {
        name: "isTDSapplicable",
        label: "TDS applicable",
        placeholder: "",
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
        name: "TDSsection",
        label: "TDS Details",
        placeholder: "Select TDS Details",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,//isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "TDS Details is required",
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
        // functions: {
        //   onOptionSelect: "GetGroupCodeDropdown",
        // },
      },

      // {
      //   name: "LocationsDrop",
      //   label: "Locations",
      //   placeholder: "Select CustomerLocations",
      //   type: "",
      //   value: "",
      //   Validations: [],
      //   generatecontrol: false,
      //   disable: false,
      // },
      {
        name: "bSSCH",
        label: "BS Schedule",
        placeholder: "BS Schedule",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          // {
          //   name: "required",
          //   message: "BS Schedule is required",
          // },
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
        value: true,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ];

    this.AccountGroupAddArray = [
      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "System Generated",
        type: "text",
        value: "System Generated",
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
          // {
          //   name: "required",
          //   message: "Perent Group Code is required",
          // },
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
    ];

    this.BankFormArray = [];

    this.ExpenseFormArray = [];

    this.TCSFormArray = [];

    this.TDSFormArray = [];
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


}
