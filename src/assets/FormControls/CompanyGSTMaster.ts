import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CompanyGSTControl {
  private CompanyGSTControlArray: FormControls[];
  constructor(isUpdate, UpdateData) {
    this.CompanyGSTControlArray = [
      {
        name: "CompanyName",
        label: "Company Name",
        placeholder: "",
        type: "text",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "billingState",
        label: "Billing State / UT",
        placeholder: "Billing State / UT",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Billing State / UT is required",
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
        },
      },
      {
        name: "gstInNumber",
        label: "Provisional / GSTIN Number",
        placeholder: "Provisional / GSTIN Number",
        type: "text",
        value: isUpdate ? UpdateData.gstInNumber : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Provisional / GSTIN Number is required",
          },
          {
            name: "pattern",
            pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
            message: "Please enter valid GST Number alphanumeric characters like 01BZAHM6385P6Z2"
          }
        ],
        functions: {
          onChange:"ValidGSTNumber"
        },
      },
      {
        name: "state",
        label: "State / UT name",
        placeholder: "State / UT name",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "State / UT name is required",
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
          onOptionSelect: "getCityMasterDetails",
        },
      },
      {
        name: "city",
        label: "City",
        placeholder: "City",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "City is required",
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
        },
      },
      {
        name: "address",
        label: "Address",
        placeholder: "Address",
        type: "text",
        value: isUpdate ? UpdateData.address : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Address is required",
          },
        ],
        functions: {},
      },
      {
        name: "isActive",
        label: "GST Active",
        placeholder: "",
        type: "toggle",
        value: isUpdate? UpdateData.isActive:false,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {},
      },
    ];
  }
  getCompanyGSTFormControls() {
    return this.CompanyGSTControlArray;
  }
}
