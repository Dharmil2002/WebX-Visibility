import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class VendorQueryPageControl {
  VendorQueryPageFormControl: FormControls[];
  constructor() {
    this.VendorQueryPageFormControl = [
      {
        name: "VendorType",
        label: "Vendor Type",
        placeholder: "Vendor Type",
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
        name: "VendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
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
            message: "Vendor Name is required",
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
  getVendorQueryPageControl() {
    return this.VendorQueryPageFormControl;
  }
}
