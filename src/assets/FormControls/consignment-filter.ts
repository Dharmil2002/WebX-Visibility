import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ConsignmentFilterControls {
  ConsignmentFilterArray: FormControls[];
  constructor() {
    this.ConsignmentFilterArray = [
      {
        name: "DocumentType",
        label: "Document Type",
        placeholder: "Select Document Type",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Document Type  is required",
          },
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
        functions: {},
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "DocketNumber",
        label: "Docket Number ",
        placeholder: "Enter Docket Number ",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {},
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "OR",
        placeholder: "Entered Value",
        type: "OR",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "or",
        label: "",
        placeholder: "",
        type: "",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "start",
        label: "Select Date Rang",
        placeholder: "",
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
      },
    ];
  }

  getConsignmentFilterArray() {
    return this.ConsignmentFilterArray;
  }
}
