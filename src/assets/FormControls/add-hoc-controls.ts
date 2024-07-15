import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddHocControls {
  addHoc: FormControls[];
  columnHeader: any;
  staticField: string[];
  constructor() {
    this.addHoc = [
      {
        name: "routeMode",
        label: "Route Mode",
        placeholder: "Route Mode",
        type: "Staticdropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
              name: "required",
              message: "Route Mode is required"
          }
      ]
      },
      {
        name: "loc",
        label: "Location",
        placeholder: "Select location",
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        additionalData: {
        },
        functions: {
          onModel: "getLocation",
          onOptionSelect: "getlocationValidation"
        },
        Validations: [
          {
              name: "required",
              message: "Location is required"
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "Choose proper value",
          }
      ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "distance",
        label: "Km Distance from Previous Location",
        placeholder: "Distance ",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "transitHrs",
        label: "Transit Hrs from Previous Location",
        placeholder: "Route Type",
        type: "number",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "route",
        label: "Route",
        placeholder: "Route",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      }
    ]
    this.columnHeader = {
      loc: {
        Title: "Location",
        class: "matcolumncenter",
        //Style: "min-width:200px",
        sticky: true
      },
      distance: {
        Title: "Distance",
        class: "matcolumncenter",
      //  Style: "min-width:80px",
        sticky: true
      },
      transitHrs: {
        Title: "Transit Hrs",
        class: "matcolumncenter"
       // Style: "min-width:200px",
      },
      actions: {
        Title: "Action",
        class: "matcolumncenter"
       // Style: "min-width:200px",
      }
    };
    this.staticField = [
      "loc",
      "distance",
      "transitHrs"
    ];
  }
}