import { FormControls } from "src/app/Models/FormControl/formcontrol";
export class AddGpsRuleControls {
  private AddGpsRuleControlArray: FormControls[];
  constructor(data, isView) {
    this.AddGpsRuleControlArray = [
      {
        name: "lOGICCD",
        label: "Logicloud Tenant Id",
        placeholder: "Logicloud Tenant Id",
        type: "text",
        value: data?.lOGICCD,
        Validations: [
          {
            name: "required",
            message: "Tenant Id is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "uNM",
        label: "User ID",
        placeholder: "User ID",
        type: "text",
        value: data?.uNM,
        Validations: [
          {
            name: "required",
            message: "User Id is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "pWD",
        label: "Password",
        placeholder: "Password",
        type: "text",
        value: data?.pWD,
        Validations: [
          {
            name: "required",
            message: "Password is required",
          },
        ],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "aPITYP",
        label: "API Type",
        placeholder: "API Type",
        type: "text",
        value: data?.aPITYP,
        Validations: [
          {
            name: "required",
            message: "API Type is required",
          },
        ],
        generatecontrol: true,
        disable: isView,
      },
      {
        name: "iSACTIVE",
        label: "Active",
        placeholder: "",
        type: "toggle",
        value: data?.iSACTIVE,
        generatecontrol: true,
        disable: isView,
        Validations: [],

        functions: {
          onChange: "activeAPI",
        },
      },
      {
        name: "aPIURL",
        label: "API URL",
        placeholder: "API URL",
        type: "text",
        value: data?.aPIURL,
        Validations: [
          {
            name: "required",
            message: "API URL is required",
          },
        ],
        generatecontrol: true,
        disable: isView,
      },
      {
        name: "aPIKEY",
        label: "API Key",
        placeholder: "API Key",
        type: "text",
        value: data?.aPIKEY,
        Validations: [],
        generatecontrol: true,
        disable: isView,
      },
      {
        name: "gPSPID",
        label: "GPS Provider ID",
        placeholder: "GPS Provider ID",
        type: "text",
        value: data?.gPSPID,
        Validations: [],
        generatecontrol: true,
        disable: isView,
      },
      {
        name: "tID",
        label: "Transporter ID",
        placeholder: "Transporter ID",
        type: "text",
        value: data?.tID,
        Validations: [],
        generatecontrol: true,
        disable: isView,
      },
    ];
  }
  getGPSRuleFormControls() {
    return this.AddGpsRuleControlArray;
  }
}
