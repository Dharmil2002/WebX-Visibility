import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class tdsReconciliationControl {
  tdsReconciliationArray: FormControls[];
  constructor() {
    this.tdsReconciliationArray = [
        {
          name: "brand",
          label: "",
          placeholder: "",
          type: "radiobutton",
          value: [
            { value: "R", name: "Row Level", checked: true },
            { value: "H", name: "Header Level" },
          ],
          Validations: [],
          functions:{onChange:"changeBrand"},
          generatecontrol: true,
          disable: false,
        },
    ];
  }
  getHandOverArrayControls() {
    return this.tdsReconciliationArray;
  }
}
export class TDSReconciliationControl {
  TDSReconciliationArray: FormControls[];
  constructor() {
    this.TDSReconciliationArray = [
      {
        name: "taxableValue",
        label: "Taxable Value",
        placeholder: "Taxable Value",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "TDSReceived",
        label: "TDS Received",
        placeholder: "TDS Received",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "dateTime",
        label: "Date",
        placeholder: "select Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
    ]
  }
  getTDSReconciliationArrayControls() {
    return this.TDSReconciliationArray;
  }
}
