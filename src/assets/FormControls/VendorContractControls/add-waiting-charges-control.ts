import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class WaitingChargesControls {
  WaitingChargesArray: FormControls[];
  constructor() {
    this.WaitingChargesArray = [
      {
        name: "vehicleType",
        label: "Vehicle Type",
        placeholder: "Vehicle Type",
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
        placeholder: "Rate",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
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

    ];
  }
  getWaitingChargesArrayControls() {
    return this.WaitingChargesArray;
  }
}
