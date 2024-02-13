import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountTdsControls {
  AccountTdsArray: FormControls[];
  constructor(isUpdate , UpdateData) {
    this.AccountTdsArray = [
      {
        name: "TDSsection",
        label: "TDS Section",
        placeholder: "TDS Section",
        type: "text",
        value: isUpdate?UpdateData.TDSsection:"",
        generatecontrol: true,
        disable: isUpdate ? true : false,
        Validations: [
          {
            name: "required",
            message: "TDS Section is required",
          },
        ],
        functions: {
          onChange:"CheckTDSSection"
        }
      },
      {
        name: "PaymentType",
        label: "Nature of Payment",
        placeholder: "Nature of Payment",
        type: "text",
        value: isUpdate?UpdateData.PaymentType:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Nature of Payment is required",
          },
        ],
        functions: {
          onChange:"CheckPaymentType"
        },
      },
      {
        name: "Thresholdlimit",
        label: "Threshold limit",
        placeholder: "Threshold limit",
        type: "text",
        value: isUpdate?UpdateData.Thresholdlimit:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Threshold limit is required",
          },
          {
            name: "pattern",
            message: "Please Enter only numeric length 1 to 100",
            pattern: "^[0-9]{1,100}$",
          },
        ],
        functions: {

        },
      },
      {
        name: "RateForHUF",
        label: "Rate for HUF/ Individual (%)",
        placeholder: "Rate for HUF/ Individual (%)",
        type: "text",
        value: isUpdate?UpdateData.RateForHUF:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate for HUF/ Individual is required",
          },
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {
        },
      },
      {
        name: "RateForOthers",
        label: "Rate for others (%)",
        placeholder: "Rate for others (%)",
        type: "text",
        value: isUpdate?UpdateData.RateForOthers:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Rate for others is required",
          },
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {
        },
      },
      {
        name: "RateForITR",
        label: "Rate for ITR",
        placeholder: "Rate for ITR",
        type: "text",
        value: isUpdate?UpdateData.RateForITR:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {},
      },
      {
        name: "RateForWithoutITR",
        label: "Rate for Without ITR",
        placeholder: "Rate for Without ITR",
        type: "text",
        value: isUpdate?UpdateData.RateForWithoutITR:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {},
      },
      {
        name: "LowRate",
        label: "Low Rate",
        placeholder: "Low Rate",
        type: "text",
        value: isUpdate?UpdateData.LowRate:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {},
      },
      {
        name: "HighRate",
        label: "High Rate",
        placeholder: "High Rate",
        type: "text",
        value: isUpdate?UpdateData.HighRate:"",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message: "Please Enter only numeric Ex:'1234.00','1234'",
            pattern: "^[0-9]+(.[0-9]{1,2})?$",
          },
        ],
        functions: {},
      },

      {
        name: "isActive",
        label: "TDS Active",
        placeholder: "",
        type: "toggle",
        value: isUpdate? UpdateData.isActive:false,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {},
      },
    ];
  }

  getAccountTdsArray() {
    return this.AccountTdsArray;
  }
}
