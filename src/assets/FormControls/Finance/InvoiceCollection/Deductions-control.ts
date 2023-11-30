import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class DeductionsControl {
  DeductionsArray: FormControls[];
  constructor() {
    this.DeductionsArray = [
      {
        name: "customer",
        label: "Customer",
        placeholder: "Customer",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "invoiceNumber",
        label: "Invoice Number",
        placeholder: "Invoice Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "invoiceNumber",
        label: "Invoice Number",
        placeholder: "Invoice Number",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "invoiceAmount",
        label: "Invoice Amount",
        placeholder: "Invoice Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "pendingAmount",
        label: "Pending Amount",
        placeholder: "Pending Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      }
    ];
  }

  getDeductionsControls() {
    return this.DeductionsArray;
  }
}
