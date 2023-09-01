import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class CustomerbillControl {
  CustomerbillArray: FormControls[];
  constructor() {
    this.CustomerbillArray = [
      {
        name: "JobNo",
        label: "Job No",
        placeholder: "Job No",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "dateTime",
        label: "Job Date",
        placeholder: "select Job Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "FromCity",
        label: "From City",
        placeholder: "From City",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "ToCity",
        label: "To City",
        placeholder: "To City",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "TNOP",
        label: "Total No of Pkgs",
        placeholder: "Total No of Pkgs",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "BillingParty",
        label: "Billing Party ",
        placeholder: "Billing Party ",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
  }

  getHandOverArrayControls() {
    return this.CustomerbillArray;
  }
}
