import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AccountTdsControls {
  AccountTdsArray: FormControls[];
  constructor(isUpdate , UpdateData) {
    this.AccountTdsArray = [
      {
        name: "TDSSection",
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
          {
            name: "pattern",
            message: "Please Enter alphanumeric length 4 to 100",
            pattern: "^[a-zA-Z0-9]{4,100}$",
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
            name: "pattern",
            message: "Please Enter only numeric length 4 to 200",
            pattern: "^[0-9]{4,100}$",
          },
        ],
        functions: {

        },
      },
      {
        name: "RateForHUF",
        label: "Rate for HUF/ Individual",
        placeholder: "Rate for HUF/ Individual",
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
            message: "Please Enter only numeric length 1 to 100",
            pattern: "^[0-9]{1,100}$",
          },
        ],
        functions: {
        },
      },
      {
        name: "RateForOthers",
        label: "Rate for others",
        placeholder: "Rate for others",
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
            message: "Please Enter only numeric length 1 to 100",
            pattern: "^[0-9]{1,100}$",
          },
        ],
        functions: {
        },
      },
    ];
  }

  getAccountTdsArray() {
    return this.AccountTdsArray;
  }
}
