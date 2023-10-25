import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddManualVoucherControl {
  ManualVoucharArray: FormControls[];
  constructor() {
    this.ManualVoucharArray = [
      {
        name: "voucherNo",
        label: "Voucher No",
        placeholder: "Voucher No",
        type: "text",
        value:"System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "voucherType",
        label: "Voucher Type",
        placeholder: "Voucher Type",
        type: "Staticdropdown",
        value:[
          {value:"Debit",name:"Debit Voucher"},
          {value:"Credit",name:"Credit Voucher"},
          {value:"Journal",name:"Journal Voucher"}
          ],
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
        label: "Amount (₹)",
        placeholder: "Amount",
        type: "number",
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
        label: "",
        placeholder: "Status",
        type: "text",
        value:"0",
        generatecontrol: false,
        disable: false,
        Validations: []
      },
      {
        name: "createdBy",
        label: "",
        placeholder: "",
        type: "text",
        value:localStorage.getItem("Username"),
        generatecontrol: false,
        disable: false,
        Validations: []
      },
      {
        name: "createdDate",
        label: "",
        placeholder: "",
        type: "text",
        value:new Date(),
        generatecontrol: false,
        disable: false,
        Validations: []
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "",
        value:localStorage.getItem("Username"),
        generatecontrol: false,
        disable: false,
        Validations: []
      }

    ];
  }
  getManualVoucharArrayControls() {
    return this.ManualVoucharArray;
  }
}
