import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountBankControls {
  AccountBankArray: FormControls[];
  constructor(isUpdate, UpdateData) {
    this.AccountBankArray = [
      {
        name: "BankCode",
        label: "Bank Code",
        placeholder: "System Genreted",
        type: "text",
        value: isUpdate ? UpdateData.Bankcode : "System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "Bankname",
        label: "Bank name",
        placeholder: "Bank name",
        type: "dropdown",
        value: isUpdate ? UpdateData.Bankname : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bank name is required",
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
        name: "Accountnumber",
        label: "Account number",
        placeholder: "Account number",
        type: "text",
        value: isUpdate ? UpdateData.Accountnumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account number is required",
          },
          {
            name: "pattern",
            message: "Please Enter Numeric length 10 to 15",
            pattern: "^[0-9]{10,15}$",
          },
        ],
        functions: {
          onChange: "CheckAccountnumber",
        },
      },
      {
        name: "IFSCcode",
        label: "IFSC code",
        placeholder: "IFSC code",
        type: "government-id",
        value: isUpdate ? UpdateData.IFSCcode : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "IFSC code is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric EX. ABCD1234567",
            pattern: "^[A-Z]{3,4}[0-9]{7}$",
          },
        ],
        functions: {
          onChange: "CheckIFSCcode",
        },
      },
      {
        name: "MICRcode",
        label: "MICR code",
        placeholder: "MICR code",
        type: "text",
        value: isUpdate ? UpdateData.MICRcode : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "MICR code is required",
          },
          {
            name: "pattern",
            message: "Please Enter Numeric length 9",
            pattern: "^[0-9]{9}$",
          },
        ],
        functions: {
          onChange: "CheckMICRcode",
        },
      },
      {
        name: "SWIFTcode",
        label: "SWIFT code",
        placeholder: "SWIFT code",
        type: "government-id",
        value: isUpdate ? `${UpdateData.SWIFTcode}` : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter alphanumeric length 11",
            pattern: "^[a-zA-Z0-9]{11}$",
          },
        ],
        functions: {
          onChange: "CheckSWIFTcode",
        },
      },
      {
        name: "ApplicationLocations",
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
        name: "BankAddress",
        label: "Bank Branch Address",
        placeholder: "Bank Branch Address",
        type: "text",
        value: isUpdate ? UpdateData.BankAddress : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Bank Branch Address is required",
          },
        ],
        functions: {},
      },
      {
        name: "AccountType",
        label: "Account Type",
        placeholder: "Account Type",
        type: "dropdown",
        value: isUpdate ? UpdateData.AccountType : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Account Type is required",
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
          onOptionSelect:'AccountTypeFunction'
        },
      },
      {
        name: "CreditLimit",
        label: "Credit Limit",
        placeholder: "Credit Limit",
        type: "number",
        value: isUpdate && UpdateData.CreditLimit != 0? UpdateData.CreditLimit : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Credit Limit is required",
          },
        ],
        functions: {},
      },
      {
        name: "isActive",
        label: "Active flag",
        placeholder: "",
        type: "toggle",
        value: isUpdate ? UpdateData.isActive : false,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {},
      },
      {
        name: "LocationsDrop",
        label: "Locations",
        placeholder: "Select CustomerLocations",
        type: "",
        value: [],
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
    ];
  }

  getAccountBankArray() {
    return this.AccountBankArray;
  }
}
