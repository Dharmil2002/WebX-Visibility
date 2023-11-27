import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class ContractNonFreightMatrixControl {
  private ContractNonFreightChargesControlArray: FormControls[];
  private ContractNonFreightMatrixControlArray: FormControls[];
  constructor(isUpdate,UpdateData) {
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
        functions: {
          onSelection: "ChargesBehaviour"
        },
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
    ];

    this.ContractNonFreightMatrixControlArray = [

      {
        name: "From",
        label: "From",
        placeholder: "From",
        type: "dropdown",
        value: isUpdate?{name:UpdateData.from,value:UpdateData.fromType}:"",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Perent Group Code is required",
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
        type: "dropdown",
        value: isUpdate?{name:UpdateData.to,value:UpdateData.toType}:"",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [
          {
            name: "required",
            message: "Perent Group Code is required",
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
        type: "dropdown",
        value: "",
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Perent Group Code is required",
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
        },
        
      },
      {
        name: "Rate",
        label: "Rate",
        placeholder: "Rate",
        type: "text",
        value: isUpdate?UpdateData.rate:"",
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
        value: isUpdate?UpdateData.minValue:"",
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
        value: isUpdate?UpdateData.maxValue:"",
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
    ];
  }
  getContractNonFreightMatrixControlControls() {
    // this.ContractNonFreightMatrixControlArray = this.ContractNonFreightMatrixControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractNonFreightMatrixControlArray;
  }

  getContractNonFreightChargesControlControls() {
    // this.ContractNonFreightChargesControlArray = this.ContractNonFreightChargesControlArray.filter(item => CurrentAccess.includes(item.name))
    return this.ContractNonFreightChargesControlArray;
  }
}
