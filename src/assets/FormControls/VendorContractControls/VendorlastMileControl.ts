import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class VendorlastMileControl {
  lastMileControlArray: FormControls[];

  constructor() {
    this.lastMileControlArray = [
      {
        name: "location",
        label: "Location",
        placeholder: "Location",
        type: "dropdown",
        value: "",
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
        Validations: [{
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
        name: "timeFrame",
        label: "Time frame",
        placeholder: "Time frame",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Time frame is required"
        },],
      },
      {
        name: "capacity",
        label: "Capacity(Ton)",
        placeholder: "Capacity",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Capacity is required"
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
        name: "minCharge",
        label: "MinCharge Amount (₹)",
        placeholder: "MinCharge Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "MinCharge Amount is required"
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
        name: "committedKm",
        label: "Committed Km",
        placeholder: "Committed Km",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Committed Km is required"
        }, {
          name: "pattern",
          message: "Please Enter only positive numbers",
          pattern: '^\\d+(\\.\\d+)?$'
        }],
      },
      {
        name: "additionalKm",
        label: "Additional Km",
        placeholder: "Additional Km",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Additional Km is required"
        }, {
          name: "pattern",
          message: "Please Enter only positive numbers",
          pattern: '^\\d+(\\.\\d+)?$'
        }],
      },
      {
        name: "maxCharges",
        label: "MaxCharge Amount (₹)",
        placeholder: "MaxCharge Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "MaxCharge Amount is required"
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
  getVendorlastMileControl() {
    return this.lastMileControlArray;
  }
}