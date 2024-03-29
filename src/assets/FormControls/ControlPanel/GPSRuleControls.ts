import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class GPSRuleControls {
  private gpsRuleControlArray: FormControls[];
  constructor(gpsrule, isUpdate) {
    this.gpsRuleControlArray = [
      {
        name: "LCtenantId",
        label: "Logicloud Tenant Id",
        placeholder: "Logicloud Tenant Id",
        type: "text",
        value: gpsrule?.LCtenantId,
        Validations: [
          {
            name: "required",
            message: "Tenant Id is required",
          },
        ],
        generatecontrol: true,
        disable: isUpdate ? true : false,
      },
      {
        name: "LCuserId",
        label: "User Id",
        placeholder: "",
        type: "text",
        value: gpsrule?.LCuserId,
        Validations: [
          {
            name: "required",
            message: "User Id is required",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "LCpassword",
        label: "Password",
        placeholder: "Password",
        type: "password",
        value: gpsrule?.LCpassword,
        Validations: [
          {
            name: "required",
            message: "Password required!",
          },
          {
            name: "pattern",
            message:
              "Please enter password with 8-24 chars, 1 upper/lower case, 1 digit & 1 special char (!@#$%^&*_=+-)",
            pattern:
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,24}$",
          },
        ],
        additionalData: {
          // showPassword: false,
          inputType: "password",
        },
        generatecontrol: true,
        disable: false,
      },
      {
        name: "iSACTIVED",
        label: "GPS Enable",
        placeholder: "",
        type: "toggle",
        value: gpsrule?.iSACTIVED,
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "activeRule",
        },
      },
    ];
  }
  getGPSRuleFormControls() {
    return this.gpsRuleControlArray;
  }
}
