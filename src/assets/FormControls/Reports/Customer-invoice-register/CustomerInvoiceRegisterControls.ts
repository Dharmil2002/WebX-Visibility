import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CustInvRegFormControl {
  CustInvRegArray: FormControls[];
  constructor() {
    this.CustInvRegArray = [
      {
        name: "start",
        label: "Select Date Range",
        placeholder: "Select Date Range",
        type: "daterangpicker",
        value: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          support: "end",
        },
      },
      // {
      //   name: "dTYPE",
      //   label: "Document type",
      //   placeholder: "Select Document type",
      //   type: "dropdown",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "invalidAutocompleteObject",
      //       message: "Choose proper value",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: true,
      //   },
      // },
      {
        name: "gSTE",
        label: "GST State",
        placeholder: "Select GST State",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "sTS",
        label: "Status",
        placeholder: "Select Status",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "CUST",
        label: "Customer",
        placeholder: "Select Customer",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
        functions: {
          onModel: "getCustomer",
        },
      },
      {
        name: "sACCODE",
        label: "SAC Code",
        placeholder: "Select SAC Code",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "lOC",
        label: "Location",
        placeholder: "Select Location",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },

      {
        name: "OR",
        label: "OR ",
        placeholder: "OR",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "OR",
        label: "OR ",
        placeholder: "OR",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "OR",
        label: "OR ",
        placeholder: "OR",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "dNO",
        label: "Enter Document No",
        placeholder: "Document No",
        type: "text",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {},
      },
      {
        name: "OR",
        label: "OR ",
        placeholder: "OR",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "OR",
        label: "OR ",
        placeholder: "OR",
        type: "",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "end",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      },
    ];
  }
  getCustInvRegFormControls() {
    return this.CustInvRegArray;
  }
}
