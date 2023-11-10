import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ViewPrint_Template } from "src/app/core/models/viewPrint/viewPrintTemplate";

export class QueryControl {
  QueryControlArray: FormControls[];
  constructor(ViewPrintTable: ViewPrint_Template, isUpdate: boolean) {
    this.QueryControlArray = [
      {
        name: "vTYPE",
        label: "View Type",
        placeholder: "Search And Select View Type",
        type: "Staticdropdown",
        value: [
          { value: "VB", name: "Vendor Bill" },
          { value: "CB", name: "Customer Bill" },
          { value: "TD", name: "THC" },
          { value: "PD", name: "PRQ" },
          { value: "DD", name: "Docket" },
          { value: "VD", name: "Voucher" },
        ],
        Validations: [
          {
            name: "required",
            message: "View Type is required..",
          },
          {
            name: "invalidAutocompleteObject",
            message: "Choose proper value",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "_id",
        label: "",
        placeholder: "",
        type: "text",
        value: '',
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "cID",
        label: "Company Code",
        placeholder: "Company Code",
        type: "text",
        value: parseInt(localStorage.getItem("companyCode")),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "eNTBY",
        label: "Entry By",
        placeholder: "Entry By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "eNTDT",
        label: "Entry Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "mODBY",
        label: "Update By",
        placeholder: "Update By",
        type: "text",
        value: localStorage.getItem("UserName"),
        Validations: [],
        generatecontrol: false,
        disable: false,
      },
      {
        name: "mODDT",
        label: "Update Date",
        placeholder: "Select Entry Date",
        type: "date",
        value: new Date(), // Set the value to the current date
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        Validations: [],
        generatecontrol: false,
        disable: false,
      }
    ];
  }
  getFormQueryControlArray() {
    return this.QueryControlArray;
  }
}
