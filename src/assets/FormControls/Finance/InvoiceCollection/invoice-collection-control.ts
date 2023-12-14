import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class InvoiceCollectionControl {
  CustomerGSTArray: FormControls[];
  CollectionSummaryArray: FormControls[];
  constructor() {
    this.CustomerGSTArray = [
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
        name: "collectionDate",
        label: "Collection Date",
        placeholder: "Collection Date",
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
        name: "onAccountbalance",
        label: "On Account balance",
        placeholder: "On Account balance",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
    ];
    this.CollectionSummaryArray = [
      {
        name: "collectionMode",
        label: "Collection Mode",
        placeholder: "Collection Mode",
        type: "Staticdropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "bank",
        label: "Bank",  
        placeholder: "Bank",
        type: "Staticdropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "chequeRefNo",
        label: "Cheque/Ref No.",
        placeholder: "Cheque/Ref No.",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "date",
        label: "Date",
        placeholder: "Date",
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
        name: "onAccount",
        label: "On Account",
        placeholder: "On Account",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "onAccountAmount",
        label: "On Account Amount",
        placeholder: "On Account Amount",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "collectionTotal",
        label: "Collection Total",
        placeholder: "Collection Total",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "Onaccountbalance",
        label: "On Account Balance",
        placeholder: "On Account Balance",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
  }

  getCustomerGSTArrayControls() {
    return this.CustomerGSTArray;
  }
  getCollectionSummaryArrayControls() {
    return this.CollectionSummaryArray;
  }
}
