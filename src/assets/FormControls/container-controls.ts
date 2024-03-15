import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class ContainerFormControls {
  ContainerFormControlsArray: FormControls[];
  constructor(isUpdate, UpdateData) {
    this.ContainerFormControlsArray = [
      {
        name: "ContainerCode",
        label: "Container Code",
        placeholder: "System Genreted",
        type: "text",
        value: isUpdate ? UpdateData.cNCD : "System Genreted",
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "containerType",
        label: "Container Type",
        placeholder: "Container Type",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "Container Type is required",
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
        functions: {
        //   onOptionSelect: "getAcGroupDropdown",
        },
      },
      {
        name: "ContainerNumber",
        label: "Container Number",
        placeholder: "Container Number",
        type: "text",
        value: isUpdate ? UpdateData.cNNO : "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Container Number is required",
          },
          {
            name: "pattern",
            message: "Please Enter alphanumeric length 4 to 200",
            pattern: "^[a-zA-Z0-9 ]{4,200}$",
          },
        ],
        functions: {},
      },
      {
        name: "VendorType",
        label: "Vendor Type ",
        placeholder: "Vendor Type ",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Vendor Type is required",
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
          showNameAndValue: true,
        },
        functions: {},
      },
      {
        name: "VendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
        type: "dropdown",
        value: "",
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
        additionalData: {
          showNameAndValue: true,
        },
        functions: {},
      },

      {
        name: "GrossWeight",
        label: "Gross Weight",
        placeholder: "Gross Weight",
        type: "number",
        value: isUpdate?UpdateData.gRW : 0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Gross Weight is required",
          },
        ],
        functions: {
          onChange:"WeightCalculate"
        },
      },
      {
        name: "TareWeight",
        label: "Tare Weight",
        placeholder: "Tare Weight",
        type: "number",
        value: isUpdate ? UpdateData.tRW : 0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Tare Weight is required",
          },
        ],
        functions: {
          onChange:"WeightCalculate"
        },
      },
      {
        name: "NetWeight",
        label: "Net Weight",
        placeholder: "Net Weight",
        type: "number",
        value: isUpdate ? UpdateData.nETW : 0,
        generatecontrol: true,
        disable: true,
        Validations: [
          {
            name: "required",
            message: "Net Weight is required",
          },
        ],
        functions: {},
      },
      {
        name: "isActive",
        label: "",
        placeholder: "",
        type: "toggle",
        value: isUpdate ? UpdateData.aCT : false,
        generatecontrol: false,
        disable: false,
        Validations: [],
      },
    ];
  }

  getContainerFormControlsArray() {
    return this.ContainerFormControlsArray;
  }
}
