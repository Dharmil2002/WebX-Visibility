import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddManualVoucharControl {
  ManualVoucharArray: FormControls[];
  constructor() {
    this.ManualVoucharArray = [
      {
        name: "voucherNo",
        label: "Voucher No",
        placeholder: "Voucher No",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "voucherType",
        label: "Voucher Type",
        placeholder: "Voucher Type",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "voucherDate",
        label: "Voucher Date",
        placeholder: "Voucher Date",
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
        name: "amount",
        label: "Amount",
        placeholder: "Amount",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "createdBy",
        label: "Created By",
        placeholder: "Created By",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "dueDate",
        label: "Due Date",
        placeholder: "select Due Date",
        type: "date",
        value: new Date(),
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        }
      },
      {
        name: "status",
        label: "Status",
        placeholder: "Status",
        type: "text",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: []
      }

    ];
  }
  getManualVoucharArrayControls() {
    return this.ManualVoucharArray;
  }
}
