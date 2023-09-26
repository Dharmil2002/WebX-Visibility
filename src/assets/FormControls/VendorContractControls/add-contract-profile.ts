import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddContractProfile {
  AddContractProfileArray: FormControls[];
  constructor() {
    this.AddContractProfileArray = [
      {
        name: "ContractCode",
        label: "Contract Code",
        placeholder: "Contract Code",
        type: "text",
        value: "System Generated",
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "VendorCode",
        label: "Vendor Code",
        placeholder: "Vendor Code",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "VendorName",
        label: "Vendor Name",
        placeholder: "Vendor Name",
        type: "text",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "ContractBranchCode",
        label: "Contract Signing Location",
        placeholder: "Contract Signing Location",
        type: "dropdown",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "Please select signing location",
          },
          {
            name: "autocomplete",
          },
          {
            name: "invalidAutocomplete",
            message: "please select values from list only",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
      },
      {
        name: "ContractDate",
        label: "Contract Date",
        placeholder: "Contract Date",
        type: "date",
        value:"",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "ContractStartDate",
        label: "Contract Start Date",
        placeholder: "Contract Start Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "ValidUptoDate",
        label: "Valid Upto Date",
        placeholder: "Valid Upto Date",
        type: "date",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date("01 Jan 2000"),
        },
      },
      {
        name: "ContractCopy",
        label: "Upload Contract Copy",
        placeholder: "Upload Contract Copy",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "onFileSelected",
        },
      }
    ];
  }
  getAddContractProfileArrayControls() {
    return this.AddContractProfileArray;
  }
}
