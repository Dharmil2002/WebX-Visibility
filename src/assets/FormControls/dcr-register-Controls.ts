import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DcrRegisterControl {
  DcrRegisterArray: FormControls[];
  constructor() {
    this.DcrRegisterArray = [
      {
        name: "start",
        label: "SelectDateRange",
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
  getDcrRegisterFormControls() {
    return this.DcrRegisterArray;
  }
}
