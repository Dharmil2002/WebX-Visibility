import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractNonFreightMatrixControl {
  private ContractNonFreightChargesControlArray: FormControls[];
  private ContractNonFreightMatrixControlArray: FormControls[];
  constructor(FreightMatrix) {
    this.ContractNonFreightChargesControlArray = [
      {
        name: "selectCharges",
        label: "Select Charges",
        placeholder: "Select Charges",
        type: "Staticdropdown",
        value: [
          {
            value: "Document Charge",
            name: "Document Charge",
          },
          {
            value: "Multi-point delivery",
            name: "Multi-point delivery",
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
            message: "Charges is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "ChargesBehaviour",
        label: "Charges Behaviour",
        placeholder: "Charges Behaviour",
        type: "Staticdropdown",
        value: [
          {
            value: "Fixed",
            name: "Fixed",
          },
          {
            value: "Variable",
            name: "Variable",
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
            message: "Charges Behaviour is required",
          },
        ],
        additionalData: {
          showNameAndValue: true,
        },
      },
      {
        name: "Charges",
        label: "Charges",
        placeholder: "Charges",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Charges is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{1,8}(?:\.[0-9]{1,2})?$",
            message: "Please enter a valid Charges",
          },
        ],
      },
      // {
      //   name: "addCharges",
      //   label: "Add Charges",
      //   placeholder: "Add Charges",
      //   type: "filelink",
      //   value: "t",
      //   generatecontrol: true,
      //   disable: false,
      //   Validations: [],
      // },
    ];

    this.ContractNonFreightMatrixControlArray = [

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
        name: "MinValue",
        label: "Min Value",
        placeholder: "Min Value",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Min Value is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{1,8}(?:\.[0-9]{1,2})?$",
            message: "Please enter a valid Min Value",
          },
        ],
      },
      {
        name: "MaxValue",
        label: "Max Value",
        placeholder: "Max Value",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Max Value is required",
          },
          {
            name: "pattern",
            pattern:
              "^[0-9]{1,8}(?:\.[0-9]{1,2})?$",
            message: "Please enter a valid Max Value",
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
  getContractNonFreightMatrixControlControls(CurrentAccess: string[]) {
    // this.ContractNonFreightMatrixControlArray = this.ContractNonFreightMatrixControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractNonFreightMatrixControlArray;
  }

  getContractNonFreightChargesControlControls(CurrentAccess: string[]) {
    // this.ContractNonFreightChargesControlArray = this.ContractNonFreightChargesControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractNonFreightChargesControlArray;
  }


}
