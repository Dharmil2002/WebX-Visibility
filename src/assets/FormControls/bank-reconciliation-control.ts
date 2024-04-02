import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class bankReconciliationControl {
  bankReconciliationArray: FormControls[];
  constructor() {
    this.bankReconciliationArray = [
      {
        name: "bank",
        label: "Select Bank",
        placeholder: "Select Bank",
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
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {
          onOptionSelect: "GetSelectedBank",
        },
      },

      {
        name: "StartDateRange",
        label: "Select Date Range",
        placeholder: "Select Date",
        type: "daterangpicker",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          support: "EndDateRange",
        },
      },
      {
        name: "openingAmount",
        label: "Opening Amount",
        placeholder: "Opening Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "EndDateRange",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [
          {
            name: "Select Data Range",
          },
          {
            name: "required",
            message: "StartDateRange is Required...!",
          },
        ],
      },
    ];
  }


  getHandOverArrayControls() {
    return this.bankReconciliationArray;
  }
}
