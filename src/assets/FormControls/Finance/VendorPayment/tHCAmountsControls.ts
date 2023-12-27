import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class THCAmountsControl {
  THCAmountsADDArray: FormControls[];
  THCAmountsLESSArray: FormControls[];
  THCAmountsArray: FormControls[];
  THCAmountsDetailsArray: FormControls[];
  constructor(Type ,THCData) {
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
        label: "Advance location",
        placeholder: "Advance location",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: Type == "balance" ? false : true,
        Validations: [
          {
            name: "required",
            message: "Advance location is required",
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
      },

      {
        name: "BalanceLocation",
        label: "Balance location",
        placeholder: "Balance location",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: Type == "balance" ? false : true,
        Validations: [
          {
            name: "required",
            message: "Balance location is required",
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
    ];
    this.THCAmountsDetailsArray = [
      {
        name: "Date",
        label: "Date",
        placeholder: "Date",
        type: "text",
        value: THCData.GenerationDate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {},
      },
      {
        name: "Contract",
        label: "Contract View",
        placeholder: "",
        type: "button",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          buttonIcon: "book-open",
        },
        functions: {
          onClick: "getBeneficiaryData",
        },
      },

      {
        name: "THCNumber",
        label: "THC Number",
        placeholder: "THC Number",
        type: "textwithbutton",
        value: THCData.THC,
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          buttonIcon: "visibility",
          functionName: "THCNumberview",
        },
      },

      {
        name: "VehicleNumber",
        label: "Vehicle Number",
        placeholder: "Vehicle Number",
        type: "textwithbutton",
        value: THCData.VehicleNumber,
        generatecontrol: true,
        disable: true,
        Validations: [],
        additionalData: {
          buttonIcon: "check",
          functionName: "VehicleNumbercheck",
        },
      },
    ]
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
  getTHCAmountsDetailsControls() {
    return this.THCAmountsDetailsArray;
  }
}
