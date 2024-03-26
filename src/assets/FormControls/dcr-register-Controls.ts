import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DcrRegisterControl {
  DcrRegisterArray: FormControls[];
  constructor() {
    this.DcrRegisterArray = [
      {
        name: "date",
        label: "Date",
        placeholder: "select Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "aCUST",
        label: "Customer",
        placeholder: "Select Customer",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Customer is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "aLOC",
        label: "Allocation location",
        placeholder: "Select Allocation location",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Allocation location is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "aEMP",
        label: "Employee",
        placeholder: "Select Employee",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Employee is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "aBUSAS",
        label: "Business Associate",
        placeholder: "Select Business Associate",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Business Associate is required..",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "sTS",
        label: "Status",
        placeholder: "Select Status",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Status is required..",
          },
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
      },
      {
        name: "bCODE",
        label: "Book code",
        placeholder: "Book code",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Book code Name is required",
          },
        ],
      },
      {
        name: "sRICENO",
        label: "Search by number",
        placeholder: "Search by number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Search by number Name is required",
          },
        ],
      },
    ];
  }
  getDcrRegisterFormControls() {
    return this.DcrRegisterArray;
  }
}
