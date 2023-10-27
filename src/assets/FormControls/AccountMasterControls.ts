import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountMasterControls {
  AccountQureyArray: FormControls[];
  AccountAddArray: FormControls[];
  AccountGroupAddArray: FormControls[];


  constructor() {
    this.AccountQureyArray = [
      {
        name: "RadioAccountCode",
        label: "",
        placeholder: "",
        type: "radiobutton",
        value: [
          {
            value: "CompanyAccount",
            name: "Company Account Code",
            checked: true,
          },
          { value: "SystemAccount", name: "System Account Code" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
        functions: {
            onChange:'SelectAccountCode'
        },
      },
      {
        name: "temp",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
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
      {
        name: "temp",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "temp",
        label: "",
        placeholder: "",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "temp",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },

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
          onOptionSelect:"getGroupCodeDropdown"
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
        disable: false,
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
          onOptionSelect:'getGroupCodeDropdown'
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
            name: "required",
            message: "Group Code is required",
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
          onChange:'getAccountDescription'
        },
      },

      {
        name: "CompanyName",
        label: "Company Name",
        placeholder: "Company Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Company Name is required",
          },
        ],
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
      
    ]

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
        disable: false,
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
          onOptionSelect:'getGroupCodeTypeDropdown'
        },
      },

      {
        name: "GroupCodeType",
        label: "Group Code",
        placeholder: "Group Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Group Code is required",
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
          onChange:'GetGroupName'
        },
      },
    ]
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
