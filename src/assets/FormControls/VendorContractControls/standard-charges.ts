import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class TERCharges {
  StandardChargesArray: FormControls[];
  constructor(StandardChargesData) {
    this.StandardChargesArray = [
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
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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
        label: "  Capacity",
        placeholder: "  Capacity",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
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
        label: "Rate",
        placeholder: "Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "min",
        label: "Min Amount",
        placeholder: "Min Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "max",
        label: "Max Amount",
        placeholder: "Max Amount",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
  }
  getStandardChargesArrayControls() {
    return this.StandardChargesArray;
  }
}
