import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractFreightMatrixControl {
  private ContractFreightMatrixControlArray: FormControls[];
  constructor(FreightMatrix) {
    this.ContractFreightMatrixControlArray = [

      {
        name: "From",
        label: "From",
        placeholder: "From",
        type: "select",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "FromHandler",
          showNameAndValue: false,

        },
        functions: {

          onModel: 'SetOptions',
          onSelect: "setSelectedOptions"
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "To",
        label: "To",
        placeholder: "To",
        type: "select",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        additionalData: {
          isIndeterminate: false,
          isChecked: false,
          support: "ToHandler",
          showNameAndValue: false,

        },
        functions: {

          onModel: 'SetOptions',
          onSelect: "setSelectedOptions"
        },
        generatecontrol: true,
        disable: false,
        accessallowed: true,
      },
      {
        name: "rateType",
        label: "Rate Type",
        placeholder: "Rate Type",
        type: "Staticdropdown",
        value: [
          {
            value: "1",
            name: "Per Kg",
          },
          {
            value: "2",
            name: "Per Pkg",
          },

        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Rate Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "capacity",
        label: "Capacity",
        placeholder: "Capacity",
        type: "Staticdropdown",
        value: [
          {
            value: "20",
            name: "20 Ton",
          },
          {
            value: "10",
            name: "10 Ton",
          },

        ],
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        accessallowed: true,
        Validations: [
          {
            name: "required",
            message: "Rate Type is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "Rate",
        label: "Rate",
        placeholder: "Rate",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{1,8}(?:\.[0-9]{1,2})?$",
            message: "Please enter a valid Rate EX. (100000.00)",
          },
        ],
      },
      {
        name: 'FromHandler',
        label: 'Origin Rate option',
        placeholder: 'Origin Rate option',
        type: '',
        value: '',
        filterOptions: "",
        Validations: [{
          name: "required",
          message: " ",
        }],
        generatecontrol: false, disable: false,
        accessallowed: true,
      },
      {
        name: 'ToHandler',
        label: 'Destination Rate option',
        placeholder: 'Destination Rate option',
        type: '',
        value: '',
        filterOptions: "",
        Validations: [{
          name: "required",
          message: " ",
        }],
        generatecontrol: false, disable: false,
        accessallowed: true,
      },
    ];
  }
  getContractFreightMatrixControlControls(CurrentAccess: string[]) {
    // this.ContractFreightMatrixControlArray = this.ContractFreightMatrixControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractFreightMatrixControlArray;
  }
}
