import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class StandardCharges {
  StandardChargesArray: FormControls[];
  constructor() {
    this.StandardChargesArray = [
      {
        name: "chargeName",
        label: "Charge Name",
        placeholder: "Charge Name",
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
        name: "vehicleCapacity",
        label: "Vehicle Capacity",
        placeholder: "Vehicle Capacity",
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
        name: "amount",
        label: "Amount",
        placeholder: "Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      }
    ];
  }
  getStandardChargesArrayControls() {
    return this.StandardChargesArray;
  }
}
