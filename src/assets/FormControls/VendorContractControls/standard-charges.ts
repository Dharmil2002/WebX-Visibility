import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class TERCharges {
  TERChargesArray: FormControls[];
  constructor(chargesData) {
    this.TERChargesArray = [
      {
        name: "route",
        label: "Route",
        placeholder: "Route",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Route is required"
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
        name: "rate",
        label: "Rate(₹)",
        placeholder: "Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [{
          name: "required",
          message: "Rate is required"
        },],
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
        },],
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
        },],
      },
      {
        name: "ENBY",
        label: "",
        placeholder: "",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "upBY",
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
  getTERChargesArrayControls() {
    return this.TERChargesArray;
  }
}
