import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class VendorAssociateControls {
  VendorAssociateArray: FormControls[];
  constructor() {
    this.VendorAssociateArray = [
      {
        name: "operation",
        label: "Operation",
        placeholder: "Operation",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Operation is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "location",
        label: "Location",
        placeholder: "Location",
        type: "dropdown",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Location is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        // functions: {
        //   // onModel: "getLocation",
        //   onOptionSelect: "checkValueExists"
        // },
        additionalData: {
          showNameAndValue: false,
        },
      },
      // {
      //   name: "city",
      //   label: "City",
      //   placeholder: "City",
      //   type: "dropdown",
      //   value: '',
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "required",
      //       message: "City is required"
      //     },
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "invalidAutocomplete",
      //       message: "please select values from list only",
      //     },
      //   ],
      //   functions: {
      //     onModel: "getLocation",
      //     onOptionSelect: "checkValueExists"
      //   },
      //   additionalData: {
      //     showNameAndValue: false,
      //   },
      // },
      {
        name: "mode",
        label: "Transport Mode",
        placeholder: "Transport Mode",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Transport Mode is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "PayBasis",
        label: "PayBasis",
        placeholder: "PayBasis",
        type: "dropdown",
        value: "",
        filterOptions: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PayBasis is required"
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: false,
          //metaData: "Basic"
        },
        functions: {
          onOptionSelect: "PayBasisFieldChanged"
        },
      },
      {
        name: "rateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "dropdown",
        value: '',
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate Type is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "rate",
        label: "Rate(₹)",
        placeholder: "Rate",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Rate is required"
        }, {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
      },
      {
        name: "min",
        label: "Min Amount(₹)",
        placeholder: "Min Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Min Amount is required"
        }, {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateMinCharge'
        },
      },
      {
        name: "max",
        label: "Max Amount(₹)",
        placeholder: "Max Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Max Amount is required"
        }, {
          name: "pattern",
          message: "Please Enter only positive numbers with up to two decimal places",
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }],
        functions: {
          onChange: 'validateMinCharge'
        },
      },
      {
        name: "eNBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "uPBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },

    ];
  }
  getVendorAssociateControls() {
    return this.VendorAssociateArray;
  }
}