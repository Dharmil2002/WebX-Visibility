import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CustomerQueryPageControl {
  CustomerQueryPageFormControl: FormControls[];
  constructor() {
    this.CustomerQueryPageFormControl = [
      {
        name: "CustomerPayBasis",
        label: "Pay Basis",
        placeholder: "Pay Basis",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
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
        functions: {},
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "OR",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "OR",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "CustomerName",
        label: "Customer Name",
        placeholder: "Customer Name",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer Name is required",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          },
        ],
        functions: {},
        additionalData: {
          showNameAndValue: false,
        },
      },
    ];
  }
  getCustomerQueryPageControl() {
    return this.CustomerQueryPageFormControl;
  }
}
