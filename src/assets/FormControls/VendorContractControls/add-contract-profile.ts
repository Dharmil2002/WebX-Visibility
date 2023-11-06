import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddContractProfile {
  AddContractProfileArray: FormControls[];
  constructor(vendorInformationData) {
    this.AddContractProfileArray = [
      {
        name: "vendor",
        label: "Vendor",
        placeholder: "Vendor",
        type: "text",
        value: vendorInformationData.vendor,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "contractID",
        label: "Contract Code",
        placeholder: "Contract Code",
        type: "text",
        value: vendorInformationData.contractID,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "contractScan",
        label: "Upload Contract Scan",
        placeholder: "Upload Contract Scan",
        type: "file",
        value: "",
        generatecontrol: true,
        disable: false,
        Validations: [],
        functions: {
          onChange: "onFileSelected",
        },
        additionalData: {
          isFileSelected: true
        },
      },

      {
        name: "vendorManager",
        label: "Vendor Manager",
        placeholder: "Vendor Manager",
        type: "text",
        value: vendorInformationData.vendorManager,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
      {
        name: "contractStartDate",
        label: " Start Date",
        placeholder: " Start Date",
        type: "date",
        value: vendorInformationData.contractStartDate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "expiryDate",
        label: "Expiry Date",
        placeholder: "Expiry Date",
        type: "date",
        value: vendorInformationData.expiryDate,
        generatecontrol: true,
        disable: false,
        Validations: [],
        additionalData: {
          minDate: new Date(),
        },
      },
      {
        name: "pendingDays",
        label: "Pending days",
        placeholder: "Pending days",
        type: "number",
        value: vendorInformationData.pendingDays,
        generatecontrol: true,
        disable: false,
        Validations: [],
      },
    ];
  }
  getAddContractProfileArrayControls() {
    return this.AddContractProfileArray;
  }
}