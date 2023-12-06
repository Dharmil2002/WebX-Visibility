import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class THCAmountsControl {
  THCAmountsADDArray: FormControls[];
  THCAmountsLESSArray: FormControls[];
  THCAmountsArray: FormControls[];
  constructor(Type) {
    this.THCAmountsADDArray = [
      {
        name: "ContractAmount",
        label: "Contract Amount",
        placeholder: "Contract Amount",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        additionalData: { op: "+" },
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },
      {
        name: "THCTotal",
        label: "THC Total",
        placeholder: "Handling ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
    this.THCAmountsLESSArray = [
      {
        name: "Freightdeduction",
        label: "Freight deduction",
        placeholder: "Freight deduction",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        additionalData: { op: "-" },
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },

      {
        name: "Penalty",
        label: "Penalty",
        placeholder: "Penalty ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        additionalData: { op: "-" },
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },

      {
        name: "Claim",
        label: "Claim",
        placeholder: "Claim ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        additionalData: { op: "-" },
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },

      {
        name: "LateArrival",
        label: "Late Arrival",
        placeholder: "Late Arrival ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        additionalData: { op: "-" },
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },

      {
        name: "Detention",
        label: "Detention",
        placeholder: "Detention ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        functions: {
          onChange: "OnChangePlusAmounts",
        },
      },
    ];

    this.THCAmountsArray = [
      {
        name: "Advance",
        label: "Advance",
        placeholder: "Handling ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: Type == "balance" ? true : false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        functions: {
          onChange: "OnChangeAdvanceAmount",
        },
      },
      {
        name: "AdvanceLocation",
        label: "Advance Location",
        placeholder: "Handling ",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "Balance",
        label: "Balance",
        placeholder: "Handling ",
        type: "number",
        value: 0.0,
        generatecontrol: true,
        disable: Type == "Advance" ? true : false,
        Validations: [
          {
            name: "pattern",
            message:
              "Please Enter only positive numbers with up to two decimal places",
            pattern: "^\\d+(\\.\\d{1,2})?$",
          },
        ],
        // functions: {
        //     onChange: "OnChangeBalanceAmount"
        // },
      },

      {
        name: "Balancelocation",
        label: "Balance location",
        placeholder: "Handling ",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
  }
  getTHCAmountsADDControls() {
    return this.THCAmountsADDArray;
  }
  getTHCAmountsLESSControls() {
    return this.THCAmountsLESSArray;
  }
  getTHCAmountsControls() {
    return this.THCAmountsArray;
  }
}
