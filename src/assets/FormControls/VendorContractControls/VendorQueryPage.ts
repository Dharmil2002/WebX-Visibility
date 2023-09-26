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
        value: [
          {
            name: "Order No",
            value: 1,
          },
          {
            name: "Plan Id",
            value: 2,
          },
          {
            name: "Trip Id",
            value: 3,
          },
        ],
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
        functions: {
        },
        additionalData: {
          showNameAndValue: false,
        },
      },
      // {
      //   name: "VendorType",
      //   label: "Vendor Type",
      //   placeholder: "Select Vendor Type",
      //   type: "dropdown",
      //   value: "",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [
      //     {
      //       name: "autocomplete",
      //     },
      //     {
      //       name: "invalidAutocompleteObject",
      //       message: "Choose proper value",
      //     },
      //   ],
      //   additionalData: {
      //     showNameAndValue: false,
      //   },
      //   functions: {},
      // },
      {
        name: "OR",
        label: "OR",
        placeholder: "",
        type: "",
        value: "",
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "OR",
        label: "OR",
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
        placeholder: "Select Vendor Name",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        functions: {},
      },
    ];
  }
  getVendorQueryPageControl() {
    return this.VendorQueryPageFormControl;
  }
}
