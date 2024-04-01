import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ConsignmentqueryControls {
  ConsignmentqueryArray: FormControls[];
  constructor() {
    this.ConsignmentqueryArray = [
      {
        name: "Docket",
        label: "Cnote No.",
        placeholder: "Enter Cnote No.",
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
        label: "Select Date Range",
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

  getConsignmentqueryArray() {
    return this.ConsignmentqueryArray;
  }
}
