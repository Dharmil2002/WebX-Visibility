import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CompanyControl {
  CompanyControlArray: FormControls[];
  FinancialControlArray: FormControls[];
  GSTControlArray: FormControls[];
  constructor(companyTable: any, isUpdate: boolean) {
    this.CompanyControlArray = [
      {
        name: "company",
        label: "Company/Tenant",
        placeholder: "Company/Tenant",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Company/Tenant is required",
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
          onOptionSelect: "onSelecttTenants",
        },
      },

      {
        name: "company_Name",
        label: "Company legal name",
        placeholder: "Company legal name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
        functions: {},
      },
      {
        name: "activeFlag",
        label: "Active Flag",
        placeholder: "",
        type: "toggle",
        value: "",
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ];

    this.FinancialControlArray = [
      {
        name: "pan_N0",
        label: "PAN No",
        placeholder: "PAN No",
        type: "government-id",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
            message: "Please enter a valid PAN NO (e.g., ABCDE1234F)",
          },
        ],
      },
      {
        name: "tan_N0",
        label: "TAN number",
        placeholder: "TAN number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter valid TAN Number(e.g., ABCDE1234F)",
            pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$",
          },
        ],
      },
      {
        name: "cin_N0",
        label: "CIN number",
        placeholder: "CIN number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter valid CIN Number(e.g., ABCDE1234F)",
            pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$",
          },
        ],
      },
      {
        name: "address",
        label: "Address",
        placeholder: "Address",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Company Name is required",
          },
          {
            name: "pattern",
            message: "Please Enter only text with 1-100 alphabets",
            pattern: "^[a-zA-Z ]{1,100}$",
          },
        ],
      },
      {
        name: "PinCode",
        label: "Pin Code",
        placeholder: "Pin Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Pin Code is required",
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
          onOptionSelect: "onSelectPinCode",
          onModel: "getPinCodeDropdown",
        },
      },
      {
        name: "city",
        label: "City",
        placeholder: "City",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "City is required",
          },
        ],
      },
      {
        name: "state",
        label: "State",
        placeholder: "State",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "state is required",
          },
        ],
      },
    ];

    this.GSTControlArray = [
      {
        name: "gstNo",
        label: "GST Number",
        placeholder: "GST Number",
        type: "government-id",
        value: isUpdate ? companyTable.GSTNumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST Number is required",
          },
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
        name: "gstState",
        label: "GST State",
        placeholder: "GST State",
        type: "text",
        value: isUpdate ? companyTable.GSTState : "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "GST State is required",
          },
        ],
        functions: {},
      },
      {
        name: "gstPinCode",
        label: "Pin Code",
        placeholder: "GST Pin Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST Pin Code is required",
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
          onOptionSelect: "onSelectGSTPinCode",
          onModel: "getGSTPinCodeDropdown",
        },
      },
      {
        name: "gstCity",
        label: "City",
        placeholder: "City",
        type: "text",
        value: isUpdate ? companyTable.GSTCity : "",
        generatecontrol: true,
        disable: true,
        Validations: [],
        functions: {},
      },
      {
        name: "gstAddres",
        label: "Address",
        placeholder: "Address",
        type: "text",
        value: isUpdate ? companyTable.Address : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "GST State is required",
          },
        ],
        functions: {},
      },

    ];
  }

  getFormControlsC() {
    return this.CompanyControlArray;
  }
  getFinancialFormControl() {
    return this.FinancialControlArray;
  }
  getGSTFormControl() {
    return this.GSTControlArray;
  }
}
