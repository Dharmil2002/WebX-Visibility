import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AdditionalDeliveryCharges {
  AdditionalDeliveryChargesArray: FormControls[];
  constructor() {
    this.AdditionalDeliveryChargesArray = [
      {
      name: "tripsAllowed",
      label: "Trips Allowed",
      placeholder: "Trips Allowed",
      type: "text",
      value: "",
      generatecontrol: true,
      disable: false,
      Validations: [],
    },
    {
      name: "additionalTripCharges",
      label: "Additional Trip Charges",
      placeholder: "Additional Trip Charges",
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
    }
    ];
  }
  getAdditionalDeliveryChargesArrayControls() {
    return this.AdditionalDeliveryChargesArray;
  }
}
