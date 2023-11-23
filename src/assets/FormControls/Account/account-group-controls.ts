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
    ];
  }

  getAccountGroupAddArray() {
    return this.AccountGroupAddArray;
  }
}
