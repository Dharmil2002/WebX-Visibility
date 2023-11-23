import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class VendorAssociateControls {
  VendorAssociateArray: FormControls[];
  constructor() {
    this.VendorAssociateArray = [
      {
        name: "city",
        label: "City",
        placeholder: "City",
        type: "dropdown",
        value:'' ,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "City is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        functions: {
          onModel: "getLocation",
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "mode",
        label: "Transport mode",
        placeholder: "Transport mode",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Transport mode is required"
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
          message: "Please Enter only positive numbers",
          pattern: '^\\d+(\\.\\d+)?$'
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
          message: "Please Enter only positive numbers",
          pattern: '^\\d+(\\.\\d+)?$'
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
          message: "Please Enter only positive numbers",
          pattern: '^\\d+(\\.\\d+)?$'
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