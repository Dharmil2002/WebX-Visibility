import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class TripLaneBased {
  tripLaneBasedArray: FormControls[];
  constructor() {
    this.tripLaneBasedArray = [
      {
        name: "mode",
        label: "Mode",
        placeholder: "Mode",
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
        name: "location",
        label: "Location",
        placeholder: "Location",
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
        name: "area",
        label: "Area",
        placeholder: "Area",
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
        name: "minimumCharge",
        label: "Minimum Charge",
        placeholder: "Minimum Charge",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "maximumCharge",
        label: "Maximum Charge",
        placeholder: "Maximum Charge",
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
      {
        name: "rate",
        label: "Rate",
        placeholder: "Rate",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      }
    ];
  }
  getTripLaneBasedArrayControls() {
    return this.tripLaneBasedArray;
  }
}
