import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DcrRegisterControl {
  DcrRegisterArray: FormControls[];
  constructor() {
    this.DcrRegisterArray = [
      {
        name: "start",
        label: "Select Date Range",
        placeholder: "Select Date Range",
        type: "daterangpicker",
        value: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
             support: "end",
        },
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
        type: "Staticdropdown",
        value: [
          { value: 1, name: "Added" },
          { value: 2, name: "Allocated" },
          { value: 3, name: "Reallocated" },
          { value: 4, name: "Assigned" },
          { value: 5, name: "Splitted" },
          { value: 6, name: "Declared_Void" },
          { value: 7, name: "Deallocated" },
          { value: 9, name: "Cancelled" },
        ],
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "bCODE",
        label: "Book code",
        placeholder: "Book code",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "sRICENO",
        label: "Search by number",
        placeholder: "Search by number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "end",
        label: "",
        placeholder: "Select Data Range",
        type: "",
        value: "",
        filterOptions: "",
        autocomplete: "",
        generatecontrol: false,
        disable: true,
        Validations: [],
      }
    ];
  }
  getDcrRegisterFormControls() {
    return this.DcrRegisterArray;
  }
}
