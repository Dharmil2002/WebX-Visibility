import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountGroupControls {
  AccountGroupAddArray: FormControls[];
  constructor(isUpdate ,UpdateData) {
    this.AccountGroupAddArray = [
      {
        name: "GroupCode",
        label: "Group Code",
        placeholder: "System Genreted",
        type: "text",
        value: isUpdate?UpdateData.Groupcode: "System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "AcGroupCat",
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
          onOptionSelect:'getBalanceSheetDropdown'
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
          showNameAndValue: true,
        },
        functions: {
          
        },
      },
      {
        name: "GroupName",
        label: "Account Group Name",
        placeholder: "Account Group Name",
        type: "text",
        value: isUpdate?UpdateData.GroupName: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Group Name is required",
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
        name: 'activeFlag',
        label: 'Active Flag',
        placeholder: 'Active',
        type: 'toggle',
        value: isUpdate ? UpdateData.activeFlag : "",
        generatecontrol: false,
        disable: false,
        Validations: []
      },
      {
        name: "eNTBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: 'eNTDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: 'eNTLOC',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: localStorage.getItem("Branch"), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: 'mODDT',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: new Date(), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
      {
        name: "mODBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: 'mODLOC',
        label: ' ',
        placeholder: ' ',
        type: 'date',
        value: localStorage.getItem("Branch"), // Set the value to the current date
        filterOptions: '',
        autocomplete: '',
        displaywith: '',
        Validations: [],
        generatecontrol: false,
        disable: false
      },
    ];
  }

  getAccountGroupAddArray() {
    return this.AccountGroupAddArray;
  }
}
